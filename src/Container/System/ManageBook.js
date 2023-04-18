import React, { useEffect, useState, useRef } from 'react'
import FormatedText from '../../components/FormatedText/FormatedText'
import { fetchListCategoryThunk } from '../../store/slice/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import { languages, category_book } from '../../utils/constant'
import { getAllBookService } from '../../service/appService'
import { TbTrashFilled } from "react-icons/tb";
import { BsPencilSquare } from "react-icons/bs";
import ModalCreateBook from './Modal/ModalCreateBook'
import ModalUpdateBook from './Modal/ModalUpdateBook'
import { handleDeleteBookService, handleGetAllShelfService, handleGetAllAuthorService } from '../../service/appService'
import _ from "lodash"
import './Manage.scss'
import { BiDetail } from "react-icons/bi";
import Select from 'react-select';
import { toast } from 'react-toastify'
import { Modal } from 'antd'
import { textEN } from '../../translations/en'
import { textVI } from '../../translations/vi'

export default function ManageBook() {
    const dispatch = useDispatch()
    const listCategories = useSelector(state => state.app.listCategories)
    const language = useSelector(state => state.app.language)
    const [currentCategory, setCurrentCategory] = useState(category_book.COMIC)
    const [listBooks, setListBooks] = useState({})

    const [dataUpdate, setDataUpdate] = useState({})
    const [isShowModalCreateBook, setIsShowModalCreateBook] = useState(false)
    const [isShowModalUpdateBook, setIsShowModalUpdateBook] = useState(false)
    const [isOpenModalCheck, setIsOpenModalCheck] = useState(false)
    const idDelete = useRef(null)
    const [listAuthors, setListAuthors] = useState({})
    const [listShelfs, setListShelfs] = useState({})


    const booksRef = useRef({})
    const searchRef = useRef(null)
    const [optionSearch, setOptionSearch] = useState({})
    const [selectedBook, setSelectedBook] = useState({})

    const [showDetail, setShowDetail] = useState({})


    const getInforShelfAndAuthor = async () => {
        try {
            let resAuhtor = await handleGetAllAuthorService()
            let resShelf = await handleGetAllShelfService()
            if (resShelf && resShelf.data && resShelf.data.errCode === 0) {
                setListShelfs(resShelf.data.data)
            } else {
                toast.error(language === languages.EN ? resShelf.data.messageEN : resShelf.data.messageVI)
            }
            if (resAuhtor && resAuhtor.data && resAuhtor.data.errCode === 0) {
                setListAuthors(resAuhtor.data.data)
            } else {
                toast.error(language === languages.EN ? resAuhtor.data.messageEN : resAuhtor.data.messageVI)
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const getAllListBook = async () => {
        let response = await getAllBookService()
        if (response && response.data && response.data.errCode === 0) {
            let object = {}
            object[category_book.COMIC] = response.data.data.filter(item => item.categoryId === 'C1')
            object[category_book.TEXTBOOKS] = response.data.data.filter(item => item.categoryId === 'C2')
            object[category_book.REFBOOK] = response.data.data.filter(item => item.categoryId === 'C3')
            object[category_book.SKILLBOOK] = response.data.data.filter(item => item.categoryId === 'C4')
            setListBooks({ ...object })
        }
    }

    useEffect(() => {
        dispatch(fetchListCategoryThunk())
        getAllListBook()
        getInforShelfAndAuthor()
        setCurrentCategory(listCategories && listCategories.length > 0 && listCategories[0].keyMap)
    }, [])

    useEffect(() => {
        const handleEvent = () => {
            if (window.scrollY > 129) {
                searchRef.current.classList.add('search-fix')
            }
            else {
                searchRef.current.classList.remove('search-fix')
            }
        }
        window.addEventListener('scroll', handleEvent);
        return () => window.removeEventListener('scroll', handleEvent)
    }, [])


    useEffect(() => {
        let options = {}
        options[currentCategory] = listBooks[currentCategory]?.map(item => {
            if (language === languages.EN) {
                return {
                    value: item.name + item.categoryId,
                    label: `Name: ${item.name}, Auhtor: ${item.authorData?.name}`
                }
            }
            if (language === languages.VI) {
                return {
                    value: item.name + item.categoryId,
                    label: `Tên: ${item.name}, Tác giả: ${item.authorData?.name}`
                }
            }
        })
        setOptionSearch(options)

    }, [language, currentCategory, listBooks])

    useEffect(() => {
        let options = {}
        if (!_.isEmpty(listBooks)) {
            for (let i = 0; i < Object.keys(category_book).length; i++) {
                let keyCategory = Object.keys(category_book)[i]
                listBooks[category_book[keyCategory]].map(item => {
                    options[item.id] = false
                })
            }
        }
        setShowDetail(options)
    }, [listBooks])


    const handleCreateNewBook = () => {
        setIsShowModalCreateBook(true)
    }

    const handleUpdateBook = (data) => {
        setDataUpdate(data)
        setIsShowModalUpdateBook(!isShowModalUpdateBook)
    }



    const toggleModalCreateBook = () => {
        setIsShowModalCreateBook(!isShowModalCreateBook)
    }
    const toggleModalUpdateBook = () => {
        setIsShowModalUpdateBook(!isShowModalUpdateBook)
    }

    const handleDeleteModalCheck = async () => {
        try {
            const response = await handleDeleteBookService(idDelete.current)
            if (response && response.data && response.data.errCode === 0) {
                toast.success(language === languages.EN ? response.data.messageEN : response.data.messageVI)
                getAllListBook()
                idDelete.current = null
                setIsOpenModalCheck(false)
            } else {
                toast.error(language === languages.EN ? response.data.messageEN : response.data.messageVI)
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const handleCancelModalCheck = () => {
        setIsOpenModalCheck(false)
    }

    const setCssBookSearched = (object) => {

        if (object) {
            object.classList.add('active')
            object.scrollIntoView({ block: "center" })
            setTimeout(() => {
                object.classList.remove('active')
            }, 3000)
        }
    }

    const setKeyRefToNewBook = async (key) => {
        await getAllListBook()
        let book = booksRef.current[key]
        setCssBookSearched(book)
    }

    const handleSearchBook = (optionSelect) => {
        let book = booksRef.current[optionSelect.value]
        setSelectedBook(optionSelect)
        setCssBookSearched(book)
    }


    return (
        <>
            <div className="manage-container">
                <ModalCreateBook
                    isOpen={isShowModalCreateBook}
                    toggle={toggleModalCreateBook}
                    className={'modal-user-container'}
                    setKeyRefToNewBook={setKeyRefToNewBook}
                    listCategories={listCategories}
                    listAuthors={listAuthors}
                    listShelfs={listShelfs}
                    setCurrentCategory={setCurrentCategory}
                />
                <ModalUpdateBook
                    isOpen={isShowModalUpdateBook}
                    toggle={toggleModalUpdateBook}
                    className={'modal-user-container'}
                    setKeyRefToNewBook={setKeyRefToNewBook}
                    listCategories={listCategories}
                    book={dataUpdate}
                    listAuthors={listAuthors}
                    listShelfs={listShelfs}
                    setCurrentCategory={setCurrentCategory}
                />
                <Modal title={language === languages.EN ? textEN.manage.confirm : textVI.manage.confirm} open={isOpenModalCheck} onOk={handleDeleteModalCheck} onCancel={handleCancelModalCheck}>
                    <p><FormatedText id="manage.checkDelete" /></p>
                </Modal>
                <div className="title text-center"><FormatedText id="manage.titleBook" /></div>
                <div className="mt-4 mx-3">
                    <div className="btn-container">
                        <button className="btn-create" onClick={() => handleCreateNewBook()}><FormatedText id="manage.btnCreate" /></button>
                        <div className="nav-btn">
                            {
                                listCategories && listCategories.length > 0 &&
                                listCategories.map((category) => {
                                    return (
                                        <button
                                            className={currentCategory === category.keyMap ? 'select' : ''}
                                            onClick={() => setCurrentCategory(category.keyMap)}
                                        >
                                            {language === languages.EN ? category.valueEn : category.valueVi} ({listBooks[category.keyMap]?.length})
                                        </button>
                                    )
                                })
                            }

                        </div>
                    </div>
                    <div className="col-12 row search-container">
                        <div className="col-12 form-group search-fix-design" ref={searchRef}>
                            <label><FormatedText id="manage.search" /></label>
                            <Select
                                value={selectedBook}
                                className='col-4'
                                onChange={handleSearchBook}
                                options={optionSearch[currentCategory] ? optionSearch[currentCategory] : []}
                            />
                        </div>
                    </div>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th><FormatedText id="table.name" /></th>
                                <th><FormatedText id="table.author" /></th>
                                <th><FormatedText id="table.quantity" /></th>
                                <th><FormatedText id="table.shelf" /></th>
                                <th><FormatedText id="table.action" /></th>

                            </tr>

                            {
                                listBooks && !_.isEmpty(listBooks) && listBooks[currentCategory] && listBooks[currentCategory].length > 0 &&
                                listBooks[currentCategory].map((book, index) => {
                                    return (
                                        <>
                                            <tr key={book.id} ref={el => booksRef.current[book.name + book.categoryId] = el} id={book.id}>
                                                <td>{book.name}</td>
                                                <td>{book.authorData.name}</td>
                                                <td>{book.quantity}</td>
                                                <td>{book.bookInforData.shelfData.name}</td>
                                                <td>
                                                    <button onClick={() => setShowDetail({ ...showDetail, [book.id]: !showDetail[book.id] })}>
                                                        <BiDetail />
                                                    </button>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => handleUpdateBook(book)}
                                                    >
                                                        <BsPencilSquare />
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => { setIsOpenModalCheck(true); idDelete.current = book.id }}
                                                    >
                                                        <TbTrashFilled />
                                                    </button>
                                                </td>
                                            </tr>
                                            {
                                                showDetail[book.id] &&
                                                <tr >
                                                    <td className='extra-infor-container' colSpan={7}>
                                                        <div className="extra-infor-body">
                                                            <div className='extra-infor-image' >
                                                                <img src={`${book.image}`} />
                                                            </div>
                                                            <div className='extra-infor row'>
                                                                <div className='col-6 my-3'><FormatedText id='manage.name' />: {book.name}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.shelf' />: {book.bookInforData?.shelfData?.name}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.category' />: {language === languages.EN ? book.categoryData?.valueEn : book.categoryData?.valueVi}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.room' />: {book.bookInforData?.roomId}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.author' />: {book.authorData?.name}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.quantity' />: {book.quantity}</div>
                                                                <div className='col-12 my-3'><FormatedText id='manage.description' />: {book.bookInforData?.description}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            }
                                        </>
                                    )
                                })
                            }
                            {
                                listBooks && !_.isEmpty(listBooks) && listBooks[currentCategory] && listBooks[currentCategory].length === 0 &&
                                <tr colSpan={5}>
                                    <FormatedText id="table.noData" />
                                </tr>
                            }

                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}
