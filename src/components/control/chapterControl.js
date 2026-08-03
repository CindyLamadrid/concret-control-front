import axios from "../../config/axiosConfig";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ConstructionContext } from "../../context/constructionContext";
import ChapterControlTable from "./chapterControlTable";
import Back from "../commons/back";

const ChapterControl = ({
  onSetChapterSelected
}) => {
  const navigate = useNavigate();
  const { stageSelected, user } = useContext(ConstructionContext);
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

  const onBack = () => {
    navigate(`/stages?user=${btoa(user)}`);
  };

  return (
    <div>
      <div className="header-title">
        <span>CONTROL DE COSTOS POR CAPÍTULO</span>
        <span className="subheader-title">&nbsp;&nbsp;&nbsp;{chaptersArray.length} Capitulo(s)</span>
      </div>
      <Back onBack={onBack} className="" />
      <br />
      <br />
      <ChapterControlTable chaptersArray={chaptersArray} onShowInputs={onShowInputs}/>
    </div>
  )
}
export default ChapterControl;
