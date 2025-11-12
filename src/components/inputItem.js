import { useEffect, useState } from 'react'
import axios from 'axios';
import ItemsSelect from './commons/select'
import InputItemTable from './inputItems/inputItemTable'


const InputItem = ({ idItem,user,contructionItemsArray,setShowOption,setIdItem }) => {

    const [inputItemsArray, setInputItemsArray] = useState([])
    const [noData, setNoData] = useState(false)

    const getInputsItems = async (id) => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/inputsItem`, {
                params: { idItem: id }
            })
            if (result && result.data && result.data.length > 0) {
                setInputItemsArray(result.data)
                setNoData(false)
            } else {
                setInputItemsArray([])
                setNoData(true)
            }
        } catch (error) {
            setInputItemsArray([])
            setNoData(true)
            console.error('Error fetching onSearchInput:', error);
        }
    }

    useEffect(
        () => {
            if (idItem) {
                getInputsItems(idItem)
            }

        }, [idItem]
    )

    const onChangeQuantity = (event, index, type) => {
        const newInputItemsArray = [...inputItemsArray]
        console.log("type", type);

        switch (type) {
            case "quantity":
                {

                    newInputItemsArray[index].quantity = parseInt(event.target.value, 10)

                }
                break;
            case "unitValue":
                {
                    newInputItemsArray[index].unitValue = parseFloat(event.target.value)
                }
                break;
            default:
                {
                    newInputItemsArray[index].waste = parseFloat(event.target.value)
                }

        }
        setInputItemsArray(...[newInputItemsArray]);
    }

     const updateInputItem = async (inputItem) => {
        try {
            const result = await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/updateInputItem`,{
                idItemInput: inputItem.idItemInput,
                idInput: inputItem.idInput,
                quantity: parseInt(inputItem.quantity),
                unitValue :parseFloat(inputItem.unitValue).toFixed(2),
                waste :parseFloat(inputItem.waste).toFixed(2),
                user
            })
           
        } catch (error) {
            setInputItemsArray([])
            setNoData(true)
            console.error('Error fetching updateInputItem:', error);
        }
    }

    const onSaveInformation=(index)=>{
        console.log("index===",index);
        const inputItem = {...inputItemsArray [index]}
      
        updateInputItem(inputItem)
         
    }

    const onChangeItem=(value)=>{
        if (value)
        setIdItem(parseInt(value,10))
    }


    return (
        <div>

            <div className='right back'  onClick={()=>{setShowOption("contructionItems")}}>
            <i 
                className='fas fa-arrow-alt-circle-left  '
                onClick={()=>{setShowOption("contructionItems")}}
            />
            <div className='container-label-back'>
                <span className='back-label'>Atrás</span>
            </div>
            </div>
      
            <div className='container-items-select'>
                <ItemsSelect
                    id ='idItem'
                    name ="name"
                    selectedValue ={idItem} 
                    setSelectedValue={onChangeItem}
                    array ={contructionItemsArray}
                />
            </div>
      

    
            
            {/* <input
             type='button'
             value="Atrás"
             onClick={()=>{setShowOption("contructionItems")}}
            /> */}
            {
                inputItemsArray && inputItemsArray.length > 0 && (

                    <InputItemTable
                        inputItemsArray={inputItemsArray}
                        onChangeQuantity={onChangeQuantity}
                        onSaveInformation={onSaveInformation}
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

        </div>
    )
}

export default InputItem