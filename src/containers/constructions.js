import { useEffect, useState, useContext } from "react";
import axios from "../config/axiosConfig";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import ConstructionTable from "../components/constructions/constructionTable";
import AdminContruction from "../components/constructions/adminConstruction";
import ReactSelect from "react-select";

const Constructions = ({}) => {
  const navigate = useNavigate();
  const { setConstructionSelected, user, role, userConstructions, permissions, company } = useContext(ConstructionContext);

  const [constructionsArray, setConstructionsArray] = useState([]);
  const [allConstructions, setAllConstructions] = useState([]);
  const [companiesArray, setCompaniesArray] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [messageResultOperation, setMessageResultOperation] = useState("");
  const [adminConstruction, setAdminConstruction] = useState({
    show: false,
    construction: "",
    action: "",
  });

  const filterByCompany = (constructions, companyId) => {
    if (!companyId) return constructions;
    return constructions.filter((c) => parseInt(c.IdCompany || c.idCompany, 10) === parseInt(companyId, 10));
  };

  const getConstructions = (companyId) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/constructions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        if (result && result.data) {
          setAllConstructions(result.data);
          if (role && role.isAdmin) {
            const filterCompId = companyId || (company && company.idCompany);
            setConstructionsArray(filterByCompany(result.data, filterCompId));
          } else {
            const allowedIds = userConstructions.map((uc) => uc.IdConstruction || uc.idConstruction);
            const filtered = result.data.filter((c) => allowedIds.includes(c.idConstruction));
            setConstructionsArray(filtered);
          }
        } else {
          setConstructionsArray([]);
          setAllConstructions([]);
        }
      })
      .catch((error) => {
        setConstructionsArray([]);
        console.error("Error fetching getConstructions:", error);
      });
  };

  const onCompanyChange = (option) => {
    setSelectedCompany(option);
    if (option) {
      setConstructionsArray(filterByCompany(allConstructions, option.value));
    } else {
      // Si limpia el filtro, muestra todos
      setConstructionsArray(allConstructions);
    }
  };

  useEffect(() => {
    localStorage.setItem(
      "chapterValues",
      JSON.stringify({ chapterSelected: 0, subchapterSelected: 0 })
    );
    getConstructions();
    if (role && role.isAdmin) getCompanies();
  }, []);

  // Cuando cargan las empresas, preseleccionar la del usuario
  useEffect(() => {
    if (companiesArray.length > 0 && company && company.idCompany && !selectedCompany) {
      const found = companiesArray.find((c) => parseInt(c.IdCompany || c.idCompany, 10) === parseInt(company.idCompany, 10));
      if (found) {
        setSelectedCompany({ value: parseInt(found.IdCompany || found.idCompany, 10), label: found.Name || found.name });
      }
    }
  }, [companiesArray]);

  const getCompanies = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_SECURITY_URL_API}/companies`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        if (result && result.data) {
          setCompaniesArray(result.data);
        }
      })
      .catch((error) => console.error("Error fetching companies:", error));
  };

  const onViewStage = (idConstruction) => {
    const construction = constructionsArray.filter(
      (x) => x.idConstruction.toString() === idConstruction.toString()
    );

    if (construction && construction.length > 0) {
      setConstructionSelected(construction[0]);
      const params = createSearchParams({
        idConstruction: construction[0].idConstruction,
      });
      navigate(`/stages?${params.toString()}&user=${btoa(user)}`);
    }
  };

  const onEditContruction = (index) => {

     setMessageResultOperation("");
    if (index > -1) {
      const construction = constructionsArray[index];
      setAdminConstruction({ show: true, action: "edit", construction });
    }
  };

  const onCreateProject = () => {
    setAdminConstruction({ show: true, construction: "", action: "new" });
  };

  const onSaveContruction = async(name, area, action, idCompany) => {

      try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${
         action === "edit" ?  "update-construction":"create-construction"}`,
        {
          idConstruction:action === "edit" ? parseInt(adminConstruction.construction.idConstruction) : 0,
          name,
          area,
          idCompany: idCompany || (company && company.idCompany) || null,
          user,
        }
      );
      if (result && result.data && result.data.length > 0) {
        const response = result.data[0];
       
        if (response.construction === 0) {
          setMessageResultOperation(
            "El proyecto ya existe con el mismo nombre ingresado"
          );
        } else {
         
          setAdminConstruction({ show: false, construction: "", action: "" });
          await getConstructions();
        }
      }
    } catch (error) {
     
      // setNoData(true);
      console.error("Error fetching onSearchItems:", error);
    }
  };

  // Helper: verificar si puede gestionar (crear/editar)
  const canManage = () => {
    if (!role) return false;
    if (role.isAdmin) return true;
    return Array.isArray(permissions) && permissions.some(
      (p) => (p.Module === "constructions" || p.module === "constructions") &&
             (p.Action === "full" || p.action === "full")
    );
  };

  return (
    <div>
      <br/>
      {/* Selector de empresa y botón agregar - solo para admins */}
      {role && role.isAdmin && (
        <div className="row mb-15" style={{ alignItems: 'center' }}>
          <div className="col-1 right label">
            <span>Empresa</span>
          </div>
          <div className="col-4">
            <ReactSelect
              className="react-select-container"
              classNamePrefix="react-select"
              options={companiesArray.map((c) => ({
                value: parseInt(c.IdCompany || c.idCompany, 10),
                label: `${c.Nit || c.nit} - ${c.Name || c.name}`,
              }))}
              value={selectedCompany}
              onChange={onCompanyChange}
              placeholder="Seleccione empresa..."
              isClearable
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                input: (base) => ({ ...base, color: '#333' }),
              }}
            />
          </div>
          <div className="col-3">
            {canManage() && (
              <button
                type="button"
                className="primary"
                onClick={() => onCreateProject()}
              >
                <i className="fas fa-plus" /> {"Agregar Projecto"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Botón para usuarios no admin */}
      {(!role || !role.isAdmin) && canManage() && (
        <div>
          <button
            type="button"
            className="primary"
            onClick={() => onCreateProject()}
          >
            <i className="fas fa-plus" /> {"Agregar Projecto"}
          </button>
        </div>
      )}
      {adminConstruction && adminConstruction.show && (
        <div
          className="modal show modal-inline"
        >
          <AdminContruction
            adminConstruction={adminConstruction}
            setAdminConstruction={setAdminConstruction}
            messageResultOperation={messageResultOperation}
            onSaveContruction={onSaveContruction}
            companiesArray={companiesArray}
            defaultCompany={company}
          />
        </div>
      )}

      {constructionsArray && constructionsArray.length > 0 && (
        <div>
          <div className="header-title">
            <span>LISTADO DE PROYECTOS</span>
            <span className="subheader-title">
              {" "}
              &nbsp;&nbsp;&nbsp;{constructionsArray.length} Projecto(s)
            </span>
          </div>

          <ConstructionTable
            constructionsArray={constructionsArray}
            onViewStage={onViewStage}
            onEditContruction={onEditContruction}
            canEdit={canManage()}
          />
        </div>
      )}
    </div>
  );
};
export default Constructions;
