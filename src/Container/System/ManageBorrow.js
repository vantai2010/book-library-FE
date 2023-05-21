import React, { useEffect, useState, useRef } from 'react'
import FormatedText from '../../components/FormatedText/FormatedText'
import { languages, status_cart, linkAvatarDefault, gender, title_notify } from '../../utils/constant'
import { TbTrashFilled } from "react-icons/tb";
import { BsPencilSquare } from "react-icons/bs";
import './Manage.scss'
import _ from "lodash"
import { BiDetail } from "react-icons/bi";
import { Modal } from 'antd'
import { textEN } from '../../translations/en'
import { textVI } from '../../translations/vi'
import { useSelector } from 'react-redux';
import { getListCartToManageService, addOneNotifycationService, deleteOneCartService, getAllBookService, confirmTransactionSuccessService, confirmCartBorrowSuccessService } from '../../service/appService';
import { toast } from 'react-toastify'
import Select from 'react-select';
import { Button } from 'antd'
import ModalCreateBorrow from './Modal/ModalCreateBorrow';
import ModalUpdateBorrow from './Modal/ModalUpdateBorrow';
import moment from 'moment';
import Loading from "../../components/Loading"

export default function ManageBorrow() {
    const language = useSelector(state => state.app.language)
    const socketNotify = useSelector(state => state.auth.socketNotify)
    const [isOpenModalInfor, setIsOpenModalInfor] = useState(false)
    const [isOpenModalConfirm, setIsOpenModalConfirm] = useState(false)
    const [listCart, setListCart] = useState({})
    const [currentStatus, setCurrentStatus] = useState(status_cart.WAITING)
    const [showDetail, setShowDetail] = useState({})
    const [reason, setReason] = useState('')
    const [reaturnDateConfirm, setReaturnDateConfirm] = useState('')
    const [errMessage, setErrMessage] = useState('')
    const dataCartRefuseSelected = useRef()
    const idCartSelected = useRef()
    const transactionConfirm = useRef()
    const [isOpenModalCreateBorrow, setIsOpenModalCreateBorrow] = useState(false)
    const [isOpenModalUpdateBorrow, setIsOpenModalUpdateBorrow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const dataUpdate = useRef()

    const transactionsRef = useRef({})
    const searchRef = useRef(null)
    const [optionSearch, setOptionSearch] = useState([])
    const [selectedTransaction, setSelectedTransaction] = useState({})

    const listBooks = useRef()

    const getAllBook = async () => {
        setIsLoading(true)
        let res = await getAllBookService()
        setIsLoading(false)
        if (res && res.data && res.data.errCode === 0) {
            let options = []
            if (res.data.data && res.data.data.length > 0) {
                res.data.data.map(item => {
                    let option = {}
                    option.value = item.id
                    option.label = item.name + ' - ' + item.authorData?.name
                    options.push(option)
                })
            }
            listBooks.current = options
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }
    const getListCartToManage = async () => {
        setIsLoading(true)
        let res = await getListCartToManageService()
        setIsLoading(false)
        if (res && res.data && res.data.errCode === 0) {
            let obtions = {}
            if (res.data.data.length > 0) {
                obtions[status_cart.WAITING] = res.data.data.filter(item => item.statusId === status_cart.WAITING)
                obtions[status_cart.BORROWING] = res.data.data.filter(item => item.statusId === status_cart.BORROWING)
            }
            setListCart(obtions)
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    useEffect(() => {
        getAllBook()
        getListCartToManage()
    }, [])

    useEffect(() => {
        let options = {}
        if (!_.isEmpty(listCart)) {
            options[currentStatus] = listCart[currentStatus]?.map(item => {
                if (language === languages.EN) {
                    return {
                        value: item.id,
                        label: `Name: ${item.userCartData?.firstName} ${item.userCartData?.lastName}, book: ${item.bookCartData?.name}, Request submission time : ${item.time}`
                    }
                }
                if (language === languages.VI) {
                    return {
                        value: item.id,
                        label: `Tên: ${item.userCartData?.lastName} ${item.userCartData?.firstName}, Sách: ${item.bookCartData?.name}, Thời gian gửi yêu cầu: ${item.time}`
                    }
                }
            })
        }
        setOptionSearch(options)
    }, [language, currentStatus, listCart])

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
        socketNotify?.on('update-list-manage', () => {
            getListCartToManage()
        })
    }, [])


    useEffect(() => {
        let options = {}
        if (!_.isEmpty(listCart)) {
            for (let i = 0; i < Object.keys(status_cart).length; i++) {
                let keyStatusCart = Object.keys(status_cart)[i]
                listCart[status_cart[keyStatusCart]]?.map(item => {
                    options[item.id] = false
                })
            }
        }
        setShowDetail(options)
    }, [listCart])

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

    const handleSearchTransaction = (optionSelect) => {
        let transaction = transactionsRef.current[optionSelect.value]
        setSelectedTransaction(optionSelect)
        setCssUserSearched(transaction)
    }

    const handleSubmitLetterRefuse = async () => {
        if (!reason) {
            setErrMessage(language === languages.EN ? 'Missing' : 'Thiếu')
            return
        }
        let res = await addOneNotifycationService({
            titleId: title_notify.ADMIN,
            receiverId: dataCartRefuseSelected.current.userId,
            messageEn: reason,
            messageVi: reason,
        })
        if (res && res.data && res.data.errCode === 0) {
            setErrMessage('')
            setIsOpenModalInfor(false)
            toast.success(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            socketNotify?.emit('send-notify-to-user', { receiverId: dataCartRefuseSelected.current.userId })
            setIsLoading(true)
            // socketNotify?.emit('handled-request', { senderId: dataCartRefuseSelected.current.userId, bookName: dataCartRefuseSelected.bookCartData?.name })

            let resDelete = await deleteOneCartService(idCartSelected.current)
            setIsLoading(false)
            if (resDelete && resDelete.data && resDelete.data.errCode === 0) {
                toast.success(language === languages.EN ? resDelete.data.messageEN : resDelete.data.messageVI)
                getListCartToManage()
            } else {
                toast.error(language === languages.EN ? resDelete.data.messageEN : resDelete.data.messageVI)
            }
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    const handleCreateNewUser = () => {
        setIsOpenModalCreateBorrow(true)
    }

    const toggleModalCreateBorrow = () => {
        setIsOpenModalCreateBorrow(!isOpenModalCreateBorrow)
    }

    const toggleModalUpdateBorrow = () => {
        setIsOpenModalUpdateBorrow(!isOpenModalUpdateBorrow)
    }

    const handleUpdateTransaction = () => {
        setIsOpenModalUpdateBorrow(true)
    }

    const handleConfirmTransactionSuccess = async () => {
        if (!reaturnDateConfirm) {
            setErrMessage(language === languages.EN ? 'Missing' : 'Thiếu')
            return
        }
        if (!moment(reaturnDateConfirm.trim(), 'DD-MM-YYYY', true).isValid()) {
            setErrMessage(language === languages.EN ? 'This field should look like 03-12-2022' : "Trường này phải có dạng như 03-12-2022")
            return
        }
        setIsLoading(true)
        let res = await confirmTransactionSuccessService({
            cartId: transactionConfirm.current.id,
            bookId: transactionConfirm.current.bookId,
            userId: transactionConfirm.current.userId,
            borrowDate: transactionConfirm.current.time,
            returnDate: reaturnDateConfirm
        })
        setIsLoading(false)
        if (res && res.data && res.data.errCode === 0) {
            toast.success(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            setIsOpenModalConfirm(false)
            setErrMessage('')
            getListCartToManage()
            setReaturnDateConfirm('')
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    const handleConfirmToUserNeedBorrow = async (data) => {
        let timeNow = moment(Date.now()).format('HH:mm-DD-MM-YYYY')
        setIsLoading(true)
        let res = await confirmCartBorrowSuccessService({
            userId: data.userId,
            cartId: data.id,
            time: timeNow,
            bookId: data.bookId,
        })
        setIsLoading(false)
        if (res && res.data && res.data.errCode === 0) {
            getListCartToManage()
            socketNotify?.emit('argee-borrow-book', { receiverId: data.userId, bookName: data.bookCartData?.name })
            // socketNotify?.emit('handled-request', { senderId: data.userId, bookName: data.bookCartData?.name })
            toast.success(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    return (
        <>
            {
                isLoading && <Loading />
            }
            <div className="manage-container">
                <ModalCreateBorrow
                    isOpen={isOpenModalCreateBorrow}
                    toggle={toggleModalCreateBorrow}
                    className={'modal-user-container'}
                    listBooks={listBooks.current}
                    resetListCart={getListCartToManage}
                />
                <ModalUpdateBorrow
                    isOpen={isOpenModalUpdateBorrow}
                    toggle={toggleModalUpdateBorrow}
                    className={'modal-user-container'}
                    listBooks={listBooks.current}
                    resetListCart={getListCartToManage}
                    dataUpdate={dataUpdate.current}
                />
                <Modal title={language === languages.EN ? textEN.manage.confirm : textVI.manage.confirm} open={isOpenModalInfor} onOk={handleSubmitLetterRefuse} onCancel={() => { setErrMessage(''); setReason(''); setIsOpenModalInfor(false) }}>
                    <p><FormatedText id="manage.reason" /></p>
                    <textarea type="text" className="form-control"
                        value={reason} onChange={e => setReason(e.target.value)}
                    />
                    <p style={{ color: 'red' }}>{errMessage}</p>
                </Modal>
                <Modal title={language === languages.EN ? textEN.manage.confirm : textVI.manage.confirm} open={isOpenModalConfirm} onOk={handleConfirmTransactionSuccess} onCancel={() => { setErrMessage(''); setReaturnDateConfirm(''); setIsOpenModalConfirm(false) }}>
                    <p><FormatedText id="manage.returnDate" /></p>
                    <textarea type="text" className="form-control"
                        value={reaturnDateConfirm} onChange={e => setReaturnDateConfirm(e.target.value)}
                    />
                    <p style={{ color: 'red' }}>{errMessage}</p>
                </Modal>
                <div className="title text-center"><FormatedText id="manage.titleBorrow" /></div>
                <div className="mt-4 mx-3">
                    <div className="btn-container">
                        {
                            currentStatus === status_cart.BORROWING &&
                            <button className="btn-create" onClick={() => handleCreateNewUser()}><FormatedText id="manage.btnCreate" /></button>
                        }
                        <div className="nav-btn">
                            <button
                                className={currentStatus === status_cart.WAITING ? 'select' : ''}
                                onClick={() => setCurrentStatus(status_cart.WAITING)}
                            >
                                <FormatedText id="manage.btnWaiting" /> ({listCart[status_cart.WAITING]?.length})
                            </button>
                            <button
                                className={currentStatus === status_cart.BORROWING ? 'select' : ''}
                                onClick={() => setCurrentStatus(status_cart.BORROWING)}
                            >
                                <FormatedText id="manage.btnBorrowing" /> ({listCart[status_cart.BORROWING]?.length})
                            </button>
                        </div>

                    </div>
                    <div className="col-12 row search-container">
                        <div className="col-12 form-group search-fix-design" ref={searchRef}>
                            <label><FormatedText id="manage.search" /></label>
                            <Select
                                value={selectedTransaction}
                                className='col-4'
                                onChange={handleSearchTransaction}
                                options={optionSearch[currentStatus] ? optionSearch[currentStatus] : []}
                            />
                        </div>
                    </div>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>#</th>
                                <th><FormatedText id="table.nameBorrower" /></th>
                                {
                                    currentStatus === status_cart.WAITING &&
                                    <th><FormatedText id="table.bookInfor" /></th>
                                }
                                {
                                    currentStatus === status_cart.BORROWING &&
                                    <th><FormatedText id="table.bookBorrowing" /></th>
                                }
                                <th><FormatedText id="table.returnDate" /></th>
                                {
                                    currentStatus === status_cart.WAITING &&
                                    <th><FormatedText id="table.timeRequire" /></th>
                                }
                                <th><FormatedText id="table.action" /></th>
                            </tr>
                            {
                                listCart && listCart[currentStatus] && listCart[currentStatus].length > 0 &&
                                listCart[currentStatus].map((item, index) => {
                                    let nameEN = '', nameVI = ''
                                    nameEN = item.userCartData?.firstName + ' ' + item.userCartData?.lastName
                                    nameVI = item.userCartData?.lastName + ' ' + item.userCartData?.firstName
                                    return (
                                        <>
                                            <tr key={item.id} ref={el => transactionsRef.current[item.id] = el}>
                                                <td>{index}</td>
                                                <td>{language === languages.EN ? nameEN : nameVI}</td>
                                                <td>{item.bookCartData?.name + ' - ' + item.bookCartData?.authorData?.name}</td>
                                                <td>{item.returnDate}</td>
                                                {
                                                    currentStatus === status_cart.WAITING &&
                                                    <td>{item.time}</td>
                                                }
                                                <td>
                                                    <button onClick={() => setShowDetail({ ...showDetail, [item.id]: !showDetail[item.id] })}>
                                                        <BiDetail />
                                                    </button>
                                                    {
                                                        currentStatus === status_cart.WAITING &&
                                                        <>
                                                            <Button type="primary" danger onClick={() => { idCartSelected.current = item.id; dataCartRefuseSelected.current = item; setIsOpenModalInfor(true); }}>
                                                                <FormatedText id="table.btnRefuse" />
                                                            </Button>
                                                            <Button type="primary" plain onClick={() => handleConfirmToUserNeedBorrow(item)}>
                                                                <FormatedText id="table.btnAgree" />
                                                            </Button>
                                                        </>
                                                    }
                                                    {
                                                        currentStatus === status_cart.BORROWING &&
                                                        <>
                                                            <button
                                                                className="btn-edit"
                                                                onClick={() => { dataUpdate.current = item; handleUpdateTransaction() }}
                                                            >
                                                                <BsPencilSquare />
                                                            </button>
                                                            <Button type="primary" plain onClick={() => { transactionConfirm.current = item; setIsOpenModalConfirm(true) }}>
                                                                <FormatedText id="table.confirm" />
                                                            </Button>
                                                        </>
                                                    }
                                                </td>
                                            </tr>
                                            {
                                                showDetail[item.id] &&
                                                <tr >
                                                    <td className='extra-infor-container' colSpan={7}>
                                                        <div className="extra-infor-body">
                                                            <div className='extra-infor-image' >
                                                                {
                                                                    item.userCartData?.image ?
                                                                        <img src={`${item.userCartData?.image}`} /> :
                                                                        (
                                                                            item.userCartData?.genderId === gender.MALE ?
                                                                                <img src={linkAvatarDefault.MALE} /> :
                                                                                item.userCartData?.genderId === gender.FEMALE ?
                                                                                    <img src={linkAvatarDefault.FEMALE} /> :
                                                                                    <img src={linkAvatarDefault.OTHER} />
                                                                        )
                                                                }
                                                            </div>
                                                            <div className='extra-infor row'>
                                                                <div className='col-6 my-3'><FormatedText id='manage.email' />: {item.userCartData?.email}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.role' />: {language === languages.EN ? item.userCartData?.roleData?.valueEn : item.userCartData?.roleData?.valueVi}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.firstName' />: {item.userCartData?.firstName}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.phoneNumber' />: {item.userCartData?.phoneNumber}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.lastName' />: {item.userCartData?.lastName}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.address' />: {item.userCartData?.address}</div>
                                                                <div className='col-6 my-3'><FormatedText id='manage.gender' />: {language === languages.EN ? item.userCartData?.genderUserData?.valueVi : item.userCartData?.genderUserData?.valueEn}</div>
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
                                listCart && listCart[currentStatus] && listCart[currentStatus].length === 0 &&
                                <tr colSpan={6}>
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
