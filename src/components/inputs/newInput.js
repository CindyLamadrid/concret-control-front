import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UnitSelect from "../commons/select";

const handlers = require("../utils/handlers");

const NewInput = ({
  unistsArray,
  categoriesArray,
  inputTypesArray,
  setShowNewInput,
  onSaveInput,
  inputType,
}) => {
  const [name, setName] = useState("");
  const [unitSelected, setUnitSelected] = useState("");
  const [inputTypeSelected, setInputTypeSelected] = useState("");
  const [categorySelected, setCategorySelected] = useState("");
  const [unitValue, setUnitValue] = useState(0);
  const [compound, setCompound] = useState(false);

  const onChangeUnit = (value) => {
    if (value) setUnitSelected(parseInt(value, 10));
  };

  const onChangeInputType = (value) => {
    if (value) setInputTypeSelected(parseInt(value, 10));
  };

  const onChangeCategory = (value) => {
    if (value) setCategorySelected(parseInt(value, 10));
  };

  useEffect(() => {
    if (unistsArray && unistsArray.length > 0)
      setUnitSelected(unistsArray[0].idUnit);
    if (inputTypesArray && inputTypesArray.length > 0)
      setInputTypeSelected(inputTypesArray[0].idInputType);

    if (categoriesArray && categoriesArray.length > 0)
      setCategorySelected(categoriesArray[0].idCategory);
  }, []);

  return (
    <Modal.Dialog>
      <Modal.Body>
        <div className="subtitle center">
          <b> CREAR INSUMO</b>
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
        {/* <div className="row">
          <div className="col-4 right">
            <span>Valor</span>
          </div>
          <div className="col-8">
            <input
              className="input w-100"
              type="text"
              value={unitValue}
              onKeyDown={(event) => handlers.onHandlerDecimal(event)}
              onChange={(event) => setUnitValue(event.target.value)}
            />
            <div className="mandatory left" hidden={unitValue}>
              <i className="fas fa-exclamation-circle" />
              &nbsp; Valor Obligatorio
            </div>
          </div>
        </div> */}

        <div className="row" hidden={inputType === "compound"}>
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
          
            onClick={() => setShowNewInput(false)}
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
                categorySelected
              );
            }}
          >{"Crear Insumo"}</button>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default NewInput;
