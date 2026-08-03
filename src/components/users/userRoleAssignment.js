import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import ReactSelect from "react-select";

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
        <Modal.Header>
          <div className="subtitle center">
            <b>ASIGNAR OBRAS — {userName}</b>
          </div>
        </Modal.Header>
        <Modal.Body>

          {/* Formulario de asignación */}
          <div className="row mb-15">
            <div className="col-3">
              <span className="label">Obra</span>
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
              />
            </div>
            <div className="col-3">
              <span className="label">Etapa (vacío = todas)</span>
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
              />
            </div>
            <div className="col-3">
              <span className="label">Nivel de acceso</span>
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
              />
            </div>
            <div className="col-3 pt-22">
              <button className="primary" onClick={onAdd} disabled={!idConstruction || (stages.length === 0 && idConstruction)}>
                <i className="fas fa-plus" /> Asignar
              </button>
              {idConstruction && stages.length === 0 && (
                <div className="mandatory text-sm mt-8">
                  Esta obra no tiene etapas creadas
                </div>
              )}
            </div>
          </div>

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
