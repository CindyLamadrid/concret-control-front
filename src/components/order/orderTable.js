const common = require("../utils/common");

const OrderTable = ({ orderArray, onEditOrder, onViewDetail, canEdit }) => {
  return (
    <div>
      <table className="table w-100">
        <thead>
          <tr>
            <th className="w-15">PROVEEDOR</th>
            <th className="w-10">FECHA FACTURA</th>
            <th className="w-10">N° FACTURA</th>
            <th className="w-15">FORMA DE PAGO</th>
            <th className="w-20">CUFE</th>
            <th className="w-15">ID DOC. ELECTRÓNICO</th>
            <th className="w-5">VER</th>
            {canEdit && <th className="w-5">EDITAR</th>}
          </tr>
        </thead>
        <tbody>
          {orderArray.map((x, index) => (
            <tr key={index.toString()}>
              <td className={index % 2 === 0 ? "dark left" : "left"}>{x.supplierName}</td>
              <td className={index % 2 === 0 ? "dark center" : "center"}>{x.billDate}</td>
              <td className={index % 2 === 0 ? "dark center" : "center"}>{x.billPrefix}{x.billNumber}</td>
              <td className={index % 2 === 0 ? "dark left" : "left"}>{x.paymentMethod}</td>
              <td className={index % 2 === 0 ? "dark left" : "left"}>{x.cufe}</td>
              <td className={index % 2 === 0 ? "dark left" : "left"}>{x.electronicDocumentId}</td>
              <td className={index % 2 === 0 ? "dark center" : "center"}>
                <i className="fas fa-external-link-alt icon-view-detail" onClick={() => onViewDetail && onViewDetail(index)} />
              </td>
              {canEdit && (
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i className="fas fa-pencil-alt icon-view-detail" onClick={() => onEditOrder && onEditOrder(index)} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
