const handlers = require("../utils/handlers");
const common = require("../utils/common");

const InputItemTable = ({
  itemInputsArray,
  onChangeQuantity,
  onSaveInformation,
  onRefresh,
  onRemoveInputItem,
  setShowOption,
  setCompoundSelected,
}) => {
  return (
    <div>
      <table className="table w-80">
        <thead>
          <tr>
            <th className="w-5"></th>
            <th className="w-5">A.P.U</th>
            <th className="w-5">DESTINO</th>
            <th className="w-5">CODIGO</th>
            <th className="w-40 ">INSUMO</th>
            <th className="w-5">UNIDAD</th>
            <th className="w-7">CANTIDAD</th>
            <th className="w-5">%DESP</th>
            <th className="w-10">VALOR/UN</th>
            <th className="w-5">GUARDAR</th>
            <th className="w-13">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {itemInputsArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "gray" : ""}>
                  <i
                    class="far fa-trash-alt icon-table-small"
                    onClick={() => onRemoveInputItem(index)}
                  />
                </td>
                <td className={index % 2 === 0 ? "gray" : ""}>
                  <i
                    className="fas fa-folder-open icon-table"
                    onClick={() => {
                      setShowOption("compoundInputs");
                      console.log("compoundSelected",x);
                      setCompoundSelected(x);
                      //  setItemSelected(x);
                    }}
                    hidden={!x.compound}
                  />
                </td>
                <td className={index % 2 === 0 ? "gray" : ""}>
                  {`${x.idChapter.toString()}${x.idSubchapter.toString()}`}
                </td>

                <td className={index % 2 === 0 ? "gray" : ""}>{x.cod}</td>

                <td className={index % 2 === 0 ? "gray left" : "left"}>
                  {x.name}
                </td>
                <td className={index % 2 === 0 ? "gray" : ""}>{x.unit}</td>
                <td className={index % 2 === 0 ? "gray w-5" : "w-5"}>
                  <input
                    type="text"
                    className={`${"input input-table right"} ${
                      x.quantityChanged ? "pending-changes" : ""
                    }`}
                    maxLength={4}
                    value={x.quantity ? x.quantity.toString() : "0"}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onChange={(event) =>
                      onChangeQuantity(event, index, "quantity")
                    }
                  />
                </td>
                <td className={index % 2 === 0 ? "gray w-5" : "w-5"}>
                  <input
                    type="text"
                    className={`${"input input-table right"} ${
                      x.wasteChanged ? "pending-changes" : ""
                    }`}
                    maxLength={4}
                    value={x.waste ? x.waste.toString() : "0"}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onChange={(event) =>
                      onChangeQuantity(event, index, "waste")
                    }
                  />
                </td>
                <td className={index % 2 === 0 ? "gray" : ""}>
                  <input
                    type="text"
                    className={`${"input input-table right"} ${
                      x.unitValueChanged ? "pending-changes" : ""
                    }`}
                    value={x.unitValue ? x.unitValue.toString() : "0"}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    disabled={x.compound}
                    onChange={(event) =>
                      onChangeQuantity(event, index, "unitValue")
                    }
                  />
                </td>
                <td className={index % 2 === 0 ? "gray right" : "right"}>
                  <i
                    className="far fa-save icon-table"
                    onClick={() => {
                      onSaveInformation(index);
                    }}
                  />
                  &nbsp;
                  <i
                    className="fas fa-times-circle icon-table"
                    onClick={() => {
                      onRefresh();
                    }}
                  />
                  &nbsp;
                </td>
                <td className={index % 2 === 0 ? "gray right" : "right"}>
                  {`${common.getMoneyFomat(x.totalInput)}`}
                </td>
              </tr>
            );
          })}
          {itemInputsArray && itemInputsArray.length > 0 && (
            <tr>
              <td colSpan={10}></td>
              <td className="right">
                {common.getMoneyFomat(
                  common.getTotals(itemInputsArray, "totalInput")
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InputItemTable;
