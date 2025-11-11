import { useEffect } from 'react';
const handlers = require('../utils/handlers')
const commom = require('../utils/common')

const ContructionItemsTable = ({ contructionItemsArray, onChangeQuantity,setShowOption ,setIdItem}) => {


 const getTotalsSubChapter=()=>{
 let total =0
    for (let i = 0; i < contructionItemsArray.length; i++) {  
        total +=  contructionItemsArray[i].totalItem *  contructionItemsArray[i].quantity
    }
    return total
}
 
    useEffect(
      ()=>{
          console.log("apuArray===",contructionItemsArray);     
      },[contructionItemsArray]
   )
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                       
                        <td>Todos</td>
                        <td>
                            A.P.U
                        </td>
                        <td>
                            Codigo
                        </td>

                        <td>
                            Item
                        </td>
                        <td>
                            Unidad
                        </td>
                        <td>
                            Cantidad
                        </td>
                        <td>
                            Valor/Un
                        </td>
                        <td>
                            Total
                        </td>


                    </tr>
                </thead>
                <tbody>

                    {
                        contructionItemsArray.map(
                            (x, index) => {
                                return (
                                    <tr key={index.toString()} >
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            <input
                                                type="checkbox"
                                            />
                                        </td>
                                     <td className={index%2===0 ? "gray":""}>
                                           <i class="fas fa-folder-plus folder"
                                            onClick={()=>
                                                {
                                                 setShowOption('inputItem');
                                                 setIdItem(x.idItem);
                                                }
                                            }
                                           />
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
                                                className="input input-table"
                                                maxLength={4}
                                                value={x.quantity? x.quantity.toString(): "0"}
                                                onKeyDown={(event)=>handlers.onHandlerNumber(event)}
                                                onChange={(event) => onChangeQuantity(event,index)}
                                            />
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.totalItem}
                                        </td>
                                        <td className={index % 2 === 0 ? "gray" : ""}>
                                            {x.totalItem && x.quantity?  x.totalItem * x.quantity:0}
                                        </td>

                                    </tr>
                                )
                            }
                        )
                    }
                     { contructionItemsArray && contructionItemsArray.length>0 &&(

                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{getTotalsSubChapter()}</td>
                        </tr>
                     )

                     }       

                </tbody>
            </table>

        </div>
    )
}

export default ContructionItemsTable