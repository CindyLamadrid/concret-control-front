import { useEffect } from "react";
const handlers = require("../utils/handlers");
const commom = require("../utils/common");

const ConstructionItemsTable = ({
  constructionItemsArray,
  onChangeQuantity,
  setShowOption,
  setItemSelected,
  onSaveInformation,
  onRefresh,
  onRemoveItem,
  onEditItem,
}) => {
  const getTotalsSubChapter = () => {
    let total = 0;
    for (let i = 0; i < constructionItemsArray.length; i++) {
      total +=
        constructionItemsArray[i].totalItem *
        constructionItemsArray[i].quantity;
    }
    return total;
  };

  useEffect(() => {
    console.log("apuArray===", constructionItemsArray);
  }, [constructionItemsArray]);
  return (
    <div>
      <table className="table construction-items-table">
        <thead>
          <tr>
            <th className="w-5">ELIMINAR</th>

            <th className="w-5">A.P.U</th>
            <th className="w-10">CODIGO</th>

            <th className="w-35 ">ITEM</th>
            <th className="w-5">UNIDAD</th>
            <th className="w-10">CANTIDAD</th>
            <th className="w-5">GUARDAR</th>
            <th className="w-10">VALOR/UN</th>
            <th className="w-10">TOTAL</th>
            <th className="w-5"></th>
          </tr>
        </thead>
        <tbody>
          {constructionItemsArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    class="far fa-trash-alt icon-view-detail"
                    onClick={() => onRemoveItem(index)}
                  />
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    className="fas fa-external-link-alt icon-view-detail"
                    onClick={() => {
                      setShowOption("inputItems");
                      setItemSelected(x);
                    }}
                  />
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
                    className={`${"input input-table right"} ${
                      x.quantityChanged ? "pending-changes" : ""
                    }`}
                    value={x.quantity ? x.quantity.toString() : "0"}
                    onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                    onChange={(event) => onChangeQuantity(event, index)}
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
                  {commom.getMoneyFomat(x.totalItem ? x.totalItem : 0)}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {commom.getMoneyFomat(
                    x.totalItem && x.quantity ? x.totalItem * x.quantity : 0
                  )}
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    className="fas fa-pencil-alt icon-view-detail"
                    onClick={() => onEditItem(index)}
                  />
                </td>
              </tr>
            );
          })}
          {constructionItemsArray && constructionItemsArray.length > 0 && (
            <tr>
              <td colspan={8}></td>
              <td className="right">
                {commom.getMoneyFomat(getTotalsSubChapter())}
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ConstructionItemsTable;
