import axios from "axios";
import {  useContext, useState ,useEffect} from "react";
import Hogan from "hogan.js";
import { ConstructionContext } from "../../context/constructionContext";
const commom = require('../utils/common')
 
const CompoundInputs = ({reportOption,setReportOption}) => {
  const { stageSelected,constructionSelected } = useContext(ConstructionContext);
  const [reportArray, setReportArray] =useState([]);
  const [loadReport, setLoadReport] =useState(false);

  const printReport = (report) => {
    const newTab = window.open("", "_blank");
    newTab.document.write(report);
    newTab.document.close(); 

    if(reportOption.type==="pdf")
    {
        setTimeout(() => {
        newTab.print();
        }, 1000);
    }
  };

  
  const createArrayData=(array)=>{
    const inputsMain =[]
   
     
    array.forEach(i => {
       const exists = inputsMain.findIndex(x=> x.idInputMain===i.idInputMain)
       if(exists ===-1)
       {
          const inputs = array.filter(x=>x.idInputMain===i.idInputMain).map(
              (y)=>
              {
                  return {
                      name: y.name,
                      cod: y.cod,
                      unit : y.unit,
                      unitValue :  y.unitValue ,
                      quantity:y.quantity,
                      waste: y.waste,
                      totalInput:  y.totalInput,
                      totalInputFormat:  y.totalInputFormat
                  }
              }
                 
          )
          inputsMain.push(
              {
                  compoundMain:i.compoundMain,
                  idInputMain:i.idInputMain,
                  compoundMainCod: i.cod,
                  inputs ,
                  total: commom.getMoneyFomat(commom.getTotals(inputs,"totalInput"))
              }
          )
       }
     });

     return inputsMain
  }

const generateReport=()=>{
  const timezone =  new Date().toLocaleTimeString();
     fetch("/templates/compoundItems.html")
      .then((r) => r.text())
      .then((dataInfo) => {
            const newTemplates = Hogan.compile(dataInfo);
            const data ={
               inputsMain: reportArray,
               projectName: constructionSelected.name,
               stageName : stageSelected.name,
               totalValue: commom.getMoneyFomat(commom.getTotals(reportArray,"value")),
               date:new Date( Date.now()).toDateString()
            }
            const htmlOutput = newTemplates.render(data);
            printReport(htmlOutput)
           
      })
}

  const getCompundInputsBudget = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_BUDGET_URL_API}/input-compound-budget`, {
          params: { idStage: stageSelected.idStage,type: stageSelected.budgetType },
        })
        .then((result) => {
          if (result && result.data && result.data.length > 0) {
            const report = result.data.map(
              (x)=>{
                const newItem = x;
                newItem.unitValue =  `${ commom.getMoneyFomat(x.unitValue ? x.unitValue : 0)}`
                newItem.totalInputFormat =  `${ commom.getMoneyFomat(x.totalInput ? x.totalInput : 0)}`
              }
            )
            setReportArray(createArrayData(result.data));
            
          } else {
            setReportArray([]);
          }
          setLoadReport(true)
        })
        .catch((error) => {
          setReportArray([]);
          setLoadReport(false)
          console.error("Error fetching getSubchapterBudget:", error);
        });
    } catch (error) {
      setReportArray([]);

      console.error("Error fetching getSubchapterBudget:", error);
    }
  };

  useEffect(() => {
   if(reportOption && reportOption.name==="compoundInputs")
    {
      getCompundInputsBudget()
      
    }
    
  }, [reportOption]);

  useEffect(
    ()=>{
       if(loadReport)
       {
        setLoadReport(false)
        generateReport(reportArray)
       }
       setReportOption('')
    },[reportArray,loadReport]
  )

  return <div> <iframe id="ifmcontentstoprint" title="print" className="printOnly" type="application/pdf"/></div>;
};

export default CompoundInputs;
