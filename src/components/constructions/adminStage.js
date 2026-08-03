import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";


const AdminStage = ({
  adminStage,
  setAdminStage,
  messageResultOperation,
  onSaveStage,
}) => {
  const [name, setName] = useState("");

useEffect(() => {
    if (adminStage.action === "edit") {
        setName(adminStage.stage.name);
       
    }
  }, [adminStage.action]);

  return (
    <Modal.Dialog>
      <Modal.Header>
        <div className="subtitle center">
          <b>
            {" "}
            {adminStage.action === "edit"
              ? "EDITAR ETAPA"
              : "CREAR ETAPA"}{" "}
          </b>
        </div>
      </Modal.Header>
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
              setAdminStage({
                show: false,
                stage: "",
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
              onSaveStage(name, adminStage.action);
            }}
          >
            {adminStage.action === "edit"
              ? "Guardar Etapa"
              : "Crear Etapa"}
          </button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default AdminStage;
