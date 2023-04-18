import { FiShoppingCart } from "react-icons/fi";
import React, { useEffect, useRef, useState } from 'react'
import FormatedText from "../components/FormatedText/FormatedText";
import { useSelector, useDispatch } from "react-redux";
import { fetchListCartsThunk } from "../store/slice/userSlice";
import { deleteOneCartService } from "../service/appService";
import { toast } from "react-toastify";
import { languages } from "../utils/constant";
import { textEN } from "../translations/en";
import { textVI } from "../translations/vi";
import moment from "moment";
import { borrowBookNowService } from "../service/appService";
import { Modal } from 'antd';
import _ from 'lodash';
import { useNavigate } from "react-router";

export default function Cart() {
    const navigate = useNavigate()
    const listCarts = useSelector(state => state.user.listCarts)
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)
    const socketNotify = useSelector(state => state.auth.socketNotify)
    const dispatch = useDispatch()
    const [showModalBorrow, setShowModalBorrow] = useState(false)
    const [returnDate, setReturnDate] = useState('')
    const [errMessage, setErrMessage] = useState('')
    const idBookSelected = useRef()

    useEffect(() => {
        dispatch(fetchListCartsThunk())
    }, [])



    const handleDeleteCart = async (e, id) => {
        if (_.isEmpty(userInfor)) {
            return toast(language === languages.EN ? 'You must be logged in to use this function' : 'Bạn phải đăng nhập mới có thể dùng chức năng này')
        }
        e.stopPropagation()
        let res = await deleteOneCartService(id)
        if (res && res.data && res.data.errCode === 0) {
            // toast.success(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            dispatch(fetchListCartsThunk())
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    const handleSubmitBorrowBook = async () => {
        if (_.isEmpty(userInfor)) {
            return toast(language === languages.EN ? 'You must be logged in to use this function' : 'Bạn phải đăng nhập mới có thể dùng chức năng này')
        }
        if (!returnDate) {
            setErrMessage(language === languages.EN ? 'Missing' : "Còn thiếu")
            return
        }

        if (!moment(returnDate, 'DD-MM-YYYY', true).isValid()) {
            setErrMessage(language === languages.EN ? 'This field should look like 03-12-2022' : "Trường này phải có dạng như 03-12-2022")
            return
        }
        let nowTime = moment(Date.now()).format('HH:mm-DD-MM-YYYY')
        let res = await borrowBookNowService({
            bookId: idBookSelected.current,
            time: nowTime,
            returnDate: returnDate
        })
        if (res && res.data && res.data.errCode === 0) {
            toast.success(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            setShowModalBorrow(false)
            dispatch(fetchListCartsThunk())
            setReturnDate('')
            setErrMessage('')
            socketNotify?.emit('send-request-borrow', { senderId: userInfor.id })
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    const handleRedirectToBookInfor = (bookId) => {
        navigate(`/infor-book/${bookId}`)
    }

    return (
        <>
            <Modal title={language === languages.EN ? textEN.bookInfor.checkTitle : textVI.bookInfor.checkTitle}
                open={showModalBorrow}
                onOk={handleSubmitBorrowBook}
                onCancel={() => setShowModalBorrow(false)}
                width={600}
            >
                <div className="form-group">
                    <label><FormatedText id="bookInfor.enterReturnDate" /></label>
                    <input className="form-control" type="text"
                        value={returnDate}
                        onChange={e => setReturnDate(e.target.value)}
                    />
                    <p style={{ color: 'red' }}>{errMessage}</p>
                </div>
            </Modal>

            <FiShoppingCart className="right-icons" />
            {
                listCarts && listCarts.length > 0 &&
                <div className='cart-notificate'>{listCarts.length}</div>
            }
            <div className="cart-container">
                {
                    listCarts && listCarts.length > 0 &&
                    listCarts.map(item => {
                        return (
                            <div className='cart-element-container' key={item.id} onClick={() => { handleRedirectToBookInfor(item.bookId) }}>
                                <div className='cart-left-element' >
                                    <img src={item.bookCartData?.image} />
                                </div>
                                <div className='cart-right-element'>
                                    <div className='cart-infor'>
                                        <p>{item.bookCartData?.name}</p>
                                        <p>{item.bookCartData?.authorData?.name}</p>
                                    </div>
                                    <div className='btn-cart'>
                                        <button className='btn-borrow' onClick={(e) => { e.stopPropagation(); idBookSelected.current = item.bookId; setShowModalBorrow(true) }}><FormatedText id="header.borrow" /></button>
                                        <button className='btn-cancel' onClick={(e) => handleDeleteCart(e, item.id)}>x</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    listCarts && listCarts.length === 0 &&
                    <div className="box-message-cart">
                        <FormatedText id="header.cartMess" />
                    </div>
                }
            </div>
        </>
    )
}
