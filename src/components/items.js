import { useEffect, useState } from "react"
import axios from 'axios';
import AdminOptions from "./commons/adminOptions"
import NewItem from "./items/newItem";
import ItemTable from "./items/itemTable";

const Items = ({ subchapterSelected, user, setShowOption ,idStage}) => {

    const [item, setItem] = useState('')
    const [showNewItem, setShowNewItem] = useState(false)
    const [itemArray, setItemArray] = useState([])
    const [unistsArray, setUnitsArray] = useState([])
    const [noData, setNoData] = useState(false)

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

    const onSearchItems = async () => {
        try {
            const result = await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/itemsByName`, {
                name:item ,
                idSubChapter:subchapterSelected
            })
            if (result && result.data && result.data.length > 0) {
                setItemArray(result.data)
                setNoData(false)
            } else {
                setItemArray([])
                setNoData(true)
            }
        } catch (error) {
            setItemArray([])
            setNoData(true)
            console.error('Error fetching onSearchItems:', error);
        }
    }

    const onSaveItem = async (unitSelected, name) => {


        try {
            const result = await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/createItem`, {
                idSubchapter: subchapterSelected,
                idUnit: unitSelected,
                name: name,
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
                setItemArray(newItems)
                setNoData(false)
                onSearchItems()
            } else {
                setItemArray([])
                setNoData(true)
            }
        } catch (error) {
            setItemArray([])
            setNoData(true)
            console.error('Error fetching onSearchItems:', error);
        }
        setShowNewItem(false)
    }

    const onNewItem = () => {
        setShowNewItem(true)
    }

    const onSelectItem = (index) => {

        if (index > -1) {

            const newItemArray = itemArray
            newItemArray[index].selected = !itemArray[index].selected
            console.log("newItemArray", newItemArray);
            setItemArray(...[newItemArray])
        }
    }

     const createStageItems = async (stageItems) => {
        try {
            const result = await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/createStageItems`, {
                idStage: idStage,
                idItem: stageItems.idItems,
                user
            })
           
           
        } catch (error) {
            setItemArray([])
            setNoData(true)
            console.error('Error fetching onSearchItems:', error);
        }
        setShowNewItem(false)
    }

    const onAddItems = () => {
        const selectedItems = itemArray.filter(
            (x) => 
                x.selected
            
        )
        if (selectedItems && selectedItems.length > 0) {
            const defaultItems = selectedItems.map(
                (x) => {
                    const apu = x
                    x.quantity = 0
                    x.value = 0
                    return apu
                }
               
            )
             // setContructionItemsArray (defaultItems)
             //
             const stageItems = [...defaultItems]
             const idItems = selectedItems.map(input => input.idItem).join(", ");
             stageItems.idItems=idItems
             console.log("stageItems===",stageItems);
             createStageItems(stageItems)
             setShowOption('contructionItems')
        }
    }

    useEffect(
        () => {
            getUnitsArray()
        }, []
    )

    return (
        <div>
            {
                !showNewItem && (
                    <AdminOptions
                        value={item}
                        setValue={setItem}
                        onSearch={onSearchItems}
                        onNewOption={onNewItem}
                        labelOption ="Crear Nuevo Item"

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
                showNewItem && (
                    <div
                        className="modal show"
                        style={{ display: 'block', position: 'initial' }}
                    >
                        <NewItem
                            unistsArray={unistsArray}
                            setShowNewItem={setShowNewItem}
                            onSaveItem={onSaveItem}
                        />
                    </div>
                )
            }
            {
                itemArray && itemArray.length > 0 && (
                    <div>
                        <br />
                        <b><span className="subtitle">LISTADO DE ITEMS GENERALES</span></b>
                        <br />
                        <ItemTable
                            itemArray={itemArray}
                            onSelectItem={onSelectItem}
                        />
                        <br />
                        <div className=" w-70 right">
                            <input
                                type="button"
                                value="Agregar Items"
                                onClick={() => onAddItems()}
                            /> &nbsp;&nbsp;
                            <input
                                type="button"
                                value="Cancelar"
                                onClick={() => { setShowNewItem(false); setShowOption('') }}
                            />
                        </div>
                    </div>
                )
            }

        </div>
    )
}
export default Items