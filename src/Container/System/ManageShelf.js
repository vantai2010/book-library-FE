import React, { useEffect, useState, useRef } from 'react'
import FormatedText from '../../components/FormatedText/FormatedText'
import { useSelector } from 'react-redux'
import { languages } from '../../utils/constant'
import { handleGetAllShelfService, handleDeleteShelfService } from '../../service/appService'
import { TbTrashFilled } from "react-icons/tb";
import { BsPencilSquare } from "react-icons/bs";
import { toast } from 'react-toastify'
import './Manage.scss'
import ModalUpdateShelf from './Modal/ModalUpdateShelf'
import _ from "lodash"
import ModalCreateShelf from './Modal/ModalCreateShelf'
import { Modal } from 'antd'
import { textEN } from '../../translations/en'
import { textVI } from '../../translations/vi'
import Select from 'react-select';

export default function ManageShelf() {
    const language = useSelector(state => state.app.language)
    const [listShelfs, setListShelfs] = useState([])
    const [isShowModalCreateShelf, setIsShowModalCreateShelf] = useState(false)
    const [isShowModalUpdateShelf, setIsShowModalUpdateShelf] = useState(false)
    const [isOpenModalCheck, setIsOpenModalCheck] = useState(false)
    const idDelete = useRef(null)
    const [dataUpdate, setDataUpdate] = useState({})

    const shelfsRef = useRef({})
    const searchRef = useRef(null)
    const [optionSearch, setOptionSearch] = useState([])
    const [selectedShelf, setSelectedShelf] = useState({})

    const getAllListShelfs = async () => {
        try {
            let response = await handleGetAllShelfService()
            if (response && response.data && response.data.errCode === 0) {
                setListShelfs(response.data.data)
            } else {
                toast.error(language === languages.EN ? response.data.messsageEN : response.data.messageVI)
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        getAllListShelfs()
    }, [])

    useEffect(() => {
        let options = []
        if (listShelfs && listShelfs.length > 0) {
            listShelfs.map(item => {
                let optionItem = {}
                if (language === languages.EN) {
                    optionItem.value = item.name
                    optionItem.label = `Name: ${item.name}, Location: ${item.location}`

                }
                if (language === languages.VI) {

                    optionItem.value = item.name
                    optionItem.label = `Tên: ${item.name}, Vị trí: ${item.location}`

                }
                options.push(optionItem)
            })
            setOptionSearch(options)
        }
    }, [listShelfs, language])

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


    const handleCreateNewShelf = () => {
        setIsShowModalCreateShelf(true)
    }

    const handleUpdateShelf = (data) => {
        setDataUpdate(data)
        setIsShowModalUpdateShelf(true)
    }


    const toggleModalCreateShelf = () => {
        setIsShowModalCreateShelf(!isShowModalCreateShelf)
    }

    const toggleModalUpdateShelf = () => {
        setIsShowModalUpdateShelf(!isShowModalUpdateShelf)
    }

    const handleDeleteModalCheck = async () => {
        try {
            const response = await handleDeleteShelfService(idDelete.current)
            if (response && response.data && response.data.errCode === 0) {
                toast.success(language === languages.EN ? response.data.messageEN : response.data.messageVI)
                getAllListShelfs()
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

    const setCssShelfSearched = (object) => {
        if (object) {
            object.classList.add('active')
            object.scrollIntoView({ block: "center" })
            setTimeout(() => {
                object.classList.remove('active')
            }, 3000)
        }
    }

    const handleSearchShelf = (optionSelect) => {
        let shelf = shelfsRef.current[optionSelect.value]
        setSelectedShelf(optionSelect)
        setCssShelfSearched(shelf)
    }

    const setKeyRefToNewShelf = async (key) => {
        await getAllListShelfs()
        let shelf = shelfsRef.current[key]
        setCssShelfSearched(shelf)
    }


    return (
        <>
            <div className="manage-container">
                <ModalCreateShelf
                    isOpen={isShowModalCreateShelf}
                    toggle={toggleModalCreateShelf}
                    className={'modal-user-container'}
                    setKeyRefToNewShelf={setKeyRefToNewShelf}
                />
                <ModalUpdateShelf
                    isOpen={isShowModalUpdateShelf}
                    toggle={toggleModalUpdateShelf}
                    className={'modal-user-container'}
                    setKeyRefToNewShelf={setKeyRefToNewShelf}
                    shelf={dataUpdate}
                />
                <Modal title={language === languages.EN ? textEN.manage.confirm : textVI.manage.confirm} open={isOpenModalCheck} onOk={handleDeleteModalCheck} onCancel={handleCancelModalCheck}>
                    <p><FormatedText id="manage.checkDelete" /></p>
                </Modal>
                <div className="title text-center"><FormatedText id="manage.titleShelf" /></div>
                <div className="mt-4 mx-3">
                    <div className="btn-container">
                        <button className="btn-create" onClick={() => handleCreateNewShelf()}><FormatedText id="manage.btnCreate" /></button>
                    </div>
                    <div className="col-12 row search-container">
                        <div className="col-12 form-group search-fix-design" ref={searchRef}>
                            <label><FormatedText id="manage.search" /></label>
                            <Select
                                value={selectedShelf}
                                className='col-4'
                                onChange={handleSearchShelf}
                                options={optionSearch}
                            />
                        </div>
                    </div>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th><FormatedText id="table.name" /></th>
                                <th><FormatedText id="table.location" /></th>
                                <th><FormatedText id="table.description" /></th>
                                <th><FormatedText id="table.action" /></th>

                            </tr>

                            {
                                listShelfs && listShelfs.length > 0 &&
                                listShelfs.map(shelf => {
                                    return (
                                        <tr key={shelf.id} ref={el => shelfsRef.current[shelf.name] = el}>
                                            <td>{shelf.name}</td>
                                            <td>{shelf.location}</td>
                                            <td>{shelf.description}</td>
                                            <td>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleUpdateShelf(shelf)}
                                                >
                                                    <BsPencilSquare />
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => { setIsOpenModalCheck(true); idDelete.current = shelf.id }}
                                                >
                                                    <TbTrashFilled />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            {
                                listShelfs && listShelfs.length === 0 &&
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
