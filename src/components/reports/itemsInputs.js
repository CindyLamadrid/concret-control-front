import axios from "../../config/axiosConfig";
import { useContext, useState, useEffect } from "react";
import Hogan from "hogan.js";
import { ConstructionContext } from "../../context/constructionContext";
import { exportToExcel } from "../utils/excelExport";
const commom = require('../utils/common')
 
const ItemsInputs = ({reportOption,setReportOption}) => {
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
    const items =[]
   
   array.forEach(i => {
     const exists = items.findIndex(x=> x.idItem===i.idItem)
    
     if(exists ===-1)
     {
      
       let showSubchapter =  true;
        console.log("i.subChapter===",i.chapter);
        console.log("items===",items);
      
       if (items.length>0 && i.chapter=== items[items.length-1].chapter )
       {
        
         console.log("items[items.length-1].subChapter===",items[items.length-1].subChapter);
          showSubchapter =  false;
       }

        const inputs = array.filter(x=>x.idItem===i.idItem).map(
            (y)=>
            {
                return {
                    cod: y.cod,
                   
                    description : y.name,
                    unitValue :  commom.getMoneyFomat(y.unitValue) ,
                    unit:y.unit,
                    quantity :y.quantity,
                    waste: y.waste,
                    totalInput:  commom.getMoneyFomat(y.totalInput),
                    totalQuantity: y.totalQuantity,
                    value:y.totalInput
                }
            }
               
        )
        items.push(
            {
                idItem: i.idItem,
                itemName: i.itemName,
                itemCod: i.itemCod,
                unitItem:i.unitItem,
                quantityItem:i.quantityItem,
                inputs ,
                totalValue: commom.getMoneyFomat(commom.getTotals(inputs,"value") ),
                total: commom.getMoneyFomat(commom.getTotals(inputs,"value") * i.quantityItem),
                chapter :i.chapter,
                chapterReport: showSubchapter? `CAPITULO: ${i.chapterCod} - ${i.chapter}`:'',
              
            }
        )
     }
   });

   return items
}

const generateReport=(reportArray)=>{
  const timezone =  new Date().toLocaleTimeString();
     fetch(`${process.env.PUBLIC_URL}/templates/itemsInputs.html`)
      .then((r) => r.text())
      .then((dataInfo) => {
            const newTemplates = Hogan.compile(dataInfo);
            const data ={
               items:createArrayData(reportArray),
               projectName: constructionSelected.name,
               stageName : stageSelected.name,
               totalValue: commom.getMoneyFomat(commom.getTotals(reportArray,"value")),
               date:new Date( Date.now()).toDateString()
            }
            const htmlOutput = newTemplates.render(data);
            printReport(htmlOutput)
           
      })
}

  const getItemsInputsExcel = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/items-input-budget`, {
        params: { idStage: stageSelected.idStage, type: stageSelected.budgetType },
      })
      .then(async (result) => {
        if (result && result.data && result.data.length > 0) {
          const ExcelJS = (await import("exceljs")).default;
          const { saveAs } = await import("file-saver");

          const wb = new ExcelJS.Workbook();
          const ws = wb.addWorksheet("Items Insumos");

          const COLS = ["CAPÍTULO","CÓDIGO A.P.U","A.P.U","CÓDIGO INSUMO","DESCRIPCIÓN","UNIDAD","CANTIDAD","FACTOR","VALOR","TOTAL","CANT. T."];
          const COL_KEYS = ["chapter","itemCod","itemName","cod","name","unit","quantity","waste","unitValue","totalInput","value"];

          const HEADER_COL_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBDD7EE" } }; // azul pastel claro

          // Set column widths without headers
          const colWidths = [18,16,30,16,30,10,10,10,18,18,10];
          colWidths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });

          const CHAPTER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD6E4F0" } };
          const APU_FILL     = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F4FD" } };
          const TOTAL_FILL   = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD0D0D0" } };

          const moneyFmt = '#,##0.00';

          const items = createArrayData(result.data);
          let currentChapter = null;

          items.forEach((item) => {
            // Chapter header row when chapter changes
            if (item.chapterReport && item.chapter !== currentChapter) {
              currentChapter = item.chapter;
              const chRow = ws.addRow([item.chapterReport]);
              ws.mergeCells(`A${chRow.number}:K${chRow.number}`);
              chRow.getCell(1).fill = CHAPTER_FILL;
              chRow.getCell(1).font = { bold: true };
              chRow.getCell(1).alignment = { horizontal: "left" };
            }

            // A.P.U header row — all from col A
            const apuRow = ws.addRow([`A.P.U: ${item.itemCod} - ${item.itemName}`]);
            ws.mergeCells(`A${apuRow.number}:K${apuRow.number}`);
            apuRow.getCell(1).fill = APU_FILL;
            apuRow.getCell(1).font = { italic: true };
            apuRow.getCell(1).alignment = { horizontal: "left" };

            // Column headers for this APU block — all from col A
            const colRow = ws.addRow(["CÓDIGO INSUMO","DESCRIPCIÓN","UNIDAD","CANTIDAD","FACTOR","VALOR","TOTAL","CANT. T."]);
            colRow.eachCell((cell) => {
              cell.fill = HEADER_COL_FILL;
              cell.font = { bold: true, color: { argb: "FF000000" } };
              cell.alignment = { horizontal: "center" };
            });

            // Input rows — all from col A
            item.inputs.forEach((inp) => {
              const r = ws.addRow([
                inp.cod, inp.description, inp.unit,
                inp.quantity, inp.waste,
                inp.value,
                inp.value,
                inp.totalQuantity,
              ]);
              r.getCell(6).numFmt = moneyFmt;
              r.getCell(7).numFmt = moneyFmt;
            });

            // Total A.P.U row — all from col A
            const totalInputsValue = commom.getTotals(item.inputs, "value");
            const totalRow = ws.addRow([
              "Total A.P.U", "", item.unitItem,
              item.quantityItem, "",
              totalInputsValue,
              totalInputsValue * item.quantityItem,
              "",
            ]);
            totalRow.eachCell((cell) => { cell.fill = TOTAL_FILL; });
            totalRow.getCell(1).font = { bold: true };
            totalRow.getCell(6).numFmt = moneyFmt;
            totalRow.getCell(7).numFmt = moneyFmt;

            ws.addRow([]); // blank spacer
          });

          const buffer = await wb.xlsx.writeBuffer();
          saveAs(new Blob([buffer]), `ItemsInsumos_${stageSelected.name}.xlsx`);
        }
        setReportOption("");
      })
      .catch((error) => {
        console.error("Error fetching excel itemsInputs:", error);
        setReportOption("");
      });
  };

  const getItemsInputsBudget = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_BUDGET_URL_API}/items-input-budget`, {
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
    if (reportOption && reportOption.name === "itemsInputs") {
      if (reportOption.type === "excel") {
        getItemsInputsExcel();
      } else {
        getItemsInputsBudget();
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

export default ItemsInputs;
