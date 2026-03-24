const InputsTable = ({ inputsArray }) => {
  return (
    <div>
      <table className="table w-100">
        <thead>
          <tr>
            <th className="w-10">IMPUTACIÓN</th>
            <th className="w-10">N° CONTRATO</th>
            <th className="w-10">CÓDIGO INSUMO</th>
            <th className="w-20">DESCRIPCIÓN</th>
            <th className="w-5">UNIDAD</th>
            <th className="w-10">CANTIDAD</th>
            <th className="w-10">PRECIO</th>
            <th className="w-10">VALOR</th>
            <th className="w-5">IVA</th>
            <th className="w-10">BASE</th>
          </tr>
        </thead>
        <tbody>
          {inputsArray.map((x, index) => (
            <tr key={index.toString()}>
              <td className={index % 2 === 0 ? "dark left" : "left"}>{x.imputation}</td>
              <td className={index % 2 === 0 ? "dark center" : "center"}>{x.contractNumber}</td>
              <td className={index % 2 === 0 ? "dark center" : "center"}>{x.inputCod}</td>
              <td className={index % 2 === 0 ? "dark left" : "left"}>{x.description}</td>
              <td className={index % 2 === 0 ? "dark center" : "center"}>{x.unit}</td>
              <td className={index % 2 === 0 ? "dark right" : "right"}>{x.quantity}</td>
              <td className={index % 2 === 0 ? "dark right" : "right"}>{x.price}</td>
              <td className={index % 2 === 0 ? "dark right" : "right"}>{x.value}</td>
              <td className={index % 2 === 0 ? "dark right" : "right"}>{x.IVA}</td>
              <td className={index % 2 === 0 ? "dark right" : "right"}>{x.base}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InputsTable;
