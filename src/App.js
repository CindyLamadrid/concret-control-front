import {useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate,useLocation } from "react-router-dom";

import "./App.scss";
import "./styles/menu.scss";
import "./styles/container.scss";
import "./styles/table.scss";
import "./styles/button.scss"
import "./styles/controls.scss"
import "./styles/login.scss"
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
import Suppliers from "./containers/suppliers"
import Contracts from "./containers/contracts"
import InputsContract from "./containers/inputsContract"
import InputsControl from "./containers/inputsControl"

function RouteLogger() {
  const location = useLocation();

  useEffect(() => {
    console.log("📍 PATH:", location.pathname);
    console.log("🔎 SEARCH:", location.search);
    console.log("🧩 FULL:", location.pathname + location.search);
    console.log("🧠 KEY:", location.key);
  }, [location]);

  return null;
}

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
         <RouteLogger />
          <div className="row no-margin">
          
            <div className="no-margin">
              <Menu setReportOption={setReportOption}/>
            </div>
           
              <Routes>
                  <Route exact path="/login" element={<Login />} />
                  <Route exact path="/"  element={<Login />} />
                
                  <Route exact path="/home" element={<div className="component"><Constructions /></div>} />
                  <Route exact path="/budget" element={<div className="component"><Budget /></div>} />
                  <Route exact path="/stages" element={<div className="component"><Stages /></div>} />
                  <Route exact path="/search-items" element={<div className="component"><Items /></div>} />
                  <Route exact path="/search-inputs" element={<div className="component"><Inputs /></div>} />
                  <Route exact path="/users" element={<div className="component"><AdminUsers /></div>} />
                  <Route exact path="/chapters" element={<div className="component"><Chapters /></div>} />
                  <Route exact path="/subchapters" element={<div className="component"><Subchapters /></div>} />
                  <Route exact path="/control" element={<div className="component"><Control /></div>} />
                  <Route exact path="/suppliers" element={<div className="component"><Suppliers /></div>} />
                  <Route exact path="/contracts" element={<div className="component"><Contracts  /></div>} /> 
                  <Route exact path="inputs-contract" element={<div className="component"><InputsContract /></div>} /> 
                  <Route exact path="inputs-control" element={<div className="component"><InputsControl /></div>} /> 
                {/* <Route exact path="/reports" element={<Reports />} /> */}
                <Route path="*" element={<Navigate to="/" replace />} />
                
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
