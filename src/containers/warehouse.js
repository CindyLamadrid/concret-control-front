import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import Resume from "../components/commons/resume";
import WarehousePanel from "../components/warehouse/warehousePanel";
import WarehouseInventory from "../components/warehouse/warehouseInventory";

const TABS = {
  ENTRIES: "entries",
  EXITS: "exits",
  STOCK: "stock",
};

const Warehouse = () => {
  const { stageSelected, constructionSelected } = useContext(ConstructionContext);
  const [searchParams] = useSearchParams();

  const idStage = stageSelected?.idStage || searchParams.get("idStage");

  const [tab, setTab] = useState(searchParams.get("tab") || TABS.ENTRIES);

  // Sync tab if URL changes (menu navigation)
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t && t !== tab) setTab(t);
  }, [searchParams]);

  return (
    <div>
      <Resume constructionSelected={constructionSelected || {}} stageSelected={stageSelected || {}} />

      {/* Tabs */}
      <div className="d-flex" style={{ gap: "8px", marginBottom: "12px" }}>
        <button type="button" className={tab === TABS.ENTRIES ? "primary" : "secondary"} onClick={() => setTab(TABS.ENTRIES)}>
          <i className="fas fa-arrow-down" /> Entradas
        </button>
        <button type="button" className={tab === TABS.EXITS ? "primary" : "secondary"} onClick={() => setTab(TABS.EXITS)}>
          <i className="fas fa-arrow-up" /> Salidas
        </button>
        <button type="button" className={tab === TABS.STOCK ? "primary" : "secondary"} onClick={() => setTab(TABS.STOCK)}>
          <i className="fas fa-boxes" /> Inventario
        </button>
      </div>

      {tab === TABS.ENTRIES && <WarehousePanel idStage={idStage} mode="entries" />}
      {tab === TABS.EXITS && <WarehousePanel idStage={idStage} mode="exits" />}
      {tab === TABS.STOCK && <WarehouseInventory idStage={idStage} />}
    </div>
  );
};

export default Warehouse;
