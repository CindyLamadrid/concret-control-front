import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import AdminOptions from "../components/commons/adminOptions";
import InputTable from "../components//inputs/inputTable";
import NewInput from "../components//inputs/newInput";
import useEventListener from "../components/utils/useEventListener";

const Inputs = ({}) => {
  const { user, stageSelected,constructionSelected } = useContext(ConstructionContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idItem = searchParams.get("idItem");
  const inputType = searchParams.get("inputType");
  const idCompoundSelected = searchParams.get("idCompoundSelected");
  const [showNewInput, setShowNewInput] = useState(false);
  const [inputsArray, setInputsArray] = useState([]);
  const [unistsArray, setUnitsArray] = useState([]);
  const [categoriesArray, setCategories] = useState([]);
  const [inputTypesArray, setinputTypesArray] = useState([]);
  const [noData, setNoData] = useState(false);
  const [input, setInput] = useState("");
  const [messageResultOperation, setMessageResultOperation] = useState("");

  const getUnitsArray = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/units`)
      .then((result) => {
        if (result && result.data) {
          const { data } = result;
          setUnitsArray(data);
        } else {
          setUnitsArray([]);
        }
      })
      .catch((error) => {
        setUnitsArray([]);
        console.error("Error fetching getUnitsArray:", error);
      });
  };

  const getCategoriesArray = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/categories`)
      .then((result) => {
        if (result && result.data) {
          setCategories(result.data);
        } else {
          setCategories([]);
        }
      })
      .catch((error) => {
        setCategories([]);
        console.error("Error fetching getCategoriesArray:", error);
      });
  };

  const getInputTypes = async () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/inputTypes`)
      .then((result) => {
        if (result && result.data) {
          setinputTypesArray(result.data);
        } else {
          setinputTypesArray([]);
        }
      })
      .catch((error) => {
        setinputTypesArray([]);
        console.error("Error fetching getInputTypes:", error);
      });
  };

  console.log("messageResultOperation===", messageResultOperation);

  const onSearchInput = async () => {
    // setMessageResultOperation('')
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/item-inputs-nameCod`,
        {
          params: { input, idStage: stageSelected.idStage },
        }
      );
      if (result && result.data && result.data.length > 0) {
        let { data } = result;
        if (inputType === "compound") {
          data = data.filter((x) => !x.compound);
        }
        setInputsArray(data);
        setNoData(false);
      } else {
        setInputsArray([]);
        setNoData(true);
      }
    } catch (error) {
      setInputsArray([]);
      setNoData(true);
      console.error("Error fetching onSearchInput:", error);
    }
  };

  const onSaveCompoundInput = async (inputs) => {
    try {
      console.log("compoundSelected===", idCompoundSelected);
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/compound-input`,
        {
          idStage: stageSelected.idStage,
          idInputCompound: inputs,
          idInput: idCompoundSelected,
          user,
        }
      );
      if (result && result.data && result.data.length > 0) {
        setNoData(false);

        const created = result.data[0];

        if (created.newInputItem === 0) {
          setMessageResultOperation(
            "El insumo ya existe para el item seleccionado"
          );
        } else {
          const params = createSearchParams({
            idItem,
            option: "compoundInputs",
            idCompoundSelected,
            user,
            idStage:stageSelected.idStage,
            idConstruction:constructionSelected.idConstruction

          });
          navigate(`/budget?${params.toString()}`);
        }
      }
    } catch (error) {
      setInputsArray([]);
      setNoData(true);
      console.error("Error fetching onSearchInput:", error);
    }
  };

  const onSaveInputItem = async (items) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/create-item-input`,
        {
          idStage: stageSelected.idStage,
          idInput: items,
          idItem,
          user,
        }
      );
      if (result && result.data && result.data.length > 0) {
        setNoData(false);

        const created = result.data[0];

        if (created.newInputItem === 0) {
          console.log("entrooooo1111", created);
          setMessageResultOperation(
            "El insumo ya existe para el item seleccionado"
          );
        } else {
          console.log("navigate");
          const params = createSearchParams({user, idItem, option: "inputItems",
            idStage:stageSelected.idStage,
            idConstruction:constructionSelected.idConstruction
           });
          navigate(`/budget?${params.toString()}`);
        }
      }
    } catch (error) {
      setInputsArray([]);
      setNoData(true);
      console.error("Error fetching onSearchInput:", error);
    }
  };

  const onNewInput = () => {
    setMessageResultOperation("");
    setShowNewInput(true);
    setNoData(false);
  };

  const onAddInput = () => {
    const selectedItems = inputsArray.filter((x) => x.selected);

    if (selectedItems && selectedItems.length > 0) {
      const idInputs = selectedItems
        .map((input) => parseInt(input.idInput))
        .join(", ");
      if (inputType !== "compound") onSaveInputItem(idInputs);
      else onSaveCompoundInput(idInputs);
    }
  };

  const onSaveInput = async (
    unitSelected,
    inputTypeSelected,
    name,
    unitValue,
    compound,
    categorySelected
  ) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/create-input`,
        {
          idUnit: unitSelected,
          idInputType: inputTypeSelected,
          idCategory: categorySelected,
          name: name,
          compound: compound,
          unitValue: unitValue,
          user,
        }
      );
      setInputsArray([]);

      if (result && result.data && result.data.length > 0) {
        const created = result.data[0];

        if (created.newInput === 0)
          setMessageResultOperation(
            "El insumo ya existe con el mismo nombre ingresado"
          );
        else setShowNewInput(false);
      }
    } catch (error) {
      setInputsArray([]);
      setNoData(true);
      console.error("Error fetching onSearchItems:", error);
    }
  };

  const onSelectInput = (index) => {
    if (index > -1) {
      const newInputsArray = [...inputsArray];
      newInputsArray[index].selected = !inputsArray[index].selected;
      console.log("newInputArray", newInputsArray);
      setInputsArray(...[newInputsArray]);
    }
  };

  const onCancelOption = () => {
    // setShowOption('inputItems')
    const params = createSearchParams({ user,idItem, option: "inputItems",
      idStage:stageSelected.idStage,
      idConstruction:constructionSelected.idConstruction
     });
    navigate(`/budget?${params.toString()}`);
  };

  useEffect(() => {
    getUnitsArray();
    getInputTypes();
    getCategoriesArray();
  }, []);

  const handleKeyDownEnter = async (event) => {
    if (event.key === "Enter") {
      if (!showNewInput) {
        await onSearchInput();
      }
    }
  };
  useEventListener("keydown", handleKeyDownEnter);

  return (
    <div>
      {!showNewInput && (
        <div>
          <br />
          <div className="header-title">
            <span>OPCIONES DE INSUMOS</span>
          </div>
          <AdminOptions
            value={input}
            setValue={setInput}
            onSearch={onSearchInput}
            onNewOption={onNewInput}
            onCancelOption={onCancelOption}
            labelOption="Crear Nuevo Insumo"
          />
        </div>
      )}
      {noData && <div>La busqueda no arrojo resultado</div>}
      {<div>{messageResultOperation}</div>}

      {showNewInput && (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <NewInput
            unistsArray={unistsArray}
            categoriesArray={categoriesArray}
            inputTypesArray={inputTypesArray}
            setShowNewInput={setShowNewInput}
            onSaveInput={onSaveInput}
            inputType={inputType}
          />
        </div>
      )}

      {inputsArray && inputsArray.length > 0 && (
        <div>
         
          <div className="subtitle">
            <span >LISTADO DE INSUMOS GENERALES</span>
          </div>
         
          <div>
            <button
              type="button"
              className="primary"
              onClick={() => onAddInput()}
            >
                {"Agregar Insumo"}
            </button>
          </div>
          <br />
          <InputTable inputsArray={inputsArray} onSelectInput={onSelectInput} />
        </div>
      )}
    </div>
  );
};

export default Inputs;
