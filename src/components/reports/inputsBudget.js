import axios from "axios";
import {  useContext, useState ,useEffect} from "react";
import Hogan from "hogan.js";
import { ConstructionContext } from "../../context/constructionContext";
const commom = require('../utils/common')
 
const InputsBudget = ({reportOption,setReportOption}) => {
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

const generateReport=(reportArray)=>{
  const timezone =  new Date().toLocaleTimeString();
     fetch("/templates/inputs.html")
      .then((r) => r.text())
      .then((dataInfo) => {
            const newTemplates = Hogan.compile(dataInfo);
            const data ={
               list:reportArray,
               projectName: constructionSelected.name,
               stageName : stageSelected.name,
               totalValue: commom.getMoneyFomat(commom.getTotals(reportArray,"total")),
               date:new Date( Date.now()).toDateString()
            }
            const htmlOutput = newTemplates.render(data);
            printReport(htmlOutput)
           
      })
}

  const getInputsBudget = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_BUDGET_URL_API}/inputs-budget`, {
          params: { idStage: stageSelected.idStage },
        })
        .then((result) => {
          if (result && result.data && result.data.length > 0) {
            const report = result.data.map(
              (x)=>{
                const newItem = x;
                newItem.totalFormat =   commom.getMoneyFomat(x.total ? x.total : 0)
                newItem.unitValueFormat =   commom.getMoneyFomat(x.unitValue ? x.unitValue : 0)
              }
            )
            setReportArray(result.data);
            
          } else {
            setReportArray([]);
          }
          setLoadReport(true)
        })
        .catch((error) => {
          setReportArray([]);
          setLoadReport(false)
          console.error("Error fetching getInputsBudget:", error);
        });
    } catch (error) {
      setReportArray([]);

      console.error("Error fetching getInputsBudget:", error);
    }
  };

  useEffect(() => {
    if(reportOption && reportOption.name==="inputs")
    {
      getInputsBudget()
     
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

export default InputsBudget;
