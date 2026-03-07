import { useEffect, useState,useContext } from "react";
import axios from "../config/axiosConfig";
import ChaptersTable from "./chapters/chaptersTable";
import AdminOptions from "./commons/adminOptions";
import AdminChapter from "./chapters/adminChapter";
import { ConstructionContext } from "../context/constructionContext";

const Chapters = ({}) => {
  const [chapterArray, setChapterArray] = useState([]);
  const [chapter, setChapter] = useState("");
  const [messageResultOperation, setMessageResultOperation] = useState("");

    const { user } =
      useContext(ConstructionContext);

  const [adminChapter, setAdminChapter] = useState({
    show: false,
    chapter: "",
    action: "",
  });
  const getchapters = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/chapters-name-cod`,
         { 
             params: { 
           nameCod:chapter
         }
       }
      )
      .then((response) => {
        setChapterArray(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const onEditChapter = (index) => {
    setMessageResultOperation("");
    if (index > -1) {
      const chapter = chapterArray[index];
      setAdminChapter({ show: true, chapter, action: "edit" });
    }
  };

  const onAddChapter = () => {
    setAdminChapter({ show: true, chapter: "", action: "new" });
  };

  const onSaveChapter = async(name,action) => {
      try {
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${
         action === "edit" ?  "update-chapter":"create-chapter"}`,
        {
          idChapter:action === "edit" ? parseInt(adminChapter.chapter.idChapter) : 0,
          name,
          user,
        }
      );
      if (result && result.data && result.data.length > 0) {
        const response = result.data[0];
       
        if (response.chapter === 0) {
          setMessageResultOperation(
            "El project ya existe con el mismo nombre ingresado"
          );
        } else {
         
          setAdminChapter({ show: false, chapter: "", action: "" });
          await getchapters();
        }
      }
    } catch (error) {
     
      // setNoData(true);
      console.error("Error fetching onSaveChapter:", error);
    }
  };

  const onSearchChapter = () => {
    getchapters();
  };

  const onCancelOption = () => {};

  useEffect(() => {
    
  }, []);
  return (
    <div>
      <div className="header-title">
        <span>LISTADO DE CAPITULOS</span>
        <span className="subheader-title">
          {" "}
          &nbsp;&nbsp;&nbsp;{chapterArray.length} capitulo(s)
        </span>
      </div>
      {adminChapter && adminChapter.show && (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <AdminChapter
            adminChapter={adminChapter}
            setAdminChapter={setAdminChapter}
            messageResultOperation={messageResultOperation}
            onSaveChapter={onSaveChapter}
          />
        </div>
      )}

      <div>
        <AdminOptions
          value={chapter}
          setValue={setChapter}
          onSearch={onSearchChapter}
          onNewOption={onAddChapter}
          onCancelOption={onCancelOption}
          hideCancelOption
          labelOption="Crear Nuevo Capitulo"
        />
      </div>
      <br />
      {chapterArray && chapterArray.length > 0 && (
        <ChaptersTable
          chapterArray={chapterArray}
          onEditChapter={onEditChapter}
        />
      )}
    </div>
  );
};

export default Chapters;
