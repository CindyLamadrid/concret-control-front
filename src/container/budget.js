import { useEffect, useState } from 'react';
import Chapter from '../components/chapters'
import Menu from '../components/menu';
import Items from '../components/items';
import ContructionItems from '../components/contructionItems'
import Inputs from '../components/inputs'
import InputItem from '../components/inputItem'

const Budget = ({user,defaultOption,idStage}) => {

   const [showOption, setShowOption] = useState(defaultOption)
     
   const [chapterSelected,setChapterSelected]= useState(0)
   const [subchapterSelected,setSubchapterSelected]= useState(0)
   const [contructionItemsArray, setContructionItemsArray] = useState([])
   const [idItem, setIdItem] = useState('')

   console.log("showOption===",showOption);
   
   return (

      <div>
         <Menu
            setShowOption={setShowOption}
            showOption={showOption}
         />
         <br/>
         {
            showOption !== 'inputItem' && showOption!=='searchInputs' && (
               <Chapter 
               chapterSelected={chapterSelected}
               setChapterSelected={setChapterSelected}
               subchapterSelected={subchapterSelected}
               setSubchapterSelected={setSubchapterSelected}
               setShowOption={setShowOption}
               showOption={showOption}
          />

          )
         }

        
         
          {/* <hr class="hr" /> */}
          <br/>
         {
            showOption === 'searchItems' && (
               <Items
                idStage={idStage}
                subchapterSelected={subchapterSelected}
                setShowOption={setShowOption}
                user={user} 
               />
            )
         }
         { showOption === 'contructionItems' &&(
            <ContructionItems
              idStage={idStage}
              idSubChapter={subchapterSelected}
              setShowOption={setShowOption}
              setIdItem={setIdItem}
              contructionItemsArray={contructionItemsArray}
               setContructionItemsArray={setContructionItemsArray}
            />)
         }
         {
            showOption === 'searchInputs' &&(
            <Inputs
              idItem={idItem}
              setShowOption={setShowOption}
              user={user} 
            />
            )
         }
         { showOption === 'inputItem' &&
               <InputItem
                contructionItemsArray={contructionItemsArray}
                idItem={idItem}
                user={user}
                setShowOption={setShowOption}
                setIdItem={setIdItem}
               />
         }
      

       
      </div>
   )
}
export default Budget