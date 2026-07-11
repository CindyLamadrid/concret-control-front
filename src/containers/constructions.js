import { useEffect, useState, useContext } from "react";
import axios from "../config/axiosConfig";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import ConstructionTable from "../components/constructions/constructionTable";
import AdminContruction from "../components/constructions/adminConstruction";

const Constructions = ({}) => {
  const navigate = useNavigate();
  const { setConstructionSelected, user, role, userConstructions, permissions } = useContext(ConstructionContext);

  const [constructionsArray, setConstructionsArray] = useState([]);
  const [messageResultOperation, setMessageResultOperation] = useState("");
  const [adminConstruction, setAdminConstruction] = useState({
    show: false,
    construction: "",
    action: "",
  });

  const getConstructions = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/constructions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        if (result && result.data) {
          // Filtrar obras según asignaciones (Admin ve todo)
          if (role && role.isAdmin) {
            setConstructionsArray(result.data);
          } else {
            const allowedIds = userConstructions.map((uc) => uc.IdConstruction || uc.idConstruction);
            const filtered = result.data.filter((c) => allowedIds.includes(c.idConstruction));
            setConstructionsArray(filtered);
          }
        } else {
          setConstructionsArray([]);
        }
      })
      .catch((error) => {
        setConstructionsArray([]);
        console.error("Error fetching getConstructions:", error);
      });
  };

  useEffect(() => {
    localStorage.setItem(
      "chapterValues",
      JSON.stringify({ chapterSelected: 0, subchapterSelected: 0 })
    );
    getConstructions();
  }, []);

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

  const onSaveContruction = async(name,area,action) => {

      try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${
         action === "edit" ?  "update-construction":"create-construction"}`,
        {
          idConstruction:action === "edit" ? parseInt(adminConstruction.construction.idConstruction) : 0,
          name,
          area,
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
      {canManage() && (
        <div>
          <button
            type="button"
            className="primary"
            onClick={() => onCreateProject()}
          >
            {"Agregar Projecto"}
          </button>
        </div>
      )}
      {adminConstruction && adminConstruction.show && (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <AdminContruction
            adminConstruction={adminConstruction}
            setAdminConstruction={setAdminConstruction}
            messageResultOperation={messageResultOperation}
            onSaveContruction={onSaveContruction}
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
