import { useState, useEffect } from "react";
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
  const [loadedChapter, setLoadedChapter] = useState(false);
  const [loadedSubchapter, setLoadedSubchapter] = useState(false);

  const getchapters = (newChapterSelected) => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/chapters`)
      .then((response) => {
        setChapterArray(response.data);
        if (response.data.length > 0)
          setChapterSelected(newChapterSelected || response.data[0].idChapter);
        setLoadedChapter(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const getSubchapters = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/subchapters`)
      .then((response) => {
        setAllSubchapterArray(response.data);
        setLoadedSubchapter(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    console.log("chapter use effect");
    if (chapterSelected >= 0) {
      getchapters(chapterSelected);
      getSubchapters();
    }
  }, [chapterSelected]);

  const selectSubchapter = () => {
    console.log("selectSubchapter===",chapterSelected);
    if (chapterSelected && JSON.stringify(chapterSelected) !== "{}") {
      const subchapters = allSubchapterArray.filter(
        (x) => x.idChapter === parseInt(chapterSelected, 10)
      );

        
      setSubchapterArray(subchapters);
      if (subchapters.length > 0) {
      
        setSubchapterSelected(
          subchapterSelected || subchapters[0].idSubchapter
        );
         localStorage.setItem(
          "chapterValues",
          JSON.stringify({
            chapterSelected,
            subchapterSelected:
              subchapterSelected || subchapters[0].idSubchapter,
          })
        );

      }else{
        setSubchapterSelected(0)
         localStorage.setItem(
          "chapterValues",
          JSON.stringify({
            chapterSelected,
            subchapterSelected:
              0,
          })
        );
      }
       
       
      
    }
  };

  useEffect(() => {
    
    if (loadedChapter && loadedSubchapter) {
      
      selectSubchapter();
    }
  }, [chapterSelected, loadedChapter, loadedSubchapter]);

  const onChangeChapter = (value) => {
    if (value) {
   
      setChapterSelected(parseInt(value, 10));
      setSubchapterSelected(0);
      localStorage.setItem(
        "chapterValues",
        JSON.stringify({
          chapterSelected: parseInt(value, 10),
          subchapterSelected: 0,
        })
      );
    }
  };

  const onChangeSubchapter = (value) => {
    if (value) {
      setSubchapterSelected(parseInt(value, 10));
      //if (showOption !== 'searchItems') {
      setShowOption("constructionItems");
      localStorage.setItem(
        "chapterValues",
        JSON.stringify({
          chapterSelected,
          subchapterSelected: parseInt(value, 10),
        })
      );
      //}
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
          selectedValue={subchapterArray && subchapterArray.length>0?subchapterSelected:-1}
          setSelectedValue={onChangeSubchapter}
          array={subchapterArray}
        />
      </div>
      <div className="col-6"></div>
    </div>
  );
};
export default Chapters;
