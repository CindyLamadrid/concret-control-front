const common = require("../utils/common");

const ContractTable = ({
  contractsArray,
  onEditCotract,
  onViewContractInputs
}) => {
  return (
    <div>
      <table className="table w-100">
        <thead>
          <tr>
          
            <th className="w-20">PROVEEDOR</th>
            <th className="w-15">INICIO</th>
            <th className="w-15">TERMINACIÓN</th>
            <th className="w-5">A.I.U</th>
            <th className="w-5">% UTILIDAD</th>
            <th className="w-5">
              VER
            </th>
            <th className="w-5">
              EDITAR
            </th>
          </tr>
        </thead>
        <tbody>
          {contractsArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.name}
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.initialDate}
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.finalDate}
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                        <input
                      type="checkbox"
                      name="supplier"
                      disabled 
                      value= {x.aiuPercentage}
                     
                    />
                 
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {x.utility}
                </td>
                 <td className={index % 2 === 0 ? "dark center" : "center"}>
                     <i
                    className="fas fa-external-link-alt icon-view-detail"
                    onClick={() => onViewContractInputs(index)}
                  />
                </td>
                  <td className={index % 2 === 0 ? "dark center" : "center"}>
                    <i
                      className="fas fa-pencil-alt icon-view-detail"
                      onClick={() => onEditCotract(index)}
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

export default ContractTable;
