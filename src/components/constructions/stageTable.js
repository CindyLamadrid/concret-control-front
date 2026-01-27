const StagesTable = ({
  onChangeTypeBudget,
  constructionStagesArray,
  onViewStageItems,
  onEditStage,
  onCloseBudget,
}) => {
  return (
    <div>
      <table className="table w-70">
        <thead>
          <tr>
            <th className="w-10">CODIGO</th>
            <th className="w-50">NOMBRE</th>
            <th className="w-30">VER</th>
            <th className="w-5">EDITAR</th>
            <th className="w-5">CERRAR</th>
          </tr>
        </thead>
        <tbody>
          {constructionStagesArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark" : ""}>{x.idStage}</td>
                <td className={index % 2 === 0 ? "dark" : ""}>{x.name}</td>

                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <select
                    className="select-table bold"
                    value={x.budgetType}
                    onChange={(event) =>
                      onChangeTypeBudget(index, event.target.value)
                    }
                  >
                    <option key="1" value="I" className="bold">
                      Presupuesto Inicial
                    </option>
                    <option key="2" value="U" className="bold">
                       Presupuesto Modificado
                    </option>
                    <option key="3" value="CC" className="bold">
                     Control Costos
                    </option>
                  </select>
                  &nbsp;&nbsp;
                  <i
                    className="fas fa-external-link-alt icon-view-detail"
                    onClick={() => onViewStageItems(x.idStage, x.budgetType)}
                  />
                </td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    className="fas fa-pencil-alt icon-view-detail"
                    onClick={() => onEditStage(index)}
                  />
                </td>
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StagesTable;
