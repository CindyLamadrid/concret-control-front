import { useEffect, useState, useContext } from "react";
import axios from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import StageTable from "../components/constructions/stageTable";
import Back from "../components/commons/back";
import AdminStage from "../components/constructions/adminStage";

const Stages = ({}) => {
  const navigate = useNavigate();
  const {
    user,
    constructionSelected,
    setStageSelected,
    setConstructionSelected,
    role,
    userConstructions,
    permissions,
  } = useContext(ConstructionContext);

  // Helper: determinar si el usuario puede editar esta etapa
  const canManageStage = (idStage) => {
    if (role && role.isAdmin) return true;
    const assignment = userConstructions.find(
      (uc) =>
        (uc.IdConstruction || uc.idConstruction) === constructionSelected.idConstruction &&
        ((uc.IdStage || uc.idStage) === idStage || (uc.IdStage || uc.idStage) === null)
    );
    return assignment && (assignment.AccessType || assignment.accessType) === "full";
  };

  const [constructionsArray, setConstructionsArray] = useState([]);
  const [constructionStagesArray, setConstructionStagesArray] = useState([]);
  const [messageResultOperation, setMessageResultOperation] = useState("");
  const [showStages, setShowStages] = useState(false);
  const [adminStage, setAdminStage] = useState({
    show: false,
    stage: "",
    action: "",
  });

  const getConstructionStages = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/construction-stages`, {
        params: { idConstruction: constructionSelected.idConstruction },
      })
      .then((result) => {
        if (result && result.data) {
          // Filtrar etapas según asignaciones (Admin ve todo)
          let stages = result.data;
          if (role && !role.isAdmin) {
            const allowedStages = userConstructions
              .filter((uc) => (uc.IdConstruction || uc.idConstruction) === constructionSelected.idConstruction)
              .map((uc) => uc.IdStage || uc.idStage);

            // Si alguna asignación tiene IdStage=null, tiene acceso a todas
            const hasAllStages = allowedStages.includes(null);
            if (!hasAllStages) {
              stages = stages.filter((s) => allowedStages.includes(s.idStage));
            }
          }
          setShowStages(true);
          setConstructionStagesArray(stages);
        } else {
          setConstructionStagesArray([]);
        }
      })
      .catch((error) => {
        setConstructionStagesArray([]);
        console.error("Error fetching getConstructionStages:", error);
      });
  };

  useEffect(() => {
    if (constructionSelected && constructionSelected.idConstruction)
      getConstructionStages();
  }, [constructionSelected]);

  const onViewStage = (idConstruction) => {
    getConstructionStages(idConstruction);
    const construction = constructionsArray.filter(
      (x) => x.idConstruction.toString() === idConstruction.toString()
    );

    if (construction && construction.length > 0)
      setConstructionSelected(construction[0]);
  };

  const viewBudget = (stage, budgetType) => {
    // Limpiar selección de capítulo para que cargue el primero al entrar
    localStorage.removeItem("chapterValues");
    navigate(
      `/budget?option=constructionItems&user=${btoa(user)}&idStage=${
        stage[0].idStage
      }&idConstruction=${
        constructionSelected.idConstruction
      }&budgetType=${budgetType}`
    );
  };

  const viewCostControl = (stage) => {
    navigate(
      `/control?option=constructionItems&user=${btoa(user)}&idStage=${
        stage[0].idStage
      }&idConstruction=${constructionSelected.idConstruction}`
    );
  };

  const onViewStageItems = (idStage, optionSelected) => {
    const stage = constructionStagesArray.filter(
      (x) => x.idStage.toString() === idStage.toString()
    );
    if (stage && stage.length > 0) {
      setStageSelected(stage[0]);
      switch (optionSelected) {
        case "CC":
          viewCostControl(stage);
          break;
        default:
          viewBudget(stage, optionSelected);
          break;
      }
    }
  };

  const onBack = () => {
    navigate(`/home?user=${btoa(user)}`);
  };

  const onCreateStage = () => {
    setAdminStage({ show: true, stage: "", action: "new" });
  };

  const onSaveStage = async (name, action) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${
          action === "edit" ? "update-stage" : "create-stage"
        }`,
        {
          idStage: action === "edit" ? parseInt(adminStage.stage.idStage) : 0,
          idConstruction: constructionSelected.idConstruction,
          name,
          user,
        }
      );
      if (result && result.data && result.data.length > 0) {
        const response = result.data[0];

        if (response.stage === 0) {
          setMessageResultOperation(
            "La etapa ya existe con el mismo nombre ingresado"
          );
        } else {
          setAdminStage({ show: false, stage: "", action: "" });
          await getConstructionStages();
        }
      }
    } catch (error) {
      // setNoData(true);
      console.error("Error fetching onSearchItems:", error);
    }
  };

  const onEditStage = (index) => {
    setMessageResultOperation("");
    if (index > -1) {
      const stage = constructionStagesArray[index];
      setAdminStage({ show: true, action: "edit", stage });
    }
  };

  const onChangeTypeBudget = (index, optionSelected) => {
    if (index > -1) {
      const stage = { ...constructionStagesArray[index] };
      stage.budgetType = optionSelected;
      const newConstructionStagesArray = [...constructionStagesArray];
      newConstructionStagesArray[index] = stage;
      setConstructionStagesArray(newConstructionStagesArray);
    }
  };

  const onCloseBudget = async (index) => {
    if (index > -1) {
      const stage = { ...constructionStagesArray[index] };
      try {
        const result = await axios.post(
          `${process.env.REACT_APP_BUDGET_URL_API}/close-budget-stage`,
          {
            idStage: stage.idStage,
            user,
          }
        );
        if (result && result.data && result.data.length > 0) {
          const response = result.data[0];

          if (response.result === "success") {
            await getConstructionStages();
            // setMessageResultOperation(
            //   "La etapa ya existe con el mismo nombre ingresado"
            // );
          }
        }
      } catch (error) {
        // setNoData(true);
        console.error("Error fetching onSearchItems:", error);
      }
    }
  };

  return (
    <div>
      <div>
        <div>
          <Back onBack={onBack} className="" />{" "}
          {canManageStage(null) && (
            <button type="button" className="primary" onClick={() => onCreateStage()}>
              {"Agregar Etapa"}
            </button>
          )}
        </div>
        {adminStage && adminStage.show && (
          <div
            className="modal show"
            style={{ display: "block", position: "initial" }}
          >
            <AdminStage
              adminStage={adminStage}
              setAdminStage={setAdminStage}
              messageResultOperation={messageResultOperation}
              onSaveStage={onSaveStage}
            />
          </div>
        )}

        <div className="header-title">
          <span>LISTADO DE ETAPAS</span>
          <span className="subheader-title">
            {" "}
            &nbsp;&nbsp;&nbsp;{constructionStagesArray.length} Etapa(s)
          </span>
        </div>

        <StageTable
          constructionStagesArray={constructionStagesArray}
          onViewStageItems={onViewStageItems}
          onEditStage={onEditStage}
          onCloseBudget={onCloseBudget}
          onChangeTypeBudget={onChangeTypeBudget}
          canEdit={canManageStage(null)}
        />
      </div>
    </div>
  );
};
export default Stages;
