import axios from "axios";
import {  useContext, useState ,useEffect,useRef} from "react";
import html2pdf from 'html2pdf.js';
import Hogan from "hogan.js";
import { ConstructionContext } from "../../context/constructionContext";
import Reports from "../../containers/reports";
const commom = require('../utils/common')


// const pdf=(report)=>{
//    const options = {
//       filename: 'my-document.pdf',
//       margin: 1,
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: {
//         unit: 'in',
//         format: 'letter',
//         orientation: 'portrait',
//       },
//     };

//     html2pdf().set(options).from(report).save();
// }
 
const SubchapterBudget = ({reportOption,setReportOption}) => {
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

    //const newTab = window.open("", "_blank");
    //newTab.document.write(pdf(report));
    //newTab.document.close(); 
   
    //    setTimeout(() => {
    //   newTab.print();
    // }, 1000);
    // const pri = document.getElementById("ifmcontentstoprint").contentWindow;
    // pri.document.open();
    // pri.document.write(report);
    // pri.document.close();
    // pri.focus();
    // setTimeout(() => {
    //   pri.print();
    // }, 1000);

    //const content = contentRef.current;

  };

const generateReport=(reportArray)=>{
  const timezone =  new Date().toLocaleTimeString();
     fetch("/templates/subchapterBudget.html")
      .then((r) => r.text())
      .then((dataInfo) => {
            const newTemplates = Hogan.compile(dataInfo);
            const data ={
               list:reportArray,
               projectName: constructionSelected.name,
               stageName : stageSelected.name,
               totalValue: commom.getMoneyFomat(commom.getTotals(reportArray,"value")),
               date:new Date( Date.now()).toDateString()
            }
            const htmlOutput = newTemplates.render(data);
            printReport(htmlOutput)
           
      })
}

  const getSubchapterBudget = () => {
    try {
     
      axios
        .get(`${process.env.REACT_APP_BUDGET_URL_API}/subchapter-budget`, {
          params: { idStage: stageSelected.idStage,type: stageSelected.budgetType },
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
    if(reportOption && reportOption.name==="subchapter")
    {
      getSubchapterBudget(reportOption.type)
     
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

export default SubchapterBudget;
