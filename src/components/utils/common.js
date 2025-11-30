
export const getTotals=(array,field)=>{
 let total =0
    for (let i = 0; i < array.length; i++) {  
        total += array[i][field];  
    }
    return total
}

export const getMoneyFomat=(value,isEditing)=>{
  if(isEditing)
     return value
const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  }).format(value)

  return formatter
}






export default getTotals