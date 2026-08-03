import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import Modal from "react-bootstrap/Modal";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import SupplierTable from "../suppliers/supplierTable";

const handlers = require("../utils/handlers");

const AdminContract = ({
  adminContract,
  messageResultOperation,
  onSaveContract,
  onCloseAdminContract,
  preselectedSupplier,
  onCreateSupplier,
}) => {
  const [suppliersArray, setSuppliersArray] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [supplierIdentification, setSupplierIdentification] = useState("");
  const [hasPreloaded, setHasPreloaded] = useState(false);
  const [noSupplierFound, setNoSupplierFound] = useState(false);
  const [initialDate, setInitialDate] = useState(new Date());
  const [finalDate, setFinalDate] = useState(new Date());
  const [aiuPercentage, setAiuPercentage] = useState(false);
  const [utility, setUtility] = useState(0);
  const [administration, setAdministration] = useState(0);
  const [events, setEvents] = useState(0);
  const [detained, setDetained] = useState(0);
  const [detainedSocialSecurity, setDetainedSocialSecurity] = useState(0);
  const [amortization, setAmortization] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [advance, setAdvance] = useState(0);

  const getSupplier = async () => {
    setNoSupplierFound(false);
    const result = await axios.get(
      `${process.env.REACT_APP_BUDGET_URL_API}/supplier-name-id`,
      {
        params: { supplier: supplierIdentification },
      },
    );
    if (result && result.data && result.data.length > 0) {
      let { data } = result;
      setSuppliersArray(data);
    } else {
      setSuppliersArray([]);
      setNoSupplierFound(true);
    }
  };

  const getContractProperties = () => {
    return {
      initialDate,
      finalDate,
      aiuPercentage,
      utility,
      administration,
      events,
      detained,
      detainedSocialSecurity,
      amortization,
      taxes,
      advance,
      idSupplier: supplier.idSupplier,
    };
  };

  const onChangeSupplierSelected = (index) => {
    if (index > -1) {
      const newSupliersArray = suppliersArray.map((item, i) => ({
        ...item,
        selected: i === index,
      }));
      setSuppliersArray(newSupliersArray);
      setSupplier(newSupliersArray[index]);
    }
  };

  useEffect(() => {
    console.log("useEffect supplier", supplier);
  }, [supplier]);

  useEffect(() => {
    if (adminContract.action === "edit") {
      setSupplier({
        idSupplier: adminContract.contract.idSupplier,
        name: adminContract.contract.name,
        address: adminContract.contract.address,
        identificationType: adminContract.contract.identificationType,
        identification: adminContract.contract.identification,
      });
      setInitialDate(adminContract.contract.init);
      setFinalDate(adminContract.contract.final);
      setAiuPercentage(adminContract.contract.aiuPercentage);
      setUtility(adminContract.contract.utility);
      setAdministration(adminContract.contract.administration);
      setEvents(adminContract.contract.events);
      setDetained(adminContract.contract.detained);
      setDetainedSocialSecurity(adminContract.contract.detainedSocialSecurity);
      setAmortization(adminContract.contract.amortization);
      setTaxes(adminContract.contract.taxes);
      setAdvance(adminContract.contract.advance);
    }
    if (adminContract.action === "new" && preselectedSupplier && preselectedSupplier.value) {
      // Precargar solo la identificación (parte antes del guión en el label)
      const label = preselectedSupplier.label || "";
      const identification = label.includes("-") ? label.split("-")[0].trim() : label;
      setSupplierIdentification(identification);
    } else if (adminContract.action === "new") {
      // No hay proveedor preseleccionado, deshabilitar auto-búsqueda
      setHasPreloaded(true);
    }
  }, [adminContract.action]);

  // Cuando se precarga en modo nuevo, buscar y auto-seleccionar el proveedor (solo una vez)
  useEffect(() => {
    const autoSearch = async () => {
      if (adminContract.action === "new" && supplierIdentification && !supplier && !hasPreloaded) {
        setHasPreloaded(true);
        try {
          const result = await axios.get(
            `${process.env.REACT_APP_BUDGET_URL_API}/supplier-name-id`,
            { params: { supplier: supplierIdentification } }
          );
          if (result && result.data && result.data.length > 0) {
            setSuppliersArray(result.data);
            const match = result.data.find(s => String(s.idSupplier) === String(preselectedSupplier?.value));
            if (match) {
              setSupplier(match);
            } else {
              setSupplier(result.data[0]);
            }
          }
        } catch (error) {
          console.error("Error auto-searching supplier:", error);
        }
      }
    };
    autoSearch();
  }, [supplierIdentification]);

  return (
    <Modal.Dialog>
      <Modal.Header>
        <div className="subtitle center">
          <b>
            {" "}
            {adminContract.action === "edit"
              ? "EDITAR CONTRATO"
              : "CREAR CONTRATO"}{" "}
          </b>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="container-xl-modals">
          {messageResultOperation && (
            <div className="center mandatory">
              <div>{messageResultOperation}</div>
            </div>
          )}

          {/* ─── SECCIÓN: PROVEEDOR ─── */}
          <div className="section-title section-title-flex">
            <span>Proveedor</span>
            {supplier && (
              <button
                className="secondary btn-sm-custom"
                onClick={() => {
                  setSupplier("");
                  setSupplierIdentification("");
                  setSuppliersArray([]);
                }}
              >
                <i className="fas fa-exchange-alt" /> Cambiar Proveedor
              </button>
            )}
          </div>

          <div className="row subcontainer-admin-options" hidden={supplier}>
            <div className="col-3 left label">
              <span>Identificación Proveedor&nbsp;</span>
            </div>
          
            <div className="col-9">
              <input
                className="input-modal w-50"
                type="text"
                value={supplierIdentification}
                onChange={(event) =>
                  setSupplierIdentification(event.target.value)
                }
              />
              &nbsp;&nbsp;
              <button
                className="primary"
                type="button"
                onClick={() => getSupplier()}
              >
                <i className="fas fa-search" /> Buscar
              </button>
              &nbsp;&nbsp;
              {noSupplierFound && onCreateSupplier && (
                <button
                  className="secondary"
                  type="button"
                  onClick={() => onCreateSupplier()}
                >
                  <i className="fas fa-plus" /> Crear Proveedor
                </button>
              )}
              <div className="mandatory left" hidden={supplierIdentification}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Proveedor Obligatorio
              </div>
              {noSupplierFound && (
                <div className="mandatory left">
                  <i className="fas fa-exclamation-circle" />
                  &nbsp; Proveedor no encontrado
                </div>
              )}
            </div>
          </div>
          {/*  */}

          <div hidden={!supplier}>
            <div className="row subcontainer-admin-options">
              <div className="col-3 right label">
                <span>Nombre&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100 input-disabled-bg"
                  type="text"
                  value={supplier.name || ""}
                  disabled
                />
              </div>
              <div className="col-3 right label">
                <span>Dirección&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100 input-disabled-bg"
                  type="text"
                  value={supplier.address || ""}
                  disabled
                />
              </div>
            </div>
            <div className="row subcontainer-admin-options">
              <div className="col-3 right label">
                <span>Tipo Identificación&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100 input-disabled-bg"
                  type="text"
                  value={supplier.identificationType || ""}
                  disabled
                />
              </div>
              <div className="col-3 right label">
                <span>Identificación&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100 input-disabled-bg"
                  type="text"
                  value={supplier.identification || ""}
                  disabled
                />
              </div>
            </div>
          </div>

          {!supplier && suppliersArray && suppliersArray.length > 0 && (
            <div className="mt-24">
            <SupplierTable
              suppliersArray={suppliersArray}
              onChangeSupplierSelected={onChangeSupplierSelected}
              screen="contract"
            />
            </div>
          )}

          {/* ─── SECCIÓN: FECHAS ─── */}
          <div hidden={!supplier}>
            <div className="section-title">
              Fechas del Contrato
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-3 right label">
                <span>Fecha Inicio&nbsp;</span>
              </div>
              <div className="col-3">
                <DatePicker
                  className="date-picker-custom"
                  onChange={setInitialDate}
                  value={initialDate}
                  dateFormat="dd/MM/yyyy"
                />
                <div className="mandatory left" hidden={initialDate}>
                  <i className="fas fa-exclamation-circle" />
                  &nbsp; Obligatorio
                </div>
              </div>
              <div className="col-3 right label">
                <span>Fecha Terminación&nbsp;</span>
              </div>
              <div className="col-3">
                <DatePicker
                  className="date-picker-custom"
                  onChange={setFinalDate}
                  value={finalDate}
                  dateFormat="dd/MM/yyyy"
                />
                <div className="mandatory left" hidden={finalDate}>
                  <i className="fas fa-exclamation-circle" />
                  &nbsp; Obligatorio
                </div>
              </div>
            </div>

            {/* ─── SECCIÓN: A.I.U ─── */}
            <div className="section-title">
              A.I.U
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-3 right label">
                <span>Maneja porcentaje A.I.U&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  type="checkbox"
                  checked={aiuPercentage}
                  onChange={() => setAiuPercentage(!aiuPercentage)}
                />
              </div>
              <div className="col-3 right label">
                <span>% Utilidad&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={utility}
                  maxLength={3}
                  onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                  onChange={(event) => setUtility(event.target.value)}
                />
              </div>
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-3 right label">
                <span>% Administración&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={administration}
                  maxLength={3}
                  onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                  onChange={(event) => setAdministration(event.target.value)}
                />
              </div>
              <div className="col-3 right label">
                <span>% Imprevistos&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={events}
                  maxLength={3}
                  onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                  onChange={(event) => setEvents(event.target.value)}
                />
              </div>
            </div>

            {/* ─── SECCIÓN: OTROS PORCENTAJES ─── */}
            <div className="section-title">
              Otros Porcentajes
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-3 right label">
                <span>% Retenido&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={detained}
                  maxLength={3}
                  onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                  onChange={(event) => setDetained(event.target.value)}
                />
              </div>
              <div className="col-3 right label">
                <span>% Ret. Seg. Social&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={detainedSocialSecurity}
                  maxLength={3}
                  onKeyDown={(event) => handlers.onHandlerNumber(event)}
                  onChange={(event) =>
                    setDetainedSocialSecurity(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-3 right label">
                <span>% Amortización&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100"
                  type="text"
                  maxLength={3}
                  onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                  value={amortization}
                  onChange={(event) => setAmortization(event.target.value)}
                />
              </div>
              <div className="col-3 right label">
                <span>% Ret. Fuente&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100"
                  type="text"
                  onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                  maxLength={3}
                  value={taxes}
                  onChange={(event) => setTaxes(event.target.value)}
                />
              </div>
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-3 right label">
                <span>% Anticipo&nbsp;</span>
              </div>
              <div className="col-3">
                <input
                  className="input-modal w-100"
                  type="text"
                  maxLength={3}
                  value={advance}
                  onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                  onChange={(event) => setAdvance(event.target.value)}
                />
              </div>
            </div>

          
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
            <button
              className="secondary"
              type="button"
              onClick={() => onCloseAdminContract()}
            >
              Cerrar
            </button>
            <button
              className="primary"
              hidden={!supplier}
              disabled={!initialDate || !finalDate || !supplier}
              onClick={() => {
                onSaveContract(getContractProperties(), adminContract.action);
              }}
            >
              {adminContract.action === "edit"
                ? "Guardar Contrato"
                : "Crear Contrato"}
            </button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default AdminContract;
