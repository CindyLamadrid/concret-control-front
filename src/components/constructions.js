import { useEffect, useState } from "react"
import axios from 'axios';
import ConstructionTable from './constructions/constructionTable'
import StageTable from './constructions/stageTable'

const Constructions = ({setShowBudget,setIdStage}) => {
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

    const onViewStage = (idConstruction) => {

        getConstructionStages(idConstruction)
    }

    const onViewStageItems=(idStage)=>{
       setShowBudget(true)
       setIdStage(idStage)
    }

    return (
        <div>
            {
                !showStages && constructionsArray && constructionsArray.length > 0 && (
                    <div>
                        <b><span className="subtitle">LISTADO DE PROYECTOS</span></b>


                        <ConstructionTable
                            constructionsArray={constructionsArray}
                            onViewStage={onViewStage}
                        />


                    </div>)
            }
            {

                showStages && (
                    <div>
                        <b><span className="subtitle">LISTADO DE ETAPAS</span></b>
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