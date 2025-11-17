import { useEffect, useState } from "react"
import axios from 'axios';
import ContructionItemsTable from './contructionItems/contructionItemsTable'
import Back from "./commons/back";
import Modal from './commons/modal';


const ContructionItems = ({user, idStage,idChapter,idSubChapter, setShowOption, setItemSelected,contructionItemsArray,setContructionItemsArray,onShowInit }) => {

    const [noData, setNoData] = useState(false)
    const [modalConfiguration,setModalConfiguration] = useState({
        show:false,
        buttonArray:[]

    })

    const onChangeQuantity =(event,index)=>{
      
         const newContructionItemsArray = [...contructionItemsArray]
         newContructionItemsArray[index].quantityChanged = newContructionItemsArray[index].originalQuantity.toString() !==event.target.value? true:false
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

    const updateItemStage=async(item)=>{
         try {
            const result = await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/updateItemStage`,{
                idConstructionStage: item.idConstructionStage,
                quantity: item.quantity,
                user
            })

              if (result && result.data)
                onConstructionItems()
           
        } catch (error) {
           
            setNoData(true)
            console.error('Error fetching updateItemStage:', error);
        }
    }

    
    const onSaveInformation=(index)=>{
        console.log("index===",index);
        const contructionItem = {...contructionItemsArray [index]}
        updateItemStage(contructionItem)
    }

    useEffect(
        () => {
          console.log("idChapter==",idChapter);
            console.log("idSubChapter==",idSubChapter);
            if(idSubChapter>0 )
              onConstructionItems()
        }, [idSubChapter]
    )

    const onBack=()=>{
        onShowInit(idSubChapter,idChapter)
    }

    const onRefresh=()=>{
         onConstructionItems()
    }

    const removeItem=async(item)=>{
         setModalConfiguration({
            show:false,
            buttonArray:[]
        })

        try {
            const result = await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/removeItem`,{
                idItem: item.idItem,
                user
            })

            if (result && result.data)
                onConstructionItems(    )
           
        } catch (error) {
            setContructionItemsArray([])
            setNoData(true)
            console.error('Error fetching removeItem:', error);
        }
    }

    const closeModal=()=>{
         setModalConfiguration({
            show:false,
            buttonArray:[]
        })
    }

    const onRemoveItem=(index)=>{
    const item = {...contructionItemsArray [index]}
      console.log("remove==",item);
      // removeInputItem(inputItem)
      setModalConfiguration(
        {
            show:true,
            buttonArray:[
                {
                    name: "Aceptar",
                    disabled: false,
                    action: removeItem
                },
                {
                    name: "Cancelar",
                    disabled: false,
                    action: closeModal
                }
            ],
            item: item
        }
      )
    }

    const onAddItems=()=>{
        setShowOption('searchItems')
    }

    return (

        <div>
            <Back
             onBack={onBack}
             className="right back"
            />



       
             {
                modalConfiguration && modalConfiguration.show &&(
                <Modal
                  message="Desea elimiar el item?"
                  buttonArray={modalConfiguration.buttonArray}
                  item = {modalConfiguration.item}
                />)
            }
            <div className=" w-90 right">
             <input
                type="button"
                value="Agregar Items"
                onClick={() => onAddItems()}
             />
             </div>
             <br/>
            {
                contructionItemsArray && contructionItemsArray.length>0 &&
                (
                    <ContructionItemsTable
                            contructionItemsArray={contructionItemsArray}
                            onChangeQuantity={onChangeQuantity}
                            setShowOption={setShowOption}
                            setItemSelected={setItemSelected}
                            onSaveInformation={onSaveInformation}
                            onRefresh={onRefresh}
                            onRemoveItem={onRemoveItem}
                        />
                )
            }
            {
                noData && (
                    <div>
                        La busqueda no arrojo resultado
                    </div>
                )
            }
        </div>
    )
}
export default ContructionItems