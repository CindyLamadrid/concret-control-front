import axios from "axios";
import { useContext, useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs-react";
import { ConstructionContext } from "../context/constructionContext";
import Logo from "../images/obrika.jpg";


const Login = () => {
  const navigate = useNavigate();
  const { setUser, setConstructionSelected, setStageSelected, setPermissions, setUserConstructions, setRole, setCompany } =
    useContext(ConstructionContext);
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const onLogin = async () => {
    if (!userInput || !password) {
      setMessage("Usuario y Contraseña obligatorios");
      return;
    }

    try {
      const userNameNormalized = userInput.toLowerCase().trim();
      const result = await axios.get(
        `${process.env.REACT_APP_SECURITY_URL_API}/user`,
        { params: { userName: userNameNormalized, password } }
      );

      if (result && result.data && result.data.token) {
        localStorage.setItem("user", userNameNormalized);
        localStorage.setItem("password", btoa(password));
        localStorage.setItem("token", result.data.token);

        // Guardar permisos y asignaciones en contexto
        setUser(userNameNormalized);
        setPermissions(result.data.permissions || []);
        setUserConstructions(result.data.constructions || []);
        setRole(result.data.role || null);
        setCompany(result.data.company || null);

        navigate(`/home?user=${btoa(userNameNormalized)}`);
      } else {
        setMessage("Usuario o Contraseña incorrecta");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage("Usuario o Contraseña incorrecta");
      } else {
        setMessage("Error de conexión con el servidor");
      }
    }
  };

  useEffect(
    ()=>{
      let pass = localStorage.getItem("password")
      if(pass){
        pass = atob(pass)
      }
      setUserInput(localStorage.getItem("user") )
      setPassword(pass || "")
      setConstructionSelected("")
      setStageSelected("")
      setUser("")
    },[]
  )

  return (
    <div className="login-wrapper">
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="login-container"></div>
              <div className="form-container">
                <div>  <img src={Logo} className="logo-login" alt="Logo"/></div>
              
                <div className="mandatory center">
                  <b>{
                    message 
                  }</b><br/>
                </div>

                <div>
                <span className="label">Usuario</span>
                  <input type="text"  value={userInput} onChange={(event)=>{setUserInput(event.target.value)}} />
                </div>
                <div>
                    <span className="label">Contraseña</span>
                  <input type="password"  value={password} onChange={(event)=>{setPassword(event.target.value)}} />
                </div>
                <div className="center">
                  <button className="primary button-login" onClick={()=>onLogin()}>
                    INICIAR SESSIÓN
                  </button>
                </div>
              
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="footer login-footer">
        <div>
          OBRIKA - 2025
        </div>
      </div>
    </div>
  );
};
export default Login;
