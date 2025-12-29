import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
const handlers = require("../utils/handlers");

const AdminContruction = ({
  adminConstruction,
  setAdminConstruction,
  messageResultOperation,
  onSaveContruction,
}) => {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");

useEffect(() => {
    if (adminConstruction.action === "edit") {
        setName(adminConstruction.construction.name);
        setArea(adminConstruction.construction.area);
    }
  }, [adminConstruction.action]);

  return (
    <Modal.Dialog>
      <Modal.Body>
        <div className="subtitle center">
          <b>
            {" "}
            {adminConstruction.action === "edit"
              ? "EDITAR PROJECTO"
              : "CREAR PROJECTO"}{" "}
          </b>
        </div>
        <div className="center mandatory">
          <div>{messageResultOperation}</div> <br />
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
            <span>Metros Cuadrados</span>
          </div>
          <div className="col-8">
            <input
              className="input w-100"
              type="text"
              onKeyDown={(event) => handlers.onHandlerDecimal(event)}
              value={area}
              onChange={(event) => setArea(event.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="right">
          <button
            className="secondary"
            type="button"
            onClick={() =>
              setAdminConstruction({
                show: false,
                construction: "",
                action: "",
              })
            }
          >
            {"Cerrar"}
          </button>
          &nbsp;&nbsp;
          <button
            className="primary"
            disabled={!name}
            onClick={() => {
              onSaveContruction(name, area, adminConstruction.action);
            }}
          >
            {adminConstruction.action === "edit"
              ? "Guardar Projecto"
              : "Crear Projecto"}
          </button>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default AdminContruction;
