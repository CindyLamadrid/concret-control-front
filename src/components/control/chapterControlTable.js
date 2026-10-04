const common = require("../utils/common");

const ChapterControlTable = ({
  chaptersArray,
  onShowInputs
}) => {
  const totalInital = chaptersArray.reduce((sum, x) => sum + (parseFloat(x.inital) || 0), 0);
  const totalUpdated = chaptersArray.reduce((sum, x) => sum + (parseFloat(x.updated) || 0), 0);
  const totalInvested = chaptersArray.reduce((sum, x) => sum + (parseFloat(x.invested) || 0), 0);
  const totalPorInvertir = totalUpdated - totalInvested;
  const totalDesviacion = totalInital - totalUpdated;

  return (
    <div>
      <table className="table w-90">
        <thead>
          <tr>
            <th className="w-5">COD</th>
            <th className="w-25">CAPÍTULO</th>
            <th className="w-12">INICIAL</th>
            <th className="w-12">MODIFICADO</th>
            <th className="w-12">INVERTIDO</th>
            <th className="w-12">POR INVERTIR</th>
            <th className="w-12">DESVIACIÓN</th>
          </tr>
        </thead>
        <tbody>
          {chaptersArray.map((x, index) => {
            const inicial = parseFloat(x.inital) || 0;
            const modificado = parseFloat(x.updated) || 0;
            const invertido = parseFloat(x.invested) || 0;
            const porInvertir = modificado - invertido;
            const desviacion = inicial - modificado;

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
                  {common.getMoneyFomat(invertido)}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {common.getMoneyFomat(porInvertir)}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "right"} style={{ color: desviacion < 0 ? '#dc3545' : '#28a745', fontWeight: 500 }}>
                  {common.getMoneyFomat(desviacion)}
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
            <td className="right"><b>{common.getMoneyFomat(totalInvested)}</b></td>
            <td className="right"><b>{common.getMoneyFomat(totalPorInvertir)}</b></td>
            <td className="right" style={{ color: totalDesviacion < 0 ? '#dc3545' : '#28a745' }}><b>{common.getMoneyFomat(totalDesviacion)}</b></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ChapterControlTable;
