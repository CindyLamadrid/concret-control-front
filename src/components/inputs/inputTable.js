

const InputTable = ({ inputsArray, onSelectInput }) => {

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <td>

                        </td>
                        <td>Código</td>
                        <td>
                            Categoria Insumo
                        </td>
                        <td>
                            Descripción
                        </td>
                        <td>
                            Unidad
                        </td>
                        <td>
                            Valor
                        </td>
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
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.categoryName}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
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