import axios from "axios";
import {  useContext, useState ,useEffect} from "react";
import Hogan from "hogan.js";
import { ConstructionContext } from "../../context/constructionContext";
import Items from "../../containers/items";
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
     fetch("/templates/itemsInputs.html")
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

  const getItemsInputsBudget = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_BUDGET_URL_API}/items-input-budget`, {
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
    if(reportOption && reportOption.name==="itemsInputs")
    {
      getItemsInputsBudget()
      
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
