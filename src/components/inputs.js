import { useEffect, useState } from "react"
import axios from 'axios';
import AdminOptions from "./commons/adminOptions"
import InputTable from "./inputs/inputTable";
import NewInput from "./inputs/newInput"



const Inputs = ({idItem,user,setShowOption}) => {
    const [showNewInput, setShowNewInput] = useState(false)
    const [inputsArray, setInputsArray] = useState([])
    const [unistsArray, setUnitsArray] = useState([])
    const [categoriesArray, setCategories] = useState([])
    const [inputTypesArray, setinputTypesArray] = useState([])
    const [noData, setNoData] = useState(false)
    const [input, setInput] = useState('')
    const [messageResultOperation,setMessageResultOperation]= useState('')

    const getUnitsArray = () => {
        axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/units`).then(
            (result) => {
                if (result && result.data) {
                    setUnitsArray(result.data)
                } else {
                    setUnitsArray([])
                }
            }
        ).catch(error => {
            setUnitsArray([])
            console.error('Error fetching getUnitsArray:', error);
        });
    }

     const getCategoriesArray = () => {
        axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/categories`).then(
            (result) => {
                if (result && result.data) {
                    setCategories(result.data)
                } else {
                    setCategories([])
                }
            }
        ).catch(error => {
            setCategories([])
            console.error('Error fetching getCategoriesArray:', error);
        });
    }

     const getInputTypes = async () => {
        axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/inputTypes`).then(
            (result) => {
                if (result && result.data) {
                    setinputTypesArray(result.data)
                } else {
                    setinputTypesArray([])
                }
            }
        ).catch(error => {
            setinputTypesArray([])
            console.error('Error fetching getInputTypes:', error);
        });
    }

    console.log("messageResultOperation===",messageResultOperation);

    const onSearchInput = async () => {

       // setMessageResultOperation('')
        try {
            const result = await axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/inputsByName`, {
                params: { input }
            })
            if (result && result.data && result.data.length > 0) {
                setInputsArray(result.data)
                setNoData(false)
                
            } else {
                setInputsArray([])
                setNoData(true)
            }
        } catch (error) {
            setInputsArray([])
            setNoData(true)
            console.error('Error fetching onSearchInput:', error);
        }
    }

    
        const onSaveInputItem = async (items) => {
        try {
            const result = await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/createInputItem`, {
                idInput:items,idItem ,user
            })
             if (result && result.data && result.data.length>0){
                 setNoData(false)
                 
                const created = result.data[0]
              
                   console.log("entrooooo",created);
                if (created.newInputItem===0)
                {
                      console.log("entrooooo1111",created);
                    setMessageResultOperation('El insumo ya existe para el item seleccionado')
                }else
                {
                    setShowOption('inputItem')
                }
            }


          
        } catch (error) {
            setInputsArray([])
            setNoData(true)
            console.error('Error fetching onSearchInput:', error);
        }
    }

    const onNewInput = () => {
      
        setMessageResultOperation('')
        setShowNewInput(true)
        setNoData(false)
    }

    const onAddInput = () => {
        const selectedItems = inputsArray.filter(
            (x) => 
                x.selected
            
        )
       
        if (selectedItems && selectedItems.length > 0) {
            const idInputs = selectedItems.map(input => input.idInput).join(", ");
            onSaveInputItem(idInputs)
            
        }
    }

    const onSaveInput=async(unitSelected,inputTypeSelected, name,unitValue,compound,categorySelected)=>{

        try {
            const result = await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/createInput`, {
               
                idUnit: unitSelected,
                idInputType: inputTypeSelected,
                idCategory: categorySelected,
                name: name,
                compound:compound,
                unitValue:unitValue,
                user
            })
            setInputsArray([])
           
            if (result && result.data && result.data.length>0){
              
                const created = result.data[0]
            
                if (created.newInput===0)
                    setMessageResultOperation('El insumo ya existe con el mismo nombre ingresado')
                else
                    setShowNewInput(false)
            }
            
        } catch (error) {
            setInputsArray([])
            setNoData(true)
            console.error('Error fetching onSearchItems:', error);
        }
       
    }

    const onSelectInput = (index) => {

        if (index > -1) {

            const newInputsArray = inputsArray
            newInputsArray[index].selected = !inputsArray[index].selected
            console.log("newInputArray", newInputsArray);
            setInputsArray(...[newInputsArray])
        }
    }

    const onCancelOption=()=>{
        setShowOption('inputItem')
    }

    useEffect(
        ()=>{
                getUnitsArray()
                getInputTypes()
                getCategoriesArray()
        },[]
    )

    return (
        <div>
            {
                !showNewInput && (
                    <AdminOptions
                        value={input}
                        setValue={setInput}
                        onSearch={onSearchInput}
                        onNewOption={onNewInput}
                        onCancelOption={onCancelOption}
                        labelOption="Crear Nuevo Insumo"

                    />


                )
            }
            {
                noData && (
                    <div>
                        La busqueda no arrojo resultado
                    </div>
                )
            }
            {
                <div>
                    {messageResultOperation}
                 </div>
            }

             {
                showNewInput && (
                    <div
                        className="modal show"
                        style={{ display: 'block', position: 'initial' }}
                    >
                        <NewInput
                            unistsArray={unistsArray}
                            categoriesArray={categoriesArray}
                            inputTypesArray={inputTypesArray}
                            setShowNewInput={setShowNewInput}
                            onSaveInput={onSaveInput}
                        />
                    </div>
                )
            }

            {
                inputsArray && inputsArray.length > 0 && (
                    <div>
                 
                       
                        <div>
                        <b><span className="subtitle">LISTADO DE INSUMOS GENERALES</span></b>
                        </div>
                           <br />
                        <div className=" w-75 right">
                            <input
                                type="button"
                                value="Agregar Insumo"
                                onClick={() => onAddInput()}
                            /> 
                        </div>
                        <br />
                        <InputTable
                            inputsArray={inputsArray}
                            onSelectInput={onSelectInput}
                        />
                       
                       
                    </div>
                )
            }
        </div>
    )
}

export default Inputs