import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

const NewUser = ({ setShowNewUser, onSaveUser, message }) => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [idCompany, setIdCompany] = useState("");
  const [idRole, setIdRole] = useState("");
  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SECURITY_URL_API}/companies`, { headers })
      .then((r) => setCompanies(r.data || []))
      .catch(() => {});

    axios
      .get(`${process.env.REACT_APP_SECURITY_URL_API}/roles`, { headers })
      .then((r) => {
        const rolesData = r.data || [];
        setRoles(rolesData);
        // Default: Presupuestador
        const presupuestador = rolesData.find(
          (rol) => (rol.Name || rol.name || "").toLowerCase() === "presupuestador"
        );
        if (presupuestador) {
          setIdRole(String(presupuestador.IdRole || presupuestador.idRole));
        } else if (rolesData.length > 0) {
          setIdRole(String(rolesData[0].IdRole || rolesData[0].idRole));
        }
      })
      .catch(() => {});
  }, []);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const canSave = name && userName && password && passwordsMatch && idCompany && idRole;

  const handleSave = () => {
    if (canSave) {
      onSaveUser(name.toUpperCase(), userName.toLowerCase(), password, parseInt(idCompany), parseInt(idRole));
    }
  };

  return (
    <Modal.Dialog>
      <Modal.Body>
        <form autoComplete="off">
        <div className="subtitle center">
          <b>CREAR USUARIO</b>
        </div>
        <div className="center mandatory">
          <div>{message}</div>
        </div>
        <div className="row">
          <div className="col-4 right label">
            <span>Empresa</span>
          </div>
          <div className="col-8">
            <select
              className="select w-100"
              value={idCompany}
              onChange={(e) => setIdCompany(e.target.value)}
            >
              <option value="">-- Seleccionar empresa --</option>
              {companies.map((c) => (
                <option key={c.IdCompany || c.idCompany} value={c.IdCompany || c.idCompany}>
                  {c.Name || c.name} ({c.Nit || c.nit})
                </option>
              ))}
            </select>
            <div className="mandatory left" hidden={idCompany}>
              <i className="fas fa-exclamation-circle" />
              &nbsp; Empresa Obligatoria
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-4 right label">
            <span>Rol</span>
          </div>
          <div className="col-8">
            <select
              className="select w-100"
              value={idRole}
              onChange={(e) => setIdRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r.IdRole || r.idRole} value={r.IdRole || r.idRole}>
                  {r.Name || r.name}
                </option>
              ))}
            </select>
            <div className="mandatory left" hidden={idRole}>
              <i className="fas fa-exclamation-circle" />
              &nbsp; Rol Obligatorio
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-4 right label">
            <span>Nombre Completo</span>
          </div>
          <div className="col-8">
            <input
              className="input w-100"
              type="text"
              autoComplete="off"
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
              autoComplete="new-username"
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
              autoComplete="new-password"
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
        <div className="row">
          <div className="col-4 right label">
            <span>Confirmar Contraseña</span>
          </div>
          <div className="col-8">
            <input
              className="input w-100"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {confirmPassword && !passwordsMatch && (
              <div className="mandatory left">
                <i className="fas fa-exclamation-circle" />
                &nbsp; Las contraseñas no coinciden
              </div>
            )}
          </div>
        </div>
        <br />
        <div className="right">
          <button className="secondary" type="button" onClick={() => setShowNewUser(false)}>
            Cerrar
          </button>
          &nbsp;
          <button className="primary" type="button" disabled={!canSave} onClick={handleSave}>
            Crear Usuario
          </button>
        </div>
        </form>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default NewUser;
