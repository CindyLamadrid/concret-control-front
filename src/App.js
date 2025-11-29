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
import Constructions from "./containers/constructions";
import Stages from "./containers/stages";
import Budget from "./containers/budget";
import Items from "./containers/items";
import Inputs from "./containers/inputs";
import Reports from "./containers/reports";
import Footer from "./containers/footer";
import Header from "./containers/header";
import Login from "./containers/login"

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
          <div className="row no-margin">
          
            <div className="col-2 no-margin" >
              <Menu setReportOption={setReportOption}/>
            </div>
           
              <Routes>
                <Route exact path="/login" element={<Login />} />
                
                  <Route exact path="/home" element={<Constructions />} />
                  <Route exact path="/budget" element={<Budget />} />
                  <Route exact path="/stages" element={<Stages />} />
                  <Route exact path="/search-items" element={<Items />} />
                  <Route exact path="/search-inputs" element={<Inputs />} />
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
