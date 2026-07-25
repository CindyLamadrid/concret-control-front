import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate, createSearchParams } from "react-router-dom";
import axios from "../config/axiosConfig";
import { ConstructionContext } from "../context/constructionContext";
import AdminSelectOptions from "../components/commons/adminSelectOptions";
import AdminOrder from "../components/orders/adminOrder";
import AdminOrderEdit from "../components/orders/adminOrderEdit";
import OrderTable from "../components/order/orderTable";

const Orders = () => {
  const { user, stageSelected } = useContext(ConstructionContext);
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get("type"));

  const [supplier, setSupplier] = useState("");
  const [suppliersArray, setSuppliersArray] = useState([]);
  const [orderArray, setOrderArray] = useState([]);
  const [noData, setNoData] = useState(false);

  const [adminOrder, setAdminOrder] = useState({ show: false, order: "", action: "" });
  const [adminOrderEdit, setAdminOrderEdit] = useState({ show: false, order: "" });
  const [messageResultOperation, setMessageResultOperation] = useState("");

  const getSuppliers = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/suppliers`);
      if (result?.data?.length > 0) {
        setSuppliersArray(result.data);
      } else {
        setSuppliersArray([]);
      }
    } catch (error) {
      setSuppliersArray([]);
      console.error("Error fetching suppliers:", error);
    }
  };

  const onSearchOrders = async () => {
    if (!supplier) return;
    try {
      const result = await axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/orders-supplier`, {
        params: { idStage: stageSelected.idStage, idSupplier: parseInt(supplier.value, 10), type },
      });
      if (result?.data?.length > 0) {
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
        `${process.env.REACT_APP_BUDGET_URL_API}/create-order`,
        { ...order, idStage: stageSelected.idStage, idSupplier: parseInt(supplier.value, 10), type, user }
      );
      if (result?.data) {
        setAdminOrder({ show: false, order: "", action: "" });
        await onSearchOrders();
      }
    } catch (error) {
      setMessageResultOperation("Error al guardar la orden");
      console.error("Error saving order:", error);
    }
  };

  const navigate = useNavigate();

  const onEditOrder = (index) => {
    setMessageResultOperation("");
    if (index > -1) {
      setAdminOrderEdit({ show: true, order: orderArray[index] });
    }
  };

  const onViewDetail = (index) => {
    if (index > -1) {
      const order = orderArray[index];
      const params = createSearchParams({
        idOrder: order.idOrder,
        idSupplier: supplier.value,
        type,
      });
      navigate(`/order-inputs?${params.toString()}`);
    }
  };

  const onCloseAdminOrderEdit = () => {
    setAdminOrderEdit({ show: false, order: "" });
    setMessageResultOperation("");
  };

  const onSaveOrderEdit = async (orderEdit) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/update-order`,
        { ...orderEdit, user }
      );
      if (result?.data) {
        setAdminOrderEdit({ show: false, order: "" });
        await onSearchOrders();
      }
    } catch (error) {
      setMessageResultOperation("Error al guardar la orden");
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  useEffect(() => {
    const newType = searchParams.get("type");
    if (type !== newType) {
      setType(newType);
      setOrderArray([]);
    }
  }, [searchParams]);

  return (
    <div>
      <div className="header-title">
        <span>ÓRDENES DE PAGO</span>
      </div>
      <AdminSelectOptions
        options={suppliersArray}
        value={supplier}
        setValue={setSupplier}
        onSearch={onSearchOrders}
        onNewOption={onNewOrder}
        onCancelOption={() => {}}
        labelOption="Crear Orden de Pago"
        hideCancelOption
      />

      {adminOrder.show && (
        <div className="modal show modal-xl modal-inline">
          <AdminOrder
            adminOrder={adminOrder}
            messageResultOperation={messageResultOperation}
            onSaveOrder={onSaveOrder}
            onCloseAdminOrder={onCloseAdminOrder}
          />
        </div>
      )}

      {adminOrderEdit.show && (
        <div className="modal show modal-xl modal-inline">
          <AdminOrderEdit
            adminOrderEdit={adminOrderEdit}
            messageResultOperation={messageResultOperation}
            onSaveOrderEdit={onSaveOrderEdit}
            onCloseAdminOrderEdit={onCloseAdminOrderEdit}
          />
        </div>
      )}

      {noData && <div>La búsqueda no arrojó resultados</div>}

      {orderArray?.length > 0 && (
        <div>
          <div className="subtitle"><span>LISTADO DE ÓRDENES</span></div>
          <OrderTable orderArray={orderArray} onEditOrder={onEditOrder} onViewDetail={onViewDetail} />
        </div>
      )}
    </div>
  );
};

export default Orders;
