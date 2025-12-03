
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
  }).format(value? value:0)

  return formatter
}






export default getTotals