const commom = require('../utils/common')

const Header=({constructionSelected,stageSelected,itemSelected,inputSelected})=>{
return(
    <div className="header-container">
       <div className="left">
           
             <span><b>OBRA: </b></span><span>{constructionSelected.name}</span>&nbsp;&nbsp;&nbsp;
             <span><b>ESTAPA: </b></span> <span>{stageSelected.name}</span>
        </div>

      {
        itemSelected && JSON.stringify(itemSelected)!=="{}" && (
          <>
           <div className="left">
           
             <span><b>ITEM: </b></span><span>{itemSelected.cod}</span>&nbsp;&nbsp;&nbsp;
             <span><b>DESCRIPCION: </b></span> <span>{itemSelected.name}</span>
             
           </div>
             <div className="left">
           
             <span><b>UNIDAD: </b></span><span>{itemSelected.unit}</span>&nbsp;&nbsp;&nbsp;
             <span><b>CANTIDAD: </b></span> <span>{itemSelected.quantity}</span>&nbsp;&nbsp;&nbsp;
               <span><b>VALOR/UN: </b></span> <span>{commom.getMoneyFomat(itemSelected.totalItem)}</span>
        </div></>
        )
      }
       {
        inputSelected && JSON.stringify(inputSelected)!=="{}" && (
          <>
           <div className="left">
           
             <span><b>INPUT: </b></span><span>{inputSelected.cod}</span>&nbsp;&nbsp;&nbsp;
             <span><b>DESCRIPCION: </b></span> <span>{inputSelected.name}</span>
             
           </div>
             <div className="left">
           
             <span><b>UNIDAD: </b></span><span>{inputSelected.unit}</span>&nbsp;&nbsp;&nbsp;
             <span><b>CANTIDAD: </b></span> <span>{inputSelected.quantity}</span>&nbsp;&nbsp;&nbsp;
               <span><b>VALOR/UN: </b></span> <span>{commom.getMoneyFomat(inputSelected.totalInput)}</span>
        </div></>
        )
      }
        

    </div>
)
}
export default Header