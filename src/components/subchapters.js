import { useEffect, useState,useContext } from "react";
import axios from "axios";
import SubchaptersTable from "./chapters/subchaptersTable";
import AdminOptions from "./commons/adminOptions";
import AdminSubchapter from "./chapters/adminSubchapter";
import { ConstructionContext } from "../context/constructionContext";

const Subchapters = ({}) => {
  const [subchapterArray, setSubchapterArray] = useState([]);
  const [subchapter, setSubchapter] = useState("");
  const [messageResultOperation, setMessageResultOperation] = useState("");

    const { user } =
      useContext(ConstructionContext);

  const [adminSubchapter, setAdminSubchapter] = useState({
    show: false,
    chapter: "",
    action: "",
  });
  const getsubchapters = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/subchapters-name-cod`,
         { 
             params: { 
           nameCod:subchapter
         }
       }
      )
      .then((response) => {
        setSubchapterArray(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const onEditSubchapter = (index) => {
    setMessageResultOperation("");
    if (index > -1) {
      const subchapter = subchapterArray[index];
      setAdminSubchapter({ show: true, subchapter, action: "edit" });
    }
  };

  const onAddSubchapter = () => {
    setAdminSubchapter({ show: true, subchapter: "", action: "new" });
  };

  const onSaveSubchapter = async(name,idChapter,action) => {
      try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${
         action === "edit" ?  "update-subchapter":"create-subchapter"}`,
        {
          idSubchapter:action === "edit" ? parseInt(adminSubchapter.subchapter.idSubchapter) : 0,
          idChapter,
          name,
          user,
        }
      );
      if (result && result.data && result.data.length > 0) {
        const response = result.data[0];
       
        if (response.subchapter === 0) {
          setMessageResultOperation(
            "El project ya existe con el mismo nombre ingresado"
          );
        } else {
         
          setAdminSubchapter({ show: false, chapter: "", action: "" });
          await getsubchapters();
        }
      }
    } catch (error) {
     
      // setNoData(true);
      console.error("Error fetching onSaveChapter:", error);
    }
  };

  const onSearchSubchapter = () => {
    getsubchapters();
  };

  const onCancelOption = () => {};

  useEffect(() => {
    
  }, []);
  return (
    <div>
      <div className="header-title">
        <span>LISTADO DE SUBCAPITULOS</span>
        <span className="subheader-title">
          {" "}
          &nbsp;&nbsp;&nbsp;{subchapterArray.length} capitulo(s)
        </span>
      </div>
      {adminSubchapter && adminSubchapter.show && (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <AdminSubchapter
            adminSubchapter={adminSubchapter}
            setAdminSubchapter={setAdminSubchapter}
            messageResultOperation={messageResultOperation}
            onSaveSubchapter={onSaveSubchapter}
          />
        </div>
      )}

      <div>
        <AdminOptions
          value={subchapter}
          setValue={setSubchapter}
          onSearch={onSearchSubchapter}
          onNewOption={onAddSubchapter}
          onCancelOption={onCancelOption}
          hideCancelOption
          labelOption="Crear Nuevo Subcapitulo"
        />
      </div>
      <br />
      {subchapterArray && subchapterArray.length > 0 && (
        <SubchaptersTable
          subchapterArray={subchapterArray}
          onEditSubchapter={onEditSubchapter}
        />
      )}
    </div>
  );
};

export default Subchapters;
