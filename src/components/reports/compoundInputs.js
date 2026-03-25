import axios from "../../config/axiosConfig";
import { useContext, useState, useEffect } from "react";
import Hogan from "hogan.js";
import { ConstructionContext } from "../../context/constructionContext";
import { exportToExcel } from "../utils/excelExport";
const commom = require('../utils/common')
 
const CompoundInputs = ({reportOption,setReportOption}) => {
  const { stageSelected,constructionSelected } = useContext(ConstructionContext);
  const [reportArray, setReportArray] =useState([]);
  const [loadReport, setLoadReport] =useState(false);

  const printReport = (report) => {
    const newTab = window.open("", "_blank");
    newTab.document.body.innerHTML= report;
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
     fetch(`${process.env.PUBLIC_URL}/templates/compoundItems.html`)
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

  const getCompoundInputsExcel = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/input-compound-budget`, {
        params: { idStage: stageSelected.idStage, type: stageSelected.budgetType },
      })
      .then(async (result) => {
        if (result && result.data && result.data.length > 0) {
          const ExcelJS = (await import("exceljs")).default;
          const { saveAs } = await import("file-saver");

          const wb = new ExcelJS.Workbook();
          const ws = wb.addWorksheet("Insumos Compuestos");

          const colWidths = [16, 30, 10, 10, 10, 18, 18];
          colWidths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });

          const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBDD7EE" } };
          const GROUP_FILL  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD6E4F0" } };
          const TOTAL_FILL  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD0D0D0" } };
          const moneyFmt = '#,##0.00';

          const groups = createArrayData(result.data);

          groups.forEach((group) => {
            const grpRow = ws.addRow([`${group.compoundMainCod} - ${group.compoundMain}`]);
            ws.mergeCells(`A${grpRow.number}:G${grpRow.number}`);
            grpRow.getCell(1).fill = GROUP_FILL;
            grpRow.getCell(1).font = { bold: true };
            grpRow.getCell(1).alignment = { horizontal: "left" };

            const colRow = ws.addRow(["CÓDIGO", "DESCRIPCIÓN", "UNIDAD", "CANTIDAD", "FACTOR", "VALOR", "TOTAL"]);
            colRow.eachCell((cell) => {
              cell.fill = HEADER_FILL;
              cell.font = { bold: true };
              cell.alignment = { horizontal: "center" };
            });

            group.inputs.forEach((inp) => {
              const r = ws.addRow([inp.cod, inp.name, inp.unit, inp.quantity, inp.waste, inp.unitValue, inp.totalInput]);
              r.getCell(6).numFmt = moneyFmt;
              r.getCell(7).numFmt = moneyFmt;
            });

            const totalVal = commom.getTotals(group.inputs, "totalInput");
            const totRow = ws.addRow(["TOTAL", "", "", "", "", "", totalVal]);
            totRow.eachCell((cell) => { cell.fill = TOTAL_FILL; });
            totRow.getCell(1).font = { bold: true };
            totRow.getCell(7).numFmt = moneyFmt;

            ws.addRow([]);
          });

          const buffer = await wb.xlsx.writeBuffer();
          saveAs(new Blob([buffer]), `InsumosCompuestos_${stageSelected.name}.xlsx`);
        }
        setReportOption("");
      })
      .catch((error) => {
        console.error("Error fetching excel compoundInputs:", error);
        setReportOption("");
      });
  };

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
    if (reportOption && reportOption.name === "compoundInputs") {
      if (reportOption.type === "excel") {
        getCompoundInputsExcel();
      } else {
        getCompundInputsBudget();
      }
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
