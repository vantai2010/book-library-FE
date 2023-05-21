import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import React, { useEffect, useState } from 'react'
import { languages } from '../../../utils/constant';
import { toast } from 'react-toastify';
import FormatedText from '../../../components/FormatedText/FormatedText';
import Select from 'react-select';
import './Modal.scss';
import { getAllBookService } from '../../../service/appService';
import { textEN } from '../../../translations/en';
import { textVI } from '../../../translations/vi';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { updateOneTransactionService } from '../../../service/appService';
import Loading from "../../../components/Loading"

export default function ModalCreateBorrow({ isOpen, toggle, className, listBooks, resetListCart, dataUpdate }) {
    let bookSelected = {
        value: dataUpdate?.bookId,
        label: dataUpdate?.bookCartData.name + " - " + dataUpdate?.bookCartData?.authorData?.name
    }
    const language = useSelector(state => state.app.language)
    const [inputForm, setInputForm] = useState({
        firstName: dataUpdate?.userCartData?.firstName,
        lastName: dataUpdate?.userCartData?.lastName,
        address: dataUpdate?.userCartData?.address,
        phoneNumber: dataUpdate?.userCartData?.phoneNumber,
        returnDate: dataUpdate?.returnDate
    })

    const [isLoading, setIsLoading] = useState(false)

    const handleOnchange = (key, event) => {
        setInputForm({
            ...inputForm,
            [key]: event.target.value
        })
    }

    const [errMessage, setErrMessage] = useState({
        firstName: '',
        lastName: '',
        address: "",
        phoneNumber: "",
        returnDate: ""
    })
    const [selectedBook, setSelectedBook] = useState(bookSelected)
    const [optionBook, setOptionBook] = useState([])

    useEffect(() => {
        if (listBooks && listBooks.length > 0) {
            setOptionBook(listBooks)
        }
    }, [listBooks])

    useEffect(() => {
        setErrMessage({
            firstName: '',
            lastName: '',
            address: "",
            phoneNumber: "",
            returnDate: ""
        })
        setInputForm({
            firstName: dataUpdate?.userCartData?.firstName,
            lastName: dataUpdate?.userCartData?.lastName,
            address: dataUpdate?.userCartData?.address,
            phoneNumber: dataUpdate?.userCartData?.phoneNumber,
            returnDate: dataUpdate?.returnDate
        })
        setSelectedBook(bookSelected)
    }, [dataUpdate])

    const handleClose = () => {
        setErrMessage({
            firstName: '',
            lastName: '',
            address: "",
            phoneNumber: "",
            returnDate: ""
        })
        setInputForm({
            firstName: dataUpdate?.userCartData?.firstName,
            lastName: dataUpdate?.userCartData?.lastName,
            address: dataUpdate?.userCartData?.address,
            phoneNumber: dataUpdate?.userCartData?.phoneNumber,
            returnDate: dataUpdate?.returnDate
        })
        setSelectedBook(bookSelected)
        toggle()
    }

    const handleChangeBook = (optionSelect) => {
        setSelectedBook(optionSelect)
    }

    const handleUpdateTransaction = async () => {
        let { firstName, lastName, phoneNumber, address, returnDate } = inputForm
        if (!selectedBook.value) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                selectedBook: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!firstName) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                firstName: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!lastName) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                lastName: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!phoneNumber) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                phoneNumber: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!address) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                address: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!returnDate) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                returnDate: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!isNaN(firstName)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                firstName: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số"
            })
            return
        }
        if (!isNaN(lastName)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                lastName: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số"
            })
            return
        }
        if (isNaN(phoneNumber)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                phoneNumber: language === languages.EN ? 'This field must be number' : "Trường này phải là số"
            })
            return
        }
        if (/^\d+\.\d+$/.test(phoneNumber)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                phoneNumber: language === languages.EN ? 'This field must be Integer' : "Trường này phải là số nguyên"
            })
            return
        }
        if (phoneNumber.length < 10 || phoneNumber.length > 10) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                phoneNumber: language === languages.EN ? '10 digit phone number' : "Số điện thoại có 10 số"
            })
            return
        }
        if (!moment(returnDate.trim(), 'DD-MM-YYYY', true).isValid()) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: "",
                phoneNumber: "",
                returnDate: "",
                selectedBook: "",
                returnDate: language === languages.EN ? 'This field should look like 03-12-2022' : "Trường này phải có dạng như 03-12-2022"
            })
            return
        }
        setIsLoading(true)
        let res = await updateOneTransactionService({
            userId: dataUpdate?.userId,
            firstName: firstName,
            lastName: lastName,
            address: address,
            phoneNumber: phoneNumber,
            returnDate: returnDate.trim(),
            cartId: dataUpdate?.id
        })
        setIsLoading(false)
        if (res && res.data && res.data.errCode === 0) {
            toast.success(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            handleClose()
            resetListCart()
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    return (
        <>
        {
            isLoading && <Loading />
        }
        <Modal
            isOpen={isOpen}
            toggle={handleClose}
            className={className}
            size={'lg'}
        >
            <ModalHeader toggle={handleClose}><FormatedText id="modal.titleBorrow" /></ModalHeader>
            <ModalBody>

                <div className="container">
                    <div className="row">
                        <div className="col-6">
                            <label><FormatedText id="manage.borrowBook" /></label>
                            <Select
                                value={selectedBook}
                                onChange={handleChangeBook}
                                options={optionBook}
                                isDisabled={true}
                            />
                            <p style={{ color: 'red' }}>{errMessage.selectedBook}</p>
                        </div>
                        <div className="col-6">
                            <label><FormatedText id="manage.firstName" /></label>
                            <input value={inputForm.firstName} onChange={(e) => handleOnchange('firstName', e)} className="form-control" type="text" />
                            <p style={{ color: 'red' }}>{errMessage.firstName}</p>
                        </div>
                        <div className="col-6">
                            <label><FormatedText id="manage.lastName" /></label>
                            <input value={inputForm.lastName} onChange={(e) => handleOnchange('lastName', e)} className="form-control" type="text" />
                            <p style={{ color: 'red' }}>{errMessage.lastName}</p>
                        </div>
                        <div className="col-6">
                            <label><FormatedText id="manage.address" /></label>
                            <input value={inputForm.address} onChange={(e) => handleOnchange('address', e)} className="form-control" type="text" />
                            <p style={{ color: 'red' }}>{errMessage.address}</p>
                        </div>
                        <div className="col-6">
                            <label><FormatedText id="manage.phoneNumber" /></label>
                            <input value={inputForm.phoneNumber} onChange={(e) => handleOnchange('phoneNumber', e)} className="form-control" type="text" />
                            <p style={{ color: 'red' }}>{errMessage.phoneNumber}</p>
                        </div>
                        <div className="col-6">
                            <label><FormatedText id="manage.returnDate" /></label>
                            <input value={inputForm.returnDate} onChange={(e) => handleOnchange('returnDate', e)} className="form-control" type="text" />
                            <p style={{ color: 'red' }}>{errMessage.returnDate}</p>
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button className='btn-close' onClick={handleClose}><FormatedText id="modal.close" /></Button>
                <Button color="primary" className='btn-create' onClick={handleUpdateTransaction}><FormatedText id="modal.update" /></Button>
            </ModalFooter>
        </Modal>
        </>
    )
}
