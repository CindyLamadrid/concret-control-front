
export const getTotals=(array,field)=>{
 let total =0
    for (let i = 0; i < array.length; i++) {  
        total += array[i][field]? array[i][field]:0;  
    }
    return total
}

export const getMoneyFomat=(value,isEditing)=>{
  if(isEditing)
     return value
const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  }).format(value? value:0)

  return formatter
}

// Formatea una fecha ISO (o Date) a dd-mm-aaaa
export const getDateFormat = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}-${month}-${year}`;
};






export default getTotals