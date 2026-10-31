import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "../commons/modalHeader";
import axios from "../../config/axiosConfig";

const common = require("../utils/common");

/**
 * Modal para agregar a la orden de pago (type 'M') las entradas de almacen
 * aun no pagadas del proveedor de la orden. Seleccion multiple con checkboxes.
 */
const AddOrderEntries = ({ idOrder, idStage, idSupplier, onSave, onClose }) => {
  const [entriesArray, setEntriesArray] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAvailableEntries = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/warehouse-available-entries`, {
        params: { idStage, idSupplier: parseInt(idSupplier, 10) },
      })
      .then((result) => {
        setEntriesArray(result?.data?.length > 0 ? result.data : []);
        setLoading(false);
      })
      .catch((error) => {
        setEntriesArray([]);
        setLoading(false);
        console.error("Error fetching available entries:", error);
      });
  };

  useEffect(() => {
    getAvailableEntries();
  }, []);

  const toggleSelect = (idMovement) => {
    setSelectedIds((prev) =>
      prev.includes(idMovement) ? prev.filter((id) => id !== idMovement) : [...prev, idMovement]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === entriesArray.length) setSelectedIds([]);
    else setSelectedIds(entriesArray.map((x) => x.idMovement));
  };

  const handleSave = () => {
    if (selectedIds.length === 0) return;
    onSave(selectedIds);
  };

  const fmt = (v) => common.getMoneyFomat(v || 0);
  const allSelected = entriesArray.length > 0 && selectedIds.length === entriesArray.length;

  return (
    <Modal.Dialog size="xl">
      <ModalHeader title="AGREGAR ENTRADAS DE ALMACÉN A LA ORDEN" onClose={onClose} />
      <Modal.Body>
        <div className="container-xl-modals">
          <div className="section-title">
            Entradas del proveedor pendientes de pago
          </div>

          {loading && <div className="center">Cargando entradas...</div>}
          {!loading && entriesArray.length === 0 && (
            <div className="center mandatory">No hay entradas pendientes de pago para este proveedor.</div>
          )}
          {!loading && entriesArray.length > 0 && (
            <div className="overflow-x-auto mt-8">
              <table className="table w-100">
                <thead>
                  <tr>
                    <th className="w-3 center">
                      <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                    </th>
                    <th className="w-10">FECHA</th>
                    <th className="w-8">CÓDIGO</th>
                    <th className="w-30">INSUMO</th>
                    <th className="w-6">UN</th>
                    <th className="w-10">CANTIDAD</th>
                    <th className="w-12">VALOR UNIT.</th>
                    <th className="w-12">VALOR TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {entriesArray.map((x, index) => {
                    const cls = index % 2 === 0 ? "dark" : "";
                    const isChecked = selectedIds.includes(x.idMovement);
                    return (
                      <tr key={index.toString()}>
                        <td className={`${cls} center`}>
                          <input type="checkbox" checked={isChecked} onChange={() => toggleSelect(x.idMovement)} />
                        </td>
                        <td className={`${cls} center`}>{common.getDateFormat(x.movementDate)}</td>
                        <td className={`${cls} center`}>{x.cod}</td>
                        <td className={`${cls} left`}>{x.inputName}</td>
                        <td className={`${cls} center`}>{x.unit}</td>
                        <td className={`${cls} right`}>{x.quantity}</td>
                        <td className={`${cls} right`}>{fmt(x.unitValue)}</td>
                        <td className={`${cls} right`}>{fmt(x.totalValue)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="secondary" type="button" onClick={onClose}>Cancelar</button>
        <button className="primary" type="button" disabled={selectedIds.length === 0} onClick={handleSave}>
          Agregar Seleccionadas ({selectedIds.length})
        </button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default AddOrderEntries;
