import React, { useRef, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { languages } from '../utils/constant'
import { textEN } from '../translations/en'
import { textVI } from '../translations/vi'
import { useSelector } from 'react-redux'
import './Search.scss'
import FormatedText from './FormatedText/FormatedText'
import { getOptionSearchService } from '../service/appService'
import { useNavigate } from 'react-router'

export default function Search() {
    const navigate = useNavigate()
    const language = useSelector(state => state.app.language)
    const [listSearch, setListSearch] = useState([])
    const [input, setInput] = useState('')
    const idTime = useRef()
    const itemSearch = useRef()


    const handleChangeFormInput = (event) => {
        if (idTime.current) {
            clearTimeout(idTime.current)
        }
        setInput(event.target.value)
        idTime.current = setTimeout(async () => {

            let resSearch = await getOptionSearchService(event.target.value)
            if (resSearch && resSearch.data && resSearch.data.errCode === 0) {
                setListSearch(resSearch.data.data)
            }
        }, 650)
    }

    const handleSearch = () => {
        if (itemSearch.current) {
            if (itemSearch.current.type === 'book') {
                navigate(`/infor-book/${itemSearch.current.bookId}`)
            }
            if (itemSearch.current.type === 'author') {
                navigate(`/infor-author/${itemSearch.current.authorId}`)
            }
            if (itemSearch.current.type === 'category') {
                navigate(`/list-books/${itemSearch.current.categoryId}/20`)
            }
            setInput('')
            itemSearch.current = null
        }
    }

    const handleSelect = (item) => {
        setInput(item.label)
        itemSearch.current = item
    }

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleSearch()
        }
    }

    return (
        <>
            <div className="content-center col-8">
                <input type="text" placeholder={language === languages.EN ? textEN.header.search : textVI.header.search}
                    value={input}
                    onChange={e => handleChangeFormInput(e)}
                    onKeyDown={e => handleEnter(e)}
                />
                <button className="" onClick={handleSearch} >
                    <BiSearch className="button-icons" />
                </button>

                <div className={input && input.length > 0 ? "options-search-container show" : "options-search-container"}>
                    <div className="options-search-body">
                        {
                            listSearch && listSearch.length > 0 &&
                            listSearch.map(item => {
                                return (
                                    <p key={item.id + item.label} onClick={() => handleSelect(item)}>{item.label}</p>
                                )
                            })
                        }
                        {
                            listSearch && listSearch.length === 0 &&
                            <p><FormatedText id="homePage.noOption" /></p>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
