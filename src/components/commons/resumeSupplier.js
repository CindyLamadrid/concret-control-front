const ResumeSupplier = ({
  constructionSelected,
  order,
}) => {
  if (!order) return null;

  return (
    <div className="resume">
      <table className="resume-table">
        <tbody>
          <tr>
            <td><b>OBRA:</b> {constructionSelected?.name || ""}</td>
            <td className="sep">|</td>
            <td><b>PROVEEDOR:</b> {order.supplierName || ""}</td>
            <td className="sep">|</td>
            <td><b>NIT:</b> {order.identification || ""}</td>
          </tr>
          <tr>
            <td><b>F.FACTURA:</b> {order.billDate || ""}</td>
            <td className="sep">|</td>
            <td><b>FACTURA:</b> {(order.billPrefix || "") + (order.billNumber || "")}</td>
            <td className="sep">|</td>
            <td><b>FORMA DE PAGO:</b> {order.paymentMethod || ""} &nbsp; <b>ESTADO:</b> Abierto</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResumeSupplier;
