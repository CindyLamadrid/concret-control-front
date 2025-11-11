const ItemTable = ({ itemArray,onSelectItem }) => {

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <td>
                           
                        </td>
                        <td>A.P.U</td>
                        <td>
                            Cod
                        </td>
                        <td>
                            Nombre
                        </td>
                        <td>
                            Unidad
                        </td>
                         <td>
                            Subcapitulo
                        </td>
                    </tr>
                </thead>
                <tbody>

                    {
                        itemArray.map(
                            (x, index) => {
                                return (
                                    <tr key={index.toString()} >
                                          <td className={index%2===0 ? "gray":""}>
                                          <input
                                            type="checkbox"
                                            checked={x.selected}
                                            onChange={()=>onSelectItem(index)}
                                          />
                                        </td>
                                        <td className={index%2===0 ? "gray":""}>
                                           <i class="fas fa-folder-plus folder"/>
                                        </td>
                                        <td className={index%2===0 ? "gray":""}>
                                           {x.idItem}
                                        </td>
                                         <td className={index%2===0 ? "gray":""}>
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