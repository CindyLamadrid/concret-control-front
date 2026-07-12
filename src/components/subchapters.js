import { useEffect, useState, useContext } from "react";
import axios from "../config/axiosConfig";
import SubchaptersTable from "./chapters/subchaptersTable";
import AdminOptions from "./commons/adminOptions";
import AdminSubchapter from "./chapters/adminSubchapter";
import Modal from "./commons/modal";
import { ConstructionContext } from "../context/constructionContext";

const Subchapters = ({}) => {
  const [subchapterArray, setSubchapterArray] = useState([]);
  const [subchapter, setSubchapter] = useState("");
  const [messageResultOperation, setMessageResultOperation] = useState("");

  const [modalConfiguration, setModalConfiguration] = useState({
    show: false,
    buttonArray: [],
  });

  const { user, role } = useContext(ConstructionContext);

  const isAdmin = role && role.isAdmin;

  const [adminSubchapter, setAdminSubchapter] = useState({
    show: false,
    chapter: "",
    action: "",
  });
  const getsubchapters = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/subchapters-name-cod`, {
        params: {
          nameCod: subchapter,
        },
      })
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
    setMessageResultOperation("")
    setAdminSubchapter({ show: true, subchapter: "", action: "new" });
  };

  const onSaveSubchapter = async (name, idChapter, action) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${
          action === "edit" ? "update-subchapter" : "create-subchapter"
        }`,
        {
          idSubchapter:
            action === "edit"
              ? parseInt(adminSubchapter.subchapter.idSubchapter)
              : 0,
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
    setMessageResultOperation("")
    getsubchapters();
  };

  const closeModal = () => {
    setModalConfiguration({
      show: false,
      buttonArray: [],
    });
  };

  const onRemoveSubchapter = async (index) => {
    const subchapter = { ...subchapterArray[index] };
    setModalConfiguration({
      show: true,
      buttonArray: [
        {
          name: "Aceptar",
          disabled: false,
          className: "primary",
          action: removeSubchapter,
        },
        {
          name: "Cancelar",
          disabled: false,
          className: "secondary",
          action: closeModal,
        },
      ],
      item: subchapter,
    });
  };

  const removeSubchapter = async (item) => {
    try {
     
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/remove-subchapter`,
        {
          idSubchapter:item.idSubchapter,
        }
      );
      if (result && result.data && result.data.length > 0) {
        const response = result.data[0];

        if (response.result === "exists") {
          setMessageResultOperation(
            "No es posible eliminar el subcapitulo, ya que contiene items asociados"
          );
        } else {
         
          await getsubchapters();
        }
         setModalConfiguration({ show: false, buttonArray:[]});
      }
    } catch (error) {
      // setNoData(true);
      console.error("Error fetching onSaveChapter:", error);
    }
  };

  const onCancelOption = () => {};

  useEffect(() => {}, []);
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
          {modalConfiguration && modalConfiguration.show && (
        <Modal
          message="Desea eliminar subcapitulo?"
          buttonArray={modalConfiguration.buttonArray}
          item={modalConfiguration.item}
        />
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
      {<div className="mandatory" hidden={adminSubchapter && adminSubchapter.show}>{messageResultOperation}</div>}

      <br />
      {subchapterArray && subchapterArray.length > 0 && (
        <SubchaptersTable
          subchapterArray={subchapterArray}
          onEditSubchapter={onEditSubchapter}
          onRemoveSubchapter={onRemoveSubchapter}
          canEdit={isAdmin}
        />
      )}
    </div>
  );
};

export default Subchapters;
