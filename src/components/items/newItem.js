import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import UnitSelect from "../commons/select";
import { Button } from "react-bootstrap";

const NewItem = ({ unistsArray, setShowNewItem, onSaveItem }) => {
  const [name, setName] = useState("");
  const [unitSelected, setUnitSelected] = useState("");

  const onChangeUnit = (value) => {
    if (value) setUnitSelected(parseInt(value, 10));
  };

  useEffect(() => {
    if (unistsArray && unistsArray.length > 0)
      setUnitSelected(unistsArray[0].idUnit);
  }, []);

  return (
    <Modal.Dialog>
      <Modal.Body>
        <div className="subtitle center">
          <b> CREAR ITEM</b>
        </div>
        <div className="row ">
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
          <div className="col-8">
            <UnitSelect
              id="idUnit"
              name="name"
              selectedValue={unitSelected}
              setSelectedValue={onChangeUnit}
              array={unistsArray}
            />
          </div>
        </div>
        <br />
        <div className="right">
          <button
            className="secondary"
            type="button"
            onClick={() => setShowNewItem(false)}
          >
            {"Cerrar"}
          </button>
          &nbsp;&nbsp;
          <button
            className="primary"
            disabled={!name}
            onClick={() => {
              onSaveItem(unitSelected, name);
            }}
          >{"Crear Item"}</button>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default NewItem;
