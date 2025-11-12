import { useEffect, useState } from "react"
import axios from 'axios';
import ContructionItemsTable from './contructionItems/contructionItemsTable'

const ContructionItems = ({ idStage,idSubChapter, setShowOption, setIdItem,contructionItemsArray,setContructionItemsArray }) => {

    const [noData, setNoData] = useState(false)

    const onChangeQuantity =(event,index)=>{
      
         const newContructionItemsArray = [...contructionItemsArray]
         newContructionItemsArray[index].quantity =  parseInt(event.target.value,10)
         setContructionItemsArray(...[newContructionItemsArray]);   
   }

    const onConstructionItems = async () => {

        axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/stageItems`, {
           idStage ,
           idSubChapter
        }).then(
            (result) => {
                if (result && result.data && result.data.length > 0) {
                    setContructionItemsArray(result.data)
                    setNoData(false)
                } else {
                    setContructionItemsArray([])
                    setNoData(true)
                }
            }
        ).catch(
            (error) => {
                setContructionItemsArray([])
                setNoData(true)
                console.error('Error fetching onConstructionItems:', error);
            }


        )


    }

    useEffect(
        () => {
            if(idSubChapter>0)
             onConstructionItems()
        }, [idSubChapter]
    )

    return (

        <div>

            <ContructionItemsTable
                contructionItemsArray={contructionItemsArray}
                onChangeQuantity={onChangeQuantity}
                setShowOption={setShowOption}
                setIdItem={setIdItem}
            />
        </div>
    )
}
export default ContructionItems