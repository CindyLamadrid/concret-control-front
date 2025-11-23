import { useEffect, useState,useContext } from "react"
import { useNavigate ,createSearchParams } from 'react-router-dom';
import { ConstructionContext } from "../context/constructionContext";
import axios from 'axios';
import ConstructionItemsTable from './constructionItems/constructionItemsTable'
import Back from "./commons/back";
import Modal from './commons/modal';


const ConstructionItems = ({idChapter,idSubChapter, setShowOption, setItemSelected,constructionItemsArray,setConstructionItemsArray,onConstructionItems }) => {
    const navigate = useNavigate ();
    const  {user,constructionSelected}=
        useContext(ConstructionContext);
  
    
    const [noData, setNoData] = useState(false)
    const [modalConfiguration,setModalConfiguration] = useState({
        show:false,
        buttonArray:[]

    })

    const onChangeQuantity =(event,index)=>{
      
         const newConstructionItemsArray = [...constructionItemsArray]
         newConstructionItemsArray[index].quantityChanged = newConstructionItemsArray[index].originalQuantity.toString() !==event.target.value? true:false
         newConstructionItemsArray[index].quantity =  event.target.value
         setConstructionItemsArray(...[newConstructionItemsArray]);   
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
        const constructionItem = {...constructionItemsArray [index]}
        updateItemStage(constructionItem)
    }

    useEffect(
        () => {
          console.log("idChapter==",idChapter);
            console.log("idSubChapter==",idSubChapter);
            if(idSubChapter>0 )
              onConstructionItems()
        }, [idSubChapter]
    )

     useEffect(
        () => {
          console.log("idChapter==",idChapter);
            console.log("idSubChapter==",idSubChapter);
          
        }, []
    )

    const onBack=()=>{
     const params = createSearchParams({idConstruction:constructionSelected.idConstruction});
      navigate(`/stages?${params.toString()}`);
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
                onConstructionItems()
           
        } catch (error) {
            setConstructionItemsArray([])
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
    const item = {...constructionItemsArray [index]}
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
        
       
        navigate(`/search-items?idSubChapter=${idSubChapter.toString()}`);
        
        //setShowOption('searchItems')
    }

    useEffect(
        ()=>{
            if(constructionItemsArray && constructionItemsArray.length>0)
                setNoData(false)
            else
                setNoData(true)

        },[constructionItemsArray]
    )

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
                constructionItemsArray && constructionItemsArray.length>0 &&
                (
                    <ConstructionItemsTable
                            constructionItemsArray={constructionItemsArray}
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
export default ConstructionItems