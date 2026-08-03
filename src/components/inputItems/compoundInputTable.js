const handlers = require("../utils/handlers");
const common = require("../utils/common");

const CompoundInputTable = ({
  compoundInputsArray,
  budgetType,
  onChangeQuantity,
  onCompoundRemoveInput,
  onSaveInformation,
  onRefresh,
  onFocusInput,
  onBlurInput,
  onEditInput,
  canEdit
}) => {
  return (
    <div>
      <table className="table w-80">
        <thead>
          <tr>
            <th className="w-5">ELIMINAR</th>

            <th className="w-5">CODIGO</th>
            <th className="w-40 ">INSUMO</th>
            <th className="w-5">UNIDAD</th>
            <th className="w-7">CANTIDAD</th>
            <th className="w-5">%DESP</th>
            <th className="w-10">VALOR/UN</th>
            <th className="w-5">GUARDAR</th>
            <th className="w-13">TOTAL</th>
             <th className="w-5">EDITAR</th>
          </tr>
        </thead>
        <tbody>
          {compoundInputsArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {canEdit && (
                    <i class="fas fa-trash icon-view-detail" onClick={() => onCompoundRemoveInput(index)} />
                  )}
                </td>
              

                <td className={index % 2 === 0 ? "dark center" : "center"}>{x.cod}</td>

                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.name}
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>{x.unit}</td>
                <td className={index % 2 === 0 ? "dark w-5 right" : "w-5 right"}>
                  <input
                    type="text"
                    className={`${"input right"} ${
                      x.quantityChanged ? "pending-changes" : ""
                    }`}
                    value={x.quantity ? x.quantity.toString() : "0"}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onChange={(event) =>
                      onChangeQuantity(event, index, "quantity")
                    }
                    disabled={!canEdit || x.compound || (x.budgetStatus==="C" && budgetType==="I")}
                  />
                </td>
                <td className={index % 2 === 0 ? "dark w-5 right" : "w-5 right"}>
                  <input
                    type="text"
                    className={`${"input right"} ${
                      x.wasteChanged ? "pending-changes" : ""
                    }`}
                    value={x.waste ? x.waste.toString() : "0"}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onChange={(event) =>
                      onChangeQuantity(event, index, "waste")
                    }
                    disabled={!canEdit || x.compound || (x.budgetStatus==="C" && budgetType==="I")}
                  />
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  <input
                    type="text"
                    className={`${"input right"} ${
                      x.unitValueChanged ? "pending-changes" : ""
                    }`}
                    value={
                      x.unitValue
                        ? common.getMoneyFomat(
                            x.unitValue.toString(),
                            x.editing
                          )
                        : "0"
                    }
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onFocus={() => onFocusInput(index)}
                    onBlur={() => onBlurInput(index)}
                    onChange={(event) =>
                      onChangeQuantity(event, index, "unitValue")
                    }
                    disabled={!canEdit || x.compound || (x.budgetStatus==="C" && budgetType==="I")}
                  />
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {canEdit && (
                    <>
                      <i
                        className="fas fa-check-circle icon-view-detail"
                        onClick={() => {
                          if(!(x.budgetStatus==="C" && budgetType==="I"))
                            onSaveInformation(index);
                        }}
                      />
                      &nbsp;
                      <i
                        className="fas fa-times-circle icon-view-detail"
                        onClick={() => { onRefresh(); }}
                      />
                      &nbsp;
                    </>
                  )}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {`${common.getMoneyFomat(x.totalInput)}`}
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {canEdit && (
                    <i
                      className="fas fa-pen icon-view-detail"
                      onClick={() => onEditInput(index)}
                    />
                  )}
                </td>
              </tr>
            );
          })}
          {compoundInputsArray && compoundInputsArray.length > 0 && (
            <tr>
              <td colSpan={8}></td>
              <td className="right">
                {common.getMoneyFomat(
                  common.getTotals(compoundInputsArray, "totalInput").toFixed(2)
                )}
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompoundInputTable;
