import { useState, useEffect } from 'react'
import ChapterSelect from './commons/select'
import SubchapterSelect from './commons/select'
import axios from 'axios';

const Chapters = ({  chapterSelected, setChapterSelected, subchapterSelected, setSubchapterSelected, setShowOption }) => {

    const [chapterArray, setChapterArray] = useState([])
    const [allSubchapterArray, setAllSubchapterArray] = useState([])
    const [subchapterArray, setSubchapterArray] = useState([])
    const [loadedChapter, setLoadedChapter] = useState(false)
    const [loadedSubchapter, setLoadedSubchapter] = useState(false)

    const getchapters = () => {

        axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/chapters`)
            .then(response => {

                setChapterArray(response.data)
                if (response.data.length > 0)
                    setChapterSelected(chapterSelected || response.data[0].idChapter)
                setLoadedChapter(true)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const getSubchapters = () => {


        axios.get(`${process.env.REACT_APP_BUDGET_URL_API}/subchapters`)
            .then(response => {
                setAllSubchapterArray(response.data)
                setLoadedSubchapter(true)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    useEffect(
        () => {
            getchapters()
            getSubchapters()
        }, []
    )

    const selectSubchapter = () => {
        if (chapterSelected && JSON.stringify(chapterSelected) !== "{}") {
            const subchapters = allSubchapterArray.filter((x) => x.idChapter === parseInt(chapterSelected, 10))

            if (subchapters.length > 0) {
                setSubchapterArray(subchapters)
                setSubchapterSelected(subchapterSelected || subchapters[0].idSubchapter)
                
                console.log("subchapters===,subchapterSelected", subchapters[0].idSubchapter);
                   
                //if (showOption !== "searchInputs" && showOption !== "compoundInputs")
                //    setShowOption("contructionItems")
            }

        }
    }

    useEffect(
        () => {
           console.log("loadedChapter===",loadedChapter);
              console.log("loadedSubchapter===",loadedSubchapter);
            if (loadedChapter && loadedSubchapter)
                selectSubchapter()
        }, [chapterSelected, loadedChapter, loadedSubchapter]
    )

    useEffect(
        ()=>{
          localStorage.setItem("chapterValues",JSON.stringify({chapterSelected,subchapterSelected}))
        },[chapterSelected,subchapterSelected]
    )



    const onChangeChapter = (value) => {
        if (value) {
            setChapterSelected(parseInt(value, 10))
            setSubchapterSelected(0)
        }
    }



    const onChangeSubchapter = (value) => {
        if (value) {
            setSubchapterSelected(parseInt(value, 10))
            //if (showOption !== 'searchItems') {
                setShowOption("constructionItems")
            //}

        }
    }

    return (
        <div className="row">


            <div className='col-3'>
                <ChapterSelect
                    id='idChapter'
                    name="name"
                    selectedValue={chapterSelected}
                    setSelectedValue={onChangeChapter}
                    array={chapterArray}
                />
            </div>
            <div className='col-3'>
                <SubchapterSelect
                    id='idSubchapter'
                    name="name"
                    selectedValue={subchapterSelected}
                    setSelectedValue={onChangeSubchapter}
                    array={subchapterArray}
                />
            </div>
            <div className='col-6'>

            </div>
        </div>
    )
}
export default Chapters