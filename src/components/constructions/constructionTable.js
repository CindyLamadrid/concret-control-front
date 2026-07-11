const ConstructionTable = ({ constructionsArray, onViewStage, onEditContruction, canEdit }) => {
  return (
    <div>
      <table className="table w-70">
        <thead>
          <tr>
            <th className="w-10">CODIGO</th>
            <th className="w-60">NOMBRE</th>
            <th className="w-10">Area</th>
            <th className="w-10">VER</th>
            {canEdit && <th className="w-5">EDITAR</th>}
          </tr>
        </thead>
        <tbody>
          {constructionsArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.cod}
                </td>
                <td className={index % 2 === 0 ? "dark" : ""}>{x.name}</td>
                <td className={index % 2 === 0 ? "dark right" : "right"}>{x.area}</td>

                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    className="fas fa-external-link-alt icon-view-detail"
                    onClick={() => onViewStage(x.idConstruction)}
                  />
                </td>
                {canEdit && (
                  <td className={index % 2 === 0 ? "dark center" : "center"}>
                    <i
                      className="fas fa-pencil-alt icon-view-detail"
                      onClick={() => onEditContruction(index)}
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

export default ConstructionTable;
