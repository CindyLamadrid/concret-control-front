const commom = require('../utils/common')

const Header=({constructionSelected,stageSelected,itemSelected})=>{
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
       
        

    </div>
)
}
export default Header