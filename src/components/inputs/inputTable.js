const common = require("../utils/common");

const InputTable = ({
  inputsArray,
  showCompoundInputs,
  onSelectInput,
  onEditInput,
  onShowCompoundInputs,
  inputType = "",
  canEdit,
}) => {
  return (
    <div>
      <table className="table w-50">
        <thead>
          <tr>
            {/* <th className="w-5">ELIMINAR</th> */}
            <th className="w-5" hidden={showCompoundInputs}>
              SELECCIONAR
            </th>
            <th
              className="w-5"
              hidden={showCompoundInputs || inputType === "control"}
            >
              A.P.U
            </th>

            <th className="w-10">CODIGO</th>
            <th className="w-40">DESCRIPCION</th>
            <th className="w-10">
              UNIDAD
            </th>
            <th className="w-20" hidden={inputType === "control"}>VALOR</th>
            {canEdit && <th className="w-5">EDITAR</th>}
          </tr>
        </thead>
        <tbody>
          {inputsArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td
                  className={index % 2 === 0 ? "dark center" : "center"}
                  hidden={showCompoundInputs}
                >
                  <input
                    type="radio"
                    name="inputRadio"
                    checked={x.selected}
                    onChange={() => onSelectInput(index)}
                  />
                </td>
                <td
                  className={index % 2 === 0 ? "dark center" : "center"}
                  hidden={showCompoundInputs || inputType === "control"}
                >
                  <i
                    class="fas fa-external-link-alt icon-view-detail"
                    onClick={() => {
                      onShowCompoundInputs(x.idInput);
                    }}
                    hidden={!x.compound}
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
                <td
                  className={index % 2 === 0 ? "dark right" : "right"}
                  hidden={inputType === "control"}
                >
                  {common.getMoneyFomat(x.unitValue)}
                </td>
                {canEdit && (
                  <td className={index % 2 === 0 ? "dark center" : "center"}>
                    <i className="fas fa-pen icon-view-detail" onClick={() => onEditInput(index)} />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InputTable;
