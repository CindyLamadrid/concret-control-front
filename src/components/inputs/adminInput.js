import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import UnitSelect from "../commons/select";

const handlers = require("../utils/handlers");

const AdminInput = ({
  onSaveInput,
  inputType,
  adminInput,
  messageResultOperation,
  onCloseAdminInput,
  
}) => {
  const [name, setName] = useState("");
  const [unitSelected, setUnitSelected] = useState("");
  const [inputTypeSelected, setInputTypeSelected] = useState("");
  const [categorySelected, setCategorySelected] = useState("");
  const [unitValue, setUnitValue] = useState(0);
  const [compound, setCompound] = useState(false);
  const [unistsArray, setUnitsArray] = useState([]);
  const [categoriesArray, setCategories] = useState([]);
  const [inputTypesArray, setinputTypesArray] = useState([]);

  const onChangeUnit = (value) => {
    if (value) setUnitSelected(parseInt(value, 10));
  };

  const onChangeInputType = (value) => {
    if (value) setInputTypeSelected(parseInt(value, 10));
  };

  const onChangeCategory = (value) => {
    if (value) setCategorySelected(parseInt(value, 10));
  };
  const getUnitsArray = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/units`)
      .then((result) => {
        if (result && result.data && result.data.length>0) {
          const { data } = result;
          setUnitsArray(data);
          if(adminInput.action!=="edit")
          setUnitSelected(parseInt(data[0].idUnit));
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
         const { data } = result;
        if (data && data.length>0) {
          setCategories(data);
          if(adminInput.action!=="edit")
          setCategorySelected(parseInt(data[0].idCategory));
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
         const { data } = result;
        if (data && data.length>0) {
          setinputTypesArray(data);
          if(adminInput.action!=="edit")
           setInputTypeSelected(parseInt(data[0].idInputType));
        } else {
          setinputTypesArray([]);
        }
      })
      .catch((error) => {
        setinputTypesArray([]);
        console.error("Error fetching getInputTypes:", error);
      });
  };

  useEffect(() => {
    getUnitsArray();
    getInputTypes();
    getCategoriesArray();
    
  }, []);

  useEffect(
    ()=>{
      console.log(adminInput.action,adminInput.input)
      if(adminInput.action==="edit")
      {
         setName(adminInput.input.name)
         if (unistsArray && unistsArray.length>0)
          setUnitSelected(adminInput.input.idUnit)
          if (inputTypesArray && inputTypesArray.length>0)
          setInputTypeSelected(adminInput.input.idInputType)
          if(categoriesArray && categoriesArray.length>0)
            setCategorySelected(adminInput.input.idCategory)
         setCompound(adminInput.input.compound)
      }
    },[adminInput.action,unistsArray,inputTypesArray,categoriesArray]
  )

  return (
    <Modal.Dialog>
      <Modal.Body>
        <div className="subtitle center">
          <b> {adminInput.action ==="edit" ? "EDITAR INSUMO": "CREAR INSUMO" } </b>
        </div>
        <div className="center mandatory">
          <div>{messageResultOperation}</div> <br/>
        </div>
        <div className="row">
          <div className="col-4 right label">
            <span>Nombre</span>
          </div>
          <div className="col-8">
            <input
              className="input w-100"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <div className="mandatory left" hidden={name}>
              <i className="fas fa-exclamation-circle" />
              &nbsp; Nombre Obligatorio
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-4 right label">
            <span>Unidad de Medida</span>
          </div>
          <div className="col-8 container-select">
            <UnitSelect
              id="idUnit"
              name="name"
              selectedValue={unitSelected}
              setSelectedValue={onChangeUnit}
              array={unistsArray}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-4 right label">
            <span>Tipo de Insumo</span>
          </div>
          <div className="col-8 container-select">
            <UnitSelect
              id="idInputType"
              name="name"
              selectedValue={inputTypeSelected}
              setSelectedValue={onChangeInputType}
              array={inputTypesArray}
            />
          </div>
          <div className="row">
            <div className="col-4 right label">
              <span>Categoria</span>
            </div>
            <div className="col-8 container-select">
              <UnitSelect
                id="idCategory"
                name="name"
                selectedValue={categorySelected}
                setSelectedValue={onChangeCategory}
                array={categoriesArray}
              />
            </div>
          </div>
        </div>
       
        <div className="row" hidden={inputType === "compound" || adminInput.action==="edit"}>
          <div className="col-4 right label">
            <span>Compuesto?</span>
          </div>
          <div className="col-8">
            <input
              className="left"
              type="checkbox"
              checked={compound}
              onChange={() => setCompound(!compound)}
            />
          </div>
        </div>
        <br />
        <div className="right">
          <button
            className="secondary"
            type="button"
          
            onClick={() => { onCloseAdminInput()}}
          >{"Cerrar"}</button>
          &nbsp;
          <button
            className="primary"
            type="button"
            disabled={!name}
            onClick={() => {
              onSaveInput(
                unitSelected,
                inputTypeSelected,
                name,
                unitValue,
                compound,
                categorySelected,
                adminInput.action,
              );
            }}
          >{adminInput.action ==="edit" ? "Guardar Insumo" :"Crear Insumo"}</button>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default AdminInput;
