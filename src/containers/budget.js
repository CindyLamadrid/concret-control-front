import { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../config/axiosConfig";
import { ConstructionContext } from "../context/constructionContext";
import usePermissions from "../hooks/usePermissions";
import Chapter from "../components/chaptersHeader";
import ConstructionItems from "../components/constructionItems";
import InputItem from "../components/inputItem";
import Header from "../components/commons/resume";
import CompoundInputs from "../components/compoundInputs";

const Budget = ({}) => {
  const { stageSelected, constructionSelected } =
    useContext(ConstructionContext);
  const { canEdit } = usePermissions("budget");

  const [searchParams, setSearchParams] = useSearchParams();
  const idItem = searchParams.get("idItem");
  const [showOption, setShowOption] = useState(
    searchParams.get("option")
      ? searchParams.get("option")
      : "constructionItems",
  );
  const [itemSelected, setItemSelected] = useState({
    idConstructionStageItem: searchParams.get("idConstructionStageItem")
      ? searchParams.get("idConstructionStageItem")
      : "",
    idItem: searchParams.get("idItem") || "",
  });
  const [compoundSelected, setCompoundSelected] = useState({
    idInput: searchParams.get("idCompoundSelected")
      ? searchParams.get("idCompoundSelected")
      : "",
  });
  const [budgetType] = useState(searchParams.get("budgetType"));

  // Sincronizar la URL con el estado actual para que al refrescar se mantenga
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("option", showOption);
    if (itemSelected && itemSelected.idConstructionStageItem) {
      params.set("idConstructionStageItem", itemSelected.idConstructionStageItem);
    }
    if (itemSelected && itemSelected.idItem) {
      params.set("idItem", itemSelected.idItem);
    }
    if (compoundSelected && compoundSelected.idInput) {
      params.set("idCompoundSelected", compoundSelected.idInput);
    }
    setSearchParams(params, { replace: true });
  }, [showOption, itemSelected?.idConstructionStageItem, compoundSelected?.idInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const [chapterSelected, setChapterSelected] = useState(() => {
    const saved = localStorage.getItem("chapterValues");
    if (saved) {
      const v = JSON.parse(saved);
      return parseInt(v.chapterSelected) || 0;
    }
    return 0;
  });
  const [subchapterSelected, setSubchapterSelected] = useState(() => {
    const saved = localStorage.getItem("chapterValues");
    if (saved) {
      const v = JSON.parse(saved);
      return parseInt(v.subchapterSelected) || 0;
    }
    return 0;
  });
  const [constructionItemsArray, setConstructionItemsArray] = useState([]);
  // const [inputType,setInputType] = useState('')
  const [itemInputsArray, setItemInputsArray] = useState([]);

  const onConstructionItems = async (refreshItemSelected) => {
    axios
      .post(`${process.env.REACT_APP_BUDGET_URL_API}/stage-items`, {
        idStage: stageSelected.idStage,
        idSubchapter: subchapterSelected,
        type: budgetType,
      })
      .then((result) => {
        if (result && result.data && result.data.length > 0) {
          setConstructionItemsArray(result.data);
          if (refreshItemSelected) {
            const item = result.data.filter(
              (x) => x.idItem.toString() === itemSelected.idItem.toString(),
            );
            setItemSelected(item[0]);
          }
        } else {
          setConstructionItemsArray([]);
        }
      })
      .catch((error) => {
        setConstructionItemsArray([]);
        // setNoData(true)
        console.error("Error fetching onConstructionItems:", error);
      });
  };

  const getItemInputs = async (id, refreshInputSelected) => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/item-inputs`,
        {
          params: { idConstructionStageItem: id },
        },
      );
      if (result && result.data && result.data.length > 0) {
        setItemInputsArray(result.data);

        if (refreshInputSelected) {
          const compound = result.data.filter(
            (x) => x.idInput.toString() === compoundSelected.idInput.toString(),
          );
          setCompoundSelected(compound[0]);
        }
      } else {
        setItemInputsArray([]);
      }
    } catch (error) {
      setItemInputsArray([]);
      console.error("Error fetching onSearchInput:", error);
    }
  };

  const getItems = (refreshItemSelected) => {
    const idStage = stageSelected && stageSelected.idStage
      ? stageSelected.idStage
      : null;

    if (
      (showOption === "constructionItems" ||
        showOption === "inputItems" ||
        showOption === "compoundInputs") &&
      chapterSelected > 0 &&
      subchapterSelected > 0 &&
      idStage
    )
      onConstructionItems(refreshItemSelected);
  };

  // BUG-16 fix: usar stageSelected.idStage como dependencia primitiva en lugar
  // del objeto stageSelected completo. Cuando el provider rehidrata desde
  // localStorage, React puede considerar que el objeto "no cambió" si la
  // referencia es la misma, y no disparar el effect. Con el valor primitivo
  // idStage sí detecta el cambio correctamente.
  const idStageForEffect = stageSelected && stageSelected.idStage
    ? stageSelected.idStage
    : null;

  useEffect(() => {
    getItems(false);
  }, [subchapterSelected, idStageForEffect]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (idItem && constructionItemsArray && constructionItemsArray.length > 0) {
      const item = constructionItemsArray.filter(
        (x) => x.idItem.toString() === idItem.toString(),
      );
      if (item && item.length > 0) setItemSelected(item[0]);
    }
  }, [constructionItemsArray]);

  // Al refrescar en inputItems o compoundInputs, recargar los insumos del ítem
  useEffect(() => {
    if (
      (showOption === "inputItems" || showOption === "compoundInputs") &&
      itemSelected &&
      itemSelected.idConstructionStageItem
    ) {
      getItemInputs(itemSelected.idConstructionStageItem, showOption === "compoundInputs");
    }
  }, [itemSelected?.idConstructionStageItem, showOption]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {showOption === "constructionItems" && (
        <Header
          stageSelected={stageSelected}
          constructionSelected={constructionSelected}
        />
      )}
      {showOption !== "inputItems" && showOption !== "compoundInputs" && (
        <div className="container_chapters">
          <Chapter
            chapterSelected={chapterSelected}
            setChapterSelected={setChapterSelected}
            subchapterSelected={subchapterSelected}
            setSubchapterSelected={setSubchapterSelected}
            setShowOption={setShowOption}
          />
        </div>
      )}

      {showOption === "constructionItems" && (
        <ConstructionItems
          idSubchapter={subchapterSelected}
          budgetType={budgetType}
          setShowOption={setShowOption}
          setItemSelected={setItemSelected}
          constructionItemsArray={constructionItemsArray}
          setConstructionItemsArray={setConstructionItemsArray}
          onConstructionItems={onConstructionItems}
          canEdit={canEdit}
        />
      )}
      {showOption === "inputItems" && (
        <InputItem
          constructionItemsArray={constructionItemsArray}
          budgetType={budgetType}
          itemSelected={itemSelected}
          setShowOption={setShowOption}
          setItemInputsArray={setItemInputsArray}
          setItemSelected={setItemSelected}
          //setInputType={setInputType}
          setCompoundSelected={setCompoundSelected}
          getItems={getItems}
          getItemInputs={getItemInputs}
          itemInputsArray={itemInputsArray}
          canEdit={canEdit}
        />
      )}
      {showOption === "compoundInputs" && (
        <CompoundInputs
          itemSelected={itemSelected}
          budgetType={budgetType}
          compoundSelected={compoundSelected}
          subchapterSelected={subchapterSelected}
          // setInputType={setInputType}
          setShowOption={setShowOption}
          setCompoundSelected={setCompoundSelected}
          getItemInputs={getItemInputs}
          canEdit={canEdit}
        />
      )}
    </div>
  );
};
export default Budget;
