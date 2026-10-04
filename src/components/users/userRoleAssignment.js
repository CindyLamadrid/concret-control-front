import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import ReactSelect from "react-select";
import ModalHeader from "../commons/modalHeader";

const UserRoleAssignment = ({
  selectedUser,
  setSelectedUser,
  constructions,
  userAssignments,
  onAssignConstruction,
  onRemoveAssignment,
}) => {
  const [idConstruction, setIdConstruction] = useState("");
  const [idStage, setIdStage] = useState("");
  const [accessType, setAccessType] = useState("view");
  const [stages, setStages] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Cargar etapas cuando se selecciona una obra
  useEffect(() => {
    if (idConstruction) {
      axios
        .get(`${process.env.REACT_APP_BUDGET_URL_API}/construction-stages`, {
          headers,
          params: { idConstruction },
        })
        .then((r) => setStages(r.data || []))
        .catch(() => setStages([]));
    } else {
      setStages([]);
    }
  }, [idConstruction]);

  const onAdd = () => {
    if (!idConstruction) return;
    setMessage("");

    // Verificar si ya existe una asignación para esa obra+etapa
    const duplicate = userAssignments.find((a) => {
      const aConst = parseInt(a.IdConstruction || a.idConstruction, 10);
      const aStage = a.IdStage || a.idStage || null;
      const newStage = idStage ? parseInt(idStage) : null;
      return aConst === parseInt(idConstruction) && aStage === newStage;
    });

    if (duplicate) {
      setMessage("Ya existe una asignación para esta obra y etapa.");
      return;
    }

    onAssignConstruction(
      parseInt(idConstruction),
      idStage ? parseInt(idStage) : null,
      accessType
    );
    setIdStage("");
  };

  const userName = selectedUser.CompleteName || selectedUser.completeName;
  const userCompanyId = selectedUser.IdCompany || selectedUser.idCompany;

  // Filtrar obras solo de la empresa del usuario seleccionado
  const filteredConstructions = constructions.filter(
    (c) => (c.IdCompany || c.idCompany) === userCompanyId
  );

  return (
    <div className="modal show modal-inline">
      <Modal.Dialog size="lg">
        <ModalHeader title={`ASIGNAR OBRAS — ${userName}`} onClose={() => setSelectedUser(null)} />
        <Modal.Body>

          {message && (
            <div className="center mandatory" style={{ marginBottom: '10px' }}>
              <i className="fas fa-exclamation-circle" /> {message}
            </div>
          )}

          {/* Formulario de asignación */}
          <div className="row" style={{ alignItems: 'flex-end', gap: '10px', marginBottom: '20px' }}>
            <div className="col-3">
              <span className="label" style={{ display: 'block', marginBottom: '6px' }}>Obra</span>
              <ReactSelect
                className="react-select-container"
                options={filteredConstructions.map((c) => ({
                  value: String(c.idConstruction),
                  label: c.name
                }))}
                value={filteredConstructions.map((c) => ({
                  value: String(c.idConstruction),
                  label: c.name
                })).find((o) => o.value === String(idConstruction)) || null}
                onChange={(opt) => { setIdConstruction(opt ? opt.value : ""); setIdStage(""); }}
                placeholder="-- Seleccionar --"
                isSearchable
                isClearable
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }), input: (base) => ({ ...base, color: '#333' }) }}
              />
            </div>
            <div className="col-3">
              <span className="label" style={{ display: 'block', marginBottom: '6px' }}>Etapa (vacío = todas)</span>
              <ReactSelect
                className="react-select-container"
                options={stages.map((s) => ({
                  value: String(s.idStage),
                  label: s.name
                }))}
                value={stages.map((s) => ({
                  value: String(s.idStage),
                  label: s.name
                })).find((o) => o.value === String(idStage)) || null}
                onChange={(opt) => setIdStage(opt ? opt.value : "")}
                placeholder="Todas las etapas"
                isSearchable
                isClearable
                isDisabled={!idConstruction}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }), input: (base) => ({ ...base, color: '#333' }) }}
              />
            </div>
            <div className="col-3">
              <span className="label" style={{ display: 'block', marginBottom: '6px' }}>Nivel de acceso</span>
              <ReactSelect
                className="react-select-container"
                options={[
                  { value: "view", label: "Solo ver" },
                  { value: "full", label: "Control completo" }
                ]}
                value={[
                  { value: "view", label: "Solo ver" },
                  { value: "full", label: "Control completo" }
                ].find((o) => o.value === accessType) || null}
                onChange={(opt) => setAccessType(opt ? opt.value : "view")}
                placeholder="Seleccionar acceso"
                isSearchable={false}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }), input: (base) => ({ ...base, color: '#333' }) }}
              />
            </div>
            <div className="col-2">
              <button className="primary" onClick={onAdd} disabled={!idConstruction}>
                <i className="fas fa-plus" /> Asignar
              </button>
            </div>
          </div>
          {idConstruction && stages.length === 0 && (
            <div className="mandatory text-sm" style={{ marginBottom: '10px' }}>
              Esta obra no tiene etapas creadas
            </div>
          )}

          {/* Tabla de asignaciones actuales */}
          {userAssignments.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Obra</th>
                  <th>Etapa</th>
                  <th>Acceso</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {userAssignments.map((a, idx) => (
                  <tr key={idx}>
                    <td>{a.ConstructionName || a.constructionName}</td>
                    <td>{a.StageName || a.stageName || "Todas"}</td>
                    <td>
                      <span className={`badge ${(a.AccessType || a.accessType) === "full" ? "bg-success" : "bg-secondary"}`}>
                        {(a.AccessType || a.accessType) === "full" ? "Control completo" : "Solo ver"}
                      </span>
                    </td>
                    <td>
                      {(a.IdUserConstruction || a.idUserConstruction) && (
                        <button
                          className="secondary"
                          onClick={() => onRemoveAssignment(a.IdUserConstruction || a.idUserConstruction)}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="center">Sin asignaciones. Este usuario no verá ninguna obra.</div>
          )}

      </Modal.Body>
      <Modal.Footer>
            <button className="secondary" onClick={() => setSelectedUser(null)}>
              Cerrar
            </button>
      </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

export default UserRoleAssignment;
