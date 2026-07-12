import { useContext } from "react";
import { ConstructionContext } from "../context/constructionContext";

export const Footer=()=>{
      const { user } = useContext(ConstructionContext);
    return(
        <div className="footer" hidden={!user}>
               <div>
                  OBRIKA - 2025
               </div>
        </div>
    )
}
export default Footer;