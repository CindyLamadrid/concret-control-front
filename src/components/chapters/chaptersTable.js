const ChaptersTable = ({ chapterArray,onEditChapter }) => {
  return (
    <div>
      <table className="table construction-table">
        <thead>
          <tr>
            <th>CODIGO</th>
            <th>NOMBRE</th>
            <th>EDITAR</th>
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
            
                 <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i
                    className="fas fa-pencil-alt icon-view-detail"
                    onClick={() => onEditChapter(index)}
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

export default ChaptersTable;
