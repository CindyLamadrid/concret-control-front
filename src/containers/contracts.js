import { useEffect, useState, useContext } from "react";
import { useSearchParams,createSearchParams ,useNavigate} from 'react-router-dom';
import axios from "../config/axiosConfig";
import { ConstructionContext } from "../context/constructionContext";
import AdminOptions from "../components/commons/adminSelectOptions";
import AdminContract from "../components/contracts/adminContracts";
import ContractTable from "../components/contracts/contractTable";

const Contracts = () => {
  const { user,stageSelected } =
        useContext(ConstructionContext);
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState("");
  const [adminContract, setAdminContract] = useState({
    show: false,
    contract: "",
    action: "",
  });
  const [messageResultOperation, setMessageResultOperation] = useState("");
  const [contractsArray, setContractsArray] = useState([]);
  const [suppliersArray,setSuppliersArray] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searchParams] = useSearchParams();
  const [type,setType] = useState(searchParams.get('type'));
  const [idSupplier] = useState(searchParams.get('idSupplier'));



  const onSearchContracts = async(id) => {
   console.log("search");
     if (!supplier && !id) return;
    setMessageResultOperation("");
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/contracts-supplier`,
        {
          params: { idStage: stageSelected.idStage ,idSupplier: parseInt(id || supplier.value ,10), type},
        }
      );
      if (result && result.data && result.data.length > 0) {
        let { data } = result;

        setContractsArray(data);
        setNoData(false);
      } else {
        setContractsArray([]);
        setNoData(true);
      }
    } catch (error) {
      setContractsArray([]);
      setNoData(true);
      console.error("Error fetching onSearchContracts:", error);
    }
  };

 useEffect(
  ()=>{
    if(idSupplier && suppliersArray && suppliersArray.length>0)
    {
      const value = suppliersArray.filter((x)=>x.value===idSupplier)
      console.log("value===",value)
      if(value && value.length>0)
      {
        setSupplier(value[0])
        onSearchContracts(value[0].value)
      }
      
    }
  },[idSupplier,suppliersArray]
 )

  const onNewContract = () => {
   setMessageResultOperation("");
    setAdminContract({
      show: true,
      contract: "",
      action: "new",
    });

  };

  const onSaveContract=async(contract, action)=>{
      if(contract)
        contract.idContract= action === "edit" ? parseInt(adminContract.contract.idContract) : 0
      
      contract.user = user
      contract.type= type;
      contract.idStage = stageSelected.idStage
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${
          action === "edit" ? "update-contract" : "create-contract"
        }`,
        contract
      );
        if (result && result.data && result.data.length > 0) {
            setContractsArray([])
            setAdminContract({ show: false, contract: "", action: "" });
            if (adminContract.action === "edit") await onSearchContracts();
          
        }
  }

  const onCloseAdminContract=()=>{
    setAdminContract({ show: false, contract: "", action: "" });
    setMessageResultOperation("");
  }

  const onEditCotract=(index)=>{
      setMessageResultOperation("");
    if (index > -1) {
      const contract = contractsArray[index];

      setAdminContract({ show: true, contract, action: "edit" });
    }
  }

  const getSuppliers = async() => {

    
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/suppliers`
      );
      if (result && result.data && result.data.length > 0) {
        let { data } = result;
       
        setSuppliersArray(data);
        setNoData(false);
      } else {
        setSuppliersArray([]);
        setNoData(true);
      }
    } catch (error) {
      setSuppliersArray([]);
      setNoData(true);
      console.error("Error fetching getSuppliers:", error);
    }
  };

  const onViewContractInputs=(index)=>{
    if (index > -1) {
      const contract = contractsArray[index];
      console.log("contract===",contract);
       const params = createSearchParams({
            user: btoa(user),
            idContract: contract.idContract,
            idSupplier:supplier.value
          
      });
     navigate(`/inputs-contract?${params.toString()}&type=${type}`);
     
    }
  }

  useEffect(
    ()=>{
    
     getSuppliers()
    },[]
  )

  
   useEffect(() => {
    console.log("searchParams==",searchParams);
   
    const newType = searchParams.get("type");
     console.log("newType==",newType);
    if(type!==newType)
    {
      setType(newType)
       setContractsArray([])
    }


  }, [searchParams]);

  return (
    <div>
      <div>
        <br />
        <div className="header-title">
          <span>OPCIONES DE CONTRATOS</span>
        </div>
        <AdminOptions
          options={suppliersArray}
          value={supplier}
          setValue={setSupplier}
          onSearch={onSearchContracts}
          onNewOption={onNewContract}
          onCancelOption={() => {}}
          labelOption="Crear Nuevo Contrato"
          hideCancelOption
        />
      </div>
       {noData && <div>La busqueda no arrojo resultado</div>}
      {
        <div hidden={adminContract && adminContract.show}>
          {messageResultOperation}
        </div>
      }

      {adminContract.show && (
        <div
          className="modal show modal-xl"
          style={{ display: "block", position: "initial" }}
        >
          <AdminContract
            adminContract={adminContract}
            messageResultOperation={messageResultOperation}
            onSaveContract={onSaveContract}
            onCloseAdminContract={onCloseAdminContract}
          />
        </div>
      )}
           {contractsArray  && contractsArray.length > 0 && (
        <div>
          <div className="subtitle">
            <span>LISTADO DE CONTRATOS</span>
          </div>

          <div>
       
          </div>
          <br />
          <ContractTable
            contractsArray={contractsArray}
            onEditCotract ={onEditCotract}
            onViewContractInputs={onViewContractInputs}
          />
        </div>
      )}
    </div>
  );
};

export default Contracts;
