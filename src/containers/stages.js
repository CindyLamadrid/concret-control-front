import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import StageTable from "../components/constructions/stageTable";
import Back from "../components/commons/back";

const Stages = ({}) => {
  const navigate = useNavigate();
  const {user, constructionSelected, setStageSelected, setConstructionSelected } =
    useContext(ConstructionContext);

  const [constructionsArray, setConstructionsArray] = useState([]);
  const [constructionStagesArray, setConstructionStagesArray] = useState([]);
  const [showStages, setShowStages] = useState(false);

  const getConstructionStages = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/construction-stages`, {
        params: { idConstruction: constructionSelected.idConstruction },
      })
      .then((result) => {
        if (result && result.data) {
          setShowStages(true);
          setConstructionStagesArray(result.data);
        } else {
          setConstructionStagesArray([]);
        }
      })
      .catch((error) => {
        setConstructionStagesArray([]);
        console.error("Error fetching getConstructionStages:", error);
      });
  };

  useEffect(() => {
    
    if(constructionSelected && constructionSelected.idConstruction)
        getConstructionStages();
  }, [constructionSelected]);



  const onViewStage = (idConstruction) => {
    getConstructionStages(idConstruction);
    const construction = constructionsArray.filter(
      (x) => x.idConstruction.toString() === idConstruction.toString()
    );

    if (construction && construction.length > 0)
      setConstructionSelected(construction[0]);
  };

  const onViewStageItems = (idStage) => {
    const stage = constructionStagesArray.filter(
      (x) => x.idStage.toString() === idStage.toString()
    );
    console.log("stage==", stage);
    if (stage && stage.length > 0) 
    {
      setStageSelected(stage[0]);
      navigate(`/budget?option=constructionItems&user=${btoa(user)}&idStage=${stage[0].idStage}&idConstruction=${constructionSelected.idConstruction}`);
    }
  };

  const onBack = () => {
    navigate(`/home?user=${btoa(user)}`);
  };

  return (
    <div>
      <div>
        <Back onBack={onBack} className="" />
        <div className="header-title">
          <span>LISTADO DE ETAPAS</span>
          <span className="subheader-title">
            {" "}
            &nbsp;&nbsp;&nbsp;{constructionStagesArray.length} Etapa(s)
          </span>
        </div>

        <StageTable
          constructionStagesArray={constructionStagesArray}
          onViewStageItems={onViewStageItems}
        />
      </div>
    </div>
  );
};
export default Stages;
