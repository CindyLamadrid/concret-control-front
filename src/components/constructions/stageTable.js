const StagesTable=({constructionStagesArray,onViewStageItems})=>{
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
                                            <input
                                            type="button"
                                            value="Ver"
                                            onClick={()=>onViewStageItems(x.idStage)}
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