const ConstructionTable = ({ constructionsArray, onViewStage,onEditStage }) => {
  return (
    <div>
      <table className="table construction-table">
        <thead>
          <tr>
            <th>CODIGO</th>
            <th>NOMBRE</th>
            <th>VER</th>
            <th>EDITAR</th>
          </tr>
        </thead>
        <tbody>
          {constructionsArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark" : ""}>
                  {x.idConstruction}
                </td>
                <td className={index % 2 === 0 ? "dark" : ""}>{x.name}</td>

                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    className="fas fa-external-link-alt icon-view-detail"
                    onClick={() => onViewStage(x.idConstruction)}
                  />
                </td>
                 <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    className="fas fa-pencil-alt icon-view-detail"
                    onClick={() => onEditStage(x.idConstruction)}
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

export default ConstructionTable;
