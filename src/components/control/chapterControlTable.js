const common = require("../utils/common");

const ChapterControlTable = ({
  chaptersArray,
  onShowInputs
}) => {
  const totalInital = chaptersArray.reduce((sum, x) => sum + (x.inital || 0), 0);
  const totalUpdated = chaptersArray.reduce((sum, x) => sum + (x.updated || 0), 0);

  return (
    <div>
      <table className="table w-80">
        <thead>
          <tr>
            <th className="w-5">COD</th>
            <th className="w-30">CAPÍTULO</th>
            <th className="w-13">INICIAL</th>
            <th className="w-13">MODIFICADO</th>
            <th className="w-13">INVERTIDO</th>
            <th className="w-13">POR INVERTIR</th>
            <th className="w-13">DESVIACIÓN</th>
          </tr>
        </thead>
        <tbody>
          {chaptersArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.cod}
                </td>
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  <span className="link cursor-pointer" onClick={() => onShowInputs(x.idChapter)}>{x.description}</span>
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
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
        <tfoot>
          <tr>
            <td colSpan="2"><b>TOTAL</b></td>
            <td className="right"><b>{common.getMoneyFomat(totalInital)}</b></td>
            <td className="right"><b>{common.getMoneyFomat(totalUpdated)}</b></td>
            <td className="right"></td>
            <td className="right"></td>
            <td className="right"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ChapterControlTable;
