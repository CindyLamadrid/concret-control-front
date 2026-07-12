import { useState, useEffect, useRef } from "react";
import ChapterSelect from "./commons/select";
import SubchapterSelect from "./commons/select";
import axios from "../config/axiosConfig";

const Chapters = ({
  chapterSelected,
  setChapterSelected,
  subchapterSelected,
  setSubchapterSelected,
  setShowOption,
}) => {
  const [chapterArray, setChapterArray] = useState([]);
  const [allSubchapterArray, setAllSubchapterArray] = useState([]);
  const [subchapterArray, setSubchapterArray] = useState([]);
  // ref para saber si ya cargamos los datos maestros (solo una vez)
  const initialized = useRef(false);

  // BUG-09 fix: carga de capítulos y subcapítulos solo al montar el componente.
  // Antes el useEffect dependía de chapterSelected, lo que provocaba que cada vez
  // que setChapterSelected era llamado dentro de getchapters, se volvía a disparar
  // el effect generando llamadas en cadena a la API.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Cargar capítulos
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/chapters`)
      .then((response) => {
        if (response.data.length > 0) {
          setChapterArray(response.data);
          // Solo fijar el capítulo si el padre aún no tiene uno válido (>0)
          if (!chapterSelected || chapterSelected <= 0) {
            setChapterSelected(response.data[0].idChapter);
          }
        }
      })
      .catch((error) => console.error("Error fetching chapters:", error));

    // Cargar todos los subcapítulos (catálogo completo, una sola vez)
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/subchapters`)
      .then((response) => {
        setAllSubchapterArray(response.data);
      })
      .catch((error) => console.error("Error fetching subchapters:", error));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // BUG-10 fix: cuando cambia el capítulo, filtrar subcapítulos del nuevo capítulo
  // y verificar si el subchapterSelected actual pertenece a ese capítulo.
  // Si no pertenece (o es 0), seleccionar el primero de la lista nueva.
  useEffect(() => {
    if (!chapterSelected || chapterSelected <= 0 || allSubchapterArray.length === 0) return;

    const subchapters = allSubchapterArray.filter(
      (x) => x.idChapter === parseInt(chapterSelected, 10)
    );
    setSubchapterArray(subchapters);

    if (subchapters.length === 0) {
      setSubchapterSelected(0);
      localStorage.setItem(
        "chapterValues",
        JSON.stringify({ chapterSelected, subchapterSelected: 0 })
      );
      return;
    }

    // Comprobar si el subcapítulo actual pertenece a los del nuevo capítulo
    const belongsToCurrent = subchapters.some(
      (x) => x.idSubchapter === parseInt(subchapterSelected, 10)
    );

    const newSubchapter = belongsToCurrent
      ? parseInt(subchapterSelected, 10)
      : subchapters[0].idSubchapter;

    setSubchapterSelected(newSubchapter);
    localStorage.setItem(
      "chapterValues",
      JSON.stringify({ chapterSelected, subchapterSelected: newSubchapter })
    );
  }, [chapterSelected, allSubchapterArray]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeChapter = (value) => {
    if (value) {
      const newChapter = parseInt(value, 10);
      // Poner subcapítulo en 0 para que el efecto anterior lo resuelva
      setSubchapterSelected(0);
      setChapterSelected(newChapter);
      localStorage.setItem(
        "chapterValues",
        JSON.stringify({ chapterSelected: newChapter, subchapterSelected: 0 })
      );
    }
  };

  const onChangeSubchapter = (value) => {
    if (value) {
      const newSubchapter = parseInt(value, 10);
      setSubchapterSelected(newSubchapter);
      setShowOption("constructionItems");
      localStorage.setItem(
        "chapterValues",
        JSON.stringify({ chapterSelected, subchapterSelected: newSubchapter })
      );
    }
  };

  return (
    <div className="row">
      <div className="col-3">
        <ChapterSelect
          id="idChapter"
          name="codName"
          selectedValue={chapterSelected}
          setSelectedValue={onChangeChapter}
          array={chapterArray}
        />
      </div>
      <div className="col-3">
        <SubchapterSelect
          id="idSubchapter"
          name="name"
          selectedValue={subchapterArray && subchapterArray.length > 0 ? subchapterSelected : -1}
          setSelectedValue={onChangeSubchapter}
          array={subchapterArray}
        />
      </div>
      <div className="col-6"></div>
    </div>
  );
};

export default Chapters;
