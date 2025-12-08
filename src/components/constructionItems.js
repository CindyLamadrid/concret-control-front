import { useEffect, useState, useContext } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import axios from "axios";
import { ConstructionContext } from "../context/constructionContext";
import ConstructionItemsTable from "./constructionItems/constructionItemsTable";
import AdminItem from './items/adminItem'
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
  const [messageResultOperation, setMessageResultOperation] = useState("");
  const [adminItem ,setAdminItem]=useState({ show: false, input: "", action: "" });
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

    const onEditItem = (index) => {
    if (index > -1) {
      const item = constructionItemsArray[index];

      setAdminItem({ show: true, item, action: "edit" });
    }
  };

  const onCloseAdminItem = () => {
    setAdminItem({ show: false, input: "", action: "" });
    setMessageResultOperation("");
  };

  const onSaveItem = async (unitSelected, name,action) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/update-item`,
        {
          idItem:action === "edit" ? parseInt(adminItem.item.idItem) : 0,
          idSubchapter,
          idUnit: unitSelected,
          name: name,
          user,
        }
      );
      if (result && result.data && result.data.length > 0) {
        const response = result.data[0];
        
        if (response.item === 0) {
          setMessageResultOperation(
            "El item ya existe con el mismo nombre ingresado"
          );
        } else {
          setConstructionItemsArray([]);
          setAdminItem({ show: false, input: "", action: "" });
          if (adminItem.action === "edit") await onConstructionItems();
        }
      }
    } catch (error) {
      setConstructionItemsArray([]);
      setNoData(true);
      console.error("Error fetching onSearchItems:", error);
    }
   
  };

  useEffect(() => {
    if (constructionItemsArray && constructionItemsArray.length > 0)
      setNoData(false);
    else setNoData(true);
  }, [constructionItemsArray]);

  return (
    <div>
     
          <div className="header-title">
              <span>LISTADO DE ITEMS POR CAPITULO</span>
              <span className="subheader-title"> &nbsp;&nbsp;&nbsp;{constructionItemsArray.length}{" "} Item(s)</span>
          </div>
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
          message="Desea eliminar el item?"
          buttonArray={modalConfiguration.buttonArray}
          item={modalConfiguration.item}
        />
      )}

        {adminItem && adminItem.show && (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <AdminItem
            messageResultOperation={messageResultOperation}
            setAdminItem={setAdminItem}
            onSaveItem={onSaveItem}
            inputType=""
            adminItem={adminItem}
            onCloseAdminItem={onCloseAdminItem}
          />
        </div>
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
          onEditItem={onEditItem}
        />
      )}
      {noData && <div>La busqueda no arrojo resultado</div>}
    </div>
  );
};
export default ConstructionItems;
