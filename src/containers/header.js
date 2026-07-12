import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";
import Logo from "../images/obrika.jpg";

export const Header = ({}) => {
  const navigate = useNavigate();
  const { user ,setUser,setStageSelected,setConstructionSelected} = useContext(ConstructionContext);

  const onClose=()=>{
    navigate('login')
    setStageSelected('')
    setConstructionSelected('')
    setUser("")
    
  }

  return (
    <div className="header" hidden={ !user}>
      <div>
        <img className="logo" src={Logo} alt="Logo" />

        <div className="user">
          <span className="container-header-icon">
            <i className="fas fa-user right header-icon" />
          </span>
          <span>{user}</span>{" "}
          <span className="container-close-header-icon close">
            <i className="fas fa-lock right close-header-icon" onClick={()=>{onClose()}}/>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Header;
