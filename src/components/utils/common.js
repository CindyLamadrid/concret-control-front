export const getTotals=(array,field)=>{
 let total =0
    for (let i = 0; i < array.length; i++) {  
        total += array[i][field];  
    }
    return total
}



export default getTotals