import axios from "../../config/axiosConfig";
import { useContext, useState, useEffect } from "react";
import Hogan from "hogan.js";
import { ConstructionContext } from "../../context/constructionContext";
import { exportToExcel } from "../utils/excelExport";
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
     fetch(`${process.env.PUBLIC_URL}/templates/inputs.html`)
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

  const getInputsBudgetExcel = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/inputs-budget`, {
        params: { idStage: stageSelected.idStage, type: stageSelected.budgetType },
      })
      .then(async (result) => {
        if (result && result.data && result.data.length > 0) {
          const ExcelJS = (await import("exceljs")).default;
          const { saveAs } = await import("file-saver");

          const wb = new ExcelJS.Workbook();
          const ws = wb.addWorksheet("Insumos");

          const colWidths = [16, 30, 12, 12, 18, 18];
          colWidths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });

          const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBDD7EE" } };
          const TOTAL_FILL  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD0D0D0" } };
          const moneyFmt = '$#,##0.00';

          const colRow = ws.addRow(["CÓDIGO", "DESCRIPCIÓN", "UNIDAD", "CANTIDAD", "VALOR", "TOTAL"]);
          colRow.eachCell((cell) => {
            cell.fill = HEADER_FILL;
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center" };
          });

          result.data.forEach((x) => {
            const r = ws.addRow([
              x.cod || "", x.inputName || "", x.unitName || "",
              x.totalQuantity || 0, x.unitValue || 0, x.total || 0,
            ]);
            r.getCell(5).numFmt = moneyFmt;
            r.getCell(6).numFmt = moneyFmt;
          });

          const grandTotal = commom.getTotals(result.data, "total");
          const totRow = ws.addRow(["TOTAL PRESUPUESTO", "", "", "", "", grandTotal]);
          totRow.eachCell((cell) => { cell.fill = TOTAL_FILL; });
          totRow.getCell(1).font = { bold: true };
          totRow.getCell(6).numFmt = moneyFmt;

          const buffer = await wb.xlsx.writeBuffer();
          saveAs(new Blob([buffer]), `Insumos_${stageSelected.name}.xlsx`);
        }
        setReportOption("");
      })
      .catch((error) => {
        console.error("Error fetching excel inputsBudget:", error);
        setReportOption("");
      });
  };

  const getInputsBudget = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_BUDGET_URL_API}/inputs-budget`, {
          params: { idStage: stageSelected.idStage,type: stageSelected.budgetType },
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
    if (reportOption && reportOption.name === "inputs") {
      if (reportOption.type === "excel") {
        getInputsBudgetExcel();
      } else {
        getInputsBudget();
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

export default InputsBudget;
