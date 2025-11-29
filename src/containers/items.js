import { useEffect, useState,useContext} from "react"
import { useNavigate,useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ConstructionContext } from "../context/constructionContext";
import AdminOptions from "../components/commons/adminOptions"
import NewItem from "../components/items/newItem";
import ItemTable from "../components/items/itemTable";
import useEventListener from '../components/utils/useEventListener';

const Items = ({  }) => {
     const navigate = useNavigate ();
    const  {user,stageSelected}=
            useContext(ConstructionContext);
    const idStage =  stageSelected.idStage  
    const [searchParams] = useSearchParams();
    const idSubchapter = searchParams.get('idSubchapter')     
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
            const result = await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/search-subchapter-items`, {
                name:item ,
                idSubchapter
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
            const result = await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/create-subchapter-item`, {
                idSubchapter,
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
                // setItemArray(newItems)
                setNoData(false)
                //onSearchItems()
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
            const result = await axios.post(`${process.env.REACT_APP_BUDGET_URL_API}/create-stage-items`, {
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
             navigate(`/budget?option=constructionItems`)
             // setShowOption('contructionItems')
        }
    }

    useEffect(
        () => {
            getUnitsArray()
        }, []
    )
    const onCancelOption=()=>{
         navigate(`/budget?option=constructionItems`)
    }

      const handleKeyDownEnter =async(event) => {
        if (event.key === 'Enter') {
           if(!showNewItem){
              await onSearchItems()
           }
        }
    }
    useEventListener('keydown', handleKeyDownEnter);

    return (
        <div  className="col-10">
            {
                !showNewItem && (
                    <div>
                        <br/>
                          <div className="header-title">
                                <span>OPCIONES DE ITEMS</span>
                            </div>
                      
                        <AdminOptions
                        value={item}
                        setValue={setItem}
                        onSearch={onSearchItems}
                        onNewOption={onNewItem}
                        labelOption ="Crear Nuevo Item"
                        onCancelOption={onCancelOption}
                          />
                   </div>

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
                        <br/>
                         <div className="subtitle">
                                <span>LISTADO DE ITEMS GENERALES</span>
                            </div>
                      
                         <div>
                            <button
                                type="button"
                                className="primary"
                                value="Agregar Items"
                                onClick={() => onAddItems()}
                            >
                               {"Agregar Items"} 
                            </button> &nbsp;
                            {/* <button
                                type="button"
                                className="secondary"
                                onClick={() => { setShowNewItem(false);navigate(`/budget?option=constructionItems`) }}
                            >
                                {"Cancelar"}
                            </button> */}
                        </div>
                        <br/>
                        <ItemTable
                            itemArray={itemArray}
                            onSelectItem={onSelectItem}
                           
                        />
                        <br />
                       
                    </div>
                )
            }

        </div>
    )
}
export default Items