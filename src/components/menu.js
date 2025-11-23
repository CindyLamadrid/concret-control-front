

import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Menu=({setShowOption,showOption})=>{
    return (
   <Navbar expand="lg" className="menu">
 
       
        <Navbar.Collapse id="basic-navbar-nav">
             <NavDropdown title="MENU" id="basic-nav-dropdown">
              </NavDropdown>
        </Navbar.Collapse>
  
    </Navbar>
    )
}
export default Menu