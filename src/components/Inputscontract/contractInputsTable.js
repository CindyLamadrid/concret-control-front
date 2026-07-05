const handlers = require("../utils/handlers");
const common = require("../utils/common");

const ContractInputsTable = ({
  contractInputsArray,
  onRemoveInput,
  onChangeQuantity,
  onSaveInformation,
  onRefresh,
  onFocusInput,
  onBlurInput,
  onImputation,
}) => {
  return (
    <div>
      <table className="table w-98">
        <thead>
          <tr>
            <th className="w-5">ELIMINAR</th>
            <th className="w-10">IMPUTACIÓN</th>
            <th className="w-5">CODIGO</th>
            <th className="w-20">INSUMO</th>
            <th className="w-5">UNIDAD</th>
            <th className="w-10">CANT. CONTRATADA</th>
            <th className="w-10">CANT. EJECUTADA</th>
            <th className="w-10">CANT. DISPONIBLE</th>
            <th className="w-10">VALOR/UN</th>
            <th className="w-5">GUARDAR</th>
            <th className="w-10">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {contractInputsArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    class="far fa-trash-alt icon-view-detail"
                    onClick={() => onRemoveInput(index)}
                  />
                </td>
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  <span
                    className="link"
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => onImputation && onImputation(index)}
                  >
                    {`${x.idStage}-${x.idChapter}-${x.idSubchapter}-${x.idInputBudget}`}
                  </span>
                </td>

                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.cod}
                </td>
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.name}
                </td>

                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.unit}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  <input
                    type="text"
                    className={`${"input input-table right"} ${x.quantityChanged ? "pending-changes" : ""
                      }`}
                    value={x.quantity ? x.quantity.toString() : "0"}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onChange={(event) => onChangeQuantity(event, index, 'quantity')}
                  />
                </td>
                 <td className={index % 2 === 0 ? "dark right" : "right"}>
                  <input
                    type="text"
                    className={`${"input input-table right"} ${x.quantityChanged ? "pending-changes" : ""
                      }`}
                    value={x.quantityDone ? x.quantityDone.toString() : "0"}
                  
                  />
                </td>
                 <td className={index % 2 === 0 ? "dark right" : "right"}>
                  <input
                    type="text"
                    className={`${"input input-table right"} ${x.quantityChanged ? "pending-changes" : ""
                      }`}
                    value={x.quantityAvailable ? x.quantityAvailable.toString() : "0"}
                  
                  />
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  <input
                    type="text"
                    className={`${"input right"} ${x.unitValueChanged ? "pending-changes" : ""
                      }`}
                    value={
                      x.unitValue
                        ? common.getMoneyFomat(
                          x.unitValue.toString(),
                          x.editing,
                        )
                        : "0"
                    }
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onFocus={() => onFocusInput(index)}
                    onBlur={() => onBlurInput(index)}
                    onChange={(event) =>
                      onChangeQuantity(event, index, "unitValue")
                    }
                  />
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    className="far fa-save icon-view-detail"
                    onClick={() => {
                      onSaveInformation(index);
                    }}
                  />
                  &nbsp;
                  <i
                    className="fas fa-times-circle icon-view-detail"
                    onClick={() => {
                      onRefresh();
                    }}
                  />
                  &nbsp;
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {common.getMoneyFomat(x.totalInput ? x.totalInput : 0)}
                </td>
              </tr>
            );
          })}
          {contractInputsArray && contractInputsArray.length > 0 && (
            <tr>
              <td colspan={10}></td>
              <td className="right">
                {common.getMoneyFomat(
                  common.getTotals(contractInputsArray, "totalInput"),
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default ContractInputsTable;
