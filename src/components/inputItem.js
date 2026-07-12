import { useEffect, useState, useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import axios from "../config/axiosConfig";
import ItemsSelect from "./commons/select";
import InputItemTable from "./inputItems/inputItemTable";
import Back from "./commons/back";
import Modal from "./commons/modal";
import Header from "./commons/resume";
import AdminInput from "./inputs/adminInput"


const InputItem = ({
  itemSelected,
  budgetType,
  itemInputsArray,
  constructionItemsArray,
  setItemInputsArray,
  setShowOption,
  setItemSelected,
  setInputType,
  setCompoundSelected,
  getItems,
  getItemInputs,
  canEdit,
}) => {
  const navigate = useNavigate();
  const { user, stageSelected, constructionSelected } =
    useContext(ConstructionContext);


  const [noData, setNoData] = useState(false);
  const [modalConfiguration, setModalConfiguration] = useState({
    show: false,
    buttonArray: [],
  });
  const [messageResultOperation, setMessageResultOperation] = useState("");


  const [adminInput, setAdminInput] = useState({
    show: false,
    input: "",
    action: "",
  });

  

  const onRefresh = () => {
    setMessageResultOperation("")
    if (itemSelected && itemSelected.idConstructionStageItem)
      getItemInputs(itemSelected.idConstructionStageItem);
  };

  useEffect(() => {
    if (itemSelected && itemSelected.idConstructionStageItem) {
       setMessageResultOperation("")
      getItemInputs(itemSelected.idConstructionStageItem);
    }
  }, [itemSelected && itemSelected.idConstructionStageItem]);

  useEffect(
    ()=>{

      if(itemInputsArray && itemInputsArray.length===0)
      {
         setNoData(true);
      }else
      {
        setNoData(false);
      }

    },[itemInputsArray]
  )

  const onChangeQuantity = (event, index, type) => {
    const newItemInputsArray = [...itemInputsArray];
  

    switch (type) {
      case "quantity":
        {
          newItemInputsArray[index].quantityChanged =
            newItemInputsArray[index].originalQuantity.toString() !==
            event.target.value
              ? true
              : false;
          newItemInputsArray[index].quantity = event.target.value;
        }
        break;
      case "unitValue":
        {
          newItemInputsArray[index].unitValueChanged =
            newItemInputsArray[index].originalUnitValue.toString() !==
            event.target.value
              ? true
              : false;
          newItemInputsArray[index].unitValue = event.target.value;
        }
        break;
      default: {
        newItemInputsArray[index].wasteChanged =
          newItemInputsArray[index].originalWaste.toString() !==
          event.target.value
            ? true
            : false;
        newItemInputsArray[index].waste = event.target.value;
      }
    }
    const waste = newItemInputsArray[index].waste || 0;
    const quantity = newItemInputsArray[index].quantity || 0;
    const unitValue = newItemInputsArray[index].unitValue || 0;
    newItemInputsArray[index].totalInput =
      (1 + parseFloat(waste) / 100) * quantity * unitValue;
    setItemInputsArray(...[newItemInputsArray]);
  };

  const updateInputItem = async (inputItem) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/update-item-input`,
        {
          idConstruction: constructionSelected.idConstruction,
          idStage: stageSelected.idStage,
          idItemInput: inputItem.idItemInput,
          idInput: inputItem.idInput,
          quantity: parseFloat(inputItem.quantity),
          unitValue: parseFloat(inputItem.unitValue).toFixed(2),
          waste: parseFloat(inputItem.waste).toFixed(2),
          user,
        }
      );

      if (result && result.data) 
        {
          if (itemSelected && itemSelected.idConstructionStageItem) {
            getItemInputs(itemSelected.idConstructionStageItem);
            getItems(true);
          }
        }
    } catch (error) {
      setItemInputsArray([]);
      setNoData(true);
      console.error("Error fetching updateInputItem:", error);
    }
  };

  const removeInputItem = async (inputItem) => {
    setModalConfiguration({
      show: false,
      buttonArray: [],
    });

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/remove-item-input`,
        {
          idConstructionStageItem:inputItem.idConstructionStageItem,
          idInput: inputItem.idInput,
          user,
        }
      );

      if (result && result.data && itemSelected && itemSelected.idConstructionStageItem)
        getItemInputs(itemSelected.idConstructionStageItem);
    } catch (error) {
      setItemInputsArray([]);
      setNoData(true);
      console.error("Error fetching removeInputItem:", error);
    }
  };

  const onSaveInformation = (index) => {
   
    const inputItem = { ...itemInputsArray[index] };
    updateInputItem(inputItem);
  };

  const closeModal = () => {
    setModalConfiguration({
      show: false,
      buttonArray: [],
    });
  };

  const onRemoveInputItem = (index) => {
    const inputItem = { ...itemInputsArray[index] };

    // removeInputItem(inputItem)
    setModalConfiguration({
      show: true,
      buttonArray: [
        {
          name: "Aceptar",
          disabled: false,
          className:'primary',
          action: removeInputItem,
        },
        {
          name: "Cancelar",
          disabled: false,
          className:'secondary',
          action: closeModal,
        },
      ],
      item: inputItem,
    });
  };

  const onChangeItem = (value) => {
    if (value) {
      const newItem = constructionItemsArray.filter(
        (x) => x.idItem.toString() === value
      );
      if (newItem && newItem.length > 0) setItemSelected(newItem[0]);
    }
    // setIdItem(parseInt(value,10))
  };

  const onBack = () => {
    setShowOption("constructionItems");
    
  };

  const onAddInputItem= () => {
    setCompoundSelected("");

    const params = createSearchParams({
      // idItem: itemSelected.idItem,
      idConstructionStageItem: itemSelected.idConstructionStageItem,
      inputType: "",
      idCompoundSelected: "",
      idItem: itemSelected.idItem,
      budgetType
    });
    navigate(`/search-inputs?${params.toString()}&user=${btoa(user)}&idStage=${stageSelected.idStage}&idConstruction=${constructionSelected.idConstruction}&budgetType=${budgetType}`);

    // setShowOption('searchInputs')
  };

  const onFocusInput=(index)=>{

     const newItemInputsArray = [...itemInputsArray];
     newItemInputsArray[index].editing = true
     setItemInputsArray(...[newItemInputsArray]);
  }

  const onBlurInput=(index)=>{
  const newItemInputsArray = [...itemInputsArray];
     newItemInputsArray[index].editing = false
     setItemInputsArray(...[newItemInputsArray]);
  }

  const onEditInput = (index) => {
    if (index > -1) {
      const input = itemInputsArray[index];

      setAdminInput({ show: true, input, action: "edit" });
    }
  };

  const onCloseAdminInput = () => {
    setAdminInput({ show: false, input: "", action: "" });
    setMessageResultOperation("");
  };

  // onSaveInput en inputItem.js solo se usa para editar (action === "edit").
  // Misma guardia que en compoundInputs.js para consistencia.
  const onSaveInput = async (
    unitSelected,
    inputTypeSelected,
    name,
    unitValue,
    compound,
    categorySelected,
    action
  ) => {
    if (action !== "edit") return;
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/update-input`,
        {
          idInput: parseInt(adminInput.input.idInput),
          idUnit: unitSelected,
          idInputType: inputTypeSelected,
          idCategory: categorySelected,
          name: name,
          compound: compound,
          unitValue: unitValue,
          user,
        }
      );

      if (result && result.data && result.data.length > 0) {
        const response = result.data[0];
        if (response.input === 0) {
          setMessageResultOperation(
            "El insumo ya existe con el mismo nombre ingresado"
          );
        } else {
          setAdminInput({ show: false, input: "", action: "" });
          setMessageResultOperation("");
          if (itemSelected && itemSelected.idConstructionStageItem)
            await getItemInputs(itemSelected.idConstructionStageItem);
        }
      }
    } catch (error) {
      console.error("Error fetching onSaveInput:", error);
    }
  };


  return (
    <div>
     
      {
        <Header
          itemSelected={itemSelected}
          stageSelected={stageSelected}
          constructionSelected={constructionSelected}
        />
      }
      {modalConfiguration && modalConfiguration.show && (
        <Modal
          message="Desea eliminar el insumo del item?"
          buttonArray={modalConfiguration.buttonArray}
          item={modalConfiguration.item}
        />
      )}
<br/>
      <div className="container-items-select">
        <ItemsSelect
          id="idItem"
          name="name"
          selectedValue={itemSelected.idItem}
          setSelectedValue={onChangeItem}
          array={constructionItemsArray}
        />
      </div>

 <div className="header-title">
              <span>LISTADO DE INSUMOS</span>
              <span className="subheader-title"> &nbsp;&nbsp;&nbsp;{itemInputsArray.length}{" "} Insumo(s)</span>
          </div>
      <div >
         <Back onBack={onBack} className="" />
            {" "}
        {canEdit && (
          <button
            type="button"
            className="primary"
            onClick={() => onAddInputItem()}
          >
            {"Agregar Insumo"}
          </button>
        )}
      </div>
      <br />

      {adminInput && adminInput.show && (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <AdminInput
            messageResultOperation={messageResultOperation}
            setAdminInput={setAdminInput}
            onSaveInput={onSaveInput}
            inputType=""
            adminInput={adminInput}
            onCloseAdminInput={onCloseAdminInput}
          />
        </div>
      )}

      {itemInputsArray && itemInputsArray.length > 0 && (
        <InputItemTable
          itemInputsArray={itemInputsArray}
          budgetType={budgetType}
          onChangeQuantity={onChangeQuantity}
          onSaveInformation={onSaveInformation}
          onRefresh={onRefresh}
          onRemoveInputItem={onRemoveInputItem}
          setShowOption={setShowOption}
          setCompoundSelected={setCompoundSelected}
          onFocusInput={onFocusInput}
          onBlurInput={onBlurInput}
          onEditInput={onEditInput}
          canEdit={canEdit}
        />
      )}
      {noData && <div>La busqueda no arrojo resultado</div>}
    </div>
  );
};

export default InputItem;
