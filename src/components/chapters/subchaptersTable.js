const SubchaptersTable = ({ subchapterArray, onEditSubchapter, onRemoveSubchapter, canEdit }) => {
  return (
    <div>
      <table className="table w-70">
        <thead>
          <tr>
            <th className="w-10">CODIGO</th>
            <th className="w-50">NOMBRE</th>
            <th className="w-30">CAPITULO</th>
            {canEdit && <th className="w-5">EDITAR</th>}
            {canEdit && <th className="w-5">ELIMINAR</th>}
          </tr>
        </thead>
        <tbody>
          {subchapterArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                <td className={index % 2 === 0 ? "dark center" : "center"}>{x.cod}</td>
                <td className={index % 2 === 0 ? "dark" : ""}>{x.name}</td>
                <td className={index % 2 === 0 ? "dark" : ""}>{x.chapter}</td>
                {canEdit && (
                  <td className={index % 2 === 0 ? "dark center" : "center"}>
                    <i className="fas fa-pencil-alt icon-view-detail" onClick={() => onEditSubchapter(index)} />
                  </td>
                )}
                {canEdit && (
                  <td className={index % 2 === 0 ? "dark center" : "center"}>
                    <i class="far fa-trash-alt icon-view-detail" onClick={() => onRemoveSubchapter(index)} />
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

export default SubchaptersTable;
