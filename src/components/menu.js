import {useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";



const Menu = ({reportOption,setReportOption}) => {
  const navigate = useNavigate();
  const [collapse, setCollapse] = useState(false);

  const [administrationOption, setAdministrationOption] = useState(true);
  const [report, setReport] = useState(true);


  const { user,stageSelected } = useContext(ConstructionContext);
  return (
    <div className={collapse ? "menu-container menu-collapsed" :"menu-container"} hidden={!user}>
      {!collapse ? (
        <div>
          <Navbar className="menu-subcontainer">
            <Container className="container-menu-title">
              <Navbar.Brand className="menu-title">
                <i className="fas fa-bars white" onClick={()=>{setCollapse(!collapse)}}/> MENU
              </Navbar.Brand>
            </Container>
          </Navbar>

          <Navbar className="menu-subcontainer">
            <Container className="no-margin">
              <Navbar.Brand className="menu-item">
                {" "}
                <b>Administrar Projectos</b>
              </Navbar.Brand>
            </Container>
          </Navbar>
          <Navbar
            className="menu-subcontainer"
            onClick={() => {
              setAdministrationOption(!administrationOption);
            }}
          >
            <Container className="no-margin">
              <Navbar.Brand className="menu-item">
                <span className="menu-option-icon">
                  <i
                    className={
                      administrationOption
                        ? "fas fa-caret-down "
                        : "fas fa-caret-right  "
                    }
                  />
                </span>
                <b>Administrar </b>
              </Navbar.Brand>
            </Container>
          </Navbar>
          {administrationOption ? (
            <Navbar className="menu-subcontainer">
              <Container className="no-margin">
                <Navbar.Brand className="menu-item">
                  {" "}
                  <span className="menu-option">Capitulos</span>
                </Navbar.Brand>
              </Container>
            </Navbar>
          ) : (
            ""
          )}
          {administrationOption ? (
            <Navbar className="menu-subcontainer">
              <Container className="no-margin">
                <Navbar.Brand className="menu-item">
                  {" "}
                  <span className="menu-option">Subcapitulos</span>
                </Navbar.Brand>
              </Container>
            </Navbar>
          ) : (
            ""
          )}
          {administrationOption ? (
            <Navbar className="menu-subcontainer">
              <Container className="no-margin">
                <Navbar.Brand className="menu-item">
                  {" "}
                  <span className="menu-option">Categorias</span>
                </Navbar.Brand>
              </Container>
            </Navbar>
          ) : (
            ""
          )}
          {administrationOption ? (
            <Navbar className="menu-subcontainer">
              <Container className="no-margin">
                <Navbar.Brand className="menu-item">
                  {" "}
                  <span className="menu-option">Unidades</span>
                </Navbar.Brand>
              </Container>
            </Navbar>
          ) : (
            ""
          )}
          <hr />
          {stageSelected && stageSelected.idStage ? (
            <Navbar
              className="menu-subcontainer"
              onClick={() => {
                setReport(!report);
              }}
            >
              <Container className="no-margin">
                <Navbar.Brand className="menu-item">
                  {" "}
                  <span className="menu-option-icon">
                    <i
                      className={
                        reportOption
                          ? "fas fa-caret-down "
                          : "fas fa-caret-right "
                      }
                    />
                  </span>
                  <b>Reportes </b>{" "}
                </Navbar.Brand>
              </Container>
            </Navbar>
          ) : (
            ""
          )}
          {stageSelected && stageSelected.idStage && report ? (
            <Navbar className="menu-subcontainer">
              <Container className="no-margin">
                <Navbar.Brand
                  className="menu-item"
                  onClick={() => {
                    setReportOption('subchapter')
                  }}
                >
                  <span className="menu-option">Presuesto Subcapitulos</span>
                </Navbar.Brand>
              </Container>
            </Navbar>
          ) : (
            ""
          )}

            {stageSelected && stageSelected.idStage && report ? (
            <Navbar className="menu-subcontainer">
              <Container className="no-margin">
                <Navbar.Brand
                  className="menu-item"
                  onClick={() => {
                    setReportOption('itemsInputs')
                  }}
                >
                  <span className="menu-option">Presuesto Items</span>
                </Navbar.Brand>
              </Container>
            </Navbar>
          ) : (
            ""
          )}
        </div>
      ) : (
       <div className="menu-icon-collapsed"><i className="fas fa-bars white" onClick={()=>{setCollapse(!collapse)}}/></div>
      )}
   
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
