

import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Menu=({setShowOption,showOption})=>{
    return (
   <Navbar expand="lg" className="menu">
 
       
        <Navbar.Collapse id="basic-navbar-nav">
             <NavDropdown title="Archivo" id="basic-nav-dropdown">
               {/* { showOption ==="contructionItems" && (<NavDropdown.Item href="#action/3.1" onClick={()=>setShowOption('searchItems')}>Adicionar Item</NavDropdown.Item>)} */}
               {/* { showOption ==="inputItem" && (<NavDropdown.Item href="#action/3.1" onClick={()=>setShowOption('searchInputs')}>Adicionar Insumos</NavDropdown.Item>)} */}
              {/* <NavDropdown.Item href="#action/3.1">Eliminar Items Marcados</NavDropdown.Item> */}
            </NavDropdown>
        </Navbar.Collapse>
  
    </Navbar>
    )
}
export default Menu