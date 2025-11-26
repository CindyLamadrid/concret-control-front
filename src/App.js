import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./styles/menu.css";
import "./styles/container.css";
import "./styles/table.css";
import "./styles/button.css"
import "./styles/controls.css"
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

function App() {
  return (
    <ConstructionProvider>
      <BrowserRouter>
        <div>
           <Header/>
          <div className="row">
            <div className="col-2">
              <Menu />
            </div>
            <div className="col-10">
              <Routes>
                <Route exact path="/home" element={<Constructions />} />
                <Route exact path="/budget" element={<Budget />} />
                <Route exact path="/stages" element={<Stages />} />
                <Route exact path="/search-items" element={<Items />} />
                <Route exact path="/search-inputs" element={<Inputs />} />
                <Route exact path="/reports" element={<Reports />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </ConstructionProvider>
  );
}

export default App;
