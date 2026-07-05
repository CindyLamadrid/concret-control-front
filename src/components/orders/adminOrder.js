import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const handlers = require("../utils/handlers");

const AdminOrder = ({ adminOrder, messageResultOperation, onSaveOrder, onCloseAdminOrder }) => {
  const [billDate, setBillDate] = useState(new Date());
  const [billPrefix, setBillPrefix] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [idPaymentMethod, setIdPaymentMethod] = useState("");
  const [paymentMethodsArray, setPaymentMethodsArray] = useState([]);
  const [cufe, setCufe] = useState("");
  const [electronicDocumentId, setElectronicDocumentId] = useState("");
  const [observations, setObservations] = useState("");

  const getPaymentMethods = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/payment-methods`);
      if (result?.data?.length > 0) setPaymentMethodsArray(result.data);
    } catch (error) {
      console.error("Error fetching paymentMethods:", error);
    }
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const getOrderProperties = () => ({
    billDate,
    billPrefix,
    billNumber,
    idPaymentMethod,
    cufe,
    electronicDocumentId,
    observations,
  });

  const isValid = billDate && billNumber && idPaymentMethod && cufe && electronicDocumentId && observations;

  const Field = ({ label, mandatory, hidden, children }) => (
    <div className="row subcontainer-admin-options" hidden={hidden}>
      <div className="col-3 right label"><span>{label} &nbsp;</span></div>
      <div className="col-9">
        {children}
        {mandatory && (
          <div className="mandatory left" hidden={!mandatory}>
            <i className="fas fa-exclamation-circle" /> &nbsp; {label} Obligatorio
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Modal.Dialog>
      <Modal.Body>
        <div className="container-xl-modals">
          <div className="subtitle center"><b>CREAR ORDEN DE PAGO</b></div>

          {messageResultOperation && (
            <div className="center mandatory"><div>{messageResultOperation}</div><br /></div>
          )}

          <div className="row subcontainer-admin-options">
            <div className="col-3 right label"><span>Fecha Factura &nbsp;</span></div>
            <div className="col-9">
              <DatePicker onChange={setBillDate} value={billDate} dateFormat="dd/MM/yyyy" />
              <div className="mandatory left" hidden={billDate}>
                <i className="fas fa-exclamation-circle" /> &nbsp; Fecha Obligatoria
              </div>
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-3 right label"><span>Prefijo Factura &nbsp;</span></div>
            <div className="col-9">
              <input
                className="input-modal w-20"
                type="text"
                value={billPrefix}
                maxLength={10}
                onChange={(e) => setBillPrefix(e.target.value)}
              />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-3 right label"><span>N° Factura &nbsp;</span></div>
            <div className="col-9">
              <input
                className="input-modal w-40"
                type="text"
                value={billNumber}
                onKeyDown={(e) => handlers.onHandlerNumber(e)}
                onChange={(e) => setBillNumber(e.target.value)}
              />
              <div className="mandatory left" hidden={billNumber}>
                <i className="fas fa-exclamation-circle" /> &nbsp; N° Factura Obligatorio
              </div>
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-3 right label"><span>Forma de Pago &nbsp;</span></div>
            <div className="col-9">
              <select
                className="input-modal w-60"
                value={idPaymentMethod}
                onChange={(e) => setIdPaymentMethod(e.target.value)}
              >
                <option value="">-- Seleccione --</option>
                {paymentMethodsArray.map((pm) => (
                  <option key={pm.idPaymentMethod} value={pm.idPaymentMethod}>{pm.method}</option>
                ))}
              </select>
              <div className="mandatory left" hidden={idPaymentMethod}>
                <i className="fas fa-exclamation-circle" /> &nbsp; Forma de Pago Obligatoria
              </div>
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-3 right label"><span>CUFE &nbsp;</span></div>
            <div className="col-9">
              <input
                className="input-modal w-80"
                type="text"
                value={cufe}
                onChange={(e) => setCufe(e.target.value)}
              />
              <div className="mandatory left" hidden={cufe}>
                <i className="fas fa-exclamation-circle" /> &nbsp; CUFE Obligatorio
              </div>
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-3 right label"><span>ID Documento Electrónico &nbsp;</span></div>
            <div className="col-9">
              <input
                className="input-modal w-80"
                type="text"
                value={electronicDocumentId}
                onChange={(e) => setElectronicDocumentId(e.target.value)}
              />
              <div className="mandatory left" hidden={electronicDocumentId}>
                <i className="fas fa-exclamation-circle" /> &nbsp; ID Documento Obligatorio
              </div>
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-3 right label"><span>Observaciones &nbsp;</span></div>
            <div className="col-9">
              <textarea
                className="input-modal w-80"
                rows={4}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
              <div className="mandatory left" hidden={observations}>
                <i className="fas fa-exclamation-circle" /> &nbsp; Observaciones Obligatorias
              </div>
            </div>
          </div>

          <br />
          <div className="right">
            <button className="secondary" type="button" onClick={onCloseAdminOrder}>Cerrar</button>
            &nbsp;&nbsp;
            <button
              className="primary"
              type="button"
              disabled={!isValid}
              onClick={() => onSaveOrder(getOrderProperties(), adminOrder.action)}
            >
              Crear Orden
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default AdminOrder;
