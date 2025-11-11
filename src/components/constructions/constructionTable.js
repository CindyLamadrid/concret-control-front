const ConstructionTable=({constructionsArray,onViewStage})=>{
    return(
        <div>
              <table className="table">
                <thead>
                    <tr>
                      
                        <td>Código</td>
                        <td>
                            Name
                        </td>
                        <td>

                        </td>
                    </tr>
                </thead>
                <tbody>

                    {
                        constructionsArray.map(
                            (x, index) => {
                                return (
                                    <tr key={index.toString()} >
                                       

                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.idConstruction}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.name}
                                        </td>

                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            <input
                                            type="button"
                                            value="Ver"
                                            onClick={()=>onViewStage(x.idConstruction)}
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

export default ConstructionTable;