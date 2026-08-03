const ResumeContract = ({
  constructionSelected,
  stageSelected,
  contract,
}) => {
  if (!contract) return null;

  return (
    <div className="resume">
      <table className="resume-table">
        <tbody>
          <tr>
            <td><b>OBRA:</b> {constructionSelected?.name || ""}</td>
            <td className="sep">|</td>
            <td><b>ETAPA:</b> {stageSelected?.name || ""}</td>
            <td className="sep">|</td>
            <td><b>ESTADO:</b> Abierto</td>
          </tr>
          <tr>
            <td><b>PROVEEDOR:</b> {contract.name || ""}</td>
            <td className="sep">|</td>
            <td><b>NIT:</b> {contract.identification || ""}</td>
            <td className="sep">|</td>
            <td><b>TEL:</b> {contract.phone || ""}</td>
          </tr>
          <tr>
            <td><b>F.INICIO:</b> {contract.initialDate || ""}</td>
            <td className="sep">|</td>
            <td><b>F.TERMINACION:</b> {contract.finalDate || ""}</td>
            <td className="sep">|</td>
            <td><b>% ADM:</b> {contract.administration || 0} &nbsp; <b>% IMP:</b> {contract.events || 0} &nbsp; <b>% UTIL:</b> {contract.utility || 0}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResumeContract;
