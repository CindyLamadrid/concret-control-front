import axios from "../../config/axiosConfig";
import { useContext, useState, useEffect } from "react";
import Hogan from "hogan.js";
import { ConstructionContext } from "../../context/constructionContext";
import { exportToExcel } from "../utils/excelExport";
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
  const { stageSelected,constructionSelected, company } = useContext(ConstructionContext);
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

const generateReport=(reportArray)=>{
  
     fetch(`${process.env.PUBLIC_URL}/templates/subchapterBudget.html`)
      .then((r) => r.text())
      .then(async (dataInfo) => {
            let logoSrc = "";
            const idCompany = company && (company.idCompany || company.IdCompany);
            if (idCompany) {
              try {
                const token = localStorage.getItem("token");
                const resp = await axios.get(
                  `${process.env.REACT_APP_SECURITY_URL_API}/company-logo`,
                  { params: { idCompany }, headers: { Authorization: `Bearer ${token}` }, responseType: "arraybuffer" }
                );
                if (resp.data && resp.data.byteLength > 0) {
                  const contentType = resp.headers["content-type"] || "image/png";
                  const base64 = btoa(new Uint8Array(resp.data).reduce((d, b) => d + String.fromCharCode(b), ""));
                  logoSrc = `data:${contentType};base64,${base64}`;
                }
              } catch (e) { /* sin logo */ }
            }
            const newTemplates = Hogan.compile(dataInfo);
            const data ={
               list:reportArray,
               projectName: constructionSelected.name,
               stageName : stageSelected.name,
               totalValue: commom.getMoneyFomat(commom.getTotals(reportArray,"value")),
               date:new Date( Date.now()).toDateString(),
               logoSrc,
            }
            const htmlOutput = newTemplates.render(data);
            printReport(htmlOutput)
      })
}

  const getSubchapterBudgetExcel = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/subchapter-budget`, {
        params: { idStage: stageSelected.idStage, type: stageSelected.budgetType },
      })
      .then(async (result) => {
        if (result && result.data && result.data.length > 0) {
          const ExcelJS = (await import("exceljs")).default;
          const { saveAs } = await import("file-saver");

          const wb = new ExcelJS.Workbook();
          const ws = wb.addWorksheet("Capítulos");

          const colWidths = [16, 40, 18];
          colWidths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });

          const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBDD7EE" } };
          const TOTAL_FILL  = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD0D0D0" } };
          const moneyFmt = '$#,##0.00';

          const colRow = ws.addRow(["CÓDIGO", "DESCRIPCIÓN", "VALOR"]);
          colRow.eachCell((cell) => {
            cell.fill = HEADER_FILL;
            cell.font = { bold: true };
            cell.alignment = { horizontal: "center" };
          });

          result.data.forEach((x) => {
            const r = ws.addRow([x.cod || "", x.description || "", x.value || 0]);
            r.getCell(3).numFmt = moneyFmt;
          });

          const grandTotal = commom.getTotals(result.data, "value");
          const totRow = ws.addRow(["TOTAL PRESUPUESTO", "", grandTotal]);
          totRow.eachCell((cell) => { cell.fill = TOTAL_FILL; });
          totRow.getCell(1).font = { bold: true };
          totRow.getCell(3).numFmt = moneyFmt;

          const buffer = await wb.xlsx.writeBuffer();
          saveAs(new Blob([buffer]), `Capitulos_${stageSelected.name}.xlsx`);
        }
        setReportOption("");
      })
      .catch((error) => {
        console.error("Error fetching excel subchapterBudget:", error);
        setReportOption("");
      });
  };

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
    if (reportOption && reportOption.name === "subchapter") {
      if (reportOption.type === "excel") {
        getSubchapterBudgetExcel();
      } else {
        getSubchapterBudget(reportOption.type);
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

export default SubchapterBudget;
