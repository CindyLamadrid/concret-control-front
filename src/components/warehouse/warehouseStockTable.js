const common = require("../utils/common");

const WarehouseStockTable = ({ stockArray }) => {
  const fmt = (v) => common.getMoneyFomat(v || 0);
  const date = (v) => (v ? common.getDateFormat(v) : "—");

  return (
    <div className="overflow-x-auto">
      <table className="table w-100">
        <thead>
          <tr>
            <th className="w-7">CÓDIGO</th>
            <th className="w-20">INSUMO</th>
            <th className="w-5">UN</th>
            <th className="w-8">ENTRADA</th>
            <th className="w-8">SALIDA</th>
            <th className="w-8">SALDO</th>
            <th className="w-10">VALOR UNIT.</th>
            <th className="w-10">TOTAL</th>
            <th className="w-10">ÚLT. ENTRADA</th>
            <th className="w-10">ÚLT. SALIDA</th>
          </tr>
        </thead>
        <tbody>
          {stockArray.map((x, index) => {
            const cls = index % 2 === 0 ? "dark" : "";
            const saldo = parseFloat(x.stock) || 0;
            const saldoCls = saldo <= 0 ? "mandatory" : "";
            return (
              <tr key={index.toString()}>
                <td className={`${cls} center`}>{x.cod}</td>
                <td className={`${cls} left`}>{x.inputName}</td>
                <td className={`${cls} center`}>{x.unit}</td>
                <td className={`${cls} right`}>{x.entries}</td>
                <td className={`${cls} right`}>{x.exits}</td>
                <td className={`${cls} right ${saldoCls}`}><b>{x.stock}</b></td>
                <td className={`${cls} right`}>{fmt(x.unitValue)}</td>
                <td className={`${cls} right`}>{fmt(x.stockValue)}</td>
                <td className={`${cls} center`}>{date(x.lastEntryDate)}</td>
                <td className={`${cls} center`}>{date(x.lastExitDate)}</td>
              </tr>
            );
          })}
          {stockArray.length > 0 && (
            <tr>
              <td colSpan={7} className="right"><b>TOTAL INVENTARIO</b></td>
              <td className="right">
                <b>{fmt(stockArray.reduce((s, x) => s + (parseFloat(x.stockValue) || 0), 0))}</b>
              </td>
              <td colSpan={2}></td>
            </tr>
          )}
        </tbody>
      </table>
      {stockArray.length === 0 && <div className="center mt-8">No hay existencias en inventario.</div>}
    </div>
  );
};

export default WarehouseStockTable;
