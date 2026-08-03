const StagesTable = ({
  onChangeTypeBudget,
  constructionStagesArray,
  onViewStageItems,
  onEditStage,
  onCloseBudget,
  canEdit,
}) => {
  return (
    <div>
      <table className="table w-70">
        <thead>
          <tr>
            <th className="w-10">CODIGO</th>
            <th className="w-50">NOMBRE</th>
            <th className="w-30">VER</th>
            {canEdit && <th className="w-5">EDITAR</th>}
            {canEdit && <th className="w-5">CERRAR</th>}
          </tr>
        </thead>
        <tbody>
          {constructionStagesArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark" : ""}>{x.idStage}</td>
                <td className={index % 2 === 0 ? "dark" : ""}>{x.name}</td>

                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <button
                    className="primary btn-sm-custom"
                    onClick={() => onViewStageItems(x.idStage, "I")}
                  >
                    <i className="fas fa-file-alt" /> P. Inicial
                  </button>
                  &nbsp;
                  {x.statusBudget !== "O" && (
                    <>
                      <button
                        className="secondary btn-sm-custom"
                        onClick={() => onViewStageItems(x.idStage, "U")}
                      >
                        <i className="fas fa-file-signature" /> P. Modificado
                      </button>
                      &nbsp;
                      <button
                        className="secondary btn-sm-custom"
                        onClick={() => onViewStageItems(x.idStage, "CC")}
                      >
                        <i className="fas fa-chart-line" /> Control Costos
                      </button>
                    </>
                  )}
                </td>
                {canEdit && (
                  <td className={index % 2 === 0 ? "dark center" : "center"}>
                    <i
                      className="fas fa-pen icon-view-detail"
                      onClick={() => onEditStage(index)}
                    />
                  </td>
                )}
                {canEdit && (
                  <td className={index % 2 === 0 ? "dark center" : "center"}>
                    <i
                      className={`fas ${
                        x.statusBudget === "O" ? "fa-unlock" : "fa-lock"
                      } icon-view-detail`}
                      onClick={() =>
                        onCloseBudget(x.statusBudget === "O" ? index : -1)
                      }
                    />
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

export default StagesTable;
