import { useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";

const Login = () => {
  const navigate = useNavigate();
   const  {setUser}=
      useContext(ConstructionContext);

  const onLogin=()=>{
   
    setUser("fabian.lopera")
    navigate("/home");
  }

  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="login-container"></div>
            <div className="form-container">
              <div>
                <input type="text" placeholder="Usuario" />
              </div>
              <div>
                <input type="text" placeholder="Contraseña" />
              </div>
               <div className="center">
                <button className="primary" onClick={()=>onLogin()}>
                  Ingresar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
