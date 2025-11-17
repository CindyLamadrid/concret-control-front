import { useEffect, useState } from "react"
import axios from 'axios';
import ConstructionTable from './constructions/constructionTable'
import StageTable from './constructions/stageTable'
import Back from "./commons/back";

const Constructions = ({ constructionSelected,setShowBudget, setStageSelected,defaultStage,setDefaultStage,setConstructionSelected }) => {
    const [constructionsArray, setConstructionsArray] = useState([])
    const [constructionStagesArray, setConstructionStagesArray] = useState([])
    const [showStages, setShowStages] = useState(false)


    const getConstructions = () => {
        axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/constructions`).then(
            (result) => {
                if (result && result.data) {
                    setConstructionsArray(result.data)
                } else {
                    setConstructionsArray([])
                }
            }
        ).catch(error => {
            setConstructionsArray([])
            console.error('Error fetching getUnitsArray:', error);
        });
    }

    const getConstructionStages = (idConstruction) => {
        axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/constructionStages`,
            {
                params: { idConstruction }
            }
        ).then(
            (result) => {
                if (result && result.data) {
                    setShowStages(true)
                    setConstructionStagesArray(result.data)
                } else {
                    setConstructionStagesArray([])
                }
            }
        ).catch(error => {
            setConstructionStagesArray([])
            console.error('Error fetching getConstructionStages:', error);
        });
    }

    useEffect(
        () => {

            getConstructions()
        }, []
    )

    useEffect(()=>{
      if(defaultStage)
      {
        setShowStages(true)
        getConstructionStages(constructionSelected.idConstruction)
        setDefaultStage(false)
      }
    },[defaultStage])



    const onViewStage = (idConstruction) => {

        getConstructionStages(idConstruction)
        const construction  = constructionsArray.filter((x)=>x.idConstruction.toString()===idConstruction.toString())
        
        if (construction && construction.length>0)
            setConstructionSelected(construction[0])
    }

    const onViewStageItems = (idStage) => {
        setShowBudget(true)
       console.log("idStage===",idStage);
       console.log("constructionStagesArray===",constructionStagesArray);
        const stage = constructionStagesArray.filter((x)=>x.idStage.toString()===idStage.toString())
         console.log("stage==",stage);
        if (stage && stage.length>0)
          setStageSelected(stage[0])
    }

       const onBack=()=>{
       setShowStages(false)
    }

    return (
        <div>
            <div hidden={!showStages}>
            <Back
             onBack={onBack}
             className="right back-no-menu"
            />
            </div>
            
            {
                !showStages && constructionsArray && constructionsArray.length > 0 && (
                    <div className="container-no-menu">
                        <div className="container-subtitle">
                            <b><span className="subtitle">LISTADO DE PROYECTOS</span></b>
                        </div>

                        <ConstructionTable
                            constructionsArray={constructionsArray}
                            onViewStage={onViewStage}
                        />


                    </div>)
            }
            {

                showStages && (
                    <div className="container-no-menu">
                        <div className="container-subtitle">
                            <b><span className="subtitle">LISTADO DE ETAPAS</span></b>
                        </div>
                        <StageTable
                            constructionStagesArray={constructionStagesArray}
                            onViewStageItems={onViewStageItems}
                        />
                    </div>

                )
            }

        </div>)
}
export default Constructions