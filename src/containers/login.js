import axios from "axios";
import { useContext, useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs-react";
import { ConstructionContext } from "../context/constructionContext";

const Login = () => {
  const navigate = useNavigate();
   const  {setUser,setConstructionSelected,setStageSelected}=
      useContext(ConstructionContext);
   const[userInput,setUserInput] = useState("fabian.lopera")
   const[password,setPassword] = useState("santi123")
   const[message,setMessage] = useState("")

  const onLogin=async()=>{

    console.log("userInput",userInput)
    console.log("password",password)

    if(!userInput || !password)
    {
       setMessage("Usuario y Contraseña obligatorios")
       return
    }
      

    const result = await axios.get(
        `${process.env.REACT_APP_SECURITY_URL_API}/user`,
        {  params: { 
          userName:userInput
        }
        }
      );

      if (result && result.data && result.data.length>0){
        const currentPassword = result.data[0].password
       
        const response = bcrypt.compareSync(password, currentPassword);
        if(response)
        {
          setUser(userInput)
          navigate(`/home?user=${btoa(userInput)}`);
        }else
        {
          setMessage("Usuario o Contraseña incorrecta")
        }
      }else{
           setMessage("Usuario o Contraseña incorrecta")
        }
  }

  useEffect(
    ()=>{
      setUser("")
      setConstructionSelected("")
      setStageSelected("")
    },[]
  )

  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="login-container"></div>
            <div className="form-container">
               <div className="mandatory center">
                <b>{
                  message 
                }</b><br/>
              </div>
              <div>
                <input type="text" placeholder="Usuario" value={userInput} onChange={(event)=>{setUserInput(event.target.value)}} />
              </div>
              <div>
                <input type="password" placeholder="Contraseña" value={password} onChange={(event)=>{setPassword(event.target.value)}} />
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
