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
                                          <td className={index%2===0 ? "dark":""}>
                                          <input
                                            type="checkbox"
                                            className="checkbox"
                                            checked={x.selected}
                                            onChange={()=>onSelectItem(index)}
                                          />
                                        </td>
                                        <td className={index%2===0 ? "dark":""}>
                                           <i className="fas fa-external-link-alt icon-view-detail"/>
                                        </td>
                                        <td className={index%2===0 ? "dark":""}>
                                           {x.cod}
                                        </td>
                                         <td className={index%2===0 ? "dark left":"left"}>
                                            {x.name}
                                        </td>
                                         <td className={index%2===0 ? "dark":""}>
                                            {x.unitName}
                                        </td>
                                         <td className={index%2===0 ? "dark":""}>
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