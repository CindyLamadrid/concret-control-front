const ChaptersTable = ({ chapterArray, onEditChapter, canEdit }) => {
  return (
    <div>
      <table className="table w-70">
        <thead>
          <tr>
            <th>CODIGO</th>
            <th>NOMBRE</th>
            {canEdit && <th>EDITAR</th>}
          </tr>
        </thead>
        <tbody>
          {chapterArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  {x.cod}
                </td>
                <td className={index % 2 === 0 ? "dark" : ""}>{x.name}</td>
                {canEdit && (
                  <td className={index % 2 === 0 ? "dark center" : "center"}>
                    <i className="fas fa-pen icon-view-detail" onClick={() => onEditChapter(index)} />
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

export default ChaptersTable;
