import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "../commons/modalHeader";
import ReactSelect from "react-select";
import axios from "../../config/axiosConfig";
import { onHandlerDecimal } from "../utils/handlers";

const AddWarehouseEntry = ({ idStage, movement, onSave, onClose }) => {
  const isEdit = !!movement;

  const [units, setUnits] = useState([]);
  const [unitSelected, setUnitSelected] = useState(null);

  const [suppliers, setSuppliers] = useState([]);
  const [supplierSelected, setSupplierSelected] = useState(null);

  const [inputName, setInputName] = useState(isEdit ? (movement.inputName || "") : "");
  const [quantity, setQuantity] = useState(isEdit && movement.quantity != null ? String(movement.quantity) : "");
  const [unitValue, setUnitValue] = useState(isEdit && movement.unitValue != null ? String(movement.unitValue) : "");
  const [movementDate, setMovementDate] = useState(() =>
    isEdit && movement.movementDate ? String(movement.movementDate).slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [observations, setObservations] = useState(isEdit ? (movement.observations || "") : "");
  const [error, setError] = useState("");

  // Unidades para el nuevo insumo
  const getUnits = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/units`)
      .then((result) => setUnits(result.data || []))
      .catch((e) => {
        setUnits([]);
        console.error("Error fetching units:", e);
      });
  };

  // Proveedores (GetSuppliers devuelve {value, label})
  const getSuppliers = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/suppliers`)
      .then((result) => setSuppliers(result.data || []))
      .catch((e) => {
        setSuppliers([]);
        console.error("Error fetching suppliers:", e);
      });
  };

  useEffect(() => {
    getUnits();
    getSuppliers();
  }, []);

  const unitOptions = units.map((u) => ({
    value: u.idUnit != null ? u.idUnit : u.IdUnit,
    label: (u.name || u.Name || "").trim(),
  }));

  // En edicion: precargar la unidad cuando lleguen las opciones
  useEffect(() => {
    if (isEdit && movement.idUnit != null && unitOptions.length > 0 && !unitSelected) {
      const found = unitOptions.find((o) => String(o.value) === String(movement.idUnit));
      if (found) setUnitSelected(found);
    }
  }, [units]);

  // En edicion: precargar el proveedor cuando lleguen las opciones
  useEffect(() => {
    if (isEdit && movement.idSupplier != null && suppliers.length > 0 && !supplierSelected) {
      const found = suppliers.find((o) => String(o.value) === String(movement.idSupplier));
      if (found) setSupplierSelected(found);
    }
  }, [suppliers]);

  const handleSave = () => {
    setError("");
    if (!inputName.trim()) {
      setError("Escriba el nombre del insumo.");
      return;
    }
    if (!unitSelected) {
      setError("Seleccione la unidad del insumo.");
      return;
    }
    if (!supplierSelected) {
      setError("Seleccione el proveedor de la entrada.");
      return;
    }
    const qty = parseFloat(quantity) || 0;
    if (qty <= 0) {
      setError("La cantidad debe ser mayor a cero.");
      return;
    }
    onSave({
      idMovement: isEdit ? movement.idMovement : undefined,
      inputName: inputName.trim(),
      idUnit: unitSelected.value,
      idSupplier: supplierSelected.value,
      quantity: qty,
      unitValue: parseFloat(unitValue) || 0,
      movementDate,
      observations,
    });
  };

  return (
    <Modal.Dialog size="lg">
      <ModalHeader title={isEdit ? "EDITAR ENTRADA DE ALMACÉN" : "REGISTRAR ENTRADA DE ALMACÉN"} onClose={onClose} />
      <Modal.Body>
        <div className="container-xl-modals">
          <div className="section-title">
            La entrada se carga al capítulo <b>INVENTARIO</b> (fijo, no editable)
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-4 right label"><span>Insumo (nombre)&nbsp;</span></div>
            <div className="col-8">
              <input
                type="text"
                className="input w-100"
                value={inputName}
                placeholder="Escriba el nombre del insumo..."
                onChange={(e) => setInputName(e.target.value)}
              />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-4 right label"><span>Unidad&nbsp;</span></div>
            <div className="col-8">
              <ReactSelect
                className="react-select-container w-50"
                isClearable
                options={unitOptions}
                value={unitSelected}
                onChange={(val) => setUnitSelected(val || null)}
                placeholder="Seleccione unidad..."
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-4 right label"><span>Proveedor&nbsp;</span></div>
            <div className="col-8">
              <ReactSelect
                className="react-select-container"
                isClearable
                options={suppliers}
                value={supplierSelected}
                onChange={(val) => setSupplierSelected(val || null)}
                placeholder="Seleccione proveedor..."
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
            <div className="col-4 right label"><span>Valor Unitario&nbsp;</span></div>
            <div className="col-8">
              <input
                type="text"
                className="input w-50"
                value={unitValue}
                onKeyDown={(e) => onHandlerDecimal(e)}
                onChange={(e) => setUnitValue(e.target.value)}
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

export default AddWarehouseEntry;
