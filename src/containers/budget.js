import { useState,useContext, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ConstructionContext } from "../context/constructionContext";
import Chapter from '../components/chapters'
import ConstructionItems from '../components/constructionItems'
import InputItem from '../components/inputItem'
import Header from '../components/commons/resume'
import CompoundInputs from '../components/compoundInputs';

const Budget = ({  }) => {
  const  {stageSelected,constructionSelected}=
    useContext(ConstructionContext);
  
   const [searchParams] = useSearchParams();
   const idItem = searchParams.get('idItem')
   const [showOption, setShowOption] = useState(searchParams.get('option') ? searchParams.get('option'):  "constructionItems")
   const [chapterSelected, setChapterSelected] = useState(-1)
   const [subchapterSelected, setSubchapterSelected] = useState(-1)
   const [constructionItemsArray, setConstructionItemsArray] = useState([])
   const [itemSelected, setItemSelected] = useState({idItem:searchParams.get('idItem')?searchParams.get('idItem'):''})
   const [compoundSelected,setCompoundSelected]= useState({idInput:searchParams.get('idCompoundSelected')?searchParams.get('idCompoundSelected'):''} )
   const [inputType,setInputType] = useState('')

   
    const onConstructionItems = async () => {
      console.log("fill===");
        axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/stage-items`, {
           idStage: stageSelected.idStage ,
           idSubchapter: subchapterSelected
        }).then(
            (result) => {
                if (result && result.data && result.data.length > 0) {
                    setConstructionItemsArray(result.data)
                   
                } else {
                    setConstructionItemsArray([])
                  
                }
            }
        ).catch(
            (error) => {
                setConstructionItemsArray([])
                // setNoData(true)
                console.error('Error fetching onConstructionItems:', error);
            }
        )
    }

   useEffect(
   ()=>{
         console.log("stageSelected===",stageSelected);
         console.log("chapterSelected change",chapterSelected);
         if ((showOption==="constructionItems" || showOption === 'inputItems')
            && chapterSelected && subchapterSelected && stageSelected.idStage )
               onConstructionItems()
      },[subchapterSelected,stageSelected]
    )

   
    useEffect(
      ()=>{
         console.log("entrooo",constructionItemsArray);
         if (idItem && constructionItemsArray && constructionItemsArray.length>0){
               const item = constructionItemsArray.filter((x)=>x.idItem.toString()===idItem.toString())
               if(item && item.length>0)
                  setItemSelected(item[0])
         }
      },
      [constructionItemsArray]
    )

      useEffect(
        () => {
            console.log("budget===");
            const chapterValues = localStorage.getItem("chapterValues")
            
            if(chapterValues )
            {
                const values =JSON.parse(chapterValues)
                const newChapterSelected =  parseInt(values.chapterSelected)
                const newSubchapterSelected =parseInt(values.subchapterSelected)
                console.log("entro chapterValues===",chapterValues);
                setChapterSelected(newChapterSelected)
                setSubchapterSelected(newSubchapterSelected)
                
            }else
            {
                 console.log("entro chapterValues1===");
                 setChapterSelected(0)
                 setSubchapterSelected(0)
                 
            }

            
        }, []
    )


   console.log("showOption===",showOption);
   return (
      <div >
         {showOption === 'constructionItems' && (
            <Header
               stageSelected={stageSelected}
               constructionSelected={constructionSelected}
            />)
         }
         {
            showOption !== 'inputItems' &&  showOption !== 'compoundInputs'&& (
               <div className='container_chapters'>
             
               <Chapter
                  chapterSelected={chapterSelected}
                  setChapterSelected={setChapterSelected}
                  subchapterSelected={subchapterSelected}
                  setSubchapterSelected={setSubchapterSelected}
                  setShowOption={setShowOption}
               /></div>

            )
         }

         {showOption === 'constructionItems' && (
            <ConstructionItems
               idSubchapter={subchapterSelected}
               setShowOption={setShowOption}
               setItemSelected={setItemSelected}
               constructionItemsArray={constructionItemsArray}
               setConstructionItemsArray={setConstructionItemsArray}
               onConstructionItems={onConstructionItems}
            />)
         }
         {showOption === 'inputItems' &&
            <InputItem
               constructionItemsArray={constructionItemsArray}
               itemSelected={itemSelected}
               setShowOption={setShowOption}
               setItemSelected={setItemSelected}
               setInputType={setInputType}
               setCompoundSelected={setCompoundSelected}

            />
         }
         {showOption === 'compoundInputs' &&
            <CompoundInputs
            itemSelected={itemSelected}
            compoundSelected={compoundSelected}
            subchapterSelected={subchapterSelected}
            setInputType={setInputType}
            setShowOption={setShowOption}
            setCompoundSelected={setCompoundSelected}
            
            />
         }



      </div>
   )
}
export default Budget