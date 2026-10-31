const common = require("../utils/common");

const WarehouseMovementsTable = ({ movementsArray, type, onRemove, onEdit }) => {
  const fmt = (v) => common.getMoneyFomat(v || 0);
  const isEntry = type === "I";

  return (
    <div className="overflow-x-auto">
      <table className="table w-100">
        <thead>
          <tr>
            <th className="w-5">ELIMINAR</th>
            <th className="w-8">FECHA</th>
            <th className="w-7">CÓDIGO</th>
            <th className="w-20">INSUMO</th>
            <th className="w-5">UN</th>
            <th className="w-7">CANTIDAD</th>
            <th className="w-10">VALOR UNIT.</th>
            <th className="w-10">VALOR TOTAL</th>
            {isEntry
              ? <th className="w-15">PROVEEDOR</th>
              : <th className="w-18">IMPUTACIÓN (DESTINO)</th>}
            <th className="w-15">OBSERVACIONES</th>
            <th className="w-5">EDITAR</th>
          </tr>
        </thead>
        <tbody>
          {movementsArray.map((x, index) => {
            const cls = index % 2 === 0 ? "dark" : "";
            return (
              <tr key={index.toString()}>
                <td className={`${cls} center`}>
                  <i className="fas fa-trash icon-view-detail" title="Eliminar" onClick={() => onRemove(x)} />
                </td>
                <td className={`${cls} center`}>{common.getDateFormat(x.movementDate)}</td>
                <td className={`${cls} center`}>{x.cod}</td>
                <td className={`${cls} left`}>{x.inputName}</td>
                <td className={`${cls} center`}>{x.unit}</td>
                <td className={`${cls} right`}>{x.quantity}</td>
                <td className={`${cls} right`}>{fmt(x.unitValue)}</td>
                <td className={`${cls} right`}>{fmt(x.totalValue)}</td>
                {isEntry
                  ? <td className={`${cls} left`}>{x.supplierName || "—"}</td>
                  : <td className={`${cls} left`}>
                      {(x.chapterName || "")}{x.subchapterName ? ` - ${x.subchapterName}` : ""}
                      {x.budgetInputName ? <><br /><small>{x.budgetInputName}</small></> : ""}
                    </td>}
                <td className={`${cls} left`}>{x.observations || ""}</td>
                <td className={`${cls} center`}>
                  <i className="fas fa-pen icon-view-detail" title="Editar" onClick={() => onEdit && onEdit(x)} />
                </td>
              </tr>
            );
          })}
          {movementsArray.length > 0 && (
            <tr>
              <td colSpan={8}></td>
              <td className="right">
                <b>{fmt(movementsArray.reduce((s, x) => s + (parseFloat(x.totalValue) || 0), 0))}</b>
              </td>
              <td colSpan={2}></td>
            </tr>
          )}
        </tbody>
      </table>
      {movementsArray.length === 0 && <div className="center mt-8">No hay movimientos registrados.</div>}
    </div>
  );
};

export default WarehouseMovementsTable;
