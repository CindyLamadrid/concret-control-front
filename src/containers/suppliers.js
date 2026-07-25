import { useState } from "react";
import axios from "../config/axiosConfig";
import AdminSupplier from "../components/suppliers/adminSupplier";
import AdminOptions from "../components/commons/adminOptions";
import SupplierTable from "../components/suppliers/supplierTable";

const Suppliers = () => {
  const [adminSupplier, setAdminSupplier] = useState({
    show: false,
    supplier: "",
    action: "",
  });
  const [messageResultOperation, setMessageResultOperation] = useState("");
  const [supplier, setSupplier] = useState("");
  const [suppliersArray, setSuppliersArray] = useState([]);
  const [noData, setNoData] = useState(false);
  const onSaveSupplier = async (supplier, action) => {
    console.log("onSaveSupplier===",supplier);
      if(supplier)
        supplier.idSupplier= action === "edit" ? parseInt(adminSupplier.supplier.idSupplier) : 0
      const result = await axios.post(
        `${process.env.REACT_APP_BUDGET_URL_API}/${
          action === "edit" ? "update-supplier" : "create-supplier"
        }`,
        supplier
      );
        if (result && result.data && result.data.length > 0) {
          const response = result.data[0];

          if (response.supplier === 0) {
            setMessageResultOperation(
              "El proveedor ya existe con el número de identificación ingresado"
            );
          } else {
            setSuppliersArray([])
            setAdminSupplier({ show: false, supplier: "", action: "" });
           if (adminSupplier.action === "edit") await onSearchSupplier();
           
          }
        }
    
  };

  const onNewSupplier = () => {
    setMessageResultOperation("");
    setAdminSupplier({
      show: true,
      supplier: "",
      action: "new",
    });
  };

  const onSearchSupplier = async () => {
    if (!supplier) return;
    setMessageResultOperation("");
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BUDGET_URL_API}/supplier-name-id`,
        {
          params: { supplier },
        }
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
      console.error("Error fetching onSearchSupplier:", error);
    }
  };

  const onEditSupplier=(index)=>{
    setMessageResultOperation("");
    if (index > -1) {
      const supplier = suppliersArray[index];

      setAdminSupplier({ show: true, supplier, action: "edit" });
    }
  }

    const onCloseAdminSupplier= () => {
    setAdminSupplier({ show: false, supplier: "", action: "" });
    setMessageResultOperation("");
  };


  return (
    <div>
      <div>
        <br />
        <div className="header-title">
          <span>OPCIONES DE PROVEEDORES</span>
        </div>
        <AdminOptions
          value={supplier}
          setValue={setSupplier}
          onSearch={onSearchSupplier}
          onNewOption={onNewSupplier}
          onCancelOption={() => {}}
          labelOption="Crear Nuevo Proveedor "
          hideCancelOption
        />
      </div>

      {noData && <div>La busqueda no arrojo resultado</div>}
      {
        <div hidden={adminSupplier && adminSupplier.show}>
          {messageResultOperation}
        </div>
      }

      {adminSupplier.show && (
        <div
          className="modal show modal-lg modal-inline"
        >
          <AdminSupplier
            adminSupplier={adminSupplier}
            setAdminSupplier={setAdminSupplier}
            messageResultOperation={messageResultOperation}
            onSaveSupplier={onSaveSupplier}
            onCloseAdminSupplier={onCloseAdminSupplier}
          />
        </div>
      )}
        {suppliersArray && suppliersArray.length > 0 && (
        <div>
          <div className="subtitle">
            <span>LISTADO DE PROVEEDORES</span>
          </div>

          <div>
       
          </div>
          <br />
          <SupplierTable
            suppliersArray={suppliersArray}
            onEditSupplier ={onEditSupplier}
            screen="supplier"
            canEdit={true}
          />
        </div>
      )}
    </div>
  );
};
export default Suppliers;
