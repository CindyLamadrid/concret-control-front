import { useEffect, useState, useContext } from "react";
import { ConstructionContext } from "../context/constructionContext";
import ChapterHeader from '../components/chaptersHeader';
import ChapterControl from "../components/control/chapterControl";
import InputControl from "../components/control/inputControl"
import Resume from "../components/commons/resume";

const Control = ({}) => {
  const { constructionSelected, stageSelected } = useContext(ConstructionContext);
  const [option, setOption] = useState("chapter");
  const [chapterSelected, setChapterSelected] = useState(-1)
  const [subchapterSelected, setSubchapterSelected] = useState(-1)

   useEffect(
        () => {
          
            const chapterValues = localStorage.getItem("chapterValues")
            if(chapterValues )
            {
                const values =JSON.parse(chapterValues)
                const newChapterSelected =  parseInt(values.chapterSelected)
                const newSubchapterSelected =parseInt(values.subchapterSelected)
              
                setChapterSelected(newChapterSelected)
                setSubchapterSelected(newSubchapterSelected)
            }else
            {  setChapterSelected(0)
               setSubchapterSelected(0)
            }
        }, []
    )

  useEffect(
    ()=>{
    
      // if (subchapterSelected>-1)
       // setOption("inputControl")
        //getInputControl(subchapterSelected)
    },[subchapterSelected]
  )

  const onSetChapterSelected=(idChapter)=>{
    setOption("input-control")
    setChapterSelected(idChapter)
  }

  return (<>
     <Resume
       constructionSelected={constructionSelected}
       stageSelected={stageSelected}
     />
     {
        option!=='chapter' && (
        <ChapterHeader
          chapterSelected={chapterSelected}
          subchapterSelected={subchapterSelected}
          setSubchapterSelected={setSubchapterSelected}
          setChapterSelected={ setChapterSelected}
          setShowOption={()=>{}}
        />
        )
    }
    {option === "chapter" && (
      <ChapterControl onSetChapterSelected={onSetChapterSelected}
      />
    )}

    {option === "input-control" && (
      <InputControl 
       subchapterSelected={subchapterSelected}
      />
    )}

    
    </>)
};
export default Control;
