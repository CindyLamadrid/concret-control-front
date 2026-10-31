const common = require("../utils/common");

/**
 * Tabla SOLO LECTURA de las entradas de almacen vinculadas a una orden de
 * pago de suministros y materiales (type 'M'). Permite quitar (desvincular).
 */
const OrderEntriesTable = ({ entriesArray, onRemoveEntry }) => {
  const fmt = (v) => common.getMoneyFomat(v || 0);

  return (
    <div className="overflow-x-auto">
      <table className="table w-100">
        <thead>
          <tr>
            <th className="w-5">QUITAR</th>
            <th className="w-10">FECHA</th>
            <th className="w-8">CÓDIGO</th>
            <th className="w-30">INSUMO</th>
            <th className="w-6">UN</th>
            <th className="w-10">CANTIDAD</th>
            <th className="w-12">VALOR UNIT.</th>
            <th className="w-12">VALOR TOTAL</th>
            <th className="w-15">OBSERVACIONES</th>
          </tr>
        </thead>
        <tbody>
          {entriesArray.map((x, index) => {
            const cls = index % 2 === 0 ? "dark" : "";
            return (
              <tr key={index.toString()}>
                <td className={`${cls} center`}>
                  <i className="fas fa-trash icon-view-detail" title="Quitar de la orden" onClick={() => onRemoveEntry(x)} />
                </td>
                <td className={`${cls} center`}>{common.getDateFormat(x.movementDate)}</td>
                <td className={`${cls} center`}>{x.cod}</td>
                <td className={`${cls} left`}>{x.inputName}</td>
                <td className={`${cls} center`}>{x.unit}</td>
                <td className={`${cls} right`}>{x.quantity}</td>
                <td className={`${cls} right`}>{fmt(x.unitValue)}</td>
                <td className={`${cls} right`}>{fmt(x.totalValue)}</td>
                <td className={`${cls} left`}>{x.observations || ""}</td>
              </tr>
            );
          })}
          {entriesArray.length > 0 && (
            <tr>
              <td colSpan={7} className="right"><b>TOTAL</b></td>
              <td className="right">
                <b>{fmt(entriesArray.reduce((s, x) => s + (parseFloat(x.totalValue) || 0), 0))}</b>
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
      {entriesArray.length === 0 && <div className="center mt-8">No hay entradas asociadas a esta orden.</div>}
    </div>
  );
};

export default OrderEntriesTable;
