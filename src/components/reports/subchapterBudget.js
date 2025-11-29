import axios from "axios";
import {  useContext, useState ,useEffect} from "react";
import Hogan from "hogan.js";
import { ConstructionContext } from "../../context/constructionContext";
const commom = require('../utils/common')
 
const SubchapterBudget = ({reportOption,setReportOption}) => {
  const { stageSelected,constructionSelected } = useContext(ConstructionContext);
  const [reportArray, setReportArray] =useState([]);
  const [loadReport, setLoadReport] =useState(false);

   const printReport = (report) => {
    const newTab = window.open("", "_blank");
    newTab.document.write(report);
     newTab.document.close(); 
       setTimeout(() => {
      newTab.print();
    }, 1000);
    // const pri = document.getElementById("ifmcontentstoprint").contentWindow;
    // pri.document.open();
    // pri.document.write(report);
    // pri.document.close();
    // pri.focus();
    // setTimeout(() => {
    //   pri.print();
    // }, 1000);
   
  };

const generateReport=(reportArray)=>{
     fetch("/templates/subchapterBudget.html")
      .then((r) => r.text())
      .then((dataInfo) => {
            const newTemplates = Hogan.compile(dataInfo);
            const data ={
               list:reportArray,
               projectName: constructionSelected.name
            }
            const htmlOutput = newTemplates.render(data);
            printReport(htmlOutput)
            console.log("htmlOutput===>",htmlOutput);
      })
}

  const getSubchapterBudget = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_BUDGET_URL_API}/subchapter-budget`, {
          params: { idStage: stageSelected.idStage },
        })
        .then((result) => {
          if (result && result.data && result.data.length > 0) {
            const report = result.data.map(
              (x)=>{
                const newItem = x;
                newItem.valueFormat =  `${ commom.getMoneyFomat(x.value ? x.value : 0)}`
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
          console.error("Error fetching getSubchapterBudget:", error);
        });
    } catch (error) {
      setReportArray([]);

      console.error("Error fetching getSubchapterBudget:", error);
    }
  };

  useEffect(() => {
    if(reportOption==="subchapter")
    {
      getSubchapterBudget()
      setReportOption('')
    }
    
  }, [reportOption]);

  useEffect(
    ()=>{
       if(loadReport)
       {
        setLoadReport(false)
        generateReport(reportArray)
       }
       
    },[reportArray,loadReport]
  )

  return <div> <iframe id="ifmcontentstoprint" title="print" className="printOnly" /></div>;
};

export default SubchapterBudget;
