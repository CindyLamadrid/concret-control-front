import { useContext, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import ThemeSelector from "./commons/themeSelector";
import Logo from "../images/obrika.jpg";

const Menu = ({ setReportOption }) => {
  const navigate = useNavigate();
  const [showTheme, setShowTheme] = useState(false);
  const {
    user,
    stageSelected,
    permissions,
    role,
    isCostControl,
    setUser,
    setStageSelected,
    setConstructionSelected,
    setPermissions,
    setUserConstructions,
    setRole,
  } = useContext(ConstructionContext);

  // Helper: verificar si el usuario tiene permiso a un módulo
  const hasPermission = (module) => {
    if (!role) return false;
    if (role.isAdmin) return true;
    return permissions.some((p) => p.Module === module || p.module === module);
  };

  // Helper: verificar si puede editar (action = 'full')
  const canManage = (module) => {
    if (!role) return false;
    if (role.isAdmin) return true;
    return permissions.some(
      (p) => (p.Module === module || p.module === module) && (p.Action === "full" || p.action === "full")
    );
  };

  const onShowHome = () => {
    navigate(`/home?user=${btoa(user)}`);
    setStageSelected("");
    setConstructionSelected("");
    localStorage.setItem(
      "chapterValues",
      JSON.stringify({ chapterSelected: 0, subchapterSelected: 0 })
    );
  };

  const onClose = () => {
    navigate("login");
    setStageSelected("");
    setConstructionSelected("");
    setUser("");
    setPermissions([]);
    setUserConstructions([]);
    setRole(null);
    localStorage.removeItem("permissions");
    localStorage.removeItem("userConstructions");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  return (
    <div className="no-margin menu-container" hidden={!user}>
      <div className="row h-100">
        <div className="col-3 no-margin center container-logo">
          <img className="logo" src={Logo} alt="Logo" />
        </div>
        <div className="col-7 no-margin">
          <Navbar expand="lg" className="nav-container">
            <div className="menu-collapse">
              <Nav className="me-auto menu-option">
                {/* PROYECTOS - visible si tiene acceso a constructions */}
                {hasPermission("constructions") && (
                  <Nav.Link className="menu-option link-option" onClick={onShowHome}>
                    <b>Proyectos</b>
                  </Nav.Link>
                )}

                {/* REPORTES - visible si tiene acceso a reports Y tiene etapa seleccionada */}
                {hasPermission("reports") &&
                  stageSelected && stageSelected.idStage &&
                  stageSelected.budgetType !== "CC" && (
                  <NavDropdown title="Reportes" className="menu-option select-option">
                    <DropdownButton title="Capitulos" className="submenu-option" key="end" drop="end">
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "subchapter", type: "" })}>
                        <i className="far fa-window-maximize" /> Pantalla
                      </Dropdown.Item>
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "subchapter", type: "pdf" })}>
                        <i className="far fa-file-pdf" /> PDF
                      </Dropdown.Item>
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "subchapter", type: "excel" })}>
                        <i className="far fa-file-excel" /> Excel
                      </Dropdown.Item>
                    </DropdownButton>

                    <DropdownButton title="Items" className="submenu-option" key="end" drop="end">
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "itemsInputs", type: "" })}>
                        <i className="far fa-window-maximize" /> Pantalla Completa
                      </Dropdown.Item>
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "itemsInputs", type: "pdf" })}>
                        <i className="far fa-file-pdf" /> PDF
                      </Dropdown.Item>
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "itemsInputs", type: "excel" })}>
                        <i className="far fa-file-excel" /> Excel
                      </Dropdown.Item>
                    </DropdownButton>

                    <DropdownButton title="Insumos Compuestos" className="submenu-option" key="end" drop="end">
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "compoundInputs", type: "" })}>
                        <i className="far fa-window-maximize" /> Pantalla Completa
                      </Dropdown.Item>
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "compoundInputs", type: "pdf" })}>
                        <i className="far fa-file-pdf" /> PDF
                      </Dropdown.Item>
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "compoundInputs", type: "excel" })}>
                        <i className="far fa-file-excel" /> Excel
                      </Dropdown.Item>
                    </DropdownButton>

                    <DropdownButton title="Insumos Generales" className="submenu-option" key="end" drop="end">
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "inputs", type: "" })}>
                        <i className="far fa-window-maximize" /> Pantalla Completa
                      </Dropdown.Item>
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "inputs", type: "pdf" })}>
                        <i className="far fa-file-pdf" /> PDF
                      </Dropdown.Item>
                      <Dropdown.Item className="submenu-option" onClick={() => setReportOption({ name: "inputs", type: "excel" })}>
                        <i className="far fa-file-excel" /> Excel
                      </Dropdown.Item>
                    </DropdownButton>
                  </NavDropdown>
                )}

                {/* ADMINISTRAR - visible si tiene al menos un permiso de gestión */}
                {((hasPermission("chapters") && !isCostControl) || (hasPermission("suppliers") && isCostControl) ||
                  (hasPermission("contracts") && isCostControl) || (hasPermission("orders") && isCostControl) || hasPermission("users")) && (
                  <NavDropdown title="Administrar" className="menu-option select-option">
                    {hasPermission("chapters") && !isCostControl && (
                      <Dropdown.Item className="submenu-option" onClick={() => navigate(`/chapters?user=${btoa(user)}`)}>
                        Capitulos
                      </Dropdown.Item>
                    )}
                    {hasPermission("chapters") && !isCostControl && (
                      <Dropdown.Item className="submenu-option" onClick={() => navigate(`/subchapters?user=${btoa(user)}`)}>
                        Subcapitulos
                      </Dropdown.Item>
                    )}
                    {hasPermission("suppliers") && isCostControl && (
                      <Dropdown.Item className="submenu-option" onClick={() => navigate(`/suppliers?user=${btoa(user)}`)}>
                        Proveedores
                      </Dropdown.Item>
                    )}

                    {hasPermission("contracts") && isCostControl && (
                      <DropdownButton title="Contratos" className="submenu-option submenu-main" key="contracts" drop="end">
                        <Dropdown.Item className="submenu-option" onClick={() => navigate(`/contracts?user=${btoa(user)}&type=L${stageSelected ? `&idStage=${stageSelected.idStage}` : ""}`, { replace: true })}>
                          Mano de Obra
                        </Dropdown.Item>
                        <Dropdown.Item className="submenu-option" onClick={() => navigate(`/contracts?user=${btoa(user)}&type=S${stageSelected ? `&idStage=${stageSelected.idStage}` : ""}`, { replace: true })}>
                          Servicios
                        </Dropdown.Item>
                        <Dropdown.Item className="submenu-option" onClick={() => navigate(`/contracts?user=${btoa(user)}&type=M${stageSelected ? `&idStage=${stageSelected.idStage}` : ""}`)}>
                          Suministros de Materiales
                        </Dropdown.Item>
                        <Dropdown.Item className="submenu-option" onClick={() => navigate(`/contracts?user=${btoa(user)}&type=C${stageSelected ? `&idStage=${stageSelected.idStage}` : ""}`)}>
                          Construcción
                        </Dropdown.Item>
                      </DropdownButton>
                    )}

                    {hasPermission("orders") && isCostControl && stageSelected && stageSelected.idStage && (
                      <DropdownButton title="Orden Pago" className="submenu-option submenu-main" key="orders" drop="end">
                        <Dropdown.Item className="submenu-option" onClick={() => navigate(`/orders?user=${btoa(user)}&type=L&idStage=${stageSelected.idStage}`, { replace: true })}>
                          Mano de Obra
                        </Dropdown.Item>
                        <Dropdown.Item className="submenu-option" onClick={() => navigate(`/orders?user=${btoa(user)}&type=S&idStage=${stageSelected.idStage}`, { replace: true })}>
                          Servicios
                        </Dropdown.Item>
                        <Dropdown.Item className="submenu-option" onClick={() => navigate(`/orders?user=${btoa(user)}&type=M&idStage=${stageSelected.idStage}`)}>
                          Suministros de Materiales
                        </Dropdown.Item>
                        <Dropdown.Item className="submenu-option" onClick={() => navigate(`/orders?user=${btoa(user)}&type=C&idStage=${stageSelected.idStage}`)}>
                          Construcción
                        </Dropdown.Item>
                      </DropdownButton>
                    )}

                    {hasPermission("users") && <NavDropdown.Divider />}
                    {hasPermission("users") && (
                      <Dropdown.Item className="submenu-option" onClick={() => navigate(`/companies?user=${btoa(user)}`)}>
                        Empresas
                      </Dropdown.Item>
                    )}
                    {hasPermission("users") && (
                      <Dropdown.Item className="submenu-option" onClick={() => navigate(`/users?user=${btoa(user)}`)}>
                        Usuarios
                      </Dropdown.Item>
                    )}
                  </NavDropdown>
                )}
              </Nav>
            </div>
          </Navbar>
        </div>
        <div className="col-2 no-margin right container-user">
          <div className="user">
            <span className="container-header-icon center">
              <i className="fas fa-user right header-icon center" />
            </span>
            <NavDropdown title={user} className="user-dropdown" align="end">
              <Dropdown.Item onClick={() => setShowTheme(!showTheme)}>
                <i className="fas fa-palette" /> Cambiar Tema
              </Dropdown.Item>
              <NavDropdown.Divider />
              <Dropdown.Item onClick={onClose}>
                <i className="fas fa-lock" /> Cerrar Sesión
              </Dropdown.Item>
            </NavDropdown>
          </div>
          {showTheme && <ThemeSelector onClose={() => setShowTheme(false)} />}
        </div>
      </div>
    </div>
  );
};

export default Menu;
