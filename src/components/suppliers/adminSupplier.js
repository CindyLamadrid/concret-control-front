import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Select from "../commons/select";

const handlers = require("../utils/handlers");

const AdminSupplier = ({
  adminSupplier,
  setAdminSupplier,
  messageResultOperation,
  onSaveSupplier,
  onCloseAdminSupplier
}) => {
  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [identificationTypeArray, setIdentificationTypeArray] = useState([]);
  const [departmentsArray, setDepartmentsArray] = useState([]);
  const [countriesArray, setCountriesArray] = useState([]);
  const [citiesArray, setCitiesArray] = useState([]);
  const [accountTypesArray, setAccountTypesArray] = useState([]);
  const [supplierTypesArray, setSupplierTypesArray] = useState([]);
  const [banksArray, setBanksArray] = useState([]);
  const [identification, setIdentification] = useState("");
  const [identificationType, setIdentificationType] = useState("");
  const [identificationFrom, setIdentificationFrom] = useState("");
  const [dv, setDv] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneOffice, setPhoneOffice] = useState("");
  const [cellPhone, setCellPhone] = useState("");
  const [currentCountry, setCurrentCountry] = useState("");
  const [currentDepartment, setCurrentDepartment] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [email, setEmail] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [bank, setBank] = useState("");
  const [taxSystem, setTaxSystem] = useState("");
  const [legalRepresentative, setLegalRepresentative] = useState("");
  const [identificationOwnerAccount, setIdentificationOwnerAccount] =
    useState("");

  const [supplierType,setSupplierType]= useState("");

   const getSupplierTypes = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/supplier-types`)
      .then((result) => {
        if (result && result.data) {
          setSupplierTypesArray(result.data);
          setSupplierType(result.data[0].idSupplierType);
        } else {
          setSupplierTypesArray([]);
        }
      })
      .catch((error) => {
        setSupplierTypesArray([]);
        console.error("Error fetching getSupplierTypes:", error);
      });
  };

  const getIdentificationTypes = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/identification-types`)
      .then((result) => {
        if (result && result.data) {
          setIdentificationTypeArray(result.data);
          setIdentificationType(result.data[0].idIdentificationType);
        } else {
          setIdentificationTypeArray([]);
        }
      })
      .catch((error) => {
        setIdentificationTypeArray([]);
        console.error("Error fetching getIdentificationTypes:", error);
      });
  };

  const getDepartments = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/departments`)
      .then((result) => {
        if (result && result.data) {
          setDepartmentsArray(result.data);
          setCurrentDepartment(result.data[0].idDepartment);
        } else {
          setDepartmentsArray([]);
        }
      })
      .catch((error) => {
        setDepartmentsArray([]);
        console.error("Error fetching getDepartments:", error);
      });
  };

  const getCountries = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/countries`)
      .then((result) => {
        if (result && result.data) {
          setCountriesArray(result.data);
          setCurrentCountry(result.data[0].idCountry);
          setIdentificationFrom(result.data[0].idCountry);
        } else {
          setCountriesArray([]);
        }
      })
      .catch((error) => {
        setCountriesArray([]);
        console.error("Error fetching getCountries:", error);
      });
  };

  const getCities = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/cities`)
      .then((result) => {
        if (result && result.data) {
          setCitiesArray(result.data);
          setCurrentCity(result.data[0].idCity);
        } else {
          setCitiesArray([]);
        }
      })
      .catch((error) => {
        setCitiesArray([]);
        console.error("Error fetching getCities:", error);
      });
  };

  const getBanks = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/banks`)
      .then((result) => {
        if (result && result.data) {
          setBanksArray(result.data);
          setBank(result.data[0].idBank);
        } else {
          setCitiesArray([]);
        }
      })
      .catch((error) => {
        setBanksArray([]);
        console.error("Error fetching getBanks:", error);
      });
  };

  const getAccountTypes = () => {
    axios
      .get(`${process.env.REACT_APP_BUDGET_URL_API}/account-types`)
      .then((result) => {
        if (result && result.data) {
          setAccountTypesArray(result.data);
          setAccountType(result.data[0].idAccountType);
        } else {
          setAccountTypesArray([]);
        }
      })
      .catch((error) => {
        setBanksArray([]);
        console.error("Error fetching getBanks:", error);
      });
  };

  const onChangeIdentificationType = (value) => {
    if (value) {
      setIdentificationType(parseInt(value, 10));
    }
  };

  const onChangeCurrentDepartment = (value) => {
    if (value) {
      setCurrentDepartment(parseInt(value, 10));
    }
  };

  const onChangeCurrentCountry = (value) => {
    if (value) {
      setCurrentCountry(parseInt(value, 10));
    }
  };
  const onChangeCurrentCity = (value) => {
    if (value) {
      setCurrentCity(parseInt(value, 10));
    }
  };
  const onChangeBank = (value) => {
    if (value) {
      setBank(parseInt(value, 10));
    }
  };

  const onChangeAccountType = (value) => {
    if (value) {
      setAccountType(parseInt(value, 10));
    }
  };

  const onChangeIdentificationCity=(value)=>{
     if (value) {
      setIdentificationFrom(parseInt(value, 10));
    }
  }

  const onChangeSupplierType=(value)=>{
     if (value) {
      setSupplierType(parseInt(value, 10));
    }
  }

  const getSupplierProperties=()=>{
    return{
        supplierType,name,secondName,lastName,secondLastName,identificationType,identification,identificationFrom,
        dv,address,currentCity,currentCountry,currentDepartment,phone,phoneOffice,cellPhone,email,
        accountName,accountNumber,accountType,bank
    }
  }

  const getCodSupplierType=()=>{
   if(supplierTypesArray.length>0)
   {
       const type = supplierTypesArray.filter(x=>x.idSupplierType===supplierType)
      if(type && type.length>0)
        return type[0].cod
   }
   return ""
  }

  const getIdentificationTypeByCod=(cod)=>{
   if(identificationTypeArray.length>0)
   {
       const identificationResult = identificationTypeArray.filter(x=>x.cod===cod)
      if(identificationResult && identificationResult.length>0)
        return identificationResult[0]
   }
   return {}
  }

  useEffect(() => {
    getSupplierTypes();
    getIdentificationTypes();
    getCountries();
    getDepartments();
    getCities();
    getBanks();
    getAccountTypes();
  }, []);
  useEffect(() => {
    if (adminSupplier.action === "edit") {
      setName(adminSupplier.supplier.name);
      setSecondName(adminSupplier.supplier.middleName)
      setLastName(adminSupplier.supplier.lastName)
      setSecondLastName(adminSupplier.supplier.secondLastName)
      setIdentification(adminSupplier.supplier.identification)
      setDv(adminSupplier.supplier.dv)
      setAddress(adminSupplier.supplier.address)
      setPhone(adminSupplier.supplier.phone)
      setPhoneOffice(adminSupplier.supplier.phoneOffice)
      setCellPhone(adminSupplier.supplier.cellPhone)
      setEmail(adminSupplier.supplier.email)
     
     
      if(supplierTypesArray && setAccountTypesArray.length>0)
        setSupplierType(adminSupplier.supplier.idSupplierType)
      if(identificationTypeArray && identificationTypeArray.length>0)
        setIdentificationType(adminSupplier.supplier.idIdentificationType)

      if(countriesArray && countriesArray.length>0)
        setCurrentCountry(adminSupplier.supplier.idCountry)
      if(departmentsArray && departmentsArray.length>0)
        setCurrentDepartment(adminSupplier.supplier.idDepartment)
      if(citiesArray && citiesArray.length>0)
      {
        setCurrentCity(adminSupplier.supplier.idCity)
        setIdentificationFrom(adminSupplier.supplier.idIdentificationFrom)
      }

    }
  }, [adminSupplier.action,supplierTypesArray,identificationTypeArray,countriesArray,departmentsArray,citiesArray,banksArray,accountTypesArray]);

  useEffect(
    ()=>{
    if (supplierType) {
         const type = getCodSupplierType()
          const identificationByType =getIdentificationTypeByCod(type==="PJ"? "NIT": "CC")
          if(identificationByType && JSON.stringify(identificationByType)!=="{}")
          setIdentificationType(identificationByType.idIdentificationType)
        
       }

    },[supplierType]
  )
  return (
    <Modal.Dialog>
      <Modal.Body>
        <div className="container-xl-modals">
          <div className="subtitle center">
            <b>
              {" "}
              {adminSupplier.action === "edit"
                ? "EDITAR PROVEEDOR"
                : "CREAR PROVEEDOR"}{" "}
            </b>
          </div>
          <div className="center mandatory">
            <div>{messageResultOperation}</div> <br />
          </div>
          <div className="row subcontainer-admin-options">
              <div className="col-2 right label">
              <span>Tipo de Proveedor &nbsp;</span>
            </div>
              <div className="col-4">
              <div className="w-80">
                <Select
                  id="idSupplierType"
                  name="name"
                  selectedValue={supplierType}
                  setSelectedValue={onChangeSupplierType}
                  array={supplierTypesArray}
                />
              </div>
              <div className="mandatory left" hidden={identificationType}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Tipo Identificación Obligatorio
              </div>
            </div>
          </div>
          <div className="row subcontainer-admin-options">
            <div className="col-2 right label">
              <span>Primer Nombre &nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="mandatory left" hidden={name}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Nombre Obligatorio
              </div>
            </div>
            <div className="col-2 right label" hidden={getCodSupplierType()==="PJ"}>
              <span>Segundo Nombre&nbsp;</span>
            </div>
            <div className="col-4" hidden={getCodSupplierType()==="PJ"}>
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={secondName}
                  onChange={(event) => setSecondName(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row subcontainer-admin-options" hidden={getCodSupplierType()==="PJ"}>
            <div className="col-2 right label">
              <span>Primer Apellido&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
              <div className="mandatory left" hidden={lastName}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Apellido Obligatorio
              </div>
            </div>
            <div className="col-2 right label">
              <span>Segundo Apellido&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={secondLastName}
                  onChange={(event) => setSecondLastName(event.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="row subcontainer-admin-options">
            <div className="col-2 right label">
              <span>Tipo Identificación &nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-80">
                <Select
                  id="idIdentificationType"
                  name="name"
                  selectedValue={identificationType}
                  setSelectedValue={onChangeIdentificationType}
                  array={identificationTypeArray}
                />
              </div>
              <div className="mandatory left" hidden={identificationType}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Tipo Identificación Obligatorio
              </div>
            </div>
            <div className="col-2 right label">
              <span>Identificación &nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={identification}
                  onChange={(event) => setIdentification(event.target.value)}
                />
              </div>
              <div className="mandatory left" hidden={identification}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Identificación Obligatorio
              </div>
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-2 right label">
              <span>De &nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-80">
                 <Select
                  id="idCity"
                  name="name"
                  selectedValue={identificationFrom}
                  setSelectedValue={onChangeIdentificationCity}
                  array={citiesArray}
                />
              </div>
              <div className="mandatory left" hidden={identificationFrom}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Ciudad de Identificación Obligatorio
              </div>
            </div>
            <div className="col-2 right label">
              <span>Dv &nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={dv}
                  maxLength={3}
                  onKeyDown={(event)=>handlers.onHandlerNumber(event)}
                  onChange={(event) => setDv(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-2 right label">
              <span>Dirección &nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  maxLength={100}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>
              <div className="mandatory left" hidden={address}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Dirección Obligatoria
              </div>
            </div>

             <div className="col-2 right label">
              <span>País Domicilio&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-80">
                <Select
                  id="idCountry"
                  name="name"
                  selectedValue={currentCountry}
                  setSelectedValue={onChangeCurrentCountry}
                  array={countriesArray}
                />
              </div>
            </div>

          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-2 right label">
              <span>Dpto. Domicilio&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-80">
                <Select
                  id="idDepartment"
                  name="name"
                  selectedValue={currentDepartment}
                  setSelectedValue={onChangeCurrentDepartment}
                  array={departmentsArray}
                />
              </div>
            </div>
             <div className="col-2 right label">
              <span>Ciudad&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-80">
                <Select
                  id="idCity"
                  name="name"
                  selectedValue={currentCity}
                  setSelectedValue={onChangeCurrentCity}
                  array={citiesArray}
                />
              </div>
            </div>
          </div>

          <div className="row subcontainer-admin-options">
            <div className="col-2 right label">
              <span>Telefono&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={phone}
                  maxLength={20}
                  onKeyDown={(event)=>handlers.onHandlerNumber(event)}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </div>
            <div className="col-2 right label">
              <span>Telefono Oficina&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={phoneOffice}
                  maxLength={20}
                  onKeyDown={(event)=>handlers.onHandlerNumber(event)}
                  onChange={(event) => setPhoneOffice(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="row subcontainer-admin-options">
            <div className="col-2 right label">
              <span>Celular&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={cellPhone}
                  maxLength={20}
                  onKeyDown={(event)=>handlers.onHandlerNumber(event)}
                  onChange={(event) => setCellPhone(event.target.value)}
                />
              </div>
               <div className="mandatory left" hidden={cellPhone}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Celular Obligatorio
              </div>
            </div>
             <div className="col-2 right label">
              <span>Email&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={email}
                
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="mandatory left" hidden={email}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Email Obligatorio
              </div>
               <div className="mandatory left" hidden={!email||email && handlers.onHandlerEmail(email)}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Email Invalido
              </div>
            </div>
     
          </div>

          <div className="row subcontainer-admin-options" hidden>
            <div className="col-2 right label">
              <span>Nombre Cuenta&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={accountName}
                  onChange={(event) => setAccountName(event.target.value)}
                />
              </div>
              <div className="mandatory left" hidden={accountName}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Nombre Cuenta Obligatorio
              </div>
            </div>
            <div className="col-2 right label">
              <span>Cuenta Bancaria&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-78">
                <input
                  className="input-modal w-100"
                  type="text"
                  value={accountNumber}
                  onKeyDown={(event)=>handlers.onHandlerNumber(event)}
                  onChange={(event) => setAccountNumber(event.target.value)}
                />
              </div>
                <div className="mandatory left" hidden={accountNumber}>
                <i className="fas fa-exclamation-circle" />
                &nbsp; Cuenta Bancaria Obligatoria
              </div>
            </div>
           
          </div>

          <div className="row subcontainer-admin-options" hidden>
            <div className="col-2 right label">
              <span>Tipo Cuenta&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-80">
                <Select
                  id="idAccountType"
                  name="name"
                  selectedValue={accountType}
                  setSelectedValue={onChangeAccountType}
                  array={accountTypesArray}
                />
              </div>
            </div>
            <div className="col-2 right label">
              <span>Banco&nbsp;</span>
            </div>
            <div className="col-4">
              <div className="w-80">
                <Select
                  id="idBank"
                  name="name"
                  selectedValue={bank}
                  setSelectedValue={onChangeBank}
                  array={banksArray}
                />
              </div>
            </div>
          </div>

          <br />
         
          <div className="right">
            <button
              className="secondary"
              type="button"
              onClick={() =>
              onCloseAdminSupplier()
              }
            >
              {"Cerrar"}
            </button>
            &nbsp;&nbsp;
            <button
              className="primary"
              disabled={!name ||(!lastName && getCodSupplierType() ==="PN") || !identification || !identificationFrom || !identification
                || !address || !cellPhone || !email
              }
              onClick={() => {
                onSaveSupplier(getSupplierProperties(), adminSupplier.action);
              }}
            >
              {adminSupplier.action === "edit"
                ? "Guardar Proveedor"
                : "Crear Proveedor"}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal.Dialog>
  );
};

export default AdminSupplier;
