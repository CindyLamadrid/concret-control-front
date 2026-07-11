const handlers = require("../utils/handlers");
const common = require("../utils/common");

const InputItemTable = ({
  itemInputsArray,
  budgetType,
  onChangeQuantity,
  onSaveInformation,
  onRefresh,
  onRemoveInputItem,
  setShowOption,
  setCompoundSelected,
  onFocusInput,
  onBlurInput,
  onEditInput,
  canEdit
}) => {
  return (
    <div>
      <table className="table w-95">
        <thead>
          <tr>
            <th className="w-5">ELIMINAR</th>
            <th className="w-5">A.P.U</th>
            <th className="w-5">DESTINO</th>
            <th className="w-5">CODIGO</th>
            <th className="w-30 ">INSUMO</th>
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
          {itemInputsArray.map((x, index) => {
            return (
              <tr key={index.toString()} >
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {canEdit && (
                    <i class="far fa-trash-alt icon-view-detail" onClick={() => onRemoveInputItem(index)} />
                  )}
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    className="fas fa-external-link-alt icon-view-detail"
                    onClick={() => {
                      setShowOption("compoundInputs");
                      setCompoundSelected(x);
                    }}
                    hidden={!x.compound}
                  />
                </td>
                <td className={index % 2 === 0 ? "dark" : ""}>
                  {`${x.idChapter.toString()}${x.codSubchapter.toString()}`}
                </td>

                <td className={index % 2 === 0 ? "dark" : ""}>{x.cod}</td>

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
                    disabled ={x.budgetStatus==="C" && budgetType==="I"}
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
                    // disabled={x.compound || (x.budgetStatus==="C" && budgetType==="I")}
                  />
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  <input
                    type="text"
                    className={`${"input right"} ${
                      x.unitValueChanged ? "pending-changes" : ""
                    }`}
                    value={x.unitValue ? common.getMoneyFomat(x.unitValue.toString(),x.editing) : "0"}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    disabled={x.compound || (x.budgetStatus==="C" && budgetType==="I")}
                    onFocus={()=>onFocusInput(index)}
                    onBlur={()=>onBlurInput(index)}
                    onChange={(event) =>
                      onChangeQuantity(event, index, "unitValue")
                    }
                  
                  />
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    className="far fa-save icon-view-detail"
                    onClick={() => {
                        if(!(x.budgetStatus==="C" && budgetType==="I"))
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
                  {`${common.getMoneyFomat(x.totalInput)}`}
                </td>
                 <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    className="fas fa-pencil-alt icon-view-detail"
                      onClick={() => onEditInput(index)}
                  />
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
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InputItemTable;
