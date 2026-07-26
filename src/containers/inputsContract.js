import { useEffect, useState, useContext } from "react";
import { ConstructionContext } from "../context/constructionContext";
import axios from "../config/axiosConfig";
import {
  useNavigate,
  useSearchParams
} from "react-router-dom";
import Back from "../components/commons/back";
import ContractInputsTable from '../components/Inputscontract/contractInputsTable';
import Charges from '../components/Inputscontract/charges';
import Resume from "../components/commons/resume";

const InputsContract = () => {
   const { user, constructionSelected, stageSelected } =
    useContext(ConstructionContext);

   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   // Read directly — never stale
   const type       = searchParams.get('type');
   const idSupplier = searchParams.get('idSupplier');
   const idContract = searchParams.get('idContract');
   const [contractInputsArray,setContractInputsArray ]= useState([]);
   const [chargesModal, setChargesModal] = useState({ show: false, index: null, item: null });
   
  
   const [modalConfiguration, setModalConfiguration] = useState({
    show: false,
    buttonArray: [],
  });
  const [messageResultOperation, setMessageResultOperation] = useState("");

  const onBack=()=>{
     navigate(`/contracts?idSupplier=${idSupplier}&type=${type}`);
  }

  const onAddInputContract=()=>{
      navigate(`/inputs-control?idSupplier=${idSupplier}&type=${type}&idContract=${idContract}`);
  }

  const removeContractInput = async (inputContract) => {
      setModalConfiguration({
        show: false,
        buttonArray: [],
      });

    
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/remove-contract-input`,
        {
          idContract:inputContract.idContract,
          idInput: inputContract.idInput,
          user,
        }
      );

      if (result && result.data) getContractInputs();
    } catch (error) {
      setContractInputsArray([]);
     
      console.error("Error fetching removeInputItem:", error);
    }
  };

  const onRefresh = () => {
    setMessageResultOperation("")
    getContractInputs();
  };


  const updateContractInput = async (contractInput, index) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/update-contract-input`,
        {
          idContractInput: contractInput.idContractInput,
          idContract: contractInput.idContract,
          idInput: contractInput.idInput,
          idChapter: contractInput.idChapter || null,
          idSubchapter: contractInput.idSubchapter || null,
          idInputBudget: contractInput.idInputBudget || null,
          idStage: contractInput.idStage || null,
          quantity: parseFloat(contractInput.quantity),
          unitValue: parseFloat(contractInput.unitValue).toFixed(2),
          user,
        }
      );

      if (result && result.data) {
        // Only clear changed flags on this row — no full reload
        const newArr = [...contractInputsArray];
        newArr[index] = {
          ...newArr[index],
          originalQuantity:  newArr[index].quantity,
          originalUnitValue: newArr[index].unitValue,
          quantityChanged:   false,
          unitValueChanged:  false,
          editing:           false,
        };
        setContractInputsArray([...newArr]);
      }
    } catch (error) {
      setContractInputsArray([]);
      console.error("Error fetching updateContractInput:", error);
    }
  };

  const onSaveInformation = (index) => {
    const contractInput = { ...contractInputsArray[index] };
    const qty = parseFloat(contractInput.quantity) || 0;
    const val = parseFloat(contractInput.unitValue) || 0;
    const maxQty = parseFloat(contractInput.budgetQuantity) || 0;
    const maxVal = parseFloat(contractInput.budgetUnitValue) || 0;

    let errors = [];
    if (maxQty > 0 && qty > maxQty) {
      errors.push(`La cantidad (${qty}) sobrepasa la del presupuesto (${maxQty})`);
    }
    if (maxVal > 0 && val > maxVal) {
      const fmtVal = val.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
      const fmtMax = maxVal.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
      errors.push(`El valor unitario (${fmtVal}) sobrepasa el del presupuesto (${fmtMax})`);
    }

    if (errors.length > 0) {
      setMessageResultOperation(errors.join(". "));
      return;
    }
    setMessageResultOperation("");
    updateContractInput(contractInput, index);
  };

  
  const onChangeQuantity = (event, index, type) => {
    const newContractInputsArray = [...contractInputsArray];
    switch (type) {
      case "quantity":
        newContractInputsArray[index].quantity = event.target.value;
        newContractInputsArray[index].quantityChanged =
          parseFloat(event.target.value) !== newContractInputsArray[index].originalQuantity;
        break;
      default:
        newContractInputsArray[index].unitValue = event.target.value;
        newContractInputsArray[index].unitValueChanged =
          parseFloat(event.target.value) !== newContractInputsArray[index].originalUnitValue;
    }
    const quantity  = parseFloat(newContractInputsArray[index].quantity)  || 0;
    const unitValue = parseFloat(newContractInputsArray[index].unitValue) || 0;
    newContractInputsArray[index].totalInput = quantity * unitValue;
    setContractInputsArray([...newContractInputsArray]);
  };

 const closeModal = () => {
    setModalConfiguration({
      show: false,
      buttonArray: [],
    });
  };

   const onRemoveInput=(index)=>{
    const inputContract = { ...contractInputsArray[index] };
   
    setModalConfiguration({
      show: true,
      buttonArray: [
        {
          name: "Aceptar",
          disabled: false,
          className:'primary',
          action: removeContractInput,
        },
        {
          name: "Cancelar",
          disabled: false,
          className:'secondary',
          action: closeModal,
        },
      ],
      item: inputContract,
    });
   }

   useEffect(
    ()=>{
      
       getContractInputs()
    },[]
   )

  const onFocusInput=(index)=>{

     const newContractInputsArray = [...contractInputsArray];
     newContractInputsArray[index].editing = true
     setContractInputsArray(...[newContractInputsArray]);
  }

  const onBlurInput=(index)=>{
  const newContractInputsArray = [...contractInputsArray];
     newContractInputsArray[index].editing = false
     setContractInputsArray(...[newContractInputsArray]);
  }

   
  const getContractInputs = async () => {
        axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/contract-inputs`, {
           idContract
        }).then(
            (result) => {
                if (result && result.data && result.data.length > 0) {
                    const data = result.data.map((x) => ({
                      ...x,
                      originalQuantity:  parseFloat(x.quantity),
                      originalUnitValue: parseFloat(x.unitValue),
                      quantityChanged:   false,
                      unitValueChanged:  false,
                      editing: false,
                    }));
                    setContractInputsArray(data);
                } else {
                    setContractInputsArray([])
                }
            }
        ).catch(
            (error) => {
                setContractInputsArray([])
                console.error('Error fetching onSearchContractInputs:', error);
            }
        )
   }


  const onImputation = (index) => {
    setChargesModal({ show: true, index, item: contractInputsArray[index] });
  };

  const onCloseCharges = () => {
    setChargesModal({ show: false, index: null, item: null });
  };

  const onHandleSaveContracts =async ({ stage, chapter, input,currentItem }) => {
    if (chargesModal.index !== null) {
      await updateContractInput({
        idContractInput : currentItem.idContractInput,
        idContract : currentItem.idContract,
        idInput: currentItem.idInput,
        idChapter: chapter.idChapter,
        idSubchapter: chapter.idSubchapter,
        idInputBudget: input ? input.value : null,
        idStage: stage ? stage.idStage : null,
        quantity: currentItem.quantity,
        unitValue: currentItem.unitValue,
        user: user
      })
      await getContractInputs();
    }
    setChargesModal({ show: false, index: null, item: null });
  };

  return (
    <div>
      <Resume constructionSelected={constructionSelected} stageSelected={stageSelected} />
      <div>
        <Back onBack={onBack}/>{" "}
        <button
          type="button"
          className="primary"
          onClick={() => onAddInputContract()}
        >
          {"Agregar Insumo"}
        </button>
      </div>
      <br/>
      {messageResultOperation && (
        <div className="mandatory mb-15"><b>{messageResultOperation}</b></div>
      )}
     
      <div>
          <ContractInputsTable
            contractInputsArray={contractInputsArray}
            onRemoveInput={onRemoveInput}
            onChangeQuantity={onChangeQuantity}
            onSaveInformation={onSaveInformation}
            onRefresh={onRefresh}
            onFocusInput={onFocusInput}
            onBlurInput={onBlurInput}
            onImputation={onImputation}
          />
      </div>
      <Charges
        show={chargesModal.show}
        onClose={onCloseCharges}
        onHandleSaveContracts={onHandleSaveContracts}
        currentItem={chargesModal.item}
      />
    </div>
  );
};
export default InputsContract;
