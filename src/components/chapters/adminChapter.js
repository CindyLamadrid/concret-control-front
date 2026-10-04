import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "../commons/modalHeader";

const handlers = require("../utils/handlers");

const AdminChapter = ({
  adminChapter,
  setAdminChapter,
  messageResultOperation,
  onSaveChapter,
}) => {
  const [name, setName] = useState("");


useEffect(() => {
    if (adminChapter.action === "edit") {
        setName(adminChapter.chapter.name);
      
    }
  }, [adminChapter.action]);

  return (
    <Modal.Dialog>
      <ModalHeader title={adminChapter.action === "edit" ? "EDITAR CAPITULO" : "CREAR CAPITULO"} onClose={() => setAdminChapter({ show: false, chapter: "", action: "" })} />
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer>
          <button
            className="secondary"
            type="button"
            onClick={() =>
              setAdminChapter({
                show: false,
                chapter: "",
                action: "",
              })
            }
          >
            {"Cerrar"}
          </button>
          <button
            className="primary"
            disabled={!name}
            onClick={() => {
              onSaveChapter(name, adminChapter.action);
            }}
          >
            {adminChapter.action === "edit"
              ? "Guardar Capitulo"
              : "Crear Capitulo"}
          </button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default AdminChapter;
