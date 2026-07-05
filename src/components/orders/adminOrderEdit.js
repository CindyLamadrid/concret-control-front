import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

const handlers = require("../utils/handlers");

const AdminOrderEdit = ({ adminOrderEdit, messageResultOperation, onSaveOrderEdit, onCloseAdminOrderEdit }) => {
  const [discount, setDiscount] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [retainedReturn, setRetainedReturn] = useState(0);
  const [sourceRetention, setSourceRetention] = useState(0);
  const [ivaRetention, setIvaRetention] = useState(0);
  const [icaRetention, setIcaRetention] = useState(0);
  const [socialSecurityRetention, setSocialSecurityRetention] = useState(0);
  const [payrollDeductions, setPayrollDeductions] = useState(0);
  const [editObservations, setEditObservations] = useState("");

  useEffect(() => {
    if (adminOrderEdit?.order) {
      const o = adminOrderEdit.order;
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
      <div className="col-4 right label"><span>{label} &nbsp;</span></div>
      <div className="col-8">
        <input
          className="input-modal w-40"
          type="text"
          value={value}
          onKeyDown={(e) => handlers.onHandlerDecimal(e)}
          onChange={(e) => setter(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <Modal.Dialog>
      <Modal.Body>
        <div className="container-xl-modals">
          <div className="subtitle center"><b>EDITAR ORDEN DE PAGO</b></div>

          {adminOrderEdit.order && (
            <div className="subtitle-admin center">
              Factura: {adminOrderEdit.order.billPrefix}{adminOrderEdit.order.billNumber} &nbsp;|&nbsp;
              {adminOrderEdit.order.supplierName}
            </div>
          )}

          {messageResultOperation && (
            <div className="center mandatory"><div>{messageResultOperation}</div><br /></div>
          )}

          <hr className="separator" />
          <div className="subtitle-admin">Deducciones y Retenciones</div>

          <NumericField label="Descuento"                    value={discount}                 setter={setDiscount} />
          <NumericField label="Anticipo / Amortización"      value={advance}                  setter={setAdvance} />
          <NumericField label="Retenido / Dev. Rete"         value={retainedReturn}            setter={setRetainedReturn} />
          <NumericField label="Retención en la Fuente"       value={sourceRetention}           setter={setSourceRetention} />
          <NumericField label="Retención del IVA"            value={ivaRetention}              setter={setIvaRetention} />
          <NumericField label="Retención del ICA"            value={icaRetention}              setter={setIcaRetention} />
          <NumericField label="Retención Seg. Social"        value={socialSecurityRetention}   setter={setSocialSecurityRetention} />
          <NumericField label="Deducciones Nómina"           value={payrollDeductions}         setter={setPayrollDeductions} />

          <div className="row subcontainer-admin-options">
            <div className="col-4 right label"><span>Observaciones &nbsp;</span></div>
            <div className="col-8">
              <textarea
                className="input-modal w-80"
                rows={4}
                value={editObservations}
                onChange={(e) => setEditObservations(e.target.value)}
              />
            </div>
          </div>

          <br />
          <div className="right">
            <button className="secondary" type="button" onClick={onCloseAdminOrderEdit}>Cerrar</button>
            &nbsp;&nbsp;
            <button className="primary" type="button" onClick={() => onSaveOrderEdit(getProperties())}>
              Guardar Orden
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default AdminOrderEdit;
