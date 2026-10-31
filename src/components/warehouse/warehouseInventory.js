import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import WarehouseStockTable from "./warehouseStockTable";

/**
 * Inventario consolidado del almacen: una sola tabla por insumo con
 * entradas, salidas, saldo, valor, total, ultima entrada y ultima salida.
 */
const WarehouseInventory = ({ idStage }) => {
  const [stockArray, setStockArray] = useState([]);
  const base = process.env.REACT_APP_BUDGET_URL_API;

  const getStock = () => {
    if (!idStage) return;
    axios
      .get(`${base}/warehouse-stock`, { params: { idStage } })
      .then((result) => setStockArray(result?.data?.length > 0 ? result.data : []))
      .catch((e) => {
        setStockArray([]);
        console.error("Error fetching stock:", e);
      });
  };

  useEffect(() => {
    getStock();
  }, [idStage]);

  return (
    <div>
      <div className="header-title">
        <span>INVENTARIO DE ALMACÉN</span>
        <span className="subheader-title">&nbsp;&nbsp;&nbsp;{stockArray.length} Insumo(s)</span>
      </div>
      <WarehouseStockTable stockArray={stockArray} />
    </div>
  );
};

export default WarehouseInventory;
