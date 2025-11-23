import { useEffect } from 'react';
const handlers = require('../utils/handlers')
const commom = require('../utils/common')

const ConstructionItemsTable = ({ constructionItemsArray, onChangeQuantity, setShowOption, setItemSelected, onSaveInformation, onRefresh, onRemoveItem }) => {


    const getTotalsSubChapter = () => {
        let total = 0
        for (let i = 0; i < constructionItemsArray.length; i++) {
            total += constructionItemsArray[i].totalItem * constructionItemsArray[i].quantity
        }
        return total
    }

    useEffect(
        () => {
            console.log("apuArray===", constructionItemsArray);
        }, [constructionItemsArray]
    )
    return (
        <div>
            <table className="table w-80">
                <thead>
                    <tr>
                        <th className='w-5'></th>

                        <th className='w-5'>
                            A.P.U
                        </th>
                        <th className='w-10'>
                            CODIGO
                        </th>

                        <th className='w-40 '>
                            ITEM
                        </th>
                        <th className='w-5'>
                            UNIDAD
                        </th>
                        <th className='w-10'>
                            CANTIDAD
                        </th>
                        <th className='w-5'>
                            GUARDAR
                        </th>
                        <th className='w-10'>
                            VALOR/UN
                        </th>
                        <th className='w-10'>
                            TOTAL
                        </th>


                    </tr>
                </thead>
                <tbody>

                    {
                        constructionItemsArray.map(
                            (x, index) => {
                                return (
                                    <tr key={index.toString()} >

                                        <td className={index % 2 === 0 ? "gray " : ""}>
                                            <i class="far fa-trash-alt icon-table-small"
                                                onClick={() => onRemoveItem(index)}
                                            />
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            <i className="fas fa-folder-open icon-table"
                                                onClick={() => {
                                                    setShowOption('inputItems');
                                               
                                                    setItemSelected(x);
                                                }
                                                }
                                            />
                                        </td>

                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.cod}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray left" : "left"}>
                                            {x.name}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.unit}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>

                                            <input
                                                type="text"
                                                className={`${"input input-table right"} ${x.quantityChanged ? 'pending-changes' : ''}`}
                                                maxLength={4}
                                                value={x.quantity ? x.quantity.toString() : "0"}
                                                onKeyDown={(event) => handlers.onHandlerDecimal(event)}
                                                onChange={(event) => onChangeQuantity(event, index)}
                                            />
                                        </td>
                                        <td className={index % 2 === 0 ? "gray right" : "right"}>
                                            <i className='far fa-save icon-table'
                                                onClick={() => { onSaveInformation(index) }}
                                            />&nbsp;
                                            <i className='fas fa-times-circle icon-table'
                                                onClick={() => { onRefresh() }}
                                            />&nbsp;
                                        </td>
                                        <td className={index % 2 === 0 ? "gray right" : "right"}>
                                            {commom.getMoneyFomat(x.totalItem ? x.totalItem : 0)}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray right" : "right"}>
                                            {commom.getMoneyFomat(x.totalItem && x.quantity ? x.totalItem * x.quantity : 0)}
                                        </td>


                                    </tr>
                                )
                            }
                        )
                    }
                    {constructionItemsArray && constructionItemsArray.length > 0 && (

                        <tr>
                            <td colspan={8}></td>
                            <td className='right' >{commom.getMoneyFomat(getTotalsSubChapter())}</td>

                        </tr>
                    )

                    }

                </tbody>
            </table>

        </div>
    )
}

export default ConstructionItemsTable