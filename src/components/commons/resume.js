const commom = require("../utils/common");

const Resume = ({
  constructionSelected,
  stageSelected,
  itemSelected,
  inputSelected,
}) => {

  return (
    <div className="resume">
      <table className="resume-table">
        <tbody>
          <tr>
            <td><b>OBRA:</b> {constructionSelected.name}</td>
            <td className="sep">|</td>
            <td><b>ETAPA:</b> {stageSelected.name}</td>
          </tr>
          {itemSelected && JSON.stringify(itemSelected) !== "{}" && (
            <tr>
              <td><b>ITEM:</b> {itemSelected.cod} - {itemSelected.name}</td>
              <td className="sep">|</td>
              <td><b>UNIDAD:</b> {itemSelected.unit} &nbsp; <b>CANTIDAD:</b> {itemSelected.quantity} &nbsp; <b>VALOR/UN:</b> {commom.getMoneyFomat(itemSelected.totalItem)}</td>
            </tr>
          )}
          {inputSelected && JSON.stringify(inputSelected) !== "{}" && (
            <tr>
              <td><b>INPUT:</b> {inputSelected.cod} - {inputSelected.name}</td>
              <td className="sep">|</td>
              <td><b>UNIDAD:</b> {inputSelected.unit} &nbsp; <b>CANTIDAD:</b> {inputSelected.quantity} &nbsp; <b>VALOR/UN:</b> {commom.getMoneyFomat(inputSelected.unitValue)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default Resume;
