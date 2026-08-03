import { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import Modal from "react-bootstrap/Modal";
import UnitSelect from "../commons/select";


const AdminItem = ({ adminItem, messageResultOperation, setAdminItem, onSaveItem }) => {
  const [name, setName] = useState("");
  const [unitSelected, setUnitSelected] = useState("");
  const [unistsArray, setUnitsArray] = useState([]);

  const onChangeUnit = (value) => {
    if (value) setUnitSelected(parseInt(value, 10));
  };

  const getUnitsArray = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/units`)
      .then((result) => {
        if (result && result.data) {
          const { data } = result;
          setUnitsArray(data);
          if (adminItem.action !== "edit") setUnitSelected(data[0].idUnit);
        } else {
          setUnitsArray([]);
        }
      })
      .catch((error) => {
        setUnitsArray([]);
        console.error("Error fetching getUnitsArray:", error);
      });
  };

  useEffect(() => {
    if (adminItem.action === "edit") {
      setName(adminItem.item.name);
      if (unistsArray && unistsArray.length > 0)
        setUnitSelected(adminItem.item.idUnit);
    }
  }, [adminItem.action, unistsArray]);

  useEffect(() => {
    getUnitsArray();
  }, []);

  return (
    <Modal.Dialog>
      <Modal.Header>
        <div className="subtitle center">
         <b> {adminItem.action ==="edit" ? "EDITAR ITEM": "CREAR ITEM" } </b>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="center mandatory">
          <div>{messageResultOperation}</div> <br/>
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
      </Modal.Body>
      <Modal.Footer>
          <button
            className="secondary"
            type="button"
            onClick={() => setAdminItem({ show: false, item: "", action: "" })}
          >
            {"Cerrar"}
          </button>
          <button
            className="primary"
            disabled={!name}
            onClick={() => {
              onSaveItem(unitSelected, name, adminItem.action);
            }}
          >
            {adminItem.action === "edit" ? "Guardar Item" : "Crear Item"}
          </button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default AdminItem;
