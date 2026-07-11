import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

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

  return (
    <div className="modal show" style={{ display: "block", position: "initial" }}>
      <Modal.Dialog size="lg">
        <Modal.Body>
          <div className="subtitle center">
            <b>ASIGNAR OBRAS — {userName}</b>
          </div>

          {/* Formulario de asignación */}
          <div className="row" style={{ marginBottom: "15px" }}>
            <div className="col-3">
              <span className="label">Obra</span>
              <select
                className="select"
                value={idConstruction}
                onChange={(e) => { setIdConstruction(e.target.value); setIdStage(""); }}
              >
                <option value="">-- Seleccionar --</option>
                {constructions.map((c) => (
                  <option key={c.idConstruction} value={c.idConstruction}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-3">
              <span className="label">Etapa (vacío = todas)</span>
              <select
                className="select"
                value={idStage}
                onChange={(e) => setIdStage(e.target.value)}
                disabled={!idConstruction}
              >
                <option value="">Todas las etapas</option>
                {stages.map((s) => (
                  <option key={s.idStage} value={s.idStage}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-3">
              <span className="label">Nivel de acceso</span>
              <select
                className="select"
                value={accessType}
                onChange={(e) => setAccessType(e.target.value)}
              >
                <option value="view">Solo ver</option>
                <option value="full">Control completo</option>
              </select>
            </div>
            <div className="col-3" style={{ paddingTop: "22px" }}>
              <button className="primary" onClick={onAdd} disabled={!idConstruction}>
                <i className="fas fa-plus" /> Asignar
              </button>
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

          <br />
          <div className="right">
            <button className="secondary" onClick={() => setSelectedUser(null)}>
              Cerrar
            </button>
          </div>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
};

export default UserRoleAssignment;
