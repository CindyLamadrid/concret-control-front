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
      <Modal.Body>
        <div className="subtitle center">
          <b>
            {" "}
            {adminStage.action === "edit"
              ? "EDITAR ETAPA"
              : "CREAR ETAPA"}{" "}
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
  
        <br />
        <div className="right">
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
          &nbsp;&nbsp;
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
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default AdminStage;
