const handlers = require('../utils/handlers')
const common = require('../utils/common')

const InputItemTable = ({ inputItemsArray,onChangeQuantity,onSaveInformation }) => {

    return (
        <div>
            <table className="table w-70">
                <thead>
                    <tr>
                        <th className='w-5'>

                        </th>
                         <th className='w-5'>
                            DESTINO
                        </th>
                        <th  className='w-5'>CODIGO</th>
                        <th className='w-40'>
                            INSUMO
                        </th>
                        <th className='w-5'>
                            UNIDAD
                        </th>
                        <th className='w-10'>
                            CANTIDAD
                        </th>
                        <th className='w-5'>
                            %DESPERDICIO
                        </th>
                        <th className='w-10'>
                            VALOR/UN
                        </th>
                        <th className='w-10'>
                            TOTAL
                        </th>
                       
                        {/* <th className='w-10'>
                            CATEGORIA
                        </th> */}
                    </tr>
                </thead>
                <tbody>

                    {
                        inputItemsArray.map(
                            (x, index) => {
                                return (
                                    <tr key={index.toString()} onBlur={()=>{onSaveInformation(index)}}>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                             <i class="far fa-trash-alt icon-table-small"/>
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {`${x.idChapter.toString()}${x.idSubchapter.toString()}` }
                                        </td>

                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.cod}
                                        </td>
                                        
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.name}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.unit}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                          
                                            <input
                                                type="text"
                                                className="input input-table right"
                                                maxLength={4}
                                                value={x.quantity? x.quantity.toString(): "0"}
                                                onKeyDown={(event)=>handlers.onHandlerNumber(event)}
                                                onChange={(event) => onChangeQuantity(event,index,"quantity")}
                                            />
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            
                                            <input
                                                type="text"
                                                className="input input-table right"
                                                maxLength={4}
                                                value={x.waste? x.waste.toString(): "0"}
                                                onKeyDown={(event)=>handlers.onHandlerNumber(event)}
                                                onChange={(event) => onChangeQuantity(event,index,"waste")}
                                            />
                                        </td>
                                         <td className={index % 2 === 0 ? "gray" : ""}>
                                          
                                            <input
                                                type="text"
                                                className="input input-table right"
                                                value={x.unitValue? x.unitValue.toString(): "0"}
                                                onKeyDown={(event)=>handlers.onHandlerNumber(event)}
                                                onChange={(event) => onChangeQuantity(event,index,"unitValue")}
                                            />
                                        </td>
                                         <td className={index % 2 === 0 ? "gray right" : "right"}>
                                            {`$${x.totalInput}`}
                                        </td>
                                    
                                        {/* <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.inputType}
                                        </td> */}


                                    </tr>
                                )
                            }
                        )
                    }
                            {inputItemsArray && inputItemsArray.length>0 && (
                                <tr>
                                <td colSpan={8}></td>
                                <td className='right'>{common.getMoneyFomat(common.getTotals(inputItemsArray,"totalInput").toFixed(2))}</td>
                               
                               
                                </tr>
                            )

                            }

                </tbody>
            </table>
        </div>
    )
}

export default InputItemTable;