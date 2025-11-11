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

    const onSearchInput = async () => {
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

     const getInputsItem = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/inputsItem`, {
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

    const onNewInput = () => {
        setShowNewInput(true)
    }

    const onAddInput = () => {
        const selectedItems = inputsArray.filter(
            (x) => 
                x.selected
            
        )
       
        if (selectedItems && selectedItems.length > 0) {
            const idInputs = selectedItems.map(input => input.idInput).join(", ");
            onSaveInputItem(idInputs)
            setShowOption('inputItem')
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
            if (result && result.data && result.data.length > 0) {
                const newItems = result.data.map(
                    (x) => {
                        const item = x;
                        item.selected = false
                        return item
                    }
                )
                setInputsArray(newItems)
                setNoData(false)
               
            } else {
                setInputsArray([])
                setNoData(true)
            }
        } catch (error) {
            setInputsArray([])
            setNoData(true)
            console.error('Error fetching onSearchItems:', error);
        }
        setShowNewInput(false)
    }

    const onSelectInput = (index) => {

        if (index > -1) {

            const newInputsArray = inputsArray
            newInputsArray[index].selected = !inputsArray[index].selected
            console.log("newInputArray", newInputsArray);
            setInputsArray(...[newInputsArray])
        }
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
                        <br />
                        <b><span className="subtitle">LISTADO DE INSUMOS GENERALES</span></b>
                        <br />
                        <InputTable
                            inputsArray={inputsArray}
                            onSelectInput={onSelectInput}
                        />
                        <br />
                        <div className=" w-70 right">
                            <input
                                type="button"
                                value="Agregar Insumo"
                                onClick={() => onAddInput()}
                            /> &nbsp;&nbsp;
                            <input
                                type="button"
                                value="Cancelar"
                                onClick={() => { setShowNewInput(false); setShowOption('') }}
                            />
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Inputs