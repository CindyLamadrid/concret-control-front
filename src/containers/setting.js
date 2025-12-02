import { useEffect,useContext } from "react"
import {useSearchParams } from "react-router-dom";
import { ConstructionContext } from "../context/constructionContext";

const Settings=({})=>{
    const [searchParams] = useSearchParams();
    const {setUser,setConstructionSelected ,setStageSelected} = useContext(ConstructionContext);
    useEffect(
        ()=>{
          setUser(atob(searchParams.get('user')))
          console.log("searchParams.get('idConstruction')",searchParams.get('idConstruction'));
          if(searchParams.get('idConstruction'))
          setConstructionSelected({idConstruction:searchParams.get('idConstruction')})

          if(searchParams.get('idStage'))
          setStageSelected({idStage:searchParams.get('idStage')})
        },[]
    )
    return<div></div>
}
export default Settings