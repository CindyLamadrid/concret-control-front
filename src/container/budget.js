import { useEffect, useState } from 'react';
import Chapter from '../components/chapters'
import Menu from '../components/menu';
import Items from '../components/items';
import ContructionItems from '../components/contructionItems'
import Inputs from '../components/inputs'
import InputItem from '../components/inputItem'
import Header from '../components/commons/header'
const Budget = ({ user, constructionSelected, stageSelected, defaultOption, onShowInit }) => {

   const [showOption, setShowOption] = useState(defaultOption)
   const [chapterSelected, setChapterSelected] = useState(0)
   const [subchapterSelected, setSubchapterSelected] = useState(0)
   const [contructionItemsArray, setContructionItemsArray] = useState([])
   const [itemSelected, setItemSelected] = useState('')


   return (

      <div>

         <Menu
            setShowOption={setShowOption}
            showOption={showOption}
         />
         <br />
         {showOption === 'contructionItems' && (
            <Header

               stageSelected={stageSelected}
               constructionSelected={constructionSelected}
            />)
         }

         {
            showOption !== 'inputItem' && showOption !== 'searchInputs' && (
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
         <br />
         {
            showOption === 'searchItems' && (
               <Items
                  idStage={stageSelected.idStage}
                  subchapterSelected={subchapterSelected}
                  setShowOption={setShowOption}
                  user={user}
               />
            )
         }

         {showOption === 'contructionItems' && (
            <ContructionItems
               idStage={stageSelected.idStage}
               idSubChapter={subchapterSelected}
               idChapter={chapterSelected}
               constructionSelected={constructionSelected}
               stageSelected={stageSelected}
               setShowOption={setShowOption}
               setItemSelected={setItemSelected}
               contructionItemsArray={contructionItemsArray}
               setContructionItemsArray={setContructionItemsArray}
               onShowInit={onShowInit}
               user={user}
            />)
         }
         {
            showOption === 'searchInputs' && (
               <Inputs
                  idItem={itemSelected.idItem}
                  setShowOption={setShowOption}
                  user={user}
               />
            )
         }
         {showOption === 'inputItem' &&
            <InputItem
               contructionItemsArray={contructionItemsArray}
               constructionSelected={constructionSelected}
               stageSelected={stageSelected}
               itemSelected={itemSelected}
               user={user}
               setShowOption={setShowOption}
               setItemSelected={setItemSelected}

            />
         }



      </div>
   )
}
export default Budget