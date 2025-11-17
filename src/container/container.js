import { useState } from "react"
import Constructions from "../components/constructions"
import Budget from "./budget"


const Container=({user})=>{
    const [showBudget,setShowBudget] =useState(false)
    const [stageSelected,setStageSelected] = useState(0)
    const [defaultStage,setDefaultStage] = useState(0)
    const [constructionSelected,setConstructionSelected] = useState(0)

    const onShowInit=()=>{
      setShowBudget(false)
      setDefaultStage (true)
    }
    return(
        <div>
        {
            !showBudget && (
                <Constructions
                setShowBudget={setShowBudget}
                setStageSelected={setStageSelected}
                setDefaultStage={setDefaultStage}
                defaultStage={defaultStage}
                setConstructionSelected={setConstructionSelected}
                constructionSelected={constructionSelected}
                />
            )
        }
        {
            showBudget &&(
             <Budget user={user}
             defaultOption="contructionItems"
             constructionSelected={constructionSelected}
             onShowInit={onShowInit}
             stageSelected={stageSelected}
            
             />

            )
        }
        </div>
        
    )
}

export default Container