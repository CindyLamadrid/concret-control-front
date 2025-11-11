import { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UnitSelect from '../commons/select'

const handlers = require('../utils/handlers')

const NewInput = ({unistsArray,categoriesArray,inputTypesArray,setShowNewInput,onSaveInput}) => {

    const [name, setName] = useState('')
    const [unitSelected,setUnitSelected] = useState('')
    const [inputTypeSelected,setInputTypeSelected] = useState('')
    const [categorySelected,setCategorySelected]= useState('')
    const [unitValue,setUnitValue]= useState(0)
    const [compound,setCompound]= useState(false)
    
    const onChangeUnit=(value)=>{
        if(value)
        setUnitSelected(parseInt(value,10))
    }

    const onChangeInputType=(value)=>{
       if(value)
        setInputTypeSelected(parseInt(value,10))
    }

    const onChangeCategory=(value)=>
    {
         if(value)
        setCategorySelected(parseInt(value,10))
    }

    useEffect(
        ()=>{
                if (unistsArray && unistsArray.length>0)
                    setUnitSelected(unistsArray[0].idUnit)
                 if (inputTypesArray && inputTypesArray.length>0)
                   setInputTypeSelected(inputTypesArray[0].idInputType)

                 if (categoriesArray && categoriesArray.length>0)
                   setCategorySelected(categoriesArray[0].idCategory)
        },[]
    )
    
    return (
       
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Crear Input</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row">
                        <div className="col-4 right">
                            <span>Nombre</span>
                        </div>
                        <div className="col-8">
                            <input
                                className="input w-100"
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                            <div className="mandatory left" hidden={name}>
                                <i className="fas fa-exclamation-circle"/>
                                 &nbsp;
                                Nombre Obligatorio</div>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-4 right">
                            <span>Unidad de Medida</span>
                        </div>
                        <div className="col-8">
                        <UnitSelect
                            
                            id ='idUnit'
                            name ="name"
                            selectedValue ={unitSelected} 
                            setSelectedValue={onChangeUnit}
                            array ={unistsArray}
                            />

                        </div>
                    </div>
                     <div className="row">
                        <div className="col-4 right">
                            <span>Tipo de Insumo</span>
                        </div>
                        <div className="col-8">
                        <UnitSelect
                            
                            id ='idInputType'
                            name ="name"
                            selectedValue ={inputTypeSelected} 
                            setSelectedValue={onChangeInputType}
                            array ={inputTypesArray}
                            />

                        </div>
                         <div className="row">
                        <div className="col-4 right">
                            <span>Categoria</span>
                        </div>
                        <div className="col-8">
                        <UnitSelect
                            
                            id ='idCategory'
                            name ="name"
                            selectedValue ={categorySelected} 
                            setSelectedValue={onChangeCategory}
                            array ={categoriesArray}
                            />

                        </div>
                            </div>
                    </div>
                         <div className="row">
                        <div className="col-4 right">
                            <span>Valor</span>
                        </div>
                        <div className="col-8">
                            <input
                                className="input w-100"
                                type="text"
                                value={unitValue}
                                onKeyDown={(event)=>handlers.onHandlerNumber(event)}
                                onChange={(event) => setUnitValue(event.target.value)}
                            />
                            <div className="mandatory left" hidden={unitValue}>
                                <i className="fas fa-exclamation-circle"/>
                                 &nbsp;
                                Valor Obligatorio</div>
                        </div>
                    </div>

                       <div className="row">
                        <div className="col-4 right">
                            <span>Compuesto?</span>
                        </div>
                        <div className="col-8">
                            <input
                            className="left"
                            type="checkbox"
                            checked={compound}
                            onChange={() => setCompound(!compound)}
                                            />
                       
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>setShowNewInput(false)}>Cerrar</Button>
                    <Button variant="primary" onClick={()=>{onSaveInput(unitSelected,inputTypeSelected,name,unitValue,compound,categorySelected)}} disabled={!name || !unitValue}>Crear Insumo</Button>
                </Modal.Footer>
            </Modal.Dialog>
    
    )
}

export default NewInput