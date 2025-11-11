import { useState } from "react"
import Constructions from "../components/constructions"
import Budget from "./budget"


const Container=({user})=>{
    const [showBudget,setShowBudget] =useState(false)
    const [idStage,setIdStage] = useState(0)

    return(
        <div>
        {
            !showBudget && (
                <Constructions
                
                setShowBudget={setShowBudget}
                setIdStage={setIdStage}
                />
            )
        }
        {
            showBudget &&(
             <Budget user={user}
             defaultOption="contructionItems"
             idStage={idStage}
             />

            )
        }
        </div>
        
    )
}

export default Container