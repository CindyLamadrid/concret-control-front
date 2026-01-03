import axios from "axios";
import { useEffect, useState,useContext } from "react";
import { ConstructionContext } from "../../context/constructionContext";
import InputControlTable from "./inputControlTable";


const InputControl = ({subchapterSelected}) => {
  const { stageSelected } = useContext(ConstructionContext);
  const [inputsArray,setInputsArray] = useState([])

   const getInputControl = (subchapter) => {
    try {
    
      axios
        .get(`${process.env.REACT_APP_BUDGET_URL_API}/input-cost-control`, {
          params: { idStage: stageSelected.idStage,idSubchapter:subchapter },
        })
        .then((result) => {
          if (result && result.data && result.data.length > 0) {
            setInputsArray(result.data);
          } else {
            setInputsArray([]);
          }
        })
        .catch((error) => {
          setInputsArray([]);

          console.error("Error fetching getInputControl:", error);
        });
    } catch (error) {
      setInputsArray([]);
      console.error("Error fetching getInputControl:", error);
    }
  };


  useEffect(
    ()=>{
    
      if (subchapterSelected>-1)
      {
        getInputControl(subchapterSelected)
      }
    },[subchapterSelected]
  )

  const onShowDetails=(idChapter)=>{
    // setChapterSelected(parseInt(idChapter))
  }

  return (
    <div>
        <InputControlTable inputsArray={inputsArray} onShowDetails={onShowDetails}/>
    </div>
  );
};
export default InputControl;
