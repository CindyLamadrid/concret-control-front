import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate,createSearchParams } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import ConstructionTable from "../components/constructions/constructionTable";

const Constructions = ({}) => {
  const navigate = useNavigate();
  const { setConstructionSelected } = useContext(ConstructionContext);

  const [constructionsArray, setConstructionsArray] = useState([]);

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
        console.error("Error fetching getUnitsArray:", error);
      });
  };

  useEffect(() => {
    getConstructions();
  }, []);

  const onViewStage = (idConstruction) => {
    const construction = constructionsArray.filter(
      (x) => x.idConstruction.toString() === idConstruction.toString()
    );

    if (construction && construction.length > 0) {
      setConstructionSelected(construction[0]);
      const params = createSearchParams({idConstruction:construction[0].idConstruction});
      navigate(`/stages?${params.toString()}`);
    }
  };

  return (
    <div>
      {/* <div hidden={!showStages}>
        <Back onBack={onBack} className="right back-no-menu" />
      </div> */}

      {constructionsArray && constructionsArray.length > 0 && (
        <div className="container-no-menu">
          <div className="container-subtitle">
            <b>
              <span className="subtitle">LISTADO DE PROYECTOS</span>
            </b>
          </div>

          <ConstructionTable
            constructionsArray={constructionsArray}
            onViewStage={onViewStage}
          />
        </div>
      )}
    </div>
  );
};
export default Constructions;
