const common = require("../utils/common");
const handlers = require("../utils/handlers");

const OrderInputsTable = ({ orderInputsArray, onChangeField, onSaveRow, onRefresh }) => {
  const fmt = (v) => common.getMoneyFomat(v || 0);

  return (
    <div>
      <table className="table w-100">
        <thead>
          <tr>
            <th className="w-10">IMPUTACIÓN</th>
            <th className="w-7">N° CONTRATO</th>
            <th className="w-5">REGISTRO</th>
            <th className="w-5">CÓDIGO</th>
            <th className="w-12">DESCRIPCIÓN</th>
            <th className="w-4">UN</th>
            <th className="w-6">CANTIDAD</th>
            <th className="w-7">PRECIO</th>
            <th className="w-7">VALOR</th>
            <th className="w-5">IVA</th>
            <th className="w-5">%IVA</th>
            <th className="w-5">GUARDAR</th>
            <th className="w-6">RETEFTE</th>
            <th className="w-6">RETEIVA</th>
            <th className="w-6">RETEICA</th>
            <th className="w-7">BASE</th>
          </tr>
        </thead>
        <tbody>
          {orderInputsArray.map((x, index) => {
            const cls  = index % 2 === 0 ? "dark" : "";
            const qty   = parseFloat(x.quantity)  || 0;
            const price = parseFloat(x.unitValue)  || 0;
            const valor = qty * price;
            const iva     = valor * (parseFloat(x.ivaPercent)     || 0) / 100;
            const reteFte = valor * (parseFloat(x.reteFtePercent)  || 0) / 100;
            const reteIva = valor * (parseFloat(x.reteIvaPercent)  || 0) / 100;
            const reteIca = valor * (parseFloat(x.reteIcaPercent)  || 0) / 100;
            const base    = valor - reteFte - reteIva - reteIca;

            return (
              <tr key={index.toString()}>
                <td className={`${cls} left`}>{x.imputation}</td>
                <td className={`${cls} center`}>{x.contractNumber}</td>
                <td className={`${cls} center`}>{x.registro}</td>
                <td className={`${cls} center`}>{x.cod}</td>
                <td className={`${cls} left`}>{x.name}</td>
                <td className={`${cls} center`}>{x.unit}</td>

                {/* CANTIDAD — editable */}
                <td className={`${cls} right`}>
                  <input
                    type="text"
                    className={`input input-table right${x.quantityChanged ? " pending-changes" : ""}`}
                    value={x.quantity != null ? x.quantity.toString() : "0"}
                    onKeyDown={(e) => handlers.onHandlerDecimal(e)}
                    onChange={(e) => onChangeField(e, index, "quantity")}
                  />
                </td>

                {/* PRECIO — editable */}
                <td className={`${cls} right`}>
                  <input
                    type="text"
                    className={`input input-table right${x.unitValueChanged ? " pending-changes" : ""}`}
                    value={x.unitValue != null ? common.getMoneyFomat(x.unitValue.toString(), x.editing) : "0"}
                    onKeyDown={(e) => handlers.onHandlerDecimal(e)}
                    onFocus={() => onChangeField(null, index, "__focus")}
                    onBlur={() => onChangeField(null, index, "__blur")}
                    onChange={(e) => onChangeField(e, index, "unitValue")}
                  />
                </td>

                <td className={`${cls} right`}>{fmt(valor)}</td>
                <td className={`${cls} right`}>{fmt(iva)}</td>

                {/* %IVA — editable */}
                <td className={`${cls} right`}>
                  <input
                    type="text"
                    className={`input input-table right${x.ivaPercentChanged ? " pending-changes" : ""}`}
                    value={x.ivaPercent != null ? x.ivaPercent.toString() : "0"}
                    onKeyDown={(e) => handlers.onHandlerDecimal(e)}
                    onChange={(e) => onChangeField(e, index, "ivaPercent")}
                  />
                </td>

                {/* GUARDAR — after %IVA */}
                <td className={`${cls} center`}>
                  <i className="far fa-save icon-view-detail" onClick={() => onSaveRow(index)} />
                  &nbsp;
                  <i className="fas fa-times-circle icon-view-detail" onClick={() => onRefresh(index)} />
                </td>

                <td className={`${cls} right`}>{fmt(reteFte)}</td>
                <td className={`${cls} right`}>{fmt(reteIva)}</td>
                <td className={`${cls} right`}>{fmt(reteIca)}</td>
                <td className={`${cls} right`}>{fmt(base)}</td>
              </tr>
            );
          })}
          {orderInputsArray.length > 0 && (
            <tr>
              <td colSpan={8}></td>
              <td className="right">
                <b>{fmt(orderInputsArray.reduce((s, x) => s + (parseFloat(x.quantity) || 0) * (parseFloat(x.unitValue) || 0), 0))}</b>
              </td>
              <td colSpan={6}></td>
              <td className="right">
                <b>{fmt(orderInputsArray.reduce((s, x) => {
                  const v   = (parseFloat(x.quantity) || 0) * (parseFloat(x.unitValue) || 0);
                  const ret = v * ((parseFloat(x.reteFtePercent) || 0) + (parseFloat(x.reteIvaPercent) || 0) + (parseFloat(x.reteIcaPercent) || 0)) / 100;
                  return s + v - ret;
                }, 0))}</b>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderInputsTable;
