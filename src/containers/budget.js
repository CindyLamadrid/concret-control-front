import { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../config/axiosConfig";
import { ConstructionContext } from "../context/constructionContext";
import Chapter from "../components/chaptersHeader";
import ConstructionItems from "../components/constructionItems";
import InputItem from "../components/inputItem";
import Header from "../components/commons/resume";
import CompoundInputs from "../components/compoundInputs";

const Budget = ({}) => {
  const { stageSelected, constructionSelected } =
    useContext(ConstructionContext);

  const [searchParams] = useSearchParams();
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
  });
  const [compoundSelected, setCompoundSelected] = useState({
    idInput: searchParams.get("idCompoundSelected")
      ? searchParams.get("idCompoundSelected")
      : "",
  });
  const [budgetType] = useState(searchParams.get("budgetType"));

  const [chapterSelected, setChapterSelected] = useState(-1);
  const [subchapterSelected, setSubchapterSelected] = useState(-1);
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
    console.log("getItems===", refreshItemSelected);
    if (
      (showOption === "constructionItems" ||
        showOption === "inputItems" ||
        showOption === "compoundInputs") &&
      chapterSelected > 0 &&
      subchapterSelected > 0 &&
      stageSelected.idStage
    )
      onConstructionItems(refreshItemSelected);
  };

  useEffect(() => {
    getItems(false);
  }, [subchapterSelected, stageSelected]);

  useEffect(() => {
    if (idItem && constructionItemsArray && constructionItemsArray.length > 0) {
      const item = constructionItemsArray.filter(
        (x) => x.idItem.toString() === idItem.toString(),
      );
      if (item && item.length > 0) setItemSelected(item[0]);
    }
  }, [constructionItemsArray]);

  useEffect(() => {
    const chapterValues = localStorage.getItem("chapterValues");
    console.log("chapterValues===", chapterValues);

    if (chapterValues) {
      const values = JSON.parse(chapterValues);
      const newChapterSelected = parseInt(values.chapterSelected);
      const newSubchapterSelected = parseInt(values.subchapterSelected);

      setChapterSelected(newChapterSelected);
      setSubchapterSelected(newSubchapterSelected);
    } else {
      setChapterSelected(0);
      setSubchapterSelected(0);
    }
  }, []);

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
        />
      )}
    </div>
  );
};
export default Budget;
