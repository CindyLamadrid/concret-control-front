import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
// import Container from "./containers/container";
import Menu from "./components/menu";
import { ConstructionProvider } from "./context/constructionProvider";
import Constructions from "./containers/constructions";
import Stages from "./containers/stages";
import Budget from "./containers/budget";
import Items from "./containers/items";
import Inputs from "./containers/inputs";

function App() {
  return (
    <ConstructionProvider>
        <BrowserRouter>
          <Menu />
          <Routes>
            <Route exact path="/home" element={<Constructions />} />
            <Route exact path="/budget" element={<Budget />} />
            <Route exact path="/stages" element={<Stages />} />
            <Route exact path="/search-items" element={<Items />} />
            <Route exact path="/search-inputs" element={<Inputs />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
    </ConstructionProvider>
  );
}

export default App;
