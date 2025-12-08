import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, createSearchParams } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import ConstructionTable from "../components/constructions/constructionTable";
import AdminContruction from "../components/constructionItems/adminConstruction";

const Constructions = ({}) => {
  const navigate = useNavigate();
  const { setConstructionSelected, user } = useContext(ConstructionContext);

  const [constructionsArray, setConstructionsArray] = useState([]);
  const [messageResultOperation, setMessageResultOperation] = useState("");
  const [adminConstruction, setAdminConstruction] = useState({
    show: false,
    construction: "",
    action: "",
  });

  const getConstructions = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/constructions`)
      .then((result) => {
        if (result && result.data) {
          setConstructionsArray(result.data);
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
            "El project ya existe con el mismo nombre ingresado"
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

  return (
    <div>
      <br/>
      <div>
        <button
          type="button"
          className="primary"
          onClick={() => onCreateProject()}
        >
          {"Agregar Projecto"}
        </button>
      </div>
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
          />
        </div>
      )}
    </div>
  );
};
export default Constructions;
