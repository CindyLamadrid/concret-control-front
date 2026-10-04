const common = require("../utils/common");

const InputControlTable = ({
  inputsArray,
  onShowDetails
}) => {
  return (
    <div>
      <table className="table w-90">
        <thead>
          <tr>
            <th className="w-5">CODIGO</th>
            <th className="w-20">INSUMO</th>
            <th className="w-5">UN</th>
            <th className="w-10">INCIAL</th>
            <th className="w-10">MODIFICADO</th>
            <th className="w-10">INVERTIDO</th>
            <th className="w-10">X INVERTIR</th>
            <th className="w-10">TOTAL</th>
            <th className="w-10">DESVIACION</th>
          </tr>
        </thead>
        <tbody>
          {inputsArray.map((x, index) => {
            const modificado = parseFloat(x.totalUpdated) || 0;
            const invertido = parseFloat(x.invested) || 0;
            const porInvertir = modificado - invertido;
            const total = invertido + porInvertir;
            const desviacion = modificado - total;

            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.cod}
                </td>
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  <span className="link" onClick={() => onShowDetails(x.idInput)}>{x.inputName}</span>
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.unitName}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {common.getMoneyFomat(x.totalInitial)}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {common.getMoneyFomat(x.totalUpdated)}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {common.getMoneyFomat(invertido)}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {common.getMoneyFomat(porInvertir)}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {common.getMoneyFomat(total)}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"} style={{ color: desviacion < 0 ? '#dc3545' : '#333' }}>
                  {common.getMoneyFomat(desviacion)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InputControlTable;
