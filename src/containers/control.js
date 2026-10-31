import { useEffect, useState, useContext } from "react";
import { ConstructionContext } from "../context/constructionContext";
import ChapterHeader from '../components/chaptersHeader';
import ChapterControl from "../components/control/chapterControl";
import InputControl from "../components/control/inputControl"
import Resume from "../components/commons/resume";
import WarehouseInventory from "../components/warehouse/warehouseInventory";

const TABS = {
  CONTROL: "control",
  INVENTORY: "inventory",
};

const Control = ({}) => {
  const { constructionSelected, stageSelected } = useContext(ConstructionContext);
  const [option, setOption] = useState("chapter");
  const [chapterSelected, setChapterSelected] = useState(-1)
  const [subchapterSelected, setSubchapterSelected] = useState(-1)
  const [tab, setTab] = useState(TABS.CONTROL);

   useEffect(
        () => {
          
            const chapterValues = localStorage.getItem("chapterValues")
            if(chapterValues )
            {
                const values =JSON.parse(chapterValues)
                const newChapterSelected =  parseInt(values.chapterSelected)
                const newSubchapterSelected =parseInt(values.subchapterSelected)
              
                setChapterSelected(newChapterSelected)
                setSubchapterSelected(newSubchapterSelected)
            }else
            {  setChapterSelected(0)
               setSubchapterSelected(0)
            }
        }, []
    )

  useEffect(
    ()=>{
    
      // if (subchapterSelected>-1)
       // setOption("inputControl")
        //getInputControl(subchapterSelected)
    },[subchapterSelected]
  )

  const onSetChapterSelected=(idChapter)=>{
    setOption("input-control")
    setChapterSelected(idChapter)
  }

  const idStage = stageSelected?.idStage;

  return (<>
     <Resume
       constructionSelected={constructionSelected}
       stageSelected={stageSelected}
     />

    {/* Botones: Control de Costos | Inventario (Almacén) */}
    <div className="d-flex" style={{ gap: "8px", marginBottom: "12px" }}>
      <button type="button" className={tab === TABS.CONTROL ? "primary" : "secondary"} onClick={() => setTab(TABS.CONTROL)}>
        <i className="fas fa-coins" /> Control de Costos
      </button>
      <button type="button" className={tab === TABS.INVENTORY ? "primary" : "secondary"} onClick={() => setTab(TABS.INVENTORY)}>
        <i className="fas fa-boxes" /> Inventario Almacén
      </button>
    </div>

    {/* Control de Costos (flujo actual) */}
    {tab === TABS.CONTROL && (
      <>
        {option !== 'chapter' && (
          <ChapterHeader
            chapterSelected={chapterSelected}
            subchapterSelected={subchapterSelected}
            setSubchapterSelected={setSubchapterSelected}
            setChapterSelected={setChapterSelected}
            setShowOption={() => {}}
          />
        )}
        {option === "chapter" && (
          <ChapterControl onSetChapterSelected={onSetChapterSelected} />
        )}
        {option === "input-control" && (
          <InputControl
            subchapterSelected={subchapterSelected}
            onBack={() => setOption("chapter")}
          />
        )}
      </>
    )}

    {/* Almacén — Inventario consolidado */}
    {tab === TABS.INVENTORY && (
      <WarehouseInventory idStage={idStage} />
    )}
    </>)
};
export default Control;
