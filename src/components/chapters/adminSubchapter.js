import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "../../config/axiosConfig";
import ChapterSelect from "../commons/select";
const handlers = require("../utils/handlers");

const AdminSubchapter = ({
  adminSubchapter,
  setAdminSubchapter,
  messageResultOperation,
  onSaveSubchapter,
}) => {
  const [name, setName] = useState("");
  const [chapterArray, setChapterArray] = useState([]);
  const [chapterSelected, setChapterSelected] = useState("");

  const getchapters = (newChapterSelected) => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/chapters`)
      .then((response) => {
        setChapterArray(response.data);
        if (response.data.length > 0)
          setChapterSelected(newChapterSelected || response.data[0].idChapter);
       
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const onChangeChapter = (value) => {
    if (value) {
      setChapterSelected(parseInt(value, 10));
    }
  };

  useEffect(() => {
    if (adminSubchapter.action === "edit") {
      setName(adminSubchapter.subchapter.name);
      getchapters(adminSubchapter.subchapter.idChapter);
    } else {
      getchapters();
    }
  }, [adminSubchapter.action]);

  return (
    <Modal.Dialog>
      <Modal.Body>
        <div className="subtitle center">
          <b>
            {" "}
            {adminSubchapter.action === "edit"
              ? "EDITAR SUBCAPITUILO"
              : "CREAR SUBCAPITUILO"}{" "}
          </b>
        </div>
        <div className="center mandatory">
          <div>{messageResultOperation}</div> <br />
        </div>
        <div className="row ">
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
        <div className="row ">
          <div className="col-4 right label">
            <span>Capitulo</span>
          </div>
          <div className="col-8">
            <ChapterSelect
              id="idChapter"
              name="codName"
              selectedValue={chapterSelected}
              setSelectedValue={onChangeChapter}
              array={chapterArray}
            />
            <div className="mandatory left" hidden={name}>
              <i className="fas fa-exclamation-circle" />
              &nbsp; Nombre Obligatorio
            </div>
          </div>
        </div>
        <br />
        <br />
        <div className="right">
          <button
            className="secondary"
            type="button"
            onClick={() =>
              setAdminSubchapter({
                show: false,
                chapter: "",
                action: "",
              })
            }
          >
            {"Cerrar"}
          </button>
          &nbsp;&nbsp;
          <button
            className="primary"
            disabled={!name}
            onClick={() => {
              onSaveSubchapter(name,chapterSelected, adminSubchapter.action);
            }}
          >
            {adminSubchapter.action === "edit"
              ? "Guardar Subcapitulo"
              : "Crear Subcapitulo"}
          </button>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default AdminSubchapter;
