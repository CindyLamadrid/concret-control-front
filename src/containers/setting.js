import { useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";

const Settings = () => {
  const [searchParams] = useSearchParams();
  const { setUser, setConstructionSelected, setStageSelected, constructionSelected, stageSelected } =
    useContext(ConstructionContext);

  useEffect(() => {
    // Restaurar user de la URL si no hay en contexto
    if (searchParams.get("user")) {
      setUser(atob(searchParams.get("user")));
    }

    // Solo sobreescribir constructionSelected si el ID de la URL es DIFERENTE
    // al que ya está en el contexto (que viene de localStorage con todos los campos).
    // Si es el mismo, no tocar — el objeto completo del localStorage tiene .name, .area, etc.
    const urlIdConstruction = searchParams.get("idConstruction");
    if (urlIdConstruction) {
      const currentId = constructionSelected && constructionSelected.idConstruction;
      if (String(currentId) !== String(urlIdConstruction)) {
        setConstructionSelected({ idConstruction: parseInt(urlIdConstruction) });
      }
    }

    // Igual para stageSelected
    const urlIdStage = searchParams.get("idStage");
    if (urlIdStage) {
      const currentId = stageSelected && stageSelected.idStage;
      if (String(currentId) !== String(urlIdStage)) {
        setStageSelected({ idStage: parseInt(urlIdStage) });
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div></div>;
};

export default Settings;
