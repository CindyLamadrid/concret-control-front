import { useEffect, useState, useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import axios from "axios";
import ConstructionItemsTable from "./constructionItems/constructionItemsTable";
import Back from "./commons/back";
import Modal from "./commons/modal";

const ConstructionItems = ({
  idSubchapter,
  setShowOption,
  setItemSelected,
  constructionItemsArray,
  setConstructionItemsArray,
  onConstructionItems,
}) => {
  const navigate = useNavigate();
  const { user, constructionSelected, stageSelected } =
    useContext(ConstructionContext);

  const [noData, setNoData] = useState(false);
  const [modalConfiguration, setModalConfiguration] = useState({
    show: false,
    buttonArray: [],
  });

  const onChangeQuantity = (event, index) => {
    const newConstructionItemsArray = [...constructionItemsArray];
    newConstructionItemsArray[index].quantityChanged =
      newConstructionItemsArray[index].originalQuantity.toString() !==
      event.target.value
        ? true
        : false;
    newConstructionItemsArray[index].quantity = event.target.value;
    setConstructionItemsArray(...[newConstructionItemsArray]);
  };

  const updateItemStage = async (item) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/update-stage-item`,
        {
          idConstructionStage: item.idConstructionStage,
          quantity: item.quantity,
          user,
        }
      );

      if (result && result.data) onConstructionItems();
    } catch (error) {
      setNoData(true);
      console.error("Error fetching updateItemStage:", error);
    }
  };

  const onSaveInformation = (index) => {
    const constructionItem = { ...constructionItemsArray[index] };
    updateItemStage(constructionItem);
  };



  const onBack = () => {
    const params = createSearchParams({
      idConstruction: constructionSelected.idConstruction,
    });
    navigate(`/stages?${params.toString()}&user=${btoa(user)}&idStage=${stageSelected.idStage}&idConstruction=${constructionSelected.idConstruction}`);
  };

  const onRefresh = () => {
    onConstructionItems();
  };

  const removeItem = async (item) => {
    setModalConfiguration({
      show: false,
      buttonArray: [],
    });

    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/remove-stage-item`,
        {
          idStage: stageSelected.idStage,
          idItem: item.idItem,
          user,
        }
      );

      if (result && result.data) onConstructionItems();
    } catch (error) {
      setConstructionItemsArray([]);
      setNoData(true);
      console.error("Error fetching removeItem:", error);
    }
  };

  const closeModal = () => {
    setModalConfiguration({
      show: false,
      buttonArray: [],
    });
  };

  const onRemoveItem = (index) => {
    const item = { ...constructionItemsArray[index] };
    console.log("remove==", item);
    // removeInputItem(inputItem)
    setModalConfiguration({
      show: true,
      buttonArray: [
        {
          name: "Aceptar",
          disabled: false,
          className:'primary',
          action: removeItem,
        },
        {
          name: "Cancelar",
          disabled: false,
          className:'secondary',
          action: closeModal,
        },
      ],
      item: item,
    });
  };

  const onAddItems = () => {
    navigate(`/search-items?idSubchapter=${idSubchapter.toString()}&user=${btoa(user)}&idStage=${stageSelected.idStage}&idConstruction=${constructionSelected.idConstruction}`);

    //setShowOption('searchItems')
  };

  useEffect(() => {
    if (constructionItemsArray && constructionItemsArray.length > 0)
      setNoData(false);
    else setNoData(true);
  }, [constructionItemsArray]);

  return (
    <div>
      <div>
        <Back onBack={onBack} className="right back" />
         {" "}  {" "}
        <button
          type="button"
          className="primary"
          onClick={() => onAddItems()}
        >
            <i className="fas fa-plus-circle"/>
             {" "}
           <span>Agregar Items</span> 
        </button>
      </div>

      {modalConfiguration && modalConfiguration.show && (
        <Modal
          message="Desea elimiar el item?"
          buttonArray={modalConfiguration.buttonArray}
          item={modalConfiguration.item}
        />
      )}
   
      <br />
      {constructionItemsArray && constructionItemsArray.length > 0 && (
        <ConstructionItemsTable
          constructionItemsArray={constructionItemsArray}
          onChangeQuantity={onChangeQuantity}
          setShowOption={setShowOption}
          setItemSelected={setItemSelected}
          onSaveInformation={onSaveInformation}
          onRefresh={onRefresh}
          onRemoveItem={onRemoveItem}
        />
      )}
      {noData && <div>La busqueda no arrojo resultado</div>}
    </div>
  );
};
export default ConstructionItems;
