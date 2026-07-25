import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../config/axiosConfig";
import { ConstructionContext } from "../context/constructionContext";
import Back from "../components/commons/back";
import OrderInputsTable from "../components/orders/orderInputsTable";
import AddOrderInput from "../components/orders/addOrderInput";

const OrderInputs = () => {
  const { user, stageSelected } = useContext(ConstructionContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read params directly from searchParams — never stale
  const idOrder    = searchParams.get("idOrder");
  const idSupplier = searchParams.get("idSupplier");
  const type       = searchParams.get("type");

  const [orderInputsArray, setOrderInputsArray] = useState([]);
  const [addModal, setAddModal] = useState(false);

  const getOrderInputs = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/order-inputs`, {
        params: { idOrder },
      })
      .then((result) => {
        if (result?.data?.length > 0) {
          const data = result.data.map((x) => ({
            ...x,
            originalQuantity:   parseFloat(x.quantity),
            originalUnitValue:  parseFloat(x.unitValue),
            originalIvaPercent: parseFloat(x.ivaPercent) || 0,
            quantityChanged:    false,
            unitValueChanged:   false,
            ivaPercentChanged:  false,
            editing: false,
          }));
          setOrderInputsArray(data);
        } else {
          setOrderInputsArray([]);
        }
      })
      .catch((error) => {
        setOrderInputsArray([]);
        console.error("Error fetching getOrderInputs:", error);
      });
  };

  const onBack = () => {
    navigate(`/orders?idSupplier=${idSupplier}&type=${type}`);
  };

  const onChangeField = (event, index, field) => {
    const arr = [...orderInputsArray];
    const row = { ...arr[index] };

    if (field === "__focus") {
      row.editing = true;
    } else if (field === "__blur") {
      row.editing = false;
    } else {
      row[field] = event.target.value;
      // Compare new string value against numeric original — both as floats
      row.quantityChanged   = parseFloat(row.quantity)   !== row.originalQuantity;
      row.unitValueChanged  = parseFloat(row.unitValue)  !== row.originalUnitValue;
      row.ivaPercentChanged = parseFloat(row.ivaPercent) !== row.originalIvaPercent;
    }

    arr[index] = row;
    setOrderInputsArray([...arr]);
  };

  const onSaveRow = async (index) => {
    const row = orderInputsArray[index];
    try {
      await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/update-order-input`, {
        idOrderInput:   row.idOrderInput,
        quantity:       parseFloat(row.quantity)       || 0,
        unitValue:      parseFloat(row.unitValue)      || 0,
        ivaPercent:     parseFloat(row.ivaPercent)     || 0,
        reteFtePercent: parseFloat(row.reteFtePercent) || 0,
        reteIvaPercent: parseFloat(row.reteIvaPercent) || 0,
        reteIcaPercent: parseFloat(row.reteIcaPercent) || 0,
        user,
      });
      // Update only this row — clear flags, update originals
      const arr = [...orderInputsArray];
      const saved = arr[index];
      arr[index] = {
        ...saved,
        originalQuantity:   parseFloat(saved.quantity),
        originalUnitValue:  parseFloat(saved.unitValue),
        originalIvaPercent: parseFloat(saved.ivaPercent) || 0,
        quantityChanged:    false,
        unitValueChanged:   false,
        ivaPercentChanged:  false,
        editing:            false,
      };
      setOrderInputsArray([...arr]);
    } catch (error) {
      console.error("Error saving order input:", error);
    }
  };

  const onRefresh = (index) => {
    // Revert this row to its saved originals — no server call
    const arr = [...orderInputsArray];
    const row = arr[index];
    arr[index] = {
      ...row,
      quantity:          row.originalQuantity,
      unitValue:         row.originalUnitValue,
      ivaPercent:        row.originalIvaPercent,
      quantityChanged:   false,
      unitValueChanged:  false,
      ivaPercentChanged: false,
      editing:           false,
    };
    setOrderInputsArray([...arr]);
  };

  const onSaveInputs = async (idContract, selectedIds) => {
    try {
      await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/create-order-inputs`, {
        idOrder,
        idContract,
        idContractInputs: selectedIds.join(","),
        user,
      });
      setAddModal(false);
      getOrderInputs();
    } catch (error) {
      console.error("Error saving order inputs:", error);
    }
  };

  useEffect(() => {
    if (idOrder) getOrderInputs();
  }, [idOrder]);

  return (
    <div>
      <div>
        <Back onBack={onBack} />
        &nbsp;&nbsp;
        <button type="button" className="primary" onClick={() => setAddModal(true)}>
          Agregar Insumo
        </button>
      </div>

      <div className="header-title mt-8">
        <span>INSUMOS DE ORDEN DE PAGO</span>
      </div>

      <OrderInputsTable
        orderInputsArray={orderInputsArray}
        onChangeField={onChangeField}
        onSaveRow={onSaveRow}
        onRefresh={onRefresh}
      />

      {addModal && (
        <div className="modal show modal-xl modal-inline">
          <AddOrderInput
            idOrder={idOrder}
            idSupplier={idSupplier}
            type={type}
            stageSelected={stageSelected}
            onSave={onSaveInputs}
            onClose={() => setAddModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default OrderInputs;
