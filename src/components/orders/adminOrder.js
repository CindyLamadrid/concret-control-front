import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import Modal from "react-bootstrap/Modal";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const handlers = require("../utils/handlers");

const AdminOrder = ({
  adminOrder,
  messageResultOperation,
  onSaveOrder,
  onCloseAdminOrder,
}) => {
  const [billDate, setBillDate] = useState(new Date());
  const [billNumber, setBillNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethodsArray, setPaymentMethodsArray] = useState([]);

  const getPaymentMethods = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/paymentMethod`
      );
      if (result && result.data && result.data.length > 0) {
        setPaymentMethodsArray(result.data);
      } else {
        setPaymentMethodsArray([]);
      }
    } catch (error) {
      setPaymentMethodsArray([]);
      console.error("Error fetching paymentMethods:", error);
    }
  };

  const getOrderProperties = () => ({
    billDate,
    billNumber: parseInt(billNumber, 10),
    paymentMethod,
  });

  useEffect(() => {
    getPaymentMethods();
  }, []);

  useEffect(() => {
    if (adminOrder.action === "edit" && adminOrder.order) {
      setBillDate(adminOrder.order.billDate ? new Date(adminOrder.order.billDate) : new Date());
      setBillNumber(adminOrder.order.billNumber || "");
      setPaymentMethod(adminOrder.order.paymentMethod || "");
    }
  }, [adminOrder.action]);

  const isValid = billDate && billNumber && paymentMethod;

  return (
    <Modal.Dialog>
      <Modal.Body>
        <div className="container-xl-modals">
          <div className="subtitle center">
            <b>{adminOrder.action === "edit" ? "EDITAR ORDEN" : "CREAR ORDEN"}</b>
          </div>

          {messageResultOperation && (
            <div className="center mandatory">
              <div>{messageResultOperation}</div>
              <br />
            </div>
          )}

          <div className="row subcontainer-admin-options">
            <div className="col-3 right label">
              <span>Fecha Factura &nbsp;</span>
            </div>
            <div className="col-9">
              <DatePicker
                onChange={setBillDate}
                value={billDate}
                dateFormat="dd/MM/yyyy"
              />
              <div className="mandatory left" hidden={billDate}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Fecha Obligatoria
              </div>
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-3 right label">
              <span>N° Factura &nbsp;</span>
            </div>
            <div className="col-9">
              <input
                className="input-modal w-40"
                type="text"
                value={billNumber}
                onKeyDown={(event) => handlers.onHandlerNumber(event)}
                onChange={(event) => setBillNumber(event.target.value)}
              />
              <div className="mandatory left" hidden={billNumber}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; N° Factura Obligatorio
              </div>
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-3 right label">
              <span>Forma de Pago &nbsp;</span>
            </div>
            <div className="col-9">
              <select
                className="input-modal w-60"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
              >
                <option value="">-- Seleccione --</option>
                {paymentMethodsArray.map((pm) => (
                  <option key={pm.paymentId} value={pm.paymentId}>
                    {pm.method}
                  </option>
                ))}
              </select>
              <div className="mandatory left" hidden={paymentMethod}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Forma de Pago Obligatoria
              </div>
            </div>
          </div>

          <br />
          <div className="right">
            <button
              className="secondary"
              type="button"
              onClick={() => onCloseAdminOrder()}
            >
              Cerrar
            </button>
            &nbsp;&nbsp;
            <button
              className="primary"
              type="button"
              disabled={!isValid}
              onClick={() => onSaveOrder(getOrderProperties(), adminOrder.action)}
            >
              {adminOrder.action === "edit" ? "Guardar Orden" : "Crear Orden"}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default AdminOrder;
