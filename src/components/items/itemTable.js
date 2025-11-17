const ItemTable = ({ itemArray,onSelectItem }) => {

    return (
        <div>
            <table className="table w-60" >
                <thead>
                    <tr>
                        <th className="w-5">
                           
                        </th>
                        <th className="w-5">A.P.U</th>
                        <th className="w-10">
                            CODIGO
                        </th>
                        <th className="w-60">
                            NOMBRE
                        </th>
                        <th className="w-10">
                            UNIDAD
                        </th>
                         <th className="w-15">
                            SUBCAPITULO
                        </th>
                    </tr>
                </thead>
                <tbody>

                    {
                        itemArray.map(
                            (x, index) => {
                                return (
                                    <tr key={index.toString()}>
                                          <td className={index%2===0 ? "gray":""}>
                                          <input
                                            type="checkbox"
                                            checked={x.selected}
                                            onChange={()=>onSelectItem(index)}
                                          />
                                        </td>
                                        <td className={index%2===0 ? "gray":""}>
                                           <i className="fas fa-folder-open icon-table"/>
                                        </td>
                                        <td className={index%2===0 ? "gray":""}>
                                           {x.cod}
                                        </td>
                                         <td className={index%2===0 ? "gray left":"left"}>
                                            {x.name}
                                        </td>
                                         <td className={index%2===0 ? "gray":""}>
                                            {x.unitName}
                                        </td>
                                         <td className={index%2===0 ? "gray":""}>
                                            {x.subChapterName}
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }


                </tbody>
            </table>

        </div>
    )
}

export default ItemTable