import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import axios from "../../config/axiosConfig";

const common = require("../utils/common");

const AddOrderInput = ({ idOrder, idSupplier, type, stageSelected, onSave, onClose }) => {
  const [contractsArray, setContractsArray] = useState([]);
  const [contractSelected, setContractSelected] = useState(null);
  const [contractInputsArray, setContractInputsArray] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loadingInputs, setLoadingInputs] = useState(false);

  // Load contracts for this supplier + type
  const getContracts = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/contracts-supplier`, {
        params: {
          idStage: stageSelected.idStage,
          idSupplier: parseInt(idSupplier, 10),
          type,
        },
      })
      .then((result) => {
        setContractsArray(result?.data?.length > 0 ? result.data : []);
      })
      .catch((error) => {
        setContractsArray([]);
        console.error("Error fetching contracts:", error);
      });
  };

  // Load contract inputs when a contract is selected
  const getContractInputs = (idContract) => {
    setLoadingInputs(true);
    setSelectedIds([]);
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/contract-inputs-for-order`, {
        params: { idContract, idOrder },
      })
      .then((result) => {
        setContractInputsArray(result?.data?.length > 0 ? result.data : []);
        setLoadingInputs(false);
      })
      .catch((error) => {
        setContractInputsArray([]);
        setLoadingInputs(false);
        console.error("Error fetching contract inputs:", error);
      });
  };

  useEffect(() => {
    getContracts();
  }, []);

  useEffect(() => {
    if (contractSelected) {
      getContractInputs(contractSelected.idContract);
    } else {
      setContractInputsArray([]);
      setSelectedIds([]);
    }
  }, [contractSelected]);

  const contractOptions = contractsArray.map((c) => ({
    value: c.idContract,
    label: `Contrato #${c.idContract} — ${c.name} (${c.initialDate} / ${c.finalDate})`,
    ...c,
  }));

  const toggleSelect = (idContractInput) => {
    setSelectedIds((prev) =>
      prev.includes(idContractInput)
        ? prev.filter((id) => id !== idContractInput)
        : [...prev, idContractInput]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === contractInputsArray.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contractInputsArray.map((x) => x.idContractInput));
    }
  };

  const handleSave = () => {
    if (!contractSelected || selectedIds.length === 0) return;
    onSave(contractSelected.idContract, selectedIds);
  };

  const fmt = (v) => common.getMoneyFomat(v || 0);
  const allSelected = contractInputsArray.length > 0 && selectedIds.length === contractInputsArray.length;

  return (
    <Modal.Dialog size="xl">
      <Modal.Body>
        <div className="container-xl-modals">
          <div className="subtitle center"><b>AGREGAR INSUMOS A LA ORDEN</b></div>

          <div className="row subcontainer-admin-options">
            <div className="col-2 right label"><span>Contrato &nbsp;</span></div>
            <div className="col-10">
              <Select
                className="input w-80 select-no-border"
                isClearable
                options={contractOptions}
                value={contractSelected ? contractOptions.find((o) => o.value === contractSelected.idContract) : null}
                onChange={(val) => setContractSelected(val || null)}
                placeholder="Seleccione un contrato..."
              />
            </div>
          </div>

          {contractSelected && (
            <>
              {loadingInputs && <div className="center">Cargando insumos...</div>}
              {!loadingInputs && contractInputsArray.length === 0 && (
                <div className="center mandatory">El contrato no tiene insumos disponibles.</div>
              )}
              {!loadingInputs && contractInputsArray.length > 0 && (
                <div style={{ overflowX: "auto", marginTop: 8 }}>
                  <table className="table w-100">
                    <thead>
                      <tr>
                        <th className="w-3 center">
                          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                        </th>
                        <th className="w-13">IMPUTACIÓN</th>
                        <th className="w-5">REGISTRO</th>
                        <th className="w-7">CÓDIGO</th>
                        <th className="w-20">DESCRIPCIÓN</th>
                        <th className="w-5">UN</th>
                        <th className="w-8">C. CONTRA.</th>
                        <th className="w-8">C. DISPO.</th>
                        <th className="w-10">PRECIO</th>
                        <th className="w-10">VALOR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contractInputsArray.map((x, index) => {
                        const cls = index % 2 === 0 ? "dark" : "";
                        const isChecked = selectedIds.includes(x.idContractInput);
                        return (
                          <tr key={index.toString()}>
                            <td className={`${cls} center`}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={x.alreadyAdded === 1}
                                onChange={() => toggleSelect(x.idContractInput)}
                              />
                            </td>
                            <td className={`${cls} left`}>{x.imputation}</td>
                            <td className={`${cls} center`}>{x.registro}</td>
                            <td className={`${cls} center`}>{x.cod}</td>
                            <td className={`${cls} left`}>{x.name}</td>
                            <td className={`${cls} center`}>{x.unit}</td>
                            <td className={`${cls} right`}>{x.quantityContracted}</td>
                            <td className={`${cls} right ${x.quantityAvailable < 0 ? "mandatory" : ""}`}>
                              {x.quantityAvailable}
                            </td>
                            <td className={`${cls} right`}>{fmt(x.unitValue)}</td>
                            <td className={`${cls} right`}>{fmt(x.valor)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          <br />
          <div className="right">
            <button className="secondary" type="button" onClick={onClose}>Cancelar</button>
            &nbsp;&nbsp;
            <button
              className="primary"
              type="button"
              disabled={!contractSelected || selectedIds.length === 0}
              onClick={handleSave}
            >
              Agregar Seleccionados ({selectedIds.length})
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default AddOrderInput;
