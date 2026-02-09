import { useEffect, useState } from "react";
import axios from "axios";
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
}) => {
  const [suppliersArray, setSuppliersArray] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [supplierIdentification, setSupplierIdentification] = useState("");
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
    console.log("onChange===", index);
    if (index > -1) {
      const newSupliersArray = [...suppliersArray];
      newSupliersArray[index].selected = !suppliersArray[index].selected;

      setSuppliersArray(...[newSupliersArray]);
      setSupplier(newSupliersArray[index]);
      console.log("newSupliersArray.idSupplier", newSupliersArray);
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
  }, [adminContract.action]);

  return (
    <Modal.Dialog>
      <Modal.Body>
        <div className="container-xl-modals">
          <div className="subtitle center">
            <b>
              {" "}
              {adminContract.action === "edit"
                ? "EDITAR CONTRATO"
                : "CREAR CONTRATO"}{" "}
            </b>
          </div>
          {messageResultOperation && (
            <div className="center mandatory">
              <div>{messageResultOperation}</div> <br />
            </div>
          )}

          <div className="row subcontainer-admin-options" hidden={supplier}>
            <div className="col-2 right label">
              <span>Proveedor &nbsp;</span>
            </div>
            <div className="col-10">
              <div className="w-80">
                <input
                  className="input w-60"
                  type="text"
                  value={supplierIdentification}
                  onChange={(event) =>
                    setSupplierIdentification(event.target.value)
                  }
                />
                &nbsp; &nbsp;
                <input
                  type="button"
                  className="primary"
                  value={"Buscar"}
                  onClick={() => {
                    getSupplier();
                  }}
                />
              </div>
              <div className="mandatory left" hidden={supplierIdentification}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Proveedor Obligatorio
              </div>
            </div>
          </div>

          <div hidden={!supplier} className="w-80">
            <div className="subtitle-admin">
              <button
                className="link"
                type="button"
                onClick={() => setSupplier("")}
              >
                {"Cambiar provedor"}
              </button>
            </div>
            <div className="row subcontainer-admin-options">
              <div className="col-2 left label">
                <span>Nombre</span>
              </div>
              <div className="col-8">
                <div className="w-80 left label-detail">{supplier.name}</div>
              </div>
            </div>
            <div className="row subcontainer-admin-options">
              <div className="col-2 left label">
                <span>Identificación</span>
              </div>
              <div className="col-8">
                <div className="w-80 left label-detail">
                  {supplier.identificationType} - {supplier.identification}
                </div>
              </div>
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-2 left label">
                <span>Address</span>
              </div>
              <div className="col-8">
                <div className="w-80 label-detail">{supplier.address}</div>
              </div>
            </div>
          </div>

          {!supplier && suppliersArray && suppliersArray.length > 0 && (
            <SupplierTable
              suppliersArray={suppliersArray}
              onChangeSupplierSelected={onChangeSupplierSelected}
              screen="contract"
            />
          )}

          <hr className="separator" />
          <div hidden={!supplier}>
            <div className="row subcontainer-admin-options">
              <div className="col-2 right label">
                <span>Inicio &nbsp;</span>
              </div>
              <div className="col-4">
                <div className="w-78 left">
                  <DatePicker
                    onChange={setInitialDate}
                    value={initialDate}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="mandatory left" hidden={initialDate}>
                  <i className="fas fa-exclamation-circle" />
                  &nbsp; Fecha Inicial Obligatorio
                </div>
              </div>
              <div className="col-2 right label">
                <span>Terminación&nbsp;</span>
              </div>
              <div className="col-4">
                <div className="w-78">
                  <DatePicker
                    onChange={setFinalDate}
                    value={finalDate}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className="mandatory " hidden={finalDate}>
                  <i className="fas fa-exclamation-circle" />
                  &nbsp; Fecha de Terminación Obligatorio
                </div>
              </div>
            </div>
            <hr className="separator" />
            <div className="subtitle-admin">A.I.U</div>
            <div className="row subcontainer-admin-options">
              <div className="col-4 right label">
                <span>Contrato maneja porcentaje A.I.U&nbsp;&nbsp;</span>
              </div>
              <div className="col-2">
                <div className="w-78">
                  <input
                    className=""
                    type="checkbox"
                    value={aiuPercentage}
                    onChange={() => setAiuPercentage(!aiuPercentage)}
                  />
                </div>
              </div>
              <div className="col-2 right label">
                <span>%Utilidad</span>
              </div>
              <div className="col-4">
                <div className="w-78">
                  <input
                    className="input-modal w-80"
                    type="text"
                    value={utility}
                    maxLength={3}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onChange={(event) => setUtility(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-2 right label">
                <span>%Administración &nbsp;</span>
              </div>
              <div className="col-4">
                <div className="w-80">
                  <input
                    className="input-modal w-80"
                    type="text"
                    value={administration}
                    maxLength={3}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onChange={(event) => setAdministration(event.target.value)}
                  />
                </div>
              </div>
              <div className="col-2 right label">
                <span>%Imprevistos</span>
              </div>
              <div className="col-4">
                <div className="w-78">
                  <input
                    className="input-modal w-80"
                    type="text"
                    value={events}
                    maxLength={3}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onChange={(event) => setEvents(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <hr className="separator" />
            <div className="subtitle-admin">Otros porcentajes</div>

            <div className="row subcontainer-admin-options">
              <div className="col-2 right label">
                <span>%Retenido &nbsp;</span>
              </div>
              <div className="col-4">
                <div className="w-80">
                  <input
                    className="input-modal w-80"
                    type="text"
                    value={detained}
                    maxLength={3}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onChange={(event) => setDetained(event.target.value)}
                  />
                </div>
              </div>
              <div className="col-2 right label">
                <span>%Ret Seg Social</span>
              </div>
              <div className="col-4">
                <div className="w-80">
                  <input
                    className="input-modal w-80"
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
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-2 right label">
                <span>% Amortización</span>
              </div>
              <div className="col-4">
                <div className="w-80">
                  <input
                    className="input-modal w-80"
                    type="text"
                    maxLength={3}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    value={amortization}
                    onChange={(event) => setAmortization(event.target.value)}
                  />
                </div>
              </div>

              <div className="col-2 right label">
                <span>% Ret Fuente</span>
              </div>
              <div className="col-4">
                <div className="w-80">
                  <input
                    className="input-modal w-80"
                    type="text"
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    maxLength={3}
                    value={taxes}
                    onChange={(event) => setTaxes(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-2 right label">
                <span>% Anticipo&nbsp;</span>
              </div>
              <div className="col-4">
                <div className="w-80">
                  <input
                    className="input-modal w-80"
                    type="text"
                    maxLength={3}
                    value={advance}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onChange={(event) => setAdvance(event.target.value)}
                  />
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
          <div className="right">
            <button
              className="secondary"
              type="button"
              onClick={() => onCloseAdminContract()}
            >
              {"Cerrar"}
            </button>
            &nbsp;&nbsp;
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
          </div>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default AdminContract;
