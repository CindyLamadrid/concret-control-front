import { useState, useContext } from "react";
import axios from "axios";
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import AdminOptions from "../components/commons/adminOptions";
import InputTable from "../components/inputs/inputTable";
import AdminInput from "../components/inputs/adminInput";
import useEventListener from "../components/utils/useEventListener";

const Inputs = ({}) => {
  const { user, stageSelected, constructionSelected } =
    useContext(ConstructionContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idItem = searchParams.get("idItem");
  const idConstructionStageItem= searchParams.get("idConstructionStageItem");
  const inputType = searchParams.get("inputType");
  const budgetType = searchParams.get("budgetType");
  const idCompoundSelected = searchParams.get("idCompoundSelected");
  const [inputsArray, setInputsArray] = useState([]);
  const [noData, setNoData] = useState(false);
  const [input, setInput] = useState("");
  const [messageResultOperation, setMessageResultOperation] = useState("");
  const [adminInput, setAdminInput] = useState({
    show: false,
    input: "",
    action: "",
  });
  const [showCompoundInputs, setShowCompoundInputs] = useState(false);
  const onSearchInput = async () => {
    setShowCompoundInputs(false);
    if (!input) return;
    setMessageResultOperation("");
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

      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/create-compound-input`,
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

        if (created.idInputCompound === 0) {
          setMessageResultOperation(
            "El insumo ya existe para el item seleccionado"
          );
        } else {
          const params = createSearchParams({
            idItem,
            idConstructionStageItem,
            option: "compoundInputs",
            idCompoundSelected,
            user: btoa(user),
            idStage: stageSelected.idStage,
            idConstruction: constructionSelected.idConstruction,
            budgetType
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
          // idStage: stageSelected.idStage,
          idInput: items,
          // idItem,
          idConstructionStageItem,
          user,
        }
      );
      if (result && result.data && result.data.length > 0) {
        setNoData(false);

        const created = result.data[0];

        if (created.itemInput === 0) {

          setMessageResultOperation(
            "El insumo ya existe para el item seleccionado"
          );
        } else {

          const params = createSearchParams({
            user: btoa(user),
            idConstructionStageItem,
            idItem,
            option: "inputItems",
            // idStage: stageSelected.idStage,
            idConstruction: constructionSelected.idConstruction,
            budgetType
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

    setAdminInput({ show: true, input: "", action: "new" });
    setNoData(false);
  };

  const onAddCompountInput = () => {
    const selectedItems = inputsArray.filter((x) => x.selected);

    if (selectedItems && selectedItems.length > 0) {
      const idInputs = selectedItems
        .map((input) => parseInt(input.idInput))
        .join(", ");
        console.log("inputType===",inputType);
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
    categorySelected,
    action
  ) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${
          action === "edit" ? "update-input" : "create-input"
        }`,
        {
          idInput: action === "edit" ? parseInt(adminInput.input.idInput) : 0,
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
          setInputsArray([]);
          setAdminInput({ show: false, input: "", action: "" });
          if (adminInput.action === "edit") await onSearchInput();
        }
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

      setInputsArray(...[newInputsArray]);
    }
  };

  const onCancelOption = () => {
    // setShowOption('inputItems')
    const params = createSearchParams({
      user: btoa(user),
      idItem,
      option: "inputItems",
      // idStage: stageSelected.idStage,
      idConstructionStageItem,
      idConstruction: constructionSelected.idConstruction,
      budgetType
    });
    navigate(`/budget?${params.toString()}`);
  };

  const onEditInput = (index) => {
     setMessageResultOperation("");
    if (index > -1) {
      const input = inputsArray[index];

      setAdminInput({ show: true, input, action: "edit" });
    }
  };

  const onCloseAdminInput = () => {
    setAdminInput({ show: false, input: "", action: "" });
    setMessageResultOperation("");
  };

  const onShowCompoundInputs = async (id) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/compound-input`,
        {
          params: { idInput: id, idStage: stageSelected.idStage },
        }
      );
      if (result && result.data && result.data.length > 0) {
        setInputsArray(result.data);
        setShowCompoundInputs(true);
        setNoData(false);
      } else {
        setInputsArray([]);
        setNoData(true);
      }
    } catch (error) {
      setInputsArray([]);
      setNoData(true);
      console.error("Error fetching onShowCompoundInputs:", error);
    }
  };



  const handleKeyDownEnter = async (event) => {
    if (event.key === "Enter") {
      if (!adminInput.show) {
        await onSearchInput();
      }
    }
  };
  useEventListener("keydown", handleKeyDownEnter);

  return (
    <div>
      {/* {!adminInput.show && ( */}
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
      {/* )} */}

      {noData && <div>La busqueda no arrojo resultado</div>}
      {
        <div hidden={adminInput && adminInput.show}>
          {messageResultOperation}
        </div>
      }

      {adminInput && adminInput.show && (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <AdminInput
            messageResultOperation={messageResultOperation}
            setAdminInput={setAdminInput}
            onSaveInput={onSaveInput}
            inputType={inputType}
            adminInput={adminInput}
            onCloseAdminInput={onCloseAdminInput}
          />
        </div>
      )}

      {inputsArray && inputsArray.length > 0 && (
        <div>
          <div className="subtitle">
            <span>LISTADO DE INSUMOS GENERALES</span>
          </div>

          <div>
            {showCompoundInputs && (
              <button
                type="button"
                className="secondary"
                onClick={() => {onSearchInput(); setShowCompoundInputs(false)}}
              >
                {"Atrás"}
              </button>
            )}
            {! showCompoundInputs && (

               <button
              type="button"
              className="primary"
              onClick={() => onAddCompountInput()}
            >
              {"Agregar Insumo"}
            </button>
            )}
           

          </div>
          <br />
          <InputTable
            inputsArray={inputsArray}
            onSelectInput={onSelectInput}
            onEditInput={onEditInput}
            onShowCompoundInputs={onShowCompoundInputs}
            showCompoundInputs={showCompoundInputs}
          />
        </div>
      )}
    </div>
  );
};

export default Inputs;
