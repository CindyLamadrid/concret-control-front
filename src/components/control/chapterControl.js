import axios from "../../config/axiosConfig";
import { useEffect, useState,useContext } from "react";
import { ConstructionContext } from "../../context/constructionContext";
import ChapterControlTable from "./chapterControlTable";

const ChapterControl = ({
  onSetChapterSelected
}) => {
  const { stageSelected } = useContext(ConstructionContext);
  const [chaptersArray, setChaptersArray] = useState([]);

  const getChaperControl = () => {
    try {
    
      axios
        .get(`${process.env.REACT_APP_BUDGET_URL_API}/chapter-cost-control`, {
          params: { idStage: stageSelected.idStage },
        })
        .then((result) => {
          if (result && result.data && result.data.length > 0) {
            setChaptersArray(result.data);
          } else {
            setChaptersArray([]);
          }
        })
        .catch((error) => {
          setChaptersArray([]);

          console.error("Error fetching getChaperControl:", error);
        });
    } catch (error) {
      setChaptersArray([]);
      console.error("Error fetching getChaperControl:", error);
    }
  };

  useEffect(() => {
    if (stageSelected )
       getChaperControl();
  }, [stageSelected]);

  const onShowInputs=(idChapter)=>{
    onSetChapterSelected(idChapter)
  }

  return (
    <div>
        <ChapterControlTable chaptersArray={chaptersArray} onShowInputs={onShowInputs}/>
    </div>
  )
}
export default ChapterControl;
