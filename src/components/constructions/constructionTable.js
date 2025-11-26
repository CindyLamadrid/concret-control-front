const ConstructionTable = ({ constructionsArray, onViewStage }) => {
  return (
    <div>
      <table className="table construction-table">
        <thead>
          <tr>
            <th>CODIGO</th>
            <th>NOMBRE</th>
            <th>VER</th>
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ConstructionTable;
