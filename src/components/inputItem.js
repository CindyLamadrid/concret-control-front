import { useEffect, useState, useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import axios from "axios";
import ItemsSelect from "./commons/select";
import InputItemTable from "./inputItems/inputItemTable";
import Back from "./commons/back";
import Modal from "./commons/modal";
import Header from "./commons/resume";

const InputItem = ({
  itemSelected,
  constructionItemsArray,
  setShowOption,
  setItemSelected,
  setInputType,
  setCompoundSelected,
}) => {
  const navigate = useNavigate();
  const { user, stageSelected, constructionSelected } =
    useContext(ConstructionContext);

  const [itemInputsArray, setItemInputsArray] = useState([]);
  const [noData, setNoData] = useState(false);
  const [modalConfiguration, setModalConfiguration] = useState({
    show: false,
    buttonArray: [],
  });



  const getItemInputs = async (id) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/item-inputs`,
        {
          params: {idStage: stageSelected.idStage, idItem: id },
        }
      );
      if (result && result.data && result.data.length > 0) {
        setItemInputsArray(result.data);
        setNoData(false);
      } else {
        setItemInputsArray([]);
        setNoData(true);
      }
    } catch (error) {
      setItemInputsArray([]);
      setNoData(true);
      console.error("Error fetching onSearchInput:", error);
    }
  };

  const onRefresh = () => {
    getItemInputs(itemSelected.idItem);
  };

  useEffect(() => {
    if (itemSelected.idItem) {
      getItemInputs(itemSelected.idItem);
     
    }
  }, [itemSelected.idItem]);

  const onChangeQuantity = (event, index, type) => {
    const newItemInputsArray = [...itemInputsArray];
    console.log("type====", type);

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

      if (result && result.data) getItemInputs(itemSelected.idItem);
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
          idStage:stageSelected.idStage,
          idItem: inputItem.idItem,
          idInput: inputItem.idInput,
          user,
        }
      );

      if (result && result.data) getItemInputs(itemSelected.idItem);
    } catch (error) {
      setItemInputsArray([]);
      setNoData(true);
      console.error("Error fetching removeInputItem:", error);
    }
  };

  const onSaveInformation = (index) => {
    console.log("index===", index);
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
    console.log("remove==", inputItem);
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
  console.log("itemSelected", itemSelected);
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

  const onAddCompoundItems = () => {
    setInputType("");
    setCompoundSelected("");

    const params = createSearchParams({
      idItem: itemSelected.idItem,
      inputType: "",
      idCompoundSelected: "",
    });
    navigate(`/search-inputs?${params.toString()}`);

    // setShowOption('searchInputs')
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
          message="Desea elimiar el insumo?"
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
<br/>
      <div >
         <Back onBack={onBack} className="" />
            {" "}
        <button
          type="button"
          className="primary"
          onClick={() => onAddCompoundItems()}
        >
          {"Agregar Insumo"}
        </button>
      </div>
      <br />

      {itemInputsArray && itemInputsArray.length > 0 && (
        <InputItemTable
          itemInputsArray={itemInputsArray}
          onChangeQuantity={onChangeQuantity}
          onSaveInformation={onSaveInformation}
          onRefresh={onRefresh}
          onRemoveInputItem={onRemoveInputItem}
          setShowOption={setShowOption}
          setCompoundSelected={setCompoundSelected}
        />
      )}
      {noData && <div>La busqueda no arrojo resultado</div>}
    </div>
  );
};

export default InputItem;
