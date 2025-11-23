import { useState, useEffect, useContext } from "react";
import { useNavigate,createSearchParams  } from 'react-router-dom';
import axios from "axios";
import { ConstructionContext } from "../context/constructionContext";
import Back from "./commons/back";
import Header from "./commons/header";
import Modal from './commons/modal';
import CompoundInputTable from "./inputItems/compoundInputTable";

const CompoundInputs = ({
  itemSelected,
  compoundSelected,
  setInputType,
  setShowOption,
  setCompoundSelected
}) => {
      const navigate = useNavigate ();
  const { user, stageSelected, constructionSelected } =
    useContext(ConstructionContext);
  const [compoundInputsArray, setCompoundInputArray] = useState([]);
  const [noData, setNoData] = useState(false);
  const [modalConfiguration, setModalConfiguration] = useState({
    show: false,
    buttonArray: [],
  });
  const onBack = () => {
    setShowOption("inputItems");
  };

  const onAddInputItems = () => {
    setInputType("compound");
    // setShowOption("searchInputs");

    const params = createSearchParams({idItem:itemSelected.idItem,inputType:'compound',idCompoundSelected:compoundSelected.idInput});
    navigate(`/search-inputs?${params.toString()}`);
  };

  const getCompoundInputs = async (id) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/getCompoundInput`,
        {
          params: { idInput: id },
        }
      );
      if (result && result.data && result.data.length > 0) {
        setCompoundInputArray(result.data);
        setNoData(false);
      } else {
        setCompoundInputArray([]);
        setNoData(true);
      }
    } catch (error) {
      setCompoundInputArray([]);
      setNoData(true);
      console.error("Error fetching getCompoundInputs:", error);
    }
  };

  const getItemsInputId = async (idItem,id) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/itemsInputId`,
        {
          params: {idItem, idInput: id },
        }
      );
      if (result && result.data && result.data.length > 0) {
        setCompoundSelected(result.data[0]);
       
      }
    } catch (error) {
      setNoData(true);
      console.error("Error fetching getItemsInputId:", error);
    }
  };

  const onChangeQuantity = (event, index, type) => {
    const newCompoundInputArray = [...compoundInputsArray];

    switch (type) {
      case "quantity":
        {
          newCompoundInputArray[index].quantityChanged =
            newCompoundInputArray[index].originalQuantity.toString() !==
            event.target.value
              ? true
              : false;
          newCompoundInputArray[index].quantity =
            event.target.value
        }
        break;
      case "unitValue":
        {
          newCompoundInputArray[index].unitValueChanged =
            newCompoundInputArray[index].originalUnitValue.toString() !==
            event.target.value
              ? true
              : false;
          newCompoundInputArray[index].unitValue = event.target.value;
        }
        break;
      default: {
        newCompoundInputArray[index].wasteChanged =
          newCompoundInputArray[index].originalWaste.toString() !==
          event.target.value
            ? true
            : false;
        newCompoundInputArray[index].waste = event.target.value;
      }
    }
    newCompoundInputArray[index].totalInput =
      (1 + parseFloat(newCompoundInputArray[index].waste) / 100) *
      newCompoundInputArray[index].quantity *
      parseFloat(newCompoundInputArray[index].unitValue);
    setCompoundInputArray(...[newCompoundInputArray]);
  };

  const updateCompoundInput = async (input) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/updateCompoundInput`,
        {
          idInputCompound: input.idInputCompound,
          idInput: input.idInput,
          quantity: parseFloat(input.quantity),
          unitValue: parseFloat(input.unitValue).toFixed(2),
          waste: parseFloat(input.waste).toFixed(2),
          user,
        }
      );

      if (result && result.data) getCompoundInputs(compoundSelected.idInput);
    } catch (error) {
      setCompoundInputArray([]);
      setNoData(true);
      console.error("Error fetching updateCompoundInput:", error);
    }
  };

  const onSaveInformation = (index) => {
    console.log("index===", index);
    const compoundItem = { ...compoundInputsArray[index] };
    updateCompoundInput(compoundItem);
  };

  const onRefresh = () => {
    getCompoundInputs(compoundSelected.idInput);
  };

  const removeCompoundInput = async (item) => {
    setModalConfiguration({
      show: false,
      buttonArray: [],
    });

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/removeCompoundInput`,
        {
          idInputCompound: item.idInputCompound,
          user,
        }
      );

      if (result && result.data) getCompoundInputs(compoundSelected.idInput);
    } catch (error) {
      setCompoundInputArray([]);
      setNoData(true);
      console.error("Error fetching removeInputItem:", error);
    }
  };

  const closeModal = () => {
    setModalConfiguration({
      show: false,
      buttonArray: [],
    });
  };

  const onCompoundRemoveInput = (index) => {
    const compoundItem = { ...compoundInputsArray[index] };
    console.log("remove==", compoundItem);
    // removeInputItem(inputItem)
    setModalConfiguration({
      show: true,
      buttonArray: [
        {
          name: "Aceptar",
          disabled: false,
          action: removeCompoundInput,
        },
        {
          name: "Cancelar",
          disabled: false,
          action: closeModal,
        },
      ],
      item: compoundItem,
    });
  };

  useEffect(() => {
    console.log("compoundSelected===",compoundSelected);
    if (compoundSelected.idInput) {
      getCompoundInputs(compoundSelected.idInput);
      if(compoundSelected && !compoundSelected.name)
         getItemsInputId(itemSelected.idItem,compoundSelected.idInput)
    }
  }, [compoundSelected.idInput]);

  return (
    <div>
      <Back onBack={onBack} className="right back" />
      {
        <Header
          inputSelected = {compoundSelected}
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
      {
        <div className=" w-90 right">
          <input
            type="button"
            value="Agregar Insumo"
            onClick={() => onAddInputItems()}
          />
        </div>
      }
      <br />
      {compoundInputsArray && compoundInputsArray.length > 0 && (
        <CompoundInputTable
          compoundInputsArray={compoundInputsArray}
          onChangeQuantity={onChangeQuantity}
          onSaveInformation={onSaveInformation}
          onRefresh={onRefresh}
          onCompoundRemoveInput={onCompoundRemoveInput}
          setShowOption={setShowOption}
          // setCompoundSelected={setCompoundSelected}
        />
      )}
      {noData && <div>La busqueda no arrojo resultado</div>}
    </div>
  );
};

export default CompoundInputs;
