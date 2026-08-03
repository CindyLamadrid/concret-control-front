import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import ReactSelect from "react-select";
import axios from "../../config/axiosConfig";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const handlers = require("../utils/handlers");

const AdminOrderEdit = ({ adminOrderEdit, messageResultOperation, onSaveOrderEdit, onCloseAdminOrderEdit }) => {
  // Dates
  const [billDate, setBillDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  const [discountDate, setDiscountDate] = useState(null);

  // Invoice fields
  const [billPrefix, setBillPrefix] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [idPaymentMethod, setIdPaymentMethod] = useState("");
  const [paymentMethodsArray, setPaymentMethodsArray] = useState([]);
  const [cufe, setCufe] = useState("");

  // Deductions
  const [discount, setDiscount] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [retainedReturn, setRetainedReturn] = useState(0);
  const [sourceRetention, setSourceRetention] = useState(0);
  const [ivaRetention, setIvaRetention] = useState(0);
  const [icaRetention, setIcaRetention] = useState(0);
  const [socialSecurityRetention, setSocialSecurityRetention] = useState(0);
  const [payrollDeductions, setPayrollDeductions] = useState(0);
  const [editObservations, setEditObservations] = useState("");

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

  useEffect(() => {
    if (adminOrderEdit?.order) {
      const o = adminOrderEdit.order;
      setBillDate(o.billDate ? new Date(o.billDate.split("/").reverse().join("-")) : new Date());
      setDueDate(o.dueDate ? new Date(o.dueDate.split("/").reverse().join("-")) : new Date());
      setDiscountDate(o.discountDate ? new Date(o.discountDate.split("/").reverse().join("-")) : null);
      setBillPrefix(o.billPrefix || "");
      setBillNumber(o.billNumber || "");
      setIdPaymentMethod(o.idPaymentMethod || "");
      setCufe(o.cufe || "");
      setDiscount(o.discount || 0);
      setAdvance(o.advance || 0);
      setRetainedReturn(o.retainedReturn || 0);
      setSourceRetention(o.sourceRetention || 0);
      setIvaRetention(o.ivaRetention || 0);
      setIcaRetention(o.icaRetention || 0);
      setSocialSecurityRetention(o.socialSecurityRetention || 0);
      setPayrollDeductions(o.payrollDeductions || 0);
      setEditObservations(o.editObservations || "");
    }
  }, [adminOrderEdit.order]);

  const getProperties = () => ({
    idOrder: adminOrderEdit.order.idOrder,
    billDate,
    dueDate,
    discountDate,
    billPrefix,
    billNumber,
    idPaymentMethod: parseInt(idPaymentMethod) || null,
    cufe,
    discount: parseFloat(discount) || 0,
    advance: parseFloat(advance) || 0,
    retainedReturn: parseFloat(retainedReturn) || 0,
    sourceRetention: parseFloat(sourceRetention) || 0,
    ivaRetention: parseFloat(ivaRetention) || 0,
    icaRetention: parseFloat(icaRetention) || 0,
    socialSecurityRetention: parseFloat(socialSecurityRetention) || 0,
    payrollDeductions: parseFloat(payrollDeductions) || 0,
    editObservations,
  });

  const NumericField = ({ label, value, setter }) => (
    <div className="row subcontainer-admin-options">
      <div className="col-5 right label"><span>{label} &nbsp;</span></div>
      <div className="col-7">
        <input
          className="input-modal w-50"
          type="text"
          value={value}
          onKeyDown={(e) => handlers.onHandlerDecimal(e)}
          onChange={(e) => setter(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <Modal.Dialog size="lg">
      <Modal.Header>
        <div className="subtitle center"><b>EDITAR ORDEN DE PAGO</b></div>
      </Modal.Header>
      <Modal.Body>
        <div className="container-xl-modals">

          {messageResultOperation && (
            <div className="center mandatory"><div>{messageResultOperation}</div></div>
          )}

          {/* Fechas */}
          <div className="section-title">Fechas</div>

          <div className="row subcontainer-admin-options">
            <div className="col-6 d-flex align-items-center">
              <span className="label" style={{minWidth: "140px"}}><b>Fecha Factura:</b></span>
              <DatePicker onChange={setBillDate} value={billDate} format="dd/MM/yyyy" />
            </div>
            <div className="col-6 d-flex align-items-center">
              <span className="label" style={{minWidth: "150px"}}><b>Fecha Vencimiento:</b></span>
              <DatePicker onChange={setDueDate} value={dueDate} format="dd/MM/yyyy" minDate={new Date()} />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-6 d-flex align-items-center">
              <span className="label" style={{minWidth: "140px"}}><b>Fecha Descuento:</b></span>
              <DatePicker onChange={setDiscountDate} value={discountDate} format="dd/MM/yyyy" minDate={new Date()} />
            </div>
            <div className="col-6"></div>
          </div>

          <hr className="separator" />

          {/* Datos de factura */}
          <div className="section-title">Datos de Factura</div>

          <div className="row subcontainer-admin-options">
            <div className="col-2 right label"><span>Prefijo &nbsp;</span></div>
            <div className="col-2">
              <input
                className="input-modal w-100"
                type="text"
                value={billPrefix}
                maxLength={10}
                onChange={(e) => setBillPrefix(e.target.value)}
              />
            </div>
            <div className="col-2 right label"><span>N° Factura &nbsp;</span></div>
            <div className="col-4">
              <input
                className="input-modal w-100"
                type="text"
                value={billNumber}
                onKeyDown={(e) => handlers.onHandlerNumber(e)}
                onChange={(e) => setBillNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-2 right label"><span>Forma de Pago &nbsp;</span></div>
            <div className="col-4">
              <ReactSelect
                className="react-select-container"
                options={paymentMethodsArray.map((pm) => ({ value: pm.idPaymentMethod, label: pm.method || pm.name }))}
                value={paymentMethodsArray.map((pm) => ({ value: pm.idPaymentMethod, label: pm.method || pm.name })).find((o) => String(o.value) === String(idPaymentMethod)) || null}
                onChange={(opt) => setIdPaymentMethod(opt ? opt.value : "")}
                placeholder="Seleccione..."
                isSearchable
              />
            </div>
            <div className="col-6"></div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-2 right label"><span>CUFE &nbsp;</span></div>
            <div className="col-10">
              <input
                className="input-modal w-80"
                type="text"
                value={cufe}
                onChange={(e) => setCufe(e.target.value)}
              />
            </div>
          </div>

          <hr className="separator" />

          {/* Deducciones */}
          <div className="section-title">Deducciones y Retenciones</div>

          <div className="row subcontainer-admin-options">
            <div className="col-6">
              <NumericField label="Descuento (+)" value={discount} setter={setDiscount} />
            </div>
            <div className="col-6">
              <NumericField label="Anticipo (+) / Amortización (-)" value={advance} setter={setAdvance} />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-6">
              <NumericField label="Retenido (+) / Dev. Rete (-)" value={retainedReturn} setter={setRetainedReturn} />
            </div>
            <div className="col-6">
              <NumericField label="Retención en la Fuente (+)" value={sourceRetention} setter={setSourceRetention} />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-6">
              <NumericField label="Retención del IVA (+)" value={ivaRetention} setter={setIvaRetention} />
            </div>
            <div className="col-6">
              <NumericField label="Retención del ICA (+)" value={icaRetention} setter={setIcaRetention} />
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-6">
              <NumericField label="Ret. Seg. Social (+) / Dev (-)" value={socialSecurityRetention} setter={setSocialSecurityRetention} />
            </div>
            <div className="col-6">
              <NumericField label="Deducciones Nómina (+)" value={payrollDeductions} setter={setPayrollDeductions} />
            </div>
          </div>

          <hr className="separator" />

          {/* Observaciones */}
          <div className="row subcontainer-admin-options">
            <div className="col-3 right label"><span>Observaciones de documento &nbsp;</span></div>
            <div className="col-9">
              <textarea
                className="input-modal w-100"
                rows={4}
                value={editObservations}
                onChange={(e) => setEditObservations(e.target.value)}
              />
            </div>
          </div>

        </div>
      </Modal.Body>
      <Modal.Footer>
            <button className="secondary" type="button" onClick={onCloseAdminOrderEdit}>Cerrar</button>
            <button className="primary" type="button" onClick={() => onSaveOrderEdit(getProperties())}>
              Guardar
            </button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default AdminOrderEdit;
