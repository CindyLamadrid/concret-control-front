import { useEffect, useState, useContext } from "react";
import axios from "../config/axiosConfig";
import { ConstructionContext } from "../context/constructionContext";
import AdminSelectOptions from "../components/commons/adminSelectOptions";
import AdminOrder from "../components/orders/adminOrder";
import OrderTable from "../components/order/orderTable";

const Orders = () => {
  const { stageSelected } = useContext(ConstructionContext);
  const [supplier, setSupplier] = useState("");
  const [suppliersArray, setSuppliersArray] = useState([]);
  const [orderArray, setOrderArray] = useState([]);
  const [noData, setNoData] = useState(false);
  const [adminOrder, setAdminOrder] = useState({ show: false, order: "", action: "" });
  const [messageResultOperation, setMessageResultOperation] = useState("");

  const getSuppliers = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/suppliers`
      );
      if (result && result.data && result.data.length > 0) {
        setSuppliersArray(result.data);
        setNoData(false);
      } else {
        setSuppliersArray([]);
        setNoData(true);
      }
    } catch (error) {
      setSuppliersArray([]);
      console.error("Error fetching suppliers:", error);
    }
  };

  const onSearchOrders = async () => {
    if (!supplier) return;
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/orders`,
        {
          params: { idStage: stageSelected.idStage, idSupplier: parseInt(supplier.value, 10) },
        }
      );
      if (result && result.data && result.data.length > 0) {
        setOrderArray(result.data);
        setNoData(false);
      } else {
        setOrderArray([]);
        setNoData(true);
      }
    } catch (error) {
      setOrderArray([]);
      setNoData(true);
      console.error("Error fetching orders:", error);
    }
  };

  const onNewOrder = () => {
    setMessageResultOperation("");
    setAdminOrder({ show: true, order: "", action: "new" });
  };

  const onCloseAdminOrder = () => {
    setAdminOrder({ show: false, order: "", action: "" });
    setMessageResultOperation("");
  };

  const onSaveOrder = async (order, action) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${action === "edit" ? "update-order" : "create-order"}`,
        { ...order, idStage: stageSelected.idStage }
      );
      if (result && result.data) {
        setAdminOrder({ show: false, order: "", action: "" });
        await onSearchOrders();
      }
    } catch (error) {
      setMessageResultOperation("Error al guardar la orden");
      console.error("Error saving order:", error);
    }
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  return (
    <div>
      <div className="header-title">
        <span>ÓRDENES</span>
      </div>
      <AdminSelectOptions
        options={suppliersArray}
        value={supplier}
        setValue={setSupplier}
        onSearch={onSearchOrders}
        onNewOption={onNewOrder}
        onCancelOption={() => {}}
        labelOption="Crear Nueva Orden"
        hideCancelOption
      />
      {adminOrder.show && (
        <div className="modal show modal-xl" style={{ display: "block", position: "initial" }}>
          <AdminOrder
            adminOrder={adminOrder}
            messageResultOperation={messageResultOperation}
            onSaveOrder={onSaveOrder}
            onCloseAdminOrder={onCloseAdminOrder}
          />
        </div>
      )}
      {noData && <div>La búsqueda no arrojó resultados</div>}
      {orderArray && orderArray.length > 0 && (
        <div>
          <div className="subtitle">
            <span>LISTADO DE ÓRDENES</span>
          </div>
          <OrderTable orderArray={orderArray} />
        </div>
      )}
    </div>
  );
};

export default Orders;
