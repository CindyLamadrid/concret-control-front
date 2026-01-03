import {useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import "./styles/menu.css";
import "./styles/container.css";
import "./styles/table.css";
import "./styles/button.css"
import "./styles/controls.css"
import "./styles/login.css"
// import Container from "./containers/container";
import Menu from "./components/menu";
import { ConstructionProvider } from "./context/constructionProvider";
import Settings from "./containers/setting";
import Constructions from "./containers/constructions";
import Stages from "./containers/stages";
import Budget from "./containers/budget";
import Items from "./containers/items";
import Inputs from "./containers/inputs";
import Reports from "./containers/reports";
import Footer from "./containers/footer";
import Login from "./containers/login"
import AdminUsers from "./containers/users"
import Chapters from "./components/chapters";
import Subchapters from "./components/subchapters";
import Control from "./containers/control"

function App() {
  const [reportOption,setReportOption] = useState('')
  const [user,setUser] = useState('')
 
  useEffect(()=>{
    const userLogged = localStorage.getItem("user")
    setUser(userLogged)
  },[])

  return (
    <ConstructionProvider>
      <BrowserRouter>
        <div>
        
         <Settings/>
          <div className="row no-margin">
          
            <div className="no-margin">
              <Menu setReportOption={setReportOption}/>
            </div>
           
              <Routes>
                <Route exact path="/login" element={<Login />} />
                
                  <Route exact path="/home" element={<div className="component"><Constructions /></div>} />
                  <Route exact path="/budget" element={<div className="component"><Budget /></div>} />
                  <Route exact path="/stages" element={<div className="component"><Stages /></div>} />
                  <Route exact path="/search-items" element={<div className="component"><Items /></div>} />
                  <Route exact path="/search-inputs" element={<div className="component"><Inputs /></div>} />
                  <Route exact path="/users" element={<div className="component"><AdminUsers /></div>} />
                  <Route exact path="/chapters" element={<div className="component"><Chapters /></div>} />
                  <Route exact path="/subchapters" element={<div className="component"><Subchapters /></div>} />
                  <Route exact path="/control" element={<div className="component"><Control /></div>} />
                   
                  
                {/* <Route exact path="/reports" element={<Reports />} /> */}
                <Route path="*" element={<Navigate to="/login" replace />} />
                
              </Routes>
           
          </div>
          <Reports reportOption={reportOption} setReportOption={setReportOption}/>
          <Footer />
          
        </div>
      </BrowserRouter>
    </ConstructionProvider>
  );
}

export default App;
