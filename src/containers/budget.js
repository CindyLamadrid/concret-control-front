import { useState,useContext, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ConstructionContext } from "../context/constructionContext";
import Chapter from '../components/chapters'
import ConstructionItems from '../components/constructionItems'
import InputItem from '../components/inputItem'
import Header from '../components/commons/header'
import CompoundInputs from '../components/compoundInputs';

const Budget = ({  }) => {
  const  {stageSelected,constructionSelected}=
    useContext(ConstructionContext);
  
   const [searchParams] = useSearchParams();
   const idItem = searchParams.get('idItem')
   const [showOption, setShowOption] = useState(searchParams.get('option') ? searchParams.get('option'):  "constructionItems")
   const [chapterSelected, setChapterSelected] = useState(0)
   const [subchapterSelected, setSubchapterSelected] = useState(0)
   const [constructionItemsArray, setConstructionItemsArray] = useState([])
   const [itemSelected, setItemSelected] = useState({idItem:searchParams.get('idItem')?searchParams.get('idItem'):''})
   const [compoundSelected,setCompoundSelected]= useState({idInput:searchParams.get('idCompoundSelected')?searchParams.get('idCompoundSelected'):''} )
   const [inputType,setInputType] = useState('')

   
    const onConstructionItems = async () => {
        axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/stageItems`, {
           idStage: chapterSelected ,
           idSubChapter: subchapterSelected
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
         console.log("change",showOption);
         if ((showOption==="constructionItems" || showOption === 'inputItems')
            && chapterSelected && subchapterSelected )
               onConstructionItems()
      },[showOption,chapterSelected,subchapterSelected]
    )

    useEffect(
      ()=>{
         if (idItem && constructionItemsArray && constructionItemsArray.length>0){
               const item = constructionItemsArray.filter((x)=>x.idItem.toString()===idItem.toString())
               if(item && item.length>0)
                  setItemSelected(item[0])
         }
      },
      [constructionItemsArray]
    )

    useEffect(
      ()=>{
          const chapterValues = localStorage.getItem("chapterValues")

          if(chapterValues )
          {
            const values =JSON.parse(chapterValues)
            setSubchapterSelected(values.subchapterSelected)
            setChapterSelected(values.chapterSelected)
          }
      },[]
    )
   
   return (
      <div>
         {showOption === 'constructionItems' && (
            <Header
               stageSelected={stageSelected}
               constructionSelected={constructionSelected}
            />)
         }
         {
            showOption !== 'inputItems' &&  showOption !== 'compoundInputs'&& (
               <Chapter
                  chapterSelected={chapterSelected}
                  setChapterSelected={setChapterSelected}
                  subchapterSelected={subchapterSelected}
                  setSubchapterSelected={setSubchapterSelected}
                  setShowOption={setShowOption}
               />

            )
         }

         {showOption === 'constructionItems' && (
            <ConstructionItems
               idSubChapter={subchapterSelected}
               idChapter={chapterSelected}
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