import React, { useEffect, useState, useRef } from 'react'
import FormatedText from '../../components/FormatedText/FormatedText'
import { handleGetAllAuthorService } from '../../service/appService'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { languages, linkAvatarDefault, gender } from '../../utils/constant'
import _ from 'lodash'
import { TbTrashFilled } from "react-icons/tb";
import { BsPencilSquare } from "react-icons/bs";
import ModalCreateAuthor from './Modal/ModalCreateAuthor'
import ModalUpdateAuthor from './Modal/ModalUpdateAuthor'
import { handleDeleteAuthorService } from '../../service/appService'
import { fetchListGenderThunk } from '../../store/slice/appSlice'
import './Manage.scss'
import Select from 'react-select';
import { BiDetail } from "react-icons/bi";
import { Modal } from 'antd'
import { textEN } from '../../translations/en'
import { textVI } from '../../translations/vi'

export default function ManageAuthor() {
    const language = useSelector(state => state.app.language)
    const listGenders = useSelector(state => state.app.listGenders)
    const dispatch = useDispatch()
    const [arrAuthors, setArrAuthors] = useState([])
    const [isShowModalCreateAuthor, setIsShowModalCreateAuthor] = useState(false)
    const [isShowModalUpdateAuthor, setIsShowModalUpdateAuthor] = useState(false)
    const [isOpenModalCheck, setIsOpenModalCheck] = useState(false)
    const idDelete = useRef(null)
    const [dataUpdate, setDataUpdate] = useState({})
    const [showDetail, setShowDetail] = useState({})

    const getAllAuthor = async () => {
        try {
            let response = await handleGetAllAuthorService()
            if (response && response.data && response.data.errCode === 0) {
                setArrAuthors(response.data.data)
            } else {
                toast.error(language === languages.EN ? response.data.messageEN : response.data.messageVI)
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const authorsRef = useRef({})
    const searchRef = useRef(null)
    const [optionSearch, setOptionSearch] = useState([])
    const [selectedAuthor, setSelectedAuthor] = useState({})

    useEffect(() => {
        getAllAuthor()
        dispatch(fetchListGenderThunk())
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
        let options = []
        if (arrAuthors && arrAuthors.length > 0) {
            arrAuthors.map(item => {
                let optionItem = {}
                if (language === languages.EN) {
                    optionItem.value = item.name + item.birthDay
                    optionItem.label = `Name: ${item.name}, Birth day: ${item.birthDay}`

                }
                if (language === languages.VI) {

                    optionItem.value = item.name + item.birthDay
                    optionItem.label = `Tên: ${item.name}, Ngày sinh: ${item.birthDay}`

                }
                options.push(optionItem)
            })
            setOptionSearch(options)
        }
    }, [arrAuthors, language])

    useEffect(() => {
        let options = {}
        if (arrAuthors && arrAuthors.length > 0) {
            arrAuthors.map(item => {
                options[item.id] = false
            })
        }
        setShowDetail(options)
    }, [arrAuthors])

    const handleCreateNewAuthor = () => {
        setIsShowModalCreateAuthor(true)
    }

    const handleUpdateAuthor = (author) => {
        setDataUpdate(author)
        setIsShowModalUpdateAuthor(true)
    }


    const toggleModalCreateAuthor = () => {
        setIsShowModalCreateAuthor(!isShowModalCreateAuthor)
    }

    const toggleModalUpdateUser = () => {
        setIsShowModalUpdateAuthor(!isShowModalUpdateAuthor)
    }

    const handleDeleteModalCheck = async () => {
        try {
            const response = await handleDeleteAuthorService(idDelete.current)
            if (response && response.data && response.data.errCode === 0) {
                toast.success(language === languages.EN ? response.data.messageEN : response.data.messageVI)
                getAllAuthor()
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

    const setCssAuthorSearched = (object) => {
        if (object) {
            object.classList.add('active')
            object.scrollIntoView({ block: "center" })
            setTimeout(() => {
                object.classList.remove('active')
            }, 3000)
        }
    }

    const setKeyRefToNewUser = async (key) => {
        await getAllAuthor()
        let author = authorsRef.current[key]
        setCssAuthorSearched(author)
    }
    const handleSearchAuthor = (optionSelect) => {
        let author = authorsRef.current[optionSelect.value]
        setSelectedAuthor(optionSelect)
        setCssAuthorSearched(author)
    }

    return (
        <>
            <div className="manage-container">
                <ModalCreateAuthor
                    isOpen={isShowModalCreateAuthor}
                    toggle={toggleModalCreateAuthor}
                    className={'modal-user-container'}
                    setKeyRefToNewUser={setKeyRefToNewUser}
                    listGenders={listGenders}
                />
                <ModalUpdateAuthor
                    isOpen={isShowModalUpdateAuthor}
                    toggle={toggleModalUpdateUser}
                    className={'modal-user-container'}
                    setKeyRefToNewUser={setKeyRefToNewUser}
                    author={dataUpdate}
                    listGenders={listGenders}
                />
                <Modal title={language === languages.EN ? textEN.manage.confirm : textVI.manage.confirm} open={isOpenModalCheck} onOk={handleDeleteModalCheck} onCancel={handleCancelModalCheck}>
                    <p><FormatedText id="manage.checkDelete" /></p>
                </Modal>
                <div className="title text-center"><FormatedText id="manage.titleAuthor" /></div>
                <div className="mt-4 mx-3">
                    <div className="btn-container">
                        <button className="btn-create" onClick={() => handleCreateNewAuthor()}><FormatedText id="manage.btnCreate" /></button>
                    </div>
                    <div className="col-12 row search-container">
                        <div className="col-12 form-group search-fix-design" ref={searchRef}>
                            <label><FormatedText id="manage.search" /></label>
                            <Select
                                value={selectedAuthor}
                                className='col-4'
                                onChange={handleSearchAuthor}
                                options={optionSearch}
                            />
                        </div>
                    </div>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th><FormatedText id="table.name" /></th>
                                <th><FormatedText id="table.birthDay" /></th>
                                <th><FormatedText id="table.gender" /></th>
                                <th><FormatedText id="table.action" /></th>
                            </tr>

                            {
                                arrAuthors && arrAuthors.length > 0 &&
                                arrAuthors.map((author) => {
                                    return (
                                        <>
                                            <tr key={author.id} ref={el => authorsRef.current[author.name + author.birthDay] = el}>
                                                <td>{author.name}</td>
                                                <td>{author.birthDay}</td>
                                                <td>{author.genderAuthorData && !_.isEmpty(author.genderAuthorData) && language === languages.VI ? author.genderAuthorData.valueVi : !_.isEmpty(author.genderAuthorData) ? author.genderAuthorData.valueEn : ''}
                                                </td>
                                                <td>
                                                    <button onClick={() => setShowDetail({ ...showDetail, [author.id]: !showDetail[author.id] })}>
                                                        <BiDetail />
                                                    </button>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => handleUpdateAuthor(author)}
                                                    >
                                                        <BsPencilSquare />
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => { setIsOpenModalCheck(true); idDelete.current = author.id }}
                                                    >
                                                        <TbTrashFilled />
                                                    </button>
                                                </td>
                                            </tr>
                                            {
                                                showDetail[author.id] &&
                                                <tr >
                                                    <td className='extra-infor-container' colSpan={7}>
                                                        <div className="extra-infor-body">
                                                            <div className='extra-infor-image' >
                                                                {
                                                                    author.image ?
                                                                        <img src={`${author.image}`} /> :
                                                                        (
                                                                            author.genderId === gender.MALE ?
                                                                                <img src={linkAvatarDefault.MALE} /> :
                                                                                author.genderId === gender.FEMALE ?
                                                                                    <img src={linkAvatarDefault.FEMALE} /> :
                                                                                    <img src={linkAvatarDefault.OTHER} />
                                                                        )
                                                                }
                                                            </div>
                                                            <div className='extra-infor row'>
                                                                <div className="col-6">
                                                                    <div className='col-12 my-3'><FormatedText id='manage.name' />: {author.name}</div>
                                                                    <div className='col-12 my-3'><FormatedText id='manage.birthDay' />: {author.birthDay}</div>
                                                                    <div className='col-12 my-3'><FormatedText id='manage.gender' />: {language === languages.EN ? author.genderAuthorData?.valueEn : author.genderAuthorData?.valueVi}</div>
                                                                </div>
                                                                <div className='col-6'>
                                                                    <div className='col-12 my-3'><FormatedText id='manage.description' />: {author.description}</div>
                                                                </div>
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
                                arrAuthors && arrAuthors.length === 0 &&
                                <tr colSpan={4}>
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
