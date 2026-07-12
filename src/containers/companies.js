import { useState, useContext } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { ConstructionContext } from "../context/constructionContext";

const Companies = () => {
  const { role } = useContext(ConstructionContext);
  const [companiesArray, setCompaniesArray] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [message, setMessage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [form, setForm] = useState({ nit: "", name: "", address: "", phone: "", email: "" });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const searchCompanies = async () => {
    if (!searchText || searchText.trim().length < 2) {
      setCompaniesArray([]);
      return;
    }
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_SECURITY_URL_API}/search-companies`,
        { headers, params: { search: searchText } }
      );
      setCompaniesArray(result.data || []);
    } catch (err) {
      console.error("Error searching companies:", err);
    }
  };

  const openCreate = () => {
    setEditCompany(null);
    setForm({ nit: "", name: "", address: "", phone: "", email: "" });
    setLogoFile(null);
    setLogoPreview(null);
    setMessage("");
    setShowAdmin(true);
  };

  const openEdit = (index) => {
    const c = companiesArray[index];
    setEditCompany(c);
    setForm({
      nit: c.Nit || c.nit || "",
      name: c.Name || c.name || "",
      address: c.Address || c.address || "",
      phone: c.Phone || c.phone || "",
      email: c.Email || c.email || "",
    });
    setLogoFile(null);
    // Si la empresa tiene logo, mostrar preview desde el API de presupuesto
    const compId = c.IdCompany || c.idCompany;
    setLogoPreview(`${process.env.REACT_APP_BUDGET_URL_API}/company-logo?idCompany=${compId}`);
    setMessage("");
    setShowAdmin(true);
  };

  const onLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        setMessage("El logo no puede superar 500KB");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async (idCompany) => {
    if (!logoFile) return;
    const formData = new FormData();
    formData.append("logo", logoFile);
    formData.append("idCompany", idCompany);
    try {
      await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/upload-company-logo`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error uploading logo:", err);
    }
  };

  const onSave = async () => {
    if (!form.nit || !form.name) {
      setMessage("NIT y Nombre son obligatorios");
      return;
    }
    try {
      const url = editCompany
        ? `${process.env.REACT_APP_SECURITY_URL_API}/update-company`
        : `${process.env.REACT_APP_SECURITY_URL_API}/create-company`;

      const body = {
        ...form,
        idCompany: editCompany ? (editCompany.IdCompany || editCompany.idCompany) : undefined,
      };

      const result = await axios.post(url, body, { headers });

      if (result.data && result.data.length > 0 && result.data[0].result === "exists") {
        setMessage("Ya existe una empresa con ese NIT");
      } else {
        // Subir logo si hay uno seleccionado
        const compId = editCompany
          ? (editCompany.IdCompany || editCompany.idCompany)
          : (result.data && result.data[0] ? result.data[0].company : null);
        if (compId && logoFile) {
          await uploadLogo(compId);
        }
        setShowAdmin(false);
        setMessage("");
        if (searchText.length >= 2) searchCompanies();
      }
    } catch (err) {
      console.error("Error saving company:", err);
      setMessage("Error al guardar empresa");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") searchCompanies();
  };

  return (
    <div className="left">
      <br />
      <div className="header-title">
        <span>LISTADO DE EMPRESAS</span>
        <span className="subheader-title">&nbsp;&nbsp;&nbsp;{companiesArray.length} empresa(s)</span>
      </div>
      <div className="row" style={{ marginBottom: "15px" }}>
        <div className="col-4">
          <input
            className="input w-100"
            type="text"
            placeholder="Nombre o NIT..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <div className="col-6">
          <button className="primary" onClick={searchCompanies}>
            <i className="fas fa-search" /> Buscar
          </button>
          &nbsp;&nbsp;
          <button className="secondary" onClick={openCreate}>
            <i className="fas fa-plus" /> Crear Nueva Empresa
          </button>
        </div>
      </div>

      {showAdmin && (
        <div className="modal show" style={{ display: "block", position: "initial" }}>
          <Modal.Dialog>
            <Modal.Body>
              <div className="subtitle center">
                <b>{editCompany ? "EDITAR EMPRESA" : "CREAR EMPRESA"}</b>
              </div>
              {message && <div className="center mandatory"><b>{message}</b></div>}
              <br />
              <div className="row">
                <div className="col-4 right label"><span>NIT</span></div>
                <div className="col-8">
                  <input className="input w-100" type="text" value={form.nit}
                    onChange={(e) => setForm({ ...form, nit: e.target.value })} />
                  {!form.nit && <div className="mandatory left"><i className="fas fa-exclamation-circle" /> NIT Obligatorio</div>}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-4 right label"><span>Nombre</span></div>
                <div className="col-8">
                  <input className="input w-100" type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  {!form.name && <div className="mandatory left"><i className="fas fa-exclamation-circle" /> Nombre Obligatorio</div>}
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-4 right label"><span>Dirección</span></div>
                <div className="col-8">
                  <input className="input w-100" type="text" value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-4 right label"><span>Teléfono</span></div>
                <div className="col-8">
                  <input className="input w-100" type="text" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-4 right label"><span>Email</span></div>
                <div className="col-8">
                  <input className="input w-100" type="text" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-4 right label"><span>Logo</span></div>
                <div className="col-8">
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={onLogoChange}
                    style={{ fontSize: "10pt" }}
                  />
                  <div style={{ fontSize: "9pt", color: "gray" }}>PNG o JPG, máximo 500KB</div>
                  {logoPreview && (
                    <div style={{ marginTop: "8px" }}>
                      <img
                        src={logoPreview}
                        alt="Logo"
                        style={{ maxHeight: "50px", maxWidth: "150px", objectFit: "contain" }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <br />
              <div className="right">
                <button className="secondary" onClick={() => setShowAdmin(false)}>Cerrar</button>
                &nbsp;&nbsp;
                <button className="primary" disabled={!form.nit || !form.name} onClick={onSave}>
                  {editCompany ? "Guardar" : "Crear Empresa"}
                </button>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </div>
      )}

      {companiesArray.length > 0 && (
        <table className="table w-70">
          <thead>
            <tr>
              <th className="w-5">LOGO</th>
              <th className="w-15">NIT</th>
              <th className="w-25">NOMBRE</th>
              <th className="w-15">DIRECCIÓN</th>
              <th className="w-15">TELÉFONO</th>
              <th className="w-15">EMAIL</th>
              <th className="w-5">EDITAR</th>
            </tr>
          </thead>
          <tbody>
            {companiesArray.map((c, index) => (
              <tr key={index}>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <img
                    src={`${process.env.REACT_APP_BUDGET_URL_API}/company-logo?idCompany=${c.IdCompany || c.idCompany}`}
                    alt=""
                    style={{ maxHeight: "25px", maxWidth: "50px", objectFit: "contain" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </td>
                <td className={index % 2 === 0 ? "dark" : ""}>{c.Nit || c.nit}</td>
                <td className={index % 2 === 0 ? "dark" : ""}>{c.Name || c.name}</td>
                <td className={index % 2 === 0 ? "dark" : ""}>{c.Address || c.address || ""}</td>
                <td className={index % 2 === 0 ? "dark" : ""}>{c.Phone || c.phone || ""}</td>
                <td className={index % 2 === 0 ? "dark" : ""}>{c.Email || c.email || ""}</td>
                <td className={index % 2 === 0 ? "dark center" : "center"}>
                  <i className="fas fa-pencil-alt icon-view-detail" onClick={() => openEdit(index)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Companies;
