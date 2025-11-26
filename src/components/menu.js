import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";

const Menu = () => {
  const navigate = useNavigate();
  const { stageSelected } = useContext(ConstructionContext);
  return (
    <div className="menu-container">
      <Navbar className="menu-subcontainer">
        <Container className="container-menu-title">
          <Navbar.Brand className="menu-title">MENU</Navbar.Brand>
        </Container>
      </Navbar>
       <Navbar className="menu-subcontainer">
       <Container>
          <Navbar.Brand className="menu-item">Projectos</Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <Navbar className="menu-subcontainer">
        <Container>
          <Navbar.Brand className="menu-item">Reports</Navbar.Brand>
        </Container>
      </Navbar>
      <Navbar className="menu-subcontainer">
        <Container>
          <Navbar.Brand className="menu-item"
            onClick={() => {
              navigate("reports");
            }}
          >
            Subcapitulos
          </Navbar.Brand>
        </Container>
      </Navbar>
    </div>
    // <Navbar expand="lg" className="menu">
    //   <Navbar.Brand>Menu</Navbar.Brand>
    //   <Navbar.Collapse>
    //     <Nav>
    //       <NavDropdown title="Reportes">
    //         <NavDropdown.Item
    //         //   disabled={!stageSelected || stageSelected.idStage}
    //           onClick={() => {
    //             navigate("reports");
    //           }}
    //         >
    //           Subcapitulos
    //         </NavDropdown.Item>
    //       </NavDropdown>
    //     </Nav>
    //   </Navbar.Collapse>
    // </Navbar>
  );
};
export default Menu;
