import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../config/axiosConfig";
import Hogan from "hogan.js";
import { ConstructionContext } from "../context/constructionContext";
import Back from "../components/commons/back";
import OrderInputsTable from "../components/orders/orderInputsTable";
import AddOrderInput from "../components/orders/addOrderInput";
import ResumeSupplier from "../components/commons/resumeSupplier";
import Notifications from "../components/commons/modal";
import ImputationProperties from "../components/commons/imputationProperties";

const common = require("../components/utils/common");

const OrderInputs = () => {
  const { user, stageSelected, constructionSelected } = useContext(ConstructionContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read params directly from searchParams — never stale
  const idOrder = searchParams.get("idOrder");
  const idSupplier = searchParams.get("idSupplier");
  const type = searchParams.get("type");

  const [orderInputsArray, setOrderInputsArray] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [validationModal, setValidationModal] = useState({ show: false, message: "" });
  const [chargesModal, setChargesModal] = useState({ show: false, index: null, item: null });

  const getOrderData = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/orders-supplier`, {
        params: { idStage: stageSelected.idStage, idSupplier: parseInt(idSupplier, 10), type },
      })
      .then((result) => {
        if (result?.data?.length > 0) {
          const found = result.data.find((o) => String(o.idOrder) === String(idOrder));
          setOrderData(found || result.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      });
  };

  const getOrderInputs = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/order-inputs`, {
        params: { idOrder },
      })
      .then((result) => {
        if (result?.data?.length > 0) {
          const data = result.data.map((x) => ({
            ...x,
            originalQuantity: parseFloat(x.quantity),
            originalUnitValue: parseFloat(x.unitValue),
            originalIvaPercent: parseFloat(x.ivaPercent) || 0,
            quantityChanged: false,
            unitValueChanged: false,
            ivaPercentChanged: false,
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
      row.quantityChanged = parseFloat(row.quantity) !== row.originalQuantity;
      row.unitValueChanged = parseFloat(row.unitValue) !== row.originalUnitValue;
      row.ivaPercentChanged = parseFloat(row.ivaPercent) !== row.originalIvaPercent;
    }

    arr[index] = row;
    setOrderInputsArray([...arr]);
  };

  const onSaveRow = async (index) => {
    const row = orderInputsArray[index];
    const qty = parseFloat(row.quantity) || 0;
    const val = parseFloat(row.unitValue) || 0;
    const maxQty = parseFloat(row.budgetQuantity) || 0;
    const maxVal = parseFloat(row.budgetUnitValue) || 0;

    let errors = [];
    if (maxQty > 0 && qty > maxQty) {
      errors.push(`La cantidad (${qty}) sobrepasa la del contrato (${maxQty})`);
    }
    if (maxVal > 0 && val > maxVal) {
      const fmtVal = val.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
      const fmtMax = maxVal.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
      errors.push(`El valor unitario (${fmtVal}) sobrepasa el del contrato (${fmtMax})`);
    }

    if (errors.length > 0) {
      setValidationModal({ show: true, message: errors.join(". ") });
      return;
    }
    setValidationModal({ show: false, message: "" });

    try {
      await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/update-order-input`, {
        idOrderInput: row.idOrderInput,
        quantity: parseFloat(row.quantity) || 0,
        unitValue: parseFloat(row.unitValue) || 0,
        ivaPercent: parseFloat(row.ivaPercent) || 0,
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
        originalQuantity: parseFloat(saved.quantity),
        originalUnitValue: parseFloat(saved.unitValue),
        originalIvaPercent: parseFloat(saved.ivaPercent) || 0,
        quantityChanged: false,
        unitValueChanged: false,
        ivaPercentChanged: false,
        editing: false,
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
      quantity: row.originalQuantity,
      unitValue: row.originalUnitValue,
      ivaPercent: row.originalIvaPercent,
      quantityChanged: false,
      unitValueChanged: false,
      ivaPercentChanged: false,
      editing: false,
    };
    setOrderInputsArray([...arr]);
  };

  const onRemoveInput = async (index) => {
    const row = orderInputsArray[index];
    try {
      await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/remove-order-input`, {
        idOrderInput: row.idOrderInput,
        user,
      });
      getOrderInputs();
    } catch (error) {
      console.error("Error removing order input:", error);
    }
  };

  const onImputation = (index) => {
    setChargesModal({ show: true, index, item: orderInputsArray[index] });
  };

  const onCloseCharges = () => {
    setChargesModal({ show: false, index: null, item: null });
  };

  const onHandleSaveImputation = async ({ stage, chapter, input, currentItem }) => {
    if (chargesModal.index !== null) {
      try {
        await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/update-contract-input`, {
          idContractInput: currentItem.idContractInput,
          idContract: currentItem.idContract,
          idInput: currentItem.idInput || null,
          idChapter: chapter.idChapter,
          idSubchapter: chapter.idSubchapter,
          idInputBudget: input ? input.value : null,
          idStage: stage ? stage.idStage : null,
          quantity: currentItem.budgetQuantity || currentItem.quantity,
          unitValue: currentItem.budgetUnitValue || currentItem.unitValue,
          user,
        });
        getOrderInputs();
      } catch (error) {
        console.error("Error updating imputation:", error);
      }
    }
    setChargesModal({ show: false, index: null, item: null });
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
    if (idOrder) {
      getOrderInputs();
      getOrderData();
    }
  }, [idOrder]);

  const getContractTypeName = () => {
    switch(type) {
      case 'L': return 'MANO DE OBRA';
      case 'S': return 'SERVICIOS';
      case 'M': return 'SUMINISTRO MATERIALES';
      case 'C': return 'CONSTRUCCIÓN';
      default: return '';
    }
  };

  const onPrint = () => {
    // Load logo from existing template
    const logoPromise = fetch(`${process.env.PUBLIC_URL}/templates/inputs.html`)
      .then((r) => r.text())
      .then((html) => {
        const match = html.match(/src="([^"]+)"/);
        return match ? match[1] : '';
      })
      .catch(() => '');

    const templatePromise = fetch(`${process.env.PUBLIC_URL}/templates/order.html`)
      .then((r) => r.text());

    Promise.all([templatePromise, logoPromise]).then(([dataInfo, logoSrc]) => {
      const template = Hogan.compile(dataInfo);
      const fmt = (v) => common.getMoneyFomat(v || 0);

      const inputs = orderInputsArray.map((x) => {
        const qty = parseFloat(x.quantity) || 0;
        const price = parseFloat(x.unitValue) || 0;
        const valor = qty * price;
        const iva = valor * (parseFloat(x.ivaPercent) || 0) / 100;
        const reteFte = valor * (parseFloat(x.reteFtePercent) || 0) / 100;
        const reteIva = valor * (parseFloat(x.reteIvaPercent) || 0) / 100;
        const reteIca = valor * (parseFloat(x.reteIcaPercent) || 0) / 100;
        const base = valor - reteFte - reteIva - reteIca;

        // Build imputation description: Etapa - Capitulo - Subcapitulo - Insumo Presupuesto
        const parts = [];
        if (x.stageName) parts.push(x.stageName);
        if (x.chapterName) parts.push(x.chapterName);
        if (x.subchapterName) parts.push(x.subchapterName);
        if (x.budgetInputName) parts.push(x.budgetInputName);
        const imputationDesc = parts.join(' - ');

        return {
          imputation: x.imputation || '',
          imputationDesc,
          contractInfo: `${x.contractNumber || ''} / A: ${x.administration || 0} - I: ${x.events || 0} - U: ${x.utility || 0}`,
          name: x.name || '',
          unit: x.unit || '',
          quantity: qty,
          unitValue: fmt(price),
          valor: fmt(valor),
          iva: fmt(iva),
          ivaPercent: x.ivaPercent || 0,
          reteFte: fmt(reteFte),
          reteIva: fmt(reteIva),
          reteIca: fmt(reteIca),
          base: fmt(base),
        };
      });

      const totalValor = orderInputsArray.reduce((s, x) => s + (parseFloat(x.quantity) || 0) * (parseFloat(x.unitValue) || 0), 0);
      const totalIva = orderInputsArray.reduce((s, x) => { const v = (parseFloat(x.quantity) || 0) * (parseFloat(x.unitValue) || 0); return s + v * (parseFloat(x.ivaPercent) || 0) / 100; }, 0);
      const totalReteFte = orderInputsArray.reduce((s, x) => { const v = (parseFloat(x.quantity) || 0) * (parseFloat(x.unitValue) || 0); return s + v * (parseFloat(x.reteFtePercent) || 0) / 100; }, 0);
      const totalReteIva = orderInputsArray.reduce((s, x) => { const v = (parseFloat(x.quantity) || 0) * (parseFloat(x.unitValue) || 0); return s + v * (parseFloat(x.reteIvaPercent) || 0) / 100; }, 0);
      const totalReteIca = orderInputsArray.reduce((s, x) => { const v = (parseFloat(x.quantity) || 0) * (parseFloat(x.unitValue) || 0); return s + v * (parseFloat(x.reteIcaPercent) || 0) / 100; }, 0);
      const totalBase = totalValor - totalReteFte - totalReteIva - totalReteIca;

      const data = {
        logoSrc,
        contractType: getContractTypeName(),
        projectName: constructionSelected?.name || '',
        stageName: stageSelected?.name || '',
        date: new Date().toLocaleDateString('es-CO'),
        supplierName: orderData?.supplierName || '',
        identification: orderData?.identification || '',
        phone: orderData?.phone || '',
        paymentMethod: orderData?.paymentMethod || '',
        billDate: orderData?.billDate || '',
        dueDate: orderData?.dueDate || '',
        billPrefix: orderData?.billPrefix || '',
        billNumber: orderData?.billNumber || '',
        cufe: orderData?.cufe || '',
        observations: orderData?.observations || '',
        inputs,
        totalValor: fmt(totalValor),
        totalIva: fmt(totalIva),
        totalReteFte: fmt(totalReteFte),
        totalReteIva: fmt(totalReteIva),
        totalReteIca: fmt(totalReteIca),
        totalBase: fmt(totalBase),
        totalGeneral: fmt(totalValor + totalIva),
      };

      const htmlOutput = template.render(data);
      const newTab = window.open("", "_blank");
      newTab.document.write(htmlOutput);
      newTab.document.close();
    });
  };

  return (
    <div>
      <ResumeSupplier
        constructionSelected={constructionSelected}
        supplier={null}
        order={orderData}
      />
      <div className="header-title">
        <span>INSUMOS DE ORDEN DE PAGO DE {type === 'L' ? 'MANO DE OBRA' : type === 'S' ? 'SERVICIOS' : type === 'M' ? 'SUMINISTRO MATERIALES' : type === 'C' ? 'CONSTRUCCIÓN' : ''}</span>
        <span className="subheader-title">&nbsp;&nbsp;&nbsp;{orderInputsArray.length} Insumo(s)</span>
      </div>


      <div className="d-flex justify-content-between align-items-center">
        <div>
          <Back onBack={onBack} />
          &nbsp;&nbsp;
          <button type="button" className="primary" onClick={() => setAddModal(true)}>
            <i className="fas fa-plus" /> Agregar Insumo
          </button>
        </div>
        <div>
          <button type="button" className="secondary" onClick={onPrint}>
            <i className="fas fa-print" /> Imprimir
          </button>
        </div>
      </div>

      <br />
      <OrderInputsTable
        orderInputsArray={orderInputsArray}
        onChangeField={onChangeField}
        onSaveRow={onSaveRow}
        onRefresh={onRefresh}
        onRemoveInput={onRemoveInput}
        onImputation={onImputation}
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

      {validationModal.show && (
        <Notifications
          message={validationModal.message}
          buttonArray={[
            { name: "Aceptar", disabled: false, className: "primary", action: () => setValidationModal({ show: false, message: "" }) }
          ]}
        />
      )}

      <ImputationProperties
        show={chargesModal.show}
        currentItem={chargesModal.item}
        onClose={onCloseCharges}
        onSave={onHandleSaveImputation}
      />
    </div>
  );
};

export default OrderInputs;
