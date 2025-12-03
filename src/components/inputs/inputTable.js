const common = require("../utils/common");

const InputTable = ({
  inputsArray,
  showCompoundInputs,
  onSelectInput,
  onEditInput,
  onShowCompoundInputs,
}) => {
  return (
    <div>
      <table className="table w-60">
        <thead>
          <tr>
            {/* <th className="w-5">ELIMINAR</th> */}
            <th className="w-5">SELECCIONAR</th>
            <th className="w-5" hidden={showCompoundInputs}>A.P.U</th>
            <th className="w-10">CODIGO</th>
            <th className="w-40">DESCRIPCION</th>
            <th className="w-10">UNIDAD</th>
            <th className="w-20">VALOR</th>
            <th className="w-5">EDITAR</th>
          </tr>
        </thead>
        <tbody>
          {inputsArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <input
                    type="checkbox"
                    checked={x.selected}
                    onChange={() => onSelectInput(index)}
                  />
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"} hidden={showCompoundInputs}>
                  <i
                    class="fas fa-external-link-alt icon-view-detail"
                    onClick={()=>{
                      onShowCompoundInputs(x.idInput)
                    }}
                    hidden={!x.compound}
                  />
                </td>

                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.idInput}
                </td>
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.name}
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.unit}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {common.getMoneyFomat(x.unitValue)}
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
        </tbody>
      </table>
    </div>
  );
};

export default InputTable;
