import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate  } from 'react-router-dom';
import { ConstructionContext } from "../context/constructionContext";
import ConstructionTable from "../components/constructions/constructionTable";
import StageTable from "../components/constructions/stageTable";
import Back from "../components/commons/back";

const Stages = ({}) => {
  const navigate = useNavigate ();
  const  {constructionSelected,setStageSelected,setConstructionSelected}=
    useContext(ConstructionContext);
   
  const [constructionsArray, setConstructionsArray] = useState([]);
  const [constructionStagesArray, setConstructionStagesArray] = useState([]);
  const [showStages, setShowStages] = useState(false);



  const getConstructionStages = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/constructionStages`, {
        params: { idConstruction:constructionSelected.idConstruction},
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
    getConstructionStages();
  }, []);

  //useEffect(() => {
   // if (defaultStage) {
    //  setShowStages(true);
   //   getConstructionStages(constructionSelected.idConstruction);
     // setDefaultStage(false);
    //}
  //}, [defaultStage]);

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
    if (stage && stage.length > 0) setStageSelected(stage[0]);

    navigate("/budget?option=constructionItems")
  };

  const onBack = () => {
    navigate("/home")
  };

  return (
    <div>
      <div hidden={!showStages}>
        <Back onBack={onBack} className="right back-no-menu" />
      </div>

      {!showStages && constructionsArray && constructionsArray.length > 0 && (
        <div className="container-no-menu">
          <div className="container-subtitle">
            <b>
              <span className="subtitle">LISTADO DE PROYECTOS</span>
            </b>
          </div>

          <ConstructionTable
            constructionsArray={constructionsArray}
            onViewStage={onViewStage}
          />
        </div>
      )}
      {showStages && (
        <div className="container-no-menu">
          <div className="container-subtitle">
            <b>
              <span className="subtitle">LISTADO DE ETAPAS</span>
            </b>
          </div>
          <StageTable
            constructionStagesArray={constructionStagesArray}
            onViewStageItems={onViewStageItems}
          />
        </div>
      )}
    </div>
  );
};
export default Stages;
