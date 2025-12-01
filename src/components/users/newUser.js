import { useState } from "react";
import Modal from "react-bootstrap/Modal";

const NewUser = ({setShowNewUser,onSaveUser}) => {
    const [name,setName] = useState('')
    const [userName,setUserName] = useState('')
    const [password,setPassword] = useState('')

  return (
    <Modal.Dialog>
      <Modal.Body>
        <div className="subtitle center">
          <b> CREAR USUARIO</b>
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
            <span>Usuario</span>
          </div>
          <div className="col-8">
            <input
              className="input w-100"
              type="text"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
            <div className="mandatory left" hidden={userName}>
              <i className="fas fa-exclamation-circle" />
              &nbsp; Usuario Obligatorio
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-4 right label">
            <span>Contraseña</span>
          </div>
          <div className="col-8">
            <input
              className="input w-100"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className="mandatory left" hidden={password}>
              <i className="fas fa-exclamation-circle" />
              &nbsp; Contraseña Obligatoria
            </div>
          </div>
        </div>

        <br />
        <div className="right">
          <button
            className="secondary"
            type="button"
            onClick={() => setShowNewUser(false)}
          >
            {"Cerrar"}
          </button>
          &nbsp;
          <button
            className="primary"
            type="button"
            disabled={!name}
            onClick={() => {
              onSaveUser(
                name,userName,password
              );
            }}
          >
            {"Crear Usuario"}
          </button>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};
export default NewUser;
