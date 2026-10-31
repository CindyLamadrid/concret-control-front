import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "../commons/modalHeader";
import ReactSelect from "react-select";
import axios from "../../config/axiosConfig";
import { onHandlerDecimal } from "../utils/handlers";

const common = require("../utils/common");

const AddWarehouseExit = ({ idStage, stockArray, movement, onSave, onClose }) => {
  const isEdit = !!movement;

  const [chapters, setChapters] = useState([]);
  const [chapterSelected, setChapterSelected] = useState(null);
  const [inputSelected, setInputSelected] = useState(null);

  // Insumo del presupuesto al que se imputa el gasto (cascada capitulo->insumo)
  const [budgetInputs, setBudgetInputs] = useState([]);
  const [budgetInputSelected, setBudgetInputSelected] = useState(null);

  const [quantity, setQuantity] = useState(isEdit && movement.quantity != null ? String(movement.quantity) : "");
  const [movementDate, setMovementDate] = useState(() =>
    isEdit && movement.movementDate ? String(movement.movementDate).slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [observations, setObservations] = useState(isEdit ? (movement.observations || "") : "");
  const [error, setError] = useState("");

  const base = process.env.REACT_APP_BUDGET_URL_API;

  // Capitulos/subcapitulos destino
  const getChaptersSubchapters = () => {
    axios
      .get(`${base}/get-chapters-subchapters`)
      .then((result) => {
        // excluir el capitulo INVENTARIO como destino de salida
        const data = (result.data || []).filter(
          (c) => String(c.chapter || "").toUpperCase().replace(/\s/g, "") !== "INVENTARIO"
        );
        setChapters(data);
      })
      .catch((e) => {
        setChapters([]);
        console.error("Error fetching chapters:", e);
      });
  };

  // Insumos del presupuesto del capitulo/subcapitulo seleccionado
  const getChapterInputs = (chapter) => {
    if (!chapter) return;
    axios
      .post(`${base}/chapter-inputs`, {
        idStage,
        idChapter: chapter.idChapter,
        idSubchapter: chapter.idSubchapter,
      })
      .then((result) => {
        setBudgetInputs(result.data || []);
        setBudgetInputSelected(null);
      })
      .catch((e) => {
        setBudgetInputs([]);
        console.error("Error fetching chapter inputs:", e);
      });
  };

  useEffect(() => {
    getChaptersSubchapters();
  }, []);

  useEffect(() => {
    if (chapterSelected) getChapterInputs(chapterSelected);
    else {
      setBudgetInputs([]);
      setBudgetInputSelected(null);
    }
  }, [chapterSelected]);

  // Solo insumos de almacen con existencia > 0. En edicion, asegurar que el
  // insumo del propio movimiento este disponible aunque su saldo sea 0.
  const stockOptions = (stockArray || [])
    .filter((s) => (parseFloat(s.stock) || 0) > 0)
    .map((s) => ({
      value: s.idInput,
      label: `${s.cod} - ${s.inputName} (Disp: ${s.stock} ${s.unit || ""})`,
      ...s,
    }));

  const inputOptions = [...stockOptions];
  if (isEdit && movement.idInput != null && !stockOptions.some((o) => String(o.value) === String(movement.idInput))) {
    inputOptions.unshift({
      value: movement.idInput,
      label: `${movement.cod} - ${movement.inputName}`,
      idInput: movement.idInput,
      inputName: movement.inputName,
      unit: movement.unit,
      stock: 0,
      unitValue: movement.unitValue,
    });
  }

  const chapterOptions = chapters.map((c) => ({
    value: `${c.idChapter}-${c.idSubchapter}`,
    label: `${c.cod || ""} ${c.chapter || ""} - ${c.subchapter || ""}`,
    ...c,
  }));

  const budgetInputOptions = budgetInputs.map((i) => ({
    value: i.idInput,
    label: `${i.cod} - ${i.name}`,
    ...i,
  }));

  const available = inputSelected ? parseFloat(inputSelected.stock) || 0 : 0;

  // Precarga en edicion: insumo de almacen que salio
  useEffect(() => {
    if (isEdit && !inputSelected) {
      const found = inputOptions.find((o) => String(o.value) === String(movement.idInput));
      if (found) setInputSelected(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockArray]);

  // Precarga en edicion: capitulo/subcapitulo destino
  useEffect(() => {
    if (isEdit && !chapterSelected && chapters.length > 0) {
      const found = chapterOptions.find(
        (o) => o.value === `${movement.idChapter}-${movement.idSubchapter}`
      );
      if (found) setChapterSelected(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters]);

  // Precarga en edicion: insumo del presupuesto imputado
  useEffect(() => {
    if (isEdit && movement.idInputBudget != null && budgetInputs.length > 0 && !budgetInputSelected) {
      const found = budgetInputOptions.find((o) => String(o.value) === String(movement.idInputBudget));
      if (found) setBudgetInputSelected(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetInputs]);

  const handleSave = () => {
    setError("");
    if (!inputSelected) {
      setError("Seleccione el insumo del almacén que sale.");
      return;
    }
    if (!chapterSelected) {
      setError("Seleccione el capítulo/subcapítulo destino.");
      return;
    }
    if (!budgetInputSelected) {
      setError("Seleccione el insumo del presupuesto al que se imputa el gasto.");
      return;
    }
    const qty = parseFloat(quantity) || 0;
    if (qty <= 0) {
      setError("La cantidad debe ser mayor a cero.");
      return;
    }
    // En creacion validamos contra disponible; en edicion el backend revalida
    // excluyendo el propio movimiento.
    if (!isEdit && qty > available) {
      setError(`La cantidad supera la existencia disponible (${available}).`);
      return;
    }
    onSave({
      idMovement: isEdit ? movement.idMovement : undefined,
      idInput: inputSelected.idInput,
      idChapter: chapterSelected.idChapter,
      idSubchapter: chapterSelected.idSubchapter,
      idInputBudget: budgetInputSelected.idInput,
      quantity: qty,
      unitValue: parseFloat(inputSelected.unitValue) || 0,
      movementDate,
      observations,
    });
  };

  return (
    <Modal.Dialog size="lg">
      <ModalHeader title={isEdit ? "EDITAR SALIDA DE ALMACÉN" : "REGISTRAR SALIDA DE ALMACÉN"} onClose={onClose} />
      <Modal.Body>
        <div className="container-xl-modals">
          <div className="section-title">
            La salida descuenta del inventario y se imputa como gasto al insumo del presupuesto
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-4 right label"><span>Insumo almacén (sale)&nbsp;</span></div>
            <div className="col-8">
              <ReactSelect
                className="react-select-container"
                isClearable
                options={inputOptions}
                value={inputSelected}
                onChange={(val) => setInputSelected(val || null)}
                placeholder="Seleccione insumo con existencia..."
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
          </div>

          {inputSelected && (
            <div className="row subcontainer-admin-options">
              <div className="col-4 right label"><span>Disponible&nbsp;</span></div>
              <div className="col-8 label">
                <b>{available}</b> {inputSelected.unit || ""} &nbsp;&nbsp;
                <span>Valor/Un: {common.getMoneyFomat(inputSelected.unitValue)}</span>
              </div>
            </div>
          )}

          <div className="row subcontainer-admin-options">
            <div className="col-4 right label"><span>Capítulo / Subcapítulo destino&nbsp;</span></div>
            <div className="col-8">
              <ReactSelect
                className="react-select-container"
                isClearable
                options={chapterOptions}
                value={chapterSelected ? chapterOptions.find((o) => o.value === `${chapterSelected.idChapter}-${chapterSelected.idSubchapter}`) : null}
                onChange={(val) => setChapterSelected(val || null)}
                placeholder="Seleccione capítulo destino..."
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-4 right label"><span>Insumo presupuesto (imputación)&nbsp;</span></div>
            <div className="col-8">
              <ReactSelect
                className="react-select-container"
                isClearable
                options={budgetInputOptions}
                value={budgetInputSelected}
                onChange={(val) => setBudgetInputSelected(val || null)}
                placeholder="Seleccione insumo del presupuesto..."
                isDisabled={!chapterSelected}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-4 right label"><span>Cantidad&nbsp;</span></div>
            <div className="col-8">
              <input
                type="text"
                className="input w-50"
                value={quantity}
                onKeyDown={(e) => onHandlerDecimal(e)}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-4 right label"><span>Fecha&nbsp;</span></div>
            <div className="col-8">
              <input
                type="date"
                className="input w-50"
                value={movementDate}
                onChange={(e) => setMovementDate(e.target.value)}
              />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-4 right label"><span>Observaciones&nbsp;</span></div>
            <div className="col-8">
              <input
                type="text"
                className="input w-100"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="mandatory center">{error}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="secondary" type="button" onClick={onClose}>Cancelar</button>
        <button className="primary" type="button" onClick={handleSave}>Guardar</button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default AddWarehouseExit;
