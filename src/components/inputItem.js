import { useEffect, useState, useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import axios from "axios";
import ItemsSelect from "./commons/select";
import InputItemTable from "./inputItems/inputItemTable";
import Back from "./commons/back";
import Modal from "./commons/modal";
import Header from "./commons/header";

const InputItem = ({
  itemSelected,
  constructionItemsArray,
  subchapterSelected,
  setShowOption,
  setItemSelected,
  setInputType,
  setCompoundSelected,
}) => {
  const navigate = useNavigate();
  const { user, stageSelected, constructionSelected } =
    useContext(ConstructionContext);

  const [inputItemsArray, setInputItemsArray] = useState([]);
  const [noData, setNoData] = useState(false);
  const [modalConfiguration, setModalConfiguration] = useState({
    show: false,
    buttonArray: [],
  });



  const getInputsItems = async (id) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/inputsItem`,
        {
          params: { idItem: id },
        }
      );
      if (result && result.data && result.data.length > 0) {
        setInputItemsArray(result.data);
        setNoData(false);
      } else {
        setInputItemsArray([]);
        setNoData(true);
      }
    } catch (error) {
      setInputItemsArray([]);
      setNoData(true);
      console.error("Error fetching onSearchInput:", error);
    }
  };

  const onRefresh = () => {
    getInputsItems(itemSelected.idItem);
  };

  useEffect(() => {
    if (itemSelected.idItem) {
      getInputsItems(itemSelected.idItem);
     
    }
  }, [itemSelected.idItem]);

  const onChangeQuantity = (event, index, type) => {
    const newInputItemsArray = [...inputItemsArray];
    console.log("type====", type);

    switch (type) {
      case "quantity":
        {
          newInputItemsArray[index].quantityChanged =
            newInputItemsArray[index].originalQuantity.toString() !==
            event.target.value
              ? true
              : false;
          newInputItemsArray[index].quantity = event.target.value;
        }
        break;
      case "unitValue":
        {
          newInputItemsArray[index].unitValueChanged =
            newInputItemsArray[index].originalUnitValue.toString() !==
            event.target.value
              ? true
              : false;
          newInputItemsArray[index].unitValue = event.target.value;
        }
        break;
      default: {
        newInputItemsArray[index].wasteChanged =
          newInputItemsArray[index].originalWaste.toString() !==
          event.target.value
            ? true
            : false;
        newInputItemsArray[index].waste = event.target.value;
      }
    }
    const waste = newInputItemsArray[index].waste || 0;
    const quantity = newInputItemsArray[index].quantity || 0;
    const unitValue = newInputItemsArray[index].unitValue || 0;
    newInputItemsArray[index].totalInput =
      (1 + parseFloat(waste) / 100) * quantity * unitValue;
    setInputItemsArray(...[newInputItemsArray]);
  };

  const updateInputItem = async (inputItem) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/updateInputItem`,
        {
          idItemInput: inputItem.idItemInput,
          idInput: inputItem.idInput,
          quantity: parseFloat(inputItem.quantity),
          unitValue: parseFloat(inputItem.unitValue).toFixed(2),
          waste: parseFloat(inputItem.waste).toFixed(2),
          user,
        }
      );

      if (result && result.data) getInputsItems(itemSelected.idItem);
    } catch (error) {
      setInputItemsArray([]);
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
        `${process.env.REACT_APP_BUDGET_URL_API}/removeInputItem`,
        {
          idItem: inputItem.idItem,
          idInput: inputItem.idInput,
          user,
        }
      );

      if (result && result.data) getInputsItems(itemSelected.idItem);
    } catch (error) {
      setInputItemsArray([]);
      setNoData(true);
      console.error("Error fetching removeInputItem:", error);
    }
  };

  const onSaveInformation = (index) => {
    console.log("index===", index);
    const inputItem = { ...inputItemsArray[index] };

    updateInputItem(inputItem);
  };

  const closeModal = () => {
    setModalConfiguration({
      show: false,
      buttonArray: [],
    });
  };

  const onRemoveInputItem = (index) => {
    const inputItem = { ...inputItemsArray[index] };
    console.log("remove==", inputItem);
    // removeInputItem(inputItem)
    setModalConfiguration({
      show: true,
      buttonArray: [
        {
          name: "Aceptar",
          disabled: false,
          action: removeInputItem,
        },
        {
          name: "Cancelar",
          disabled: false,
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
      <Back onBack={onBack} className="right back" />
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

      <div className="container-items-select">
        <ItemsSelect
          id="idItem"
          name="name"
          selectedValue={itemSelected.idItem}
          setSelectedValue={onChangeItem}
          array={constructionItemsArray}
        />
      </div>

      <div className=" w-90 right">
        <input
          type="button"
          value="Agregar Insumo"
          onClick={() => onAddCompoundItems()}
        />
      </div>
      <br />

      {inputItemsArray && inputItemsArray.length > 0 && (
        <InputItemTable
          inputItemsArray={inputItemsArray}
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
