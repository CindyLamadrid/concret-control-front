const common = require("../utils/common");

const SupplierTable = ({
  suppliersArray,
  onEditSupplier,
  screen,
  onChangeSupplierSelected,
}) => {
  return (
    <div>
      <table className="table w-100">
        <thead>
          <tr>
            {screen === "contract" && <th className="w-5">SELECCIONAR</th>}
            <th className="w-15">TIPO</th>
            <th className="w-15">NOMBRE</th>
            <th className="w-15">APELLIDO</th>
            {/* <th className="w-10">SEGUNDO APELLIDO</th> */}
            <th className="w-10">TIPO ID</th>
            <th className="w-10">IDENTIFICACIÓN</th>
            {/* <th className="w-5">PAIS</th>
            <th className="w-5">DEPARTAMENTO</th>
            <th className="w-5">CIUDAD</th> */}
            <th className="w-15">DIRECCIÓN</th>
            {/* <th className="w-2">DV</th> */}
            <th className="w-5">CELULAR</th>
            {/* <th className="w-5">TELÉFONO</th>
            <th className="w-2">TELÉFONO OFICINA</th> */}
            <th className="w-10">CORREO</th>
            <th className="w-5" hidden={screen === "contract"}>
              EDITAR
            </th>
          </tr>
        </thead>
        <tbody>
          {suppliersArray.map((x, index) => {
            return (
              <tr key={index.toString()}>
                {screen === "contract" && (
                  <td className={index % 2 === 0 ? "dark center" : "center"}>
                    <input
                      type="radio"
                      name="supplier" 
                      value={x.selected}
                      onChange={() => {
                        onChangeSupplierSelected(index);
                      }}
                    />
                  </td>
                )}
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.supplierType}
                </td>
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.name}
                </td>
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.lastName}
                </td>
                {/* <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.secondLastName}
                </td> */}
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.identificationType}
                </td>
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.identification}
                </td>
                {/* <td className={index % 2 === 0 ? "dark right" : "left"}>
                  {x.country}
                </td>
                 <td className={index % 2 === 0 ? "dark right" : "left"}>
                  {x.department}
                </td>
                  <td className={index % 2 === 0 ? "dark right" : "left"}>
                  {x.city}
                </td> */}
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.address}
                </td>
                {/* <td className={index % 2 === 0 ? "dark right" : "right"}>
                  {x.dv}
                </td> */}
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.cellPhone}
                </td>
                {/* <td className={index % 2 === 0 ? "dark right" : "left"}>
                  {x.phone}
                </td>
                <td className={index % 2 === 0 ? "dark right" : "left"}>
                  {x.phoneOffice}
                </td> */}
                <td className={index % 2 === 0 ? "dark left" : "left"}>
                  {x.email}
                </td>
                {screen === "supplier" && (
                  <td className={index % 2 === 0 ? "dark center" : "center"}>
                    <i
                      className="fas fa-pencil-alt icon-view-detail"
                      onClick={() => onEditSupplier(index)}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;
