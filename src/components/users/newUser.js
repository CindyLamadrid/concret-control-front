import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import ReactSelect from "react-select";
import ModalHeader from "../commons/modalHeader";

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

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const isPasswordValid = hasMinLength && hasUpperCase && hasSpecialChar;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const canSave = name && userName && isPasswordValid && passwordsMatch && idCompany && idRole;

  const handleSave = () => {
    if (canSave) {
      onSaveUser(name.toUpperCase(), userName.toLowerCase(), password, parseInt(idCompany), parseInt(idRole));
    }
  };

  const selectStyles = {
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    input: (base) => ({ ...base, color: '#333' }),
  };

  return (
    <Modal.Dialog>
      <ModalHeader title="CREAR USUARIO" onClose={() => setShowNewUser(false)} />
      <Modal.Body>
        <form autoComplete="off">
          {message && (
            <div className="center mandatory" style={{ marginBottom: '10px' }}>
              <b>{message}</b>
            </div>
          )}

          <div className="row" style={{ marginBottom: '15px' }}>
            <div className="col-5 right label">
              <span>Empresa</span>
            </div>
            <div className="col-7">
              <ReactSelect
                className="react-select-container w-100"
                options={companies.map((c) => ({
                  value: String(c.IdCompany || c.idCompany),
                  label: `${c.Name || c.name} (${c.Nit || c.nit})`
                }))}
                value={companies.map((c) => ({
                  value: String(c.IdCompany || c.idCompany),
                  label: `${c.Name || c.name} (${c.Nit || c.nit})`
                })).find((o) => o.value === String(idCompany)) || null}
                onChange={(opt) => setIdCompany(opt ? opt.value : "")}
                placeholder="-- Seleccionar empresa --"
                isSearchable
                menuPortalTarget={document.body}
                styles={selectStyles}
              />
              {!idCompany && (
                <div className="mandatory left">
                  <i className="fas fa-exclamation-circle" /> Empresa Obligatoria
                </div>
              )}
            </div>
          </div>

          <div className="row" style={{ marginBottom: '15px' }}>
            <div className="col-5 right label">
              <span>Rol</span>
            </div>
            <div className="col-7">
              <ReactSelect
                className="react-select-container w-100"
                options={roles.map((r) => ({
                  value: String(r.IdRole || r.idRole),
                  label: r.Name || r.name
                }))}
                value={roles.map((r) => ({
                  value: String(r.IdRole || r.idRole),
                  label: r.Name || r.name
                })).find((o) => o.value === String(idRole)) || null}
                onChange={(opt) => setIdRole(opt ? opt.value : "")}
                placeholder="-- Seleccionar rol --"
                isSearchable
                menuPortalTarget={document.body}
                styles={selectStyles}
              />
            </div>
          </div>

          <div className="row" style={{ marginBottom: '15px' }}>
            <div className="col-5 right label">
              <span>Nombre Completo</span>
            </div>
            <div className="col-7">
              <input
                className="input w-100"
                type="text"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {!name && (
                <div className="mandatory left">
                  <i className="fas fa-exclamation-circle" /> Nombre Obligatorio
                </div>
              )}
            </div>
          </div>

          <div className="row" style={{ marginBottom: '15px' }}>
            <div className="col-5 right label">
              <span>Usuario</span>
            </div>
            <div className="col-7">
              <input
                className="input w-100"
                type="text"
                autoComplete="new-username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              {!userName && (
                <div className="mandatory left">
                  <i className="fas fa-exclamation-circle" /> Usuario Obligatorio
                </div>
              )}
            </div>
          </div>

          <div className="row" style={{ marginBottom: '8px' }}>
            <div className="col-5 right label">
              <span>Contraseña</span>
            </div>
            <div className="col-7">
              <input
                className="input w-100"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Password requirements */}
          <div className="row" style={{ marginBottom: '15px' }}>
            <div className="col-5"></div>
            <div className="col-7">
              <div style={{ fontSize: '10px', color: '#666', lineHeight: '1.6' }}>
                <div>
                  <i className={`fas ${hasMinLength ? 'fa-check-circle' : 'fa-circle'}`} style={{ color: hasMinLength ? '#28a745' : '#ccc', marginRight: '5px' }} />
                  Minimo 8 caracteres
                </div>
                <div>
                  <i className={`fas ${hasUpperCase ? 'fa-check-circle' : 'fa-circle'}`} style={{ color: hasUpperCase ? '#28a745' : '#ccc', marginRight: '5px' }} />
                  Al menos una letra mayuscula
                </div>
                <div>
                  <i className={`fas ${hasSpecialChar ? 'fa-check-circle' : 'fa-circle'}`} style={{ color: hasSpecialChar ? '#28a745' : '#ccc', marginRight: '5px' }} />
                  Al menos un caracter especial (!@#$%&*)
                </div>
              </div>
            </div>
          </div>

          <div className="row" style={{ marginBottom: '15px' }}>
            <div className="col-5 right label">
              <span>Confirmar Contraseña</span>
            </div>
            <div className="col-7">
              <input
                className="input w-100"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && !passwordsMatch && (
                <div className="mandatory left">
                  <i className="fas fa-exclamation-circle" /> Las contraseñas no coinciden
                </div>
              )}
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="secondary" type="button" onClick={() => setShowNewUser(false)}>
          Cerrar
        </button>
        <button className="primary" type="button" disabled={!canSave} onClick={handleSave}>
          Crear Usuario
        </button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default NewUser;
