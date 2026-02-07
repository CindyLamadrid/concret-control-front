import { useEffect, useState, useContext } from "react";
import { ConstructionContext } from "../context/constructionContext";
import axios from "axios";
import {
  useNavigate,
  useSearchParams
} from "react-router-dom";
import Back from "../components/commons/back";
import ContractInputsTable from '../components/Inputscontract/contractInputsTable'

const InputsContract = () => {
   const { user } =
    useContext(ConstructionContext);

   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const [type] = useState(searchParams.get('type'));
   const [idSupplier]= useState(searchParams.get('idSupplier'));
   const [idContract]= useState(searchParams.get("idContract"));
   const [contractInputsArray,setContractInputsArray ]= useState([]);
   
  
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


  const updateContractInput=async(contractInput)=>{
     try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/update-contract-input`,
        {
          
          idContract: contractInput.idContract,
          idInput: contractInput.idInput,
          quantity: parseFloat(contractInput.quantity),
          unitValue: parseFloat(contractInput.unitValue).toFixed(2),
          user,
        }
      );

      if (result && result.data) 
        {
         getContractInputs()
          
        }
    } catch (error) {
      setContractInputsArray([]);
    
      console.error("Error fetching updateContractInput:", error);
    }
  }

  const onSaveInformation = (index) => {
   
    const contractInput = { ...contractInputsArray[index] };
    updateContractInput(contractInput);
  };

  
  const onChangeQuantity = (event, index, type) => {
    const newContractInputsArray = [...contractInputsArray];
    switch (type) {
      case "quantity":
        {
          newContractInputsArray[index].quantityChanged =
            newContractInputsArray[index].originalQuantity.toString() !==
            event.target.value
              ? true
              : false;
          newContractInputsArray[index].quantity = event.target.value;
        }
        break;
      default: {
          newContractInputsArray[index].unitValueChanged =
            newContractInputsArray[index].originalUnitValue.toString() !==
            event.target.value
              ? true
              : false;
          newContractInputsArray[index].unitValue = event.target.value;
      }
    }
   
    const quantity = newContractInputsArray[index].quantity || 0;
    const unitValue = newContractInputsArray[index].unitValue || 0;
    newContractInputsArray[index].totalInput =
      quantity * unitValue;
    setContractInputsArray(...[newContractInputsArray]);
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
                    setContractInputsArray(result.data)
                } else {
                    setContractInputsArray([])
                }
            }
        ).catch(
            (error) => {
                setContractInputsArray([])
                // setNoData(true)
                console.error('Error fetching onSearchContractInputs:', error);
            }
        )
   }


  return (
    <div>
      <div>
        <Back onBack={onBack} className="" />{" "}
        <button
          type="button"
          className="primary"
          onClick={() => onAddInputContract()}
        >
          {"Agregar Insumo"}
        </button>
      </div>
      <div>
          <ContractInputsTable
            contractInputsArray={contractInputsArray}
            onRemoveInput={onRemoveInput}
            onChangeQuantity={onChangeQuantity}
            onSaveInformation={onSaveInformation}
            onRefresh={onRefresh}
            onFocusInput={onFocusInput}
            onBlurInput={onBlurInput}
           
           
          />
      </div>
    </div>
  );
};
export default InputsContract;
