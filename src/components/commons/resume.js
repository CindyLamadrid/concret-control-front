const commom = require("../utils/common");

const Resume = ({
  constructionSelected,
  stageSelected,
  itemSelected,
  inputSelected,
}) => {
  return (
    <div className="resume">
      <div className="left">
        <span>
          <b>OBRA: </b>
        </span>
        <span className="text">{constructionSelected.name}</span>
        &nbsp;&nbsp;&nbsp;
        <span>
          <b>ETAPA: </b>
        </span>{" "}
        <span className="text">{stageSelected.name}</span>
      </div>

      {itemSelected && JSON.stringify(itemSelected) !== "{}" && (
        <>
          <div className="left">
            <span>
              <b>ITEM: </b>
            </span>
            <span className="text">{itemSelected.cod}</span>&nbsp;&nbsp;&nbsp;
            <span>
              <b>DESCRIPCION: </b>
            </span>{" "}
            <span className="text">{itemSelected.name}</span>
          </div>
          <div className="left">
            <span>
              <b>UNIDAD: </b>
            </span>
            <span className="text">{itemSelected.unit}</span>&nbsp;&nbsp;&nbsp;
            <span>
              <b>CANTIDAD: </b>
            </span>{" "}
            <span className="text">{itemSelected.quantity}</span>
            &nbsp;&nbsp;&nbsp;
            <span>
              <b>VALOR/UN: </b>
            </span>{" "}
            <span className="text">
              {commom.getMoneyFomat(itemSelected.totalItem)}
            </span>
          </div>
        </>
      )}
      {inputSelected && JSON.stringify(inputSelected) !== "{}" && (
        <>
          <div className="left">
            <span>
              <b>INPUT: </b>
            </span>
            <span className="text">{inputSelected.cod}</span>&nbsp;&nbsp;&nbsp;
            <span>
              <b>DESCRIPCION: </b>
            </span>{" "}
            <span className="text">{inputSelected.name}</span>
          </div>
          <div className="left">
            <span>
              <b>UNIDAD: </b>
            </span>
            <span className="text">{inputSelected.unit}</span>&nbsp;&nbsp;&nbsp;
            <span>
              <b>CANTIDAD: </b>
            </span>{" "}
            <span className="text">{inputSelected.quantity}</span>
            &nbsp;&nbsp;&nbsp;
            <span>
              <b>VALOR/UN: </b>
            </span>{" "}
            <span className="text">
              {commom.getMoneyFomat(inputSelected.unitValue)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
export default Resume;
