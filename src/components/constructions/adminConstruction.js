import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import ReactSelect from "react-select";
const handlers = require("../utils/handlers");

const AdminContruction = ({
  adminConstruction,
  setAdminConstruction,
  messageResultOperation,
  onSaveContruction,
  companiesArray,
  defaultCompany,
}) => {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [idCompany, setIdCompany] = useState("");

  useEffect(() => {
    if (adminConstruction.action === "edit") {
      setName(adminConstruction.construction.name);
      setArea(adminConstruction.construction.area);
      setIdCompany(adminConstruction.construction.IdCompany || adminConstruction.construction.idCompany || "");
    } else {
      // Al crear, preseleccionar la empresa del usuario
      setIdCompany(defaultCompany && defaultCompany.idCompany ? defaultCompany.idCompany : "");
    }
  }, [adminConstruction.action]);

  return (
    <Modal.Dialog>
      <Modal.Header>
        <div className="subtitle center">
          <b>
            {adminConstruction.action === "edit"
              ? "EDITAR PROYECTO"
              : "CREAR PROYECTO"}
          </b>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="center mandatory">
          <div>{messageResultOperation}</div> <br />
        </div>
        <div className="row">
          <div className="col-4 right label">
            <span>Empresa</span>
          </div>
          <div className="col-8">
            <ReactSelect
              className="react-select-container w-100"
              options={companiesArray ? companiesArray.map((c) => ({
                value: String(c.IdCompany || c.idCompany),
                label: `${c.Name || c.name} (${c.Nit || c.nit})`
              })) : []}
              value={companiesArray ? companiesArray.map((c) => ({
                value: String(c.IdCompany || c.idCompany),
                label: `${c.Name || c.name} (${c.Nit || c.nit})`
              })).find((o) => o.value === String(idCompany)) || null : null}
              onChange={(opt) => setIdCompany(opt ? opt.value : "")}
              placeholder="-- Seleccionar empresa --"
              isSearchable
            />
            <div className="mandatory left" hidden={idCompany}>
              <i className="fas fa-exclamation-circle" />
              &nbsp; Empresa Obligatoria
            </div>
          </div>
        </div>
        <br />
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
      </Modal.Body>
      <Modal.Footer>
          <button
            className="secondary"
            type="button"
            onClick={() =>
              setAdminConstruction({ show: false, construction: "", action: "" })
            }
          >
            {"Cerrar"}
          </button>
          <button
            className="primary"
            disabled={!name || !idCompany}
            onClick={() => {
              onSaveContruction(name, area, adminConstruction.action, parseInt(idCompany));
            }}
          >
            {adminConstruction.action === "edit" ? "Guardar Proyecto" : "Crear Proyecto"}
          </button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default AdminContruction;
