import { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import AdminOptions from "../components/commons/adminOptions";
import AdminInput from "../components/inputs/adminInput";
import InputTable from "../components/inputs/inputTable";
import Back from "../components/commons/back";
import ChapterSelect from "../components/commons/select";
import { ConstructionContext } from "../context/constructionContext";
import useEventListener from "../components/utils/useEventListener";

const InputsControl = () => {
  const { user,stageSelected } = useContext(ConstructionContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [type] = useState(searchParams.get("type"));
  const [idSupplier] = useState(searchParams.get("idSupplier"));
  const [idContract] = useState(searchParams.get("idContract"));
  const [inputsArray, setInputsArray] = useState([]);
  const [noData, setNoData] = useState(false);
  const [input, setInput] = useState("");
  const [messageResultOperation, setMessageResultOperation] = useState("");
  const [chapters, setChapters] = useState([]);
  const [inputs,setInputs] = useState([]);
  const [chapterSubChater, setChapterSubChater] = useState("");
  const [chapterSelected,setChapterSelected]=useState("")
  const [inputSelected,setInputSelected]=useState("")

  const [adminInput, setAdminInput] = useState({
    show: false,
    input: "",
    action: "",
  });

  const onSearchInput = async () => {
  //  setChapterSelected("")
    if (!input) return;
    setMessageResultOperation("");
    try {
      const result = await axios.get
      (
        `${process.env.REACT_APP_BUDGET_URL_API}/item-inputs-control-nameCod`,
        {
          params: { input },
        },
      );
      if (result && result.data && result.data.length > 0) {
        let { data } = result;
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

  const onSaveInput = async (unitSelected, name, action) => {
    try {
      console.log("adminInput==", adminInput);
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${
          action === "edit" ? "update-input-control" : "create-input-control"
        }`,
        {
          idInput: action === "edit" ? parseInt(adminInput.input.idInput) : 0,
          idUnit: unitSelected,
          name: name,
          user,
        },
      );

      if (result && result.data && result.data.length > 0) {
        const response = result.data[0];
        if (response.input === 0) {
          setMessageResultOperation(
            "El insumo ya existe con el mismo nombre ingresado",
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

  const onNewInput = () => {
    setMessageResultOperation("");

    setAdminInput({ show: true, input: "", action: "new" });
    setNoData(false);
  };

  const onSelectInput = (index) => {
   
    if (index > -1) {
          const newInputsArray = inputsArray.map(
        (x) =>{x.selected=false

          return x
        }
      );
      const input =  newInputsArray[index]
      input.selected = !input.selected ;
      newInputsArray[index] = input
      setInputsArray(newInputsArray);
    }
  };

  const onCancelOption = () => {
    // setShowOption('inputItems')
    const params = createSearchParams({
      user: btoa(user),
      type,
      idSupplier,
      idContract
    });
    navigate(`/inputs-contract?${params.toString()}`);
  };

  const onEditInput = (index) => {
    setMessageResultOperation("");
    if (index > -1) {
      const input = inputsArray[index];
      console.log("input===", input);
      setAdminInput({ show: true, input, action: "edit" });
    }
  };

  const onBack = () => {
    const params = createSearchParams({
      user: btoa(user),
      idSupplier,
      idContract,
    });
    navigate(`/inputs-contract?${params.toString()}`);
  };

  const onSaveInputContract = async (items) => {
    try {
       console.log("chapterSelected",chapterSelected);
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/create-contract-input`,
        {
          idInput: items,
          idContract,
          idChapter: chapterSelected.idChapter,
          idSubchapter :chapterSelected.idSubchapter,
          user,
        },
      );
      if (result && result.data && result.data.length > 0) {
        setNoData(false);

        const created = result.data[0];

        if (created.itemInput === 0) {
          setMessageResultOperation(
            "El insumo ya existe para el contrato seleccionado",
          );
        } else {
          const params = createSearchParams({
            user: btoa(user),
            idSupplier,
            idContract,
          });
          navigate(`/inputs-contract?${params.toString()}`);
        }
      }
    } catch (error) {
      setInputsArray([]);
      setNoData(true);
      console.error("Error fetching onSearchInput:", error);
    }
  };

  const onAddInputsContract = () => {
    const selectedItems = inputsArray.filter((x) => x.selected);

    if (selectedItems && selectedItems.length > 0) {
      const idInputs = selectedItems
        .map((input) => parseInt(input.idInput))
        .join(", ");
      onSaveInputContract(idInputs);
    }
  };

  const onCloseAdminInput = () => {
    setAdminInput({ show: false, input: "", action: "" });
    setMessageResultOperation("");
  };

  const handleKeyDownEnter = async (event) => {
    if (event.key === "Enter") {
      if (!adminInput.show) {
        await onSearchInput();
      }
    }
  };

  const getChaptersSubchapters = async () => {
    try {
      axios
        .get(
          `${process.env.REACT_APP_BUDGET_URL_API}/get-chapters-subchapters`,
        )
        .then((result) => {
          setChapters(result.data);
          console.log("getChaptersSubchapters===",result.data)
          if(result.data.length>0)
          {
             console.log("getChaptersSubchaptersV1===",result.data[0])
              setChapterSelected(result.data[0])
          }
        
        });
    } catch (error) {
      console.error("Error fetching getChaptersSubchapters:", error);
    }
  };

    const getChapterInputs = async () => {
     
    try {
      axios
        .post(
          `${process.env.REACT_APP_BUDGET_URL_API}/chapter-inputs`,
          {
            idStage: stageSelected.idStage,
            idChapter : chapterSelected.idChapter,
            idSubchapter: chapterSelected.idSubchapter
          }
        )
        .then((result) => {
          setInputs(result.data);
        });
    } catch (error) {
      console.error("Error fetching getChaptersSubchapters:", error);
    }
  };

  useEventListener("keydown", handleKeyDownEnter);

  useEffect(() => {
    getChaptersSubchapters();
  }, []);

  
  useEffect(() => {
    if(chapterSelected &&JSON.stringify(chapterSelected)!=="{")
    getChapterInputs()
  }, [chapterSelected]);

  const onSelectChapter=(value)=>{
    const chapterSelected = chapters.filter(
      (x) =>
        x.cod===value
      
    )
    console.log("chapterSelected",chapterSelected);

    if(chapterSelected && chapterSelected.length>0){
       setChapterSelected(chapterSelected[0])
    }
    setChapterSubChater(value)
  }

  return (
    <div>
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
            inputType="control"
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
            <Back onBack={onBack} className="" />{" "}
            <button
              type="button"
              className="primary"
              onClick={() => onAddInputsContract()}
            >
              {"Agregar Insumo"}
            </button>
          </div>

          <br />
            <div className="row">
            <div className="col-2">Capitulo y Subcapitulo</div>
            <div className="col-10">
              <div className="w-40">
                <ChapterSelect
                  id="cod"
                  name="chapterSubchapter"
                  array={chapters}
                  selectedValue={chapterSubChater}
                  setSelectedValue={onSelectChapter}
                />
              </div>
            </div>
          </div>
             <div className="row">
            <div className="col-2">Inputs</div>
            <div className="col-10">
              <div className="w-40">
                <ChapterSelect
                  id="cod"
                  name="name"
                  array={inputs}
                  selectedValue={inputSelected}
                  setSelectedValue={setInputSelected}
                />
              </div>
            </div>
          </div>
          <InputTable
            inputsArray={inputsArray}
            onSelectInput={onSelectInput}
            onEditInput={onEditInput}
            onShowCompoundInputs={() => {}}
            showCompoundInputs={false}
            inputType="control"
          />
        </div>
      )}
    </div>
  );
};

export default InputsControl;
