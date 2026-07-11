import {  useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../config/axiosConfig";
import { ConstructionContext } from "../context/constructionContext";
import AdminOptions from "../components/commons/adminOptions";
import AdminItem from "../components/items/adminItem";
import ItemTable from "../components/items/itemTable";
import useEventListener from "../components/utils/useEventListener";

const Items = ({}) => {
  const navigate = useNavigate();
  const { user, stageSelected, constructionSelected } =
    useContext(ConstructionContext);
  const idStage = stageSelected.idStage;
  const [searchParams] = useSearchParams();
  const idSubchapter = searchParams.get("idSubchapter");
  const budgetType = searchParams.get("budgetType");
  const [item, setItem] = useState("");
  const [messageResultOperation, setMessageResultOperation] = useState("");
  const [itemArray, setItemArray] = useState([]);
  const [noData, setNoData] = useState(false);
  const [adminItem, setAdminItem] = useState({
    show: false,
    item: "",
    action: "",
  });

  const onSearchItems = async () => {
    if (!item) return;
    setMessageResultOperation("");
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/search-subchapter-items`,
        {
          name: item,
          idSubchapter,
        }
      );
      if (result && result.data && result.data.length > 0) {
        setItemArray(result.data);
        setNoData(false);
      } else {
        setItemArray([]);
        setNoData(true);
      }
    } catch (error) {
      setItemArray([]);
      setNoData(true);
      console.error("Error fetching onSearchItems:", error);
    }
  };

  const onSaveItem = async (unitSelected, name,action) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${
         action === "edit" ?  "update-item":"create-subchapter-item"}`,
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
        // const newItems = response.map((x) => {
        //   const item = x;
        //   item.selected = false;
        //   return item;
        // });
        // setItemArray(newItems);
        if (response.item === 0) {
          setMessageResultOperation(
            "El item ya existe con el mismo nombre ingresado"
          );
        } else {
          setItemArray([]);
          setAdminItem({ show: false, input: "", action: "" });
          if (adminItem.action === "edit") await onSearchItems();
        }
      }
    } catch (error) {
      setItemArray([]);
      setNoData(true);
      console.error("Error fetching onSearchItems:", error);
    }
   
  };

  const onNewItem = () => {
    setMessageResultOperation("")
    setNoData(false)
    setAdminItem({ show: true, action: "new", item: "" });
  };

  const onSelectItem = (index) => {
    if (index > -1) {
      const newItemArray = [...itemArray]; ;
      newItemArray[index].selected = !itemArray[index].selected;
    
      setItemArray(...[newItemArray]);
    }
  };

  const createStageItems = async (stageItems) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/create-stage-items`,
        {
          idStage: idStage,
          idItem: stageItems.idItems,
          user,
          type: budgetType
        }
      );
       if (result && result.data && result.data.length > 0) {
        setNoData(false);

        const created = result.data[0];

        if (created.stageItem === 0) {
        
          setMessageResultOperation(
            "El item ya existe para el capitulo seleccionado"
          );
        }else{
         navigate(
        `/budget?option=constructionItems&user=${btoa(user)}&idStage=${
          stageSelected.idStage
        }&idConstruction=${constructionSelected.idConstruction}&budgetType=${budgetType}`
      );
        } 
    }
    } catch (error) {
      setItemArray([]);
      setNoData(true);
      console.error("Error fetching onSearchItems:", error);
    }
    setAdminItem({ show: false, action: "", item: "" });
  };

  const onEditItem = (index) => {
     setMessageResultOperation("");
    if (index > -1) {
      const item = itemArray[index];
      setAdminItem({ show: true, action: "edit", item });
    }
  };

  const onAddItems = () => {
    const selectedItems = itemArray.filter((x) => x.selected);
    if (selectedItems && selectedItems.length > 0) {
      const defaultItems = selectedItems.map((x) => {
        const apu = x;
        x.quantity = 0;
        x.value = 0;
        return apu;
      });
  
      const stageItems = [...defaultItems];
      const idItems = selectedItems.map((input) => input.idItem).join(", ");
      stageItems.idItems = idItems;
  
      createStageItems(stageItems);

    }
  };

  const onCancelOption = () => {
    navigate(
      `/budget?option=constructionItems&user=${btoa(user)}&idStage=${
        stageSelected.idStage
      }&idConstruction=${constructionSelected.idConstruction}&budgetType=${budgetType}`
    );
  };

  const handleKeyDownEnter = async (event) => {
    if (event.key === "Enter") {
      if (!adminItem.show) {
        await onSearchItems();
      }
    }
  };
  useEventListener("keydown", handleKeyDownEnter);

  return (
    <div>
    
      <div>
        <br />
        <div className="header-title">
          <span>OPCIONES DE ITEMS</span>
        </div>

        <AdminOptions
          value={item}
          setValue={setItem}
          onSearch={onSearchItems}
          onNewOption={onNewItem}
          labelOption="Crear Nuevo Item"
          onCancelOption={onCancelOption}
        />
      </div>
      {noData && <div>La busqueda no arrojo resultado</div>}

      {<div hidden={adminItem && adminItem.show}>{messageResultOperation}</div>}

      {adminItem && adminItem.show && (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <AdminItem
            adminItem={adminItem}
            messageResultOperation={messageResultOperation}
            setAdminItem={setAdminItem}
            onSaveItem={onSaveItem}
          />
        </div>
      )}
      {itemArray && itemArray.length > 0 && (
        <div>
          <br />
          <div className="subtitle">
            <span>LISTADO DE ITEMS GENERALES</span>
          </div>

          <div>
            <button
              type="button"
              className="primary"
              value="Agregar Items"
              onClick={() => onAddItems()}
            >
              {"Agregar Items"}
            </button>{" "}
            &nbsp;
          </div>
          <br />
          <ItemTable
            itemArray={itemArray}
            onSelectItem={onSelectItem}
            onEditItem={onEditItem}
          />
          <br />
        </div>
      )}
    </div>
  );
};
export default Items;
