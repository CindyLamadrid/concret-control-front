import { useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import Logo from "../images/concretoVivo.png";

const Menu = ({ setReportOption }) => {
  const navigate = useNavigate();
  const {
    user,
    stageSelected,
    setUser,
    setStageSelected,
    setConstructionSelected,
  } = useContext(ConstructionContext);

  const onShowHome = () => {
    navigate(`/home?user=${btoa(user)}`);
    setStageSelected("");
    setConstructionSelected("");
    localStorage.setItem(
      "chapterValues",
      JSON.stringify({ chapterSelected: 0, subchapterSelected: 0 }),
    );
  };

  const onClose = () => {
    navigate("login");
    setStageSelected("");
    setConstructionSelected("");
    setUser("");
  };

  return (
    <div className="no-margin menu-container" hidden={!user}>
      <div className="row h-100">
        <div className="col-3 no-margin center container-logo">
          <img className="logo" src={Logo} alt="Logo" />
        </div>
        <div className="col-7 no-margin">
          <Navbar expand="lg" className="nav-container">
            <div className=" menu-collapse">
              <Nav className="me-auto menu-option">
                <Nav.Link
                  className="menu-option link-option"
                  onClick={() => onShowHome()}
                >
                  <b>Projectos</b>
                </Nav.Link>
                {stageSelected &&
                stageSelected.idStage &&
                stageSelected.budgetType != "CC" ? (
                  <NavDropdown
                    title="Reportes"
                    className="menu-option select-option"
                  >
                    <DropdownButton
                      title="Capitulos"
                      className="submenu-option"
                      key="end"
                      drop="end"
                    >
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          setReportOption({ name: "subchapter", type: "" });
                        }}
                      >
                        {" "}
                        <i className="far fa-window-maximize" /> Pantalla
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          setReportOption({ name: "subchapter", type: "pdf" });
                        }}
                      >
                        <i className="far fa-file-pdf" /> PDF
                      </Dropdown.Item>
                    </DropdownButton>

                    <DropdownButton
                      title="Items"
                      className="submenu-option"
                      key="end"
                      drop="end"
                    >
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          setReportOption({ name: "itemsInputs", type: "" });
                        }}
                      >
                        {" "}
                        <i className="far fa-window-maximize" /> Pantalla
                        Completa
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          setReportOption({ name: "itemsInputs", type: "pdf" });
                        }}
                      >
                        <i className="far fa-file-pdf" /> PDF
                      </Dropdown.Item>
                    </DropdownButton>

                    <DropdownButton
                      title=" Insumos Compuestos"
                      className="submenu-option"
                      key="end"
                      drop="end"
                    >
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          setReportOption({ name: "compoundInputs", type: "" });
                        }}
                      >
                        {" "}
                        <i className="far fa-window-maximize" /> Pantalla
                        Completa
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          setReportOption({
                            name: "compoundInputs",
                            type: "pdf",
                          });
                        }}
                      >
                        <i className="far fa-file-pdf" /> PDF
                      </Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton
                      title="  Insumos Generales"
                      className="submenu-option"
                      key="end"
                      drop="end"
                    >
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          setReportOption({ name: "inputs", type: "" });
                        }}
                      >
                        <i className="far fa-window-maximize" /> Pantalla
                        Completa
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          setReportOption({ name: "inputs", type: "pdf" });
                        }}
                      >
                        {" "}
                        <i className="far fa-file-pdf" /> PDF
                      </Dropdown.Item>
                    </DropdownButton>
                  </NavDropdown>
                ) : (
                  ""
                )}

                <NavDropdown
                  title="Administrar"
                  className="menu-option select-option"
                >
                  <Dropdown.Item
                    className="submenu-option"
                    onClick={() => {
                      navigate(`/chapters?user=${btoa(user)}`);
                    }}
                  >
                    Capitulos
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="submenu-option"
                    onClick={() => {
                      navigate(`/subchapters?user=${btoa(user)}`);
                    }}
                  >
                    Subcapitulos
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="submenu-option"
                    onClick={() => {
                      navigate(`/suppliers?user=${btoa(user)}`);
                    }}
                  >
                    Proveedores
                  </Dropdown.Item>
                  {stageSelected && stageSelected.idStage ? (
                    <DropdownButton
                      title="Contratos"
                      className="submenu-option submenu-main"
                      key="end"
                      drop="end"
                    >
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          navigate(
                            `/contracts?user=${btoa(user)}&type=L&idStage=${stageSelected.idStage}`,
                            { replace: true },
                          );
                        }}
                      >
                        {" "}
                        Mano de Obra
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          navigate(
                            `/contracts?user=${btoa(user)}&type=S&idStage=${stageSelected.idStage}`,
                            { replace: true },
                          );
                        }}
                      >
                        Servicios
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          navigate(
                            `/contracts?user=${btoa(user)}&type=M&idStage=${stageSelected.idStage}`,
                          );
                        }}
                      >
                        Suministros de Materiales
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          navigate(
                            `/contracts?user=${btoa(user)}&type=C&idStage=${stageSelected.idStage}`,
                          );
                        }}
                      >
                        Construcción
                      </Dropdown.Item>
                    </DropdownButton>
                  ) : (
                    ""
                  )}

                  {stageSelected && stageSelected.idStage ? (
                    <DropdownButton
                      title="Orden Pago"
                      className="submenu-option submenu-main"
                      key="end"
                      drop="end"
                    >
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          navigate(
                            `/orders?user=${btoa(user)}&type=L&idStage=${stageSelected.idStage}`,
                            { replace: true },
                          );
                        }}
                      >
                        {" "}
                        Mano de Obra
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          navigate(
                            `/orders?user=${btoa(user)}&type=S&idStage=${stageSelected.idStage}`,
                            { replace: true },
                          );
                        }}
                      >
                        Servicios
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          navigate(
                            `/orders?user=${btoa(user)}&type=M&idStage=${stageSelected.idStage}`,
                          );
                        }}
                      >
                        Suministros de Materiales
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="submenu-option"
                        onClick={() => {
                          navigate(
                            `/orders?user=${btoa(user)}&type=C&idStage=${stageSelected.idStage}`,
                          );
                        }}
                      >
                        Construcción
                      </Dropdown.Item>
                    </DropdownButton>
                  ) : (
                    ""
                  )}
                  <NavDropdown.Divider />

                  <Dropdown.Item
                    className="submenu-option"
                    onClick={() => {
                      navigate(`/users?user=${btoa(user)}`);
                    }}
                  >
                    Usuarios
                  </Dropdown.Item>
                </NavDropdown>
              </Nav>
            </div>
          </Navbar>
        </div>
        <div className="col-2 no-margin right container-user">
          <div className="user">
            <span className="container-header-icon center">
              <i className="fas fa-user right header-icon center" />
            </span>
            <span>
              {" "}
              <b>{user}</b>
            </span>{" "}
            <span className="container-close-header-icon close center">
              <i
                className="fas fa-lock right close-header-icon"
                onClick={() => {
                  onClose();
                }}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
