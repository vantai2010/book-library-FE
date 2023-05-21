import React, { useEffect, useRef, useState } from 'react'
import './Manage.scss'
import FormatedText from '../../components/FormatedText/FormatedText'
import ModalCreateUser from './Modal/ModalCreateUser'
import ModalUpdateUser from './Modal/ModalUpdateUser'
import { gender, languages, linkAvatarDefault, user_role } from '../../utils/constant'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleDeleteUserService, handleGetAllUserService } from '../../service/appService'
import { fetchListGenderThunk, fetchListRoleThunk } from '../../store/slice/appSlice';
import _ from 'lodash'
import { TbTrashFilled } from "react-icons/tb";
import { BsPencilSquare } from "react-icons/bs";
import { BiDetail } from "react-icons/bi";
import { Modal } from 'antd';
import { textEN } from '../../translations/en'
import { textVI } from '../../translations/vi'
import Select from 'react-select';
import Loading from "../../components/Loading"


export default function ManageUser() {
    const dispatch = useDispatch()
    const listGenders = useSelector(state => state.app.listGenders)
    const listRoles = useSelector(state => state.app.listRoles)
    const language = useSelector(state => state.app.language)
    const [isOpenModalCreateUser, setIsOpenModalCreateUser] = useState(false)
    const [isOpenModalUpdateUser, setIsOpenModalUpdateUser] = useState(false)
    const [isOpenModalCheck, setIsOpenModalCheck] = useState(false)
    const idDelete = useRef(null)
    const [showDetail, setShowDetail] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const usersRef = useRef({})
    const searchRef = useRef(null)
    const [optionSearch, setOptionSearch] = useState({})
    const [selectedUser, setSelectedUser] = useState({})

    const [dataUpdate, setDataUpdate] = useState({})
    const [arrUsers, setArrUsers] = useState({})
    const [currentRole, setCurrentRole] = useState(user_role.ADMIN)

    useEffect(() => {
        let options = {}
        if (!_.isEmpty(arrUsers)) {
            options[currentRole] = arrUsers[currentRole]?.map(item => {
                if (language === languages.EN) {
                    return {
                        value: item.email,
                        label: `${item.email}, Name: ${item.firstName} ${item.lastName}, PhoneNumber: ${item.phoneNumber}, Address: ${item.address}`
                    }
                }
                if (language === languages.VI) {
                    return {
                        value: item.email,
                        label: `${item.email}, Tên: ${item.lastName} ${item.firstName}, Số điện thoại: ${item.phoneNumber}, Địa chỉ: ${item.address}`
                    }
                }
            })
        }
        setOptionSearch(options)

    }, [language, currentRole, arrUsers])

    const getAllUsersToState = async () => {
        
        try {
            setIsLoading(true)
            let response = await handleGetAllUserService()
            setIsLoading(false)
            if (response && response.data && response.data.errCode === 0) {
                let coppyArrUser = { ...arrUsers }
                coppyArrUser[user_role.ADMIN] = response.data.data.filter(user => user.roleId === user_role.ADMIN)
                coppyArrUser[user_role.USER] = response.data.data.filter(user => user.roleId === user_role.USER)
                setArrUsers({ ...coppyArrUser })
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        getAllUsersToState()
        dispatch(fetchListGenderThunk())
        dispatch(fetchListRoleThunk())
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
        if (!_.isEmpty(arrUsers)) {
            for (let i = 0; i < Object.keys(user_role).length; i++) {
                let keyUserRole = Object.keys(user_role)[i]
                arrUsers[user_role[keyUserRole]]?.map(item => {
                    options[item.id] = false
                })
            }
        }
        setShowDetail(options)
    }, [arrUsers])


    const toggleModalCreateUser = () => {
        setIsOpenModalCreateUser(!isOpenModalCreateUser)
    }
    const toggleModalUpdateUser = () => {
        setIsOpenModalUpdateUser(!isOpenModalUpdateUser)
    }

    const handleCreateNewUser = () => {
        setIsOpenModalCreateUser(true)
    }


    const handleUpdateUser = (user) => {
        setDataUpdate(user)
        setIsOpenModalUpdateUser(true)
    }

    const handleDeleteModalCheck = async () => {
        try {
            const response = await handleDeleteUserService(idDelete.current)
            if (response && response.data && response.data.errCode === 0) {
                toast.success(language === languages.EN ? response.data.messageEN : response.data.messageVI)
                getAllUsersToState()
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

    const setCssUserSearched = (opject) => {
        if (opject) {
            opject.classList.add('active')
            // console.log('top', opject.offsetTop)
            opject.scrollIntoView({ block: "center" })
            // console.log(window, window.scrollY)
            setTimeout(() => {
                opject.classList.remove('active')
            }, 3000)
        }
    }

    const setKeyRefToNewUser = async (key) => {
        await getAllUsersToState()
        let user = usersRef.current[key]
        setCssUserSearched(user)
    }


    const handleSearchUser = (optionSelect) => {
        let user = usersRef.current[optionSelect.value]
        setSelectedUser(optionSelect)
        setCssUserSearched(user)
    }



    return (
        <>
        {
            isLoading && <Loading />
        }
            <div className="manage-container manage-user" >
                <ModalCreateUser
                    isOpen={isOpenModalCreateUser}
                    toggle={toggleModalCreateUser}
                    className={'modal-user-container'}
                    listGenders={listGenders}
                    listRoles={listRoles}
                    setCurrentRole={setCurrentRole}
                    setKeyRefToNewUser={setKeyRefToNewUser}
                />
                <ModalUpdateUser
                    isOpen={isOpenModalUpdateUser}
                    toggle={toggleModalUpdateUser}
                    className={'modal-user-container'}
                    user={dataUpdate}
                    listGenders={listGenders}
                    setKeyRefToNewUser={setKeyRefToNewUser}
                    listRoles={listRoles}
                    setCurrentRole={setCurrentRole}

                />
                <Modal title={language === languages.EN ? textEN.manage.confirm : textVI.manage.confirm} open={isOpenModalCheck} onOk={handleDeleteModalCheck} onCancel={handleCancelModalCheck}>
                    <p><FormatedText id="manage.checkDelete" /></p>
                </Modal>
                <div className="title text-center"><FormatedText id="manage.titleUser" /></div>
                <div className="mt-4 mx-3">
                    <div className="btn-container">
                        <button className="btn-create" onClick={() => handleCreateNewUser()}><FormatedText id="manage.btnCreate" /></button>

                        <div className="nav-btn">
                            <button
                                className={currentRole === user_role.ADMIN ? 'select' : ''}
                                onClick={() => setCurrentRole(user_role.ADMIN)}
                            >
                                <FormatedText id="manage.btnAdmin" /> ({arrUsers[user_role.ADMIN]?.length})
                            </button>
                            <button
                                className={currentRole === user_role.USER ? 'select' : ''}
                                onClick={() => setCurrentRole(user_role.USER)}
                            >
                                <FormatedText id="manage.btnUser" /> ({arrUsers[user_role.USER]?.length})
                            </button>
                        </div>

                    </div>
                    <div className="col-12 row search-container">
                        <div className="col-12 form-group search-fix-design" ref={searchRef}>
                            <label><FormatedText id="manage.search" /></label>
                            <Select
                                value={selectedUser}
                                className='col-4'
                                onChange={handleSearchUser}
                                options={optionSearch[currentRole] ? optionSearch[currentRole] : []}
                            />
                        </div>
                        {/* <div className="col-">

                        </div> */}
                    </div>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th><FormatedText id="table.email" /></th>
                                <th><FormatedText id="table.firstName" /></th>
                                <th><FormatedText id="table.lastName" /></th>
                                <th><FormatedText id="table.address" /></th>
                                <th><FormatedText id="table.phoneNumber" /></th>
                                <th><FormatedText id="table.gender" /></th>
                                <th><FormatedText id="table.action" /></th>

                            </tr>

                            {
                                arrUsers && arrUsers[currentRole] && arrUsers[currentRole].length > 0 &&
                                arrUsers[currentRole].map((user, index) => {
                                    return (
                                        <>
                                            <tr key={user.id} ref={el => usersRef.current[user.email] = el}>
                                                <td>{user.email}</td>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>{user.address}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td>
                                                    {user.genderUserData && !_.isEmpty(user.genderUserData) && language === languages.VI ? user.genderUserData.valueVi : !_.isEmpty(user.genderUserData) ? user.genderUserData.valueEn : ''}
                                                </td>
                                                <button onClick={() => setShowDetail({ ...showDetail, [user.id]: !showDetail[user.id] })}>
                                                    <BiDetail />
                                                </button>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleUpdateUser(user)}
                                                >
                                                    <BsPencilSquare />
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => { setIsOpenModalCheck(true); idDelete.current = user.id }}
                                                >
                                                    <TbTrashFilled />
                                                </button>
                                            </tr>
                                            {
                                                showDetail[user.id] &&
                                                <tr >
                                                    <td className='extra-infor-container' colSpan={7}>
                                                        <div className="extra-infor-body">
                                                            <div className='extra-infor-image' >
                                                                {
                                                                    user.image ?
                                                                        <img src={`${user.image}`} /> :
                                                                        (
                                                                            user.genderId === gender.MALE ?
                                                                                <img src={linkAvatarDefault.MALE} /> :
                                                                                user.genderId === gender.FEMALE ?
                                                                                    <img src={linkAvatarDefault.FEMALE} /> :
                                                                                    <img src={linkAvatarDefault.OTHER} />
                                                                        )
                                                                }
                                                            </div>
                                                            <div className='extra-infor row'>
                                                                <div className='col-6 my-3'><FormatedText id='manage.email' />: {user.email}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.role' />: {language === languages.EN ? user.roleData?.valueEn : user.roleData?.valueVi}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.firstName' />: {user.firstName}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.phoneNumber' />: {user.phoneNumber}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.lastName' />: {user.lastName}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.address' />: {user.address}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.gender' />: {language === languages.EN ? user.genderUserData?.valueVi : user.genderUserData?.valueEn}</div>
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
                                arrUsers && arrUsers[currentRole] && arrUsers[currentRole].length === 0 &&
                                <tr colSpan={7}>
                                    <FormatedText id="table.noData" />
                                </tr>
                            }

                        </tbody>
                    </table>
                </div >
            </div >
        </>
    )
}
