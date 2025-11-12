const StagesTable = ({ constructionStagesArray, onViewStageItems }) => {
    return (
        <div>
            <table className="table  w-40">
                <thead>
                    <tr>

                        <th>CODIGO</th>
                        <th>
                            NOMBRE
                        </th>
                        <th>

                        </th>
                    </tr>
                </thead>
                <tbody>

                    {
                        constructionStagesArray.map(
                            (x, index) => {
                                return (
                                    <tr key={index.toString()} >


                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.idStage}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.name}
                                        </td>

                                        <td className={index % 2 === 0 ? "gray" : ""}>

                                            <i
                                                className="fas fa-folder-open icon-table"
                                                onClick={() => onViewStageItems(x.idStage)}
                                            />
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

export default StagesTable