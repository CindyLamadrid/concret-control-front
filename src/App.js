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
import Header from "./containers/header";
import Login from "./containers/login"
import AdminUsers from "./containers/users"

function App() {
  const [reportOption,setReportOption] = useState('')
  const [user,setUser] = useState('')
 
  useEffect(()=>{
    const userLogged = localStorage.getItem("user")
    console.log("userLogged",userLogged);
    setUser(userLogged)
  },[])

  return (
    <ConstructionProvider>
      <BrowserRouter>
        <div>
         <Header />
         <Settings/>
          <div className="row no-margin">
          
            <div className="col-2 no-margin" >
              <Menu setReportOption={setReportOption}/>
            </div>
           
              <Routes>
                <Route exact path="/login" element={<Login />} />
                
                  <Route exact path="/home" element={<div className="col-10"><Constructions /></div>} />
                  <Route exact path="/budget" element={<div className="col-10"><Budget /></div>} />
                  <Route exact path="/stages" element={<div className="col-10"><Stages /></div>} />
                  <Route exact path="/search-items" element={<div className="col-10"><Items /></div>} />
                  <Route exact path="/search-inputs" element={<div className="col-10"><Inputs /></div>} />
                  <Route exact path="/users" element={<div className="col-10"><AdminUsers /></div>} />
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
