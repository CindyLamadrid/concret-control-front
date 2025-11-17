

const InputTable = ({ inputsArray, onSelectInput }) => {

    return (
        <div>
            <table className="table w-50">
                <thead>
                    <tr>
                      
                        <th className="w-5">

                        </th>
                        <th className="w-10">CODIGO</th>
                        <th className="w-50">
                            DESCRIPCION
                        </th>
                        <th className="w-15">
                            UNIDAD
                        </th>
                        <th className="w-20">
                            VALOR
                        </th>
                    </tr>
                </thead>
                <tbody>

                    {
                        inputsArray.map(
                            (x, index) => {
                                return (
                                    <tr key={index.toString()} >
                                     
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            <input
                                                type="checkbox"
                                                checked={x.selected}
                                                onChange={() => onSelectInput(index)}
                                            />
                                        </td>

                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.idInput}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray left" : "left"}>
                                            {x.name}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.unitName}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.value}
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

export default InputTable