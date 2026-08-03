import { useEffect, useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import ReactSelect from "react-select";
import axios from "../../config/axiosConfig";
import { ConstructionContext } from "../../context/constructionContext";

const Charges = ({ show, onClose, onHandleSaveContracts, currentItem }) => {
  const { constructionSelected, stageSelected } = useContext(ConstructionContext);

  const [constructionStagesArray, setConstructionStagesArray] = useState([]);
  const [stageOption, setStageOption] = useState(null);

  const [chapters, setChapters] = useState([]);
  const [chapterSelected, setChapterSelected] = useState(null);

  const [inputs, setInputs] = useState([]);
  const [inputSelected, setInputSelected] = useState(null);

  // --- loaders ---
  const getConstructionStages = (item) => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/construction-stages`, {
        params: { idConstruction: constructionSelected.idConstruction },
      })
      .then((result) => {
        if (result && result.data) {
          setConstructionStagesArray(result.data);
          if (item) {
            const found = result.data.find((s) => s.idStage === parseInt(item.idStage));
          
            if (found) setStageOption({ value: found.idStage, label: found.name, ...found });
          }
        } else {
          setConstructionStagesArray([]);
        }
      })
      .catch((error) => {
        setConstructionStagesArray([]);
        console.error("Error fetching getConstructionStages:", error);
      });
  };

  const getChaptersSubchapters = (item) => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/get-chapters-subchapters`)
      .then((result) => {
        setChapters(result.data);
        if (item && item.idChapter && item.idSubchapter) {
          const found = result.data.find(
            (c) => c.idChapter === parseInt(item.idChapter) && c.idSubchapter === parseInt(item.idSubchapter)
          );
          if (found) setChapterSelected(found);
        } else if (result.data && result.data.length > 0) {
          setChapterSelected(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching getChaptersSubchapters:", error);
      });
  };

  const getChapterInputs = (stage, chapter, item) => {
    if (!stage || !chapter) return;
    axios
      .post(`${process.env.REACT_APP_BUDGET_URL_API}/chapter-inputs`, {
        idStage: stage.idStage,
        idChapter: chapter.idChapter,
        idSubchapter: chapter.idSubchapter,
      })
      .then((result) => {
        const data = result.data || [];
        setInputs(data);
        if (item && item.idInputBudget) {
          const found = data.find((i) => parseInt(i.idInput) === parseInt(item.idInputBudget));
          if (found) setInputSelected({ value: parseInt(found.idInput), label: `${found.cod} - ${found.name}`, ...found });
          else setInputSelected(null);
        } else {
          setInputSelected(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching getChapterInputs:", error);
      });
  };

  // Reset when modal closes
  useEffect(() => {
    if (!show) {
      setStageOption(null);
      setChapterSelected(null);
      setInputSelected(null);
      setInputs([]);
      setConstructionStagesArray([]);
      setChapters([]);
    }
  }, [show]);

  // Load data when modal opens with currentItem
  useEffect(() => {
    if (!show) return;
    getConstructionStages(currentItem);
    getChaptersSubchapters(currentItem);
  }, [show, currentItem]);

  // Load inputs when both stage and chapter are selected
  useEffect(() => {
    if (stageOption && chapterSelected) {
      getChapterInputs(stageOption, chapterSelected,currentItem);
    }
  }, [stageOption, chapterSelected]);

  // --- select options ---
  const stageOptions = constructionStagesArray.map((s) => ({
    value: s.idStage,
    label: s.name,
    ...s,
  }));

  const chapterOptions = chapters.map((c) => ({
    value: `${c.idChapter}-${c.idSubchapter}`,
    label: `${c.cod || ""} ${c.chapter || ""} - ${c.subchapter || ""}`,
    ...c,
  }));

  const inputOptions = inputs.map((i) => ({
    value: i.idInput,
    label: `${i.cod} - ${i.name}`,
    ...i,
  }));

  const onHandleSave = () => {
    if (stageOption && chapterSelected && inputSelected) {
      onHandleSaveContracts({ stage: stageOption, chapter: chapterSelected, input: inputSelected,currentItem });
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show modal-xs modal-inline"
    >
      <Modal.Dialog>
        <Modal.Header>
          <div className="subtitle center">
            <b>IMPUTACIÓN</b>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div>

            <div className="section-title">
              Seleccione la imputación
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-5 right label">
                <span>Etapa&nbsp;</span>
              </div>
              <div className="col-7">
                <ReactSelect
                  className="react-select-container"
                  isClearable
                  options={stageOptions}
                  value={stageOption}
                  onChange={(val) => setStageOption(val)}
                  placeholder="Seleccione etapa..."
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-5 right label">
                <span>Capítulo / Subcapítulo&nbsp;</span>
              </div>
              <div className="col-7">
                <ReactSelect
                  className="react-select-container"
                  isClearable
                  options={chapterOptions}
                  value={chapterSelected ? chapterOptions.find((o) => o.value === `${chapterSelected.idChapter}-${chapterSelected.idSubchapter}`) : null}
                  onChange={(val) => setChapterSelected(val || null)}
                  placeholder="Seleccione capítulo..."
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
            </div>

            <div className="row subcontainer-admin-options">
              <div className="col-5 right label">
                <span>Insumo&nbsp;</span>
              </div>
              <div className="col-7">
                <ReactSelect
                  className="react-select-container"
                  isClearable
                  options={inputOptions}
                  value={inputSelected}
                  onChange={(val) => setInputSelected(val || null)}
                  placeholder="Seleccione insumo..."
                  isDisabled={!stageOption || !chapterSelected}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
            </div>

          </div>
        </Modal.Body>
        <Modal.Footer>
              <button className="secondary" type="button" onClick={()=>onClose()}>
                Cancelar
              </button>
              <button
                className="primary"
                type="button"
                disabled={!stageOption || !chapterSelected || !inputSelected}
                onClick={()=>onHandleSave()}
              >
                Guardar
              </button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

export default Charges;
