const common = require("../utils/common");

const ChapterControlTable = ({
  chaptersArray,
  onShowInputs
}) => {
  return (
    <div>
      <table className="table w-90">
        <thead>
          <tr>
            <th className="w-10">CODIGO</th>
            <th className="w-40">CAPITULO</th>
            <th className="w-10">INICAL</th>
            <th className="w-10">INVERTIDO</th>
            <th className="w-10">POR INVERTIR</th>
            <th className="w-10">TOTAL</th>
            <th className="w-10">DESVIACION</th>
          </tr>
        </thead>
        <tbody>
          {chaptersArray.map((x, index) => {
            return (
              <tr key={index.toString()}>

                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.cod}
                </td>
                <td className={index % 2 === 0 ? "dark left" : "left"} >
                 <span className="link" onClick={()=>onShowInputs(x.idChapter)}>{x.description}</span>
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {common.getMoneyFomat(x.inital)}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {common.getMoneyFomat(x.updated)}
                </td>
                  <td className={index % 2 === 0 ? "dark right" : "right"}>
                
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                
                </td>
               
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ChapterControlTable;
