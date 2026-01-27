import { useEffect, useState, useContext } from "react";
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import Back from "../components/commons/back";

const InputsContract = () => {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const [type] = useState(searchParams.get('type'));
   const [idSupplier]= useState(searchParams.get('idSupplier'));
   const [idContract]= useState(searchParams.get("idContract"));

  const onBack=()=>{
     navigate(`/contracts?idSupplier=${idSupplier}&type=${type}`);
  }

  const onAddInputContract=()=>{

      
      navigate(`/inputs-control?idSupplier=${idSupplier}&type=${type}&idContract=${idContract}`);
  }

  return (
    <div>
      <div>
        <Back onBack={onBack} className="" />{" "}
        <button
          type="button"
          className="primary"
          onClick={() => onAddInputContract()}
        >
          {"Agregar Insumo"}
        </button>
      </div>
    </div>
  );
};
export default InputsContract;
