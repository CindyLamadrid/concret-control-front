import { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";

const Menu = ({ reportOption, setReportOption ,setReportType}) => {
  const navigate = useNavigate();
  const [collapse, setCollapse] = useState(false);

  const [administrationOption, setAdministrationOption] = useState(false);
  const [report, setReport] = useState(true);

  const { user, stageSelected, setStageSelected, setConstructionSelected } =
    useContext(ConstructionContext);

  const onShowHome = () => {
    navigate(`/home?user=${btoa(user)}`);
    setStageSelected("");
    setConstructionSelected("");
    localStorage.setItem(
      "chapterValues",
      JSON.stringify({ chapterSelected: 0, subchapterSelected: 0 })
    );
  };
  return (
    <div
      className={collapse ? "menu-container menu-collapsed" : "menu-container"}
      hidden={!user}
    >
      {!collapse ? (
        <div>
          <Navbar className="menu-subcontainer">
            <Container className="container-menu-title">
              <Navbar.Brand className="menu-title">
                <i
                  className="fas fa-bars white"
                  onClick={() => {
                    setCollapse(!collapse);
                  }}
                />{" "}
                MENU
              </Navbar.Brand>
            </Container>
          </Navbar>

          {user ? (
            <div>
              <hr />
              <Navbar className="menu-subcontainer">
                <Container className="no-margin">
                  <Navbar.Brand
                    className="menu-item"
                    onClick={() => {
                      navigate(`/users?user=${btoa(user)}`);
                    }}
                  >
                    {" "}
                    <b>Administrar Usuarios</b>
                  </Navbar.Brand>
                </Container>
              </Navbar>
              <hr />
            </div>
          ) : (
            ""
          )}

          <Navbar className="menu-subcontainer">
            <Container className="no-margin">
              <Navbar.Brand
                className="menu-item"
                onClick={() => {
                  onShowHome();
                }}
              >
                {" "}
                <b>Projectos</b>
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
                        report
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
                <Navbar.Collapse id="basic-navbar-nav">
                   <Navbar.Brand className="menu-item">
                    <NavDropdown
                      className=" menu-option "
                      title="Capitulos"
                     
                    >
                      <NavDropdown.Item className="sub-menu-select"  onClick={() => { setReportOption({name:"subchapter",type:""}); }}>
                        <i className="far fa-window-maximize"/>{" "}
                        Pantalla Completa
                      </NavDropdown.Item>
                      <NavDropdown.Item className="sub-menu-select" onClick={() => { setReportOption({name:"subchapter",type:"pdf"}); }}>
                        <i className="far fa-file-pdf"/>{" "}
                         PDF
                      </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Brand>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          ) : (
            ""
          )}

          {stageSelected && stageSelected.idStage && report ? (
          
             <Navbar className="menu-subcontainer">
              <Container className="no-margin">
                <Navbar.Collapse id="basic-navbar-nav">
                   <Navbar.Brand className="menu-item">
                    <NavDropdown
                      className=" menu-option "
                      title="Items"
                     
                    >
                      <NavDropdown.Item className="sub-menu-select"  onClick={() => { setReportOption({name:"itemsInputs",type:""}); }}>
                        <i className="far fa-window-maximize"/>{" "}
                        Pantalla Completa
                      </NavDropdown.Item>
                      <NavDropdown.Item className="sub-menu-select" onClick={() => { setReportOption({name:"itemsInputs",type:"pdf"}); }}>
                        <i className="far fa-file-pdf"/>{" "}
                         PDF
                      </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Brand>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          ) : (
            ""
          )}

          {stageSelected && stageSelected.idStage && report ? (
             <Navbar className="menu-subcontainer">
              <Container className="no-margin">
                <Navbar.Collapse id="basic-navbar-nav">
                   <Navbar.Brand className="menu-item">
                    <NavDropdown
                      className=" menu-option "
                      title="Insumos Compuestos"
                     
                    >
                      <NavDropdown.Item className="sub-menu-select"  onClick={() => { setReportOption({name:"compoundInputs",type:""}) }}>
                        <i className="far fa-window-maximize"/>{" "}
                        Pantalla Completa
                      </NavDropdown.Item>
                      <NavDropdown.Item className="sub-menu-select"onClick={() => { setReportOption({name:"compoundInputs",type:"pdf"}) }} >
                        <i className="far fa-file-pdf"/>{" "}
                         PDF
                      </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Brand>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          ) : (
            ""
          )}

                {stageSelected && stageSelected.idStage && report ? (
             <Navbar className="menu-subcontainer">
              <Container className="no-margin">
                <Navbar.Collapse id="basic-navbar-nav">
                   <Navbar.Brand className="menu-item">
                    <NavDropdown
                      className=" menu-option "
                      title="Insumos Generales"
                     
                    >
                      <NavDropdown.Item className="sub-menu-select"  onClick={() => { setReportOption({name:"inputs",type:""}); }}>
                        <i className="far fa-window-maximize"/>{" "}
                        Pantalla Completa
                      </NavDropdown.Item>
                      <NavDropdown.Item className="sub-menu-select"  onClick={() => { setReportOption({name:"inputs",type:"pdf"}); }}>
                        <i className="far fa-file-pdf"/>{" "}
                         PDF
                      </NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Brand>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="menu-icon-collapsed">
          <i
            className="fas fa-bars white"
            onClick={() => {
              setCollapse(!collapse);
            }}
          />
        </div>
      )}
    </div>
    // <Navbar expand="lg" className="menu">
    //   <Navbar.Brand>Menu</Navbar.Brand>
    //   <Navbar.Collapse>
    //     <Nav>admni
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
