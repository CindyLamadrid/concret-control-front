import axios from "axios";
import { useContext, useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs-react";
import { ConstructionContext } from "../context/constructionContext";
import Logo from "../images/concretoVivo.png";


const Login = () => {
  const navigate = useNavigate();
   const  {setUser,setConstructionSelected,setStageSelected}=
      useContext(ConstructionContext);
   const[userInput,setUserInput] = useState("")
   const[password,setPassword] = useState("")
   const[message,setMessage] = useState("")

  const onLogin=async()=>{
    
  if(!userInput || !password)
    {
       setMessage("Usuario y Contraseña obligatorios")
       return
    }
      

    const result = await axios.get(
        `${process.env.REACT_APP_SECURITY_URL_API}/user`,
        {  params: { 
          userName:userInput,
          password
        }
        }
      );
      console.log("result===",result);

      if (result && result.data && result.data &&  result.data.token){
          localStorage.setItem("user",userInput)
          localStorage.setItem("password",btoa(password))
          localStorage.setItem('token', result.data.token);
          setUser(userInput)
        
          navigate(`/home?user=${btoa(userInput)}`);
    
      }else{
           setMessage("Usuario o Contraseña incorrecta")
        }
  }

  useEffect(
    ()=>{
      let pass = localStorage.getItem("password")
      if(pass){
        pass = atob(pass)
      }
      console.log(localStorage.getItem("user"));
      setUserInput(localStorage.getItem("user") )
      setPassword(pass || "")
      setConstructionSelected("")
      setStageSelected("")
      setUser("")
    },[]
  )

  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="login-container"></div>
            <div className="form-container">
              <div>  <img src={Logo} className="logo-login"/></div>
            
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
  );
};
export default Login;
