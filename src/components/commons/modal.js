import Modal from 'react-bootstrap/Modal';

const Notifications=({message, buttonArray,item})=>{
return (
     <div
                        className="modal show"
                        style={{ display: 'block', position: 'initial' }}
                    >
       <Modal.Dialog>
                <Modal.Body>
                        {message? message:""}
                        <div>
                           {buttonArray && buttonArray.length>0 &&(
                             buttonArray.map(
                                (x,index)=>{
                                   return (

                                    <input
                                    className={`${index===0?'btn-primary':'button-space btn-primary'}`}
                                    type="button"
                                    value={x.name}
                                    disabled={x.disabled}
                                    onClick={() => { x.action(item) }}
                                    />
                                   ) 
                                }
                             ))
                           }
                      {/* <input
                        className="btn-primary"
                        type="button"
                        value="Crear Item"
                        disabled={!name}
                        onClick={() => { onSaveItem(unitSelected, name) }}
                    /> */}
                        </div>
                </Modal.Body>
        </Modal.Dialog>
        </div>
)
}

export default Notifications