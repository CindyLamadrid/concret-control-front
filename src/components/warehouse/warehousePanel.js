import { useEffect, useState, useContext } from "react";
import axios from "../../config/axiosConfig";
import { ConstructionContext } from "../../context/constructionContext";
import Notifications from "../commons/modal";
import AddWarehouseEntry from "./addWarehouseEntry";
import AddWarehouseExit from "./addWarehouseExit";
import WarehouseMovementsTable from "./warehouseMovementsTable";

/**
 * Panel reutilizable de movimientos de almacen (entradas 'I' / salidas 'O').
 * mode: 'entries' | 'exits'
 * Se usa tanto en el modulo Almacen como en las pestanas del Control de Costos.
 */
const WarehousePanel = ({ idStage, mode }) => {
  const { user } = useContext(ConstructionContext);
  const base = process.env.REACT_APP_BUDGET_URL_API;

  const isEntries = mode === "entries";
  const type = isEntries ? "I" : "O";

  const [movements, setMovements] = useState([]);
  const [stockArray, setStockArray] = useState([]);
  // modal: { show, movement }. movement=null -> crear; movement=obj -> editar
  const [modal, setModal] = useState({ show: false, movement: null });
  const [validationModal, setValidationModal] = useState({ show: false, message: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, movement: null });

  const getMovements = () => {
    if (!idStage) return;
    axios
      .get(`${base}/warehouse-movements`, { params: { idStage, type } })
      .then((result) => setMovements(result?.data?.length > 0 ? result.data : []))
      .catch((e) => {
        setMovements([]);
        console.error("Error fetching movements:", e);
      });
  };

  const getStock = () => {
    if (!idStage) return;
    axios
      .get(`${base}/warehouse-stock`, { params: { idStage } })
      .then((result) => setStockArray(result?.data?.length > 0 ? result.data : []))
      .catch((e) => {
        setStockArray([]);
        console.error("Error fetching stock:", e);
      });
  };

  const refresh = () => {
    getMovements();
    if (!isEntries) getStock();
  };

  useEffect(() => {
    refresh();
  }, [idStage, mode]);

  const onSaveEntry = async (payload) => {
    const isEdit = !!payload.idMovement;
    const url = isEdit ? `${base}/warehouse-update-entry` : `${base}/warehouse-create-entry`;
    try {
      await axios.post(url, {
        idMovement: payload.idMovement,
        idStage,
        inputName: payload.inputName,
        idUnit: payload.idUnit,
        quantity: payload.quantity,
        unitValue: payload.unitValue,
        movementDate: payload.movementDate,
        idOrder: null,
        idSupplier: payload.idSupplier,
        observations: payload.observations,
        user,
      });
      setModal({ show: false, movement: null });
      refresh();
    } catch (e) {
      setValidationModal({ show: true, message: e.response?.data?.error || "Error al guardar la entrada" });
      console.error("Error saving entry:", e);
    }
  };

  const onSaveExit = async (payload) => {
    const isEdit = !!payload.idMovement;
    const url = isEdit ? `${base}/warehouse-update-exit` : `${base}/warehouse-create-exit`;
    try {
      await axios.post(url, {
        idMovement: payload.idMovement,
        idStage,
        idInput: payload.idInput,
        idChapter: payload.idChapter,
        idSubchapter: payload.idSubchapter,
        idInputBudget: payload.idInputBudget,
        quantity: payload.quantity,
        unitValue: payload.unitValue,
        movementDate: payload.movementDate,
        observations: payload.observations,
        user,
      });
      setModal({ show: false, movement: null });
      refresh();
    } catch (e) {
      if (e.response && e.response.status === 409) {
        setValidationModal({ show: true, message: e.response.data.error || "No hay existencia suficiente" });
      } else {
        setValidationModal({ show: true, message: "Error al guardar la salida" });
      }
      console.error("Error saving exit:", e);
    }
  };

  const onEditMovement = (movement) => {
    setModal({ show: true, movement });
  };

  const onRemoveMovement = (movement) => {
    setConfirmModal({ show: true, movement });
  };

  const confirmRemove = async () => {
    const movement = confirmModal.movement;
    setConfirmModal({ show: false, movement: null });
    if (!movement) return;
    try {
      await axios.post(`${base}/warehouse-remove-movement`, { idMovement: movement.idMovement, user });
      refresh();
    } catch (e) {
      console.error("Error removing movement:", e);
    }
  };

  return (
    <div>
      <div className="header-title">
        <span>ALMACÉN — {isEntries ? "ENTRADAS" : "SALIDAS"}</span>
        <span className="subheader-title">&nbsp;&nbsp;&nbsp;{movements.length} Movimiento(s)</span>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <button type="button" className="primary" onClick={() => setModal({ show: true, movement: null })}>
          <i className="fas fa-plus" /> {isEntries ? "Registrar Entrada" : "Registrar Salida"}
        </button>
      </div>

      <WarehouseMovementsTable movementsArray={movements} type={type} onRemove={onRemoveMovement} onEdit={onEditMovement} />

      {modal.show && isEntries && (
        <div className="modal show modal-lg modal-inline">
          <AddWarehouseEntry
            idStage={idStage}
            movement={modal.movement}
            onSave={onSaveEntry}
            onClose={() => setModal({ show: false, movement: null })}
          />
        </div>
      )}
      {modal.show && !isEntries && (
        <div className="modal show modal-lg modal-inline">
          <AddWarehouseExit
            idStage={idStage}
            stockArray={stockArray}
            movement={modal.movement}
            onSave={onSaveExit}
            onClose={() => setModal({ show: false, movement: null })}
          />
        </div>
      )}

      {validationModal.show && (
        <Notifications
          message={validationModal.message}
          buttonArray={[
            { name: "Aceptar", disabled: false, className: "primary", action: () => setValidationModal({ show: false, message: "" }) },
          ]}
        />
      )}

      {confirmModal.show && (
        <Notifications
          message="¿Desea eliminar este movimiento de almacén?"
          buttonArray={[
            { name: "Eliminar", disabled: false, className: "primary", action: confirmRemove },
            { name: "Cancelar", disabled: false, className: "secondary", action: () => setConfirmModal({ show: false, movement: null }) },
          ]}
        />
      )}
    </div>
  );
};

export default WarehousePanel;
