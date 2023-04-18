import "./BookInfor.scss";
import { useEffect, useState, useRef } from "react";
import { FiShoppingCart, FiStar } from "react-icons/fi";
import CommentForm from "../Comment/CommentForm";
import FormatedText from '../../components/FormatedText/FormatedText'
import HomeHeader from "../HomePage/HomeHeader"
import HomeFooter from "../HomePage/HomeFooter"
import { useParams } from "react-router";
import { getInforBookByIdService, addNewBookToCartService, borrowBookNowService } from "../../service/appService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { NAME_BACK_LOCATION, SCROLL_BACK_LOCATION, languages } from "../../utils/constant";
import _ from "lodash"
import moment from 'moment';
import { fetchListCartsThunk } from "../../store/slice/userSlice";
import { Modal } from 'antd';
import "flatpickr/dist/themes/material_green.css";
import { textEN } from "../../translations/en";
import { textVI } from "../../translations/vi";
import { connectToChatSocket } from "../../service/chatSocketService";
import { useNavigate } from "react-router";

function BookInfor() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const socketChat = useRef()
    const language = useSelector(state => state.app.language)
    const socketNotify = useSelector(state => state.auth.socketNotify)
    const userInfor = useSelector(state => state.auth.userInfor)
    const [book, setBook] = useState({})
    const [showModalBorrow, setShowModalBorrow] = useState(false)
    const [returnDate, setReturnDate] = useState('')
    const [errMessage, setErrMessage] = useState('')

    const handleGetInforBookById = async () => {
        let res = await getInforBookByIdService(params.id)
        if (res && res.data && res.data.errCode === 0) {
            setBook(res.data.data)
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        handleGetInforBookById()
    }, [params])

    useEffect(() => {
        socketChat.current = connectToChatSocket()
        return () => {
            socketChat.current?.disconnect();
        }
    }, [params])


    useEffect(() => {
        socketChat.current?.emit('join-to-room-chat', { roomId: book?.bookInforData?.roomId })

    }, [book])

    const handleAddToCart = async () => {
        if (_.isEmpty(userInfor)) {
            return toast(language === languages.EN ? 'You must be logged in to use this function' : 'Bạn phải đăng nhập mới có thể dùng chức năng này')
        }
        let timeNow = moment(Date.now()).format('HH:mm-DD-MM-YYYY')
        let res = await addNewBookToCartService({
            bookId: book.id,
            time: timeNow
        })
        if (res && res.data && res.data.errCode === 0) {
            dispatch(fetchListCartsThunk())
            toast(language === languages.EN ? res.data.messageEN : res.data.messageVI)
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

        if (!moment(returnDate.trim(), 'DD-MM-YYYY', true).isValid()) {
            setErrMessage(language === languages.EN ? 'This field should look like 03-12-2022' : "Trường này phải có dạng như 03-12-2022")
            return
        }

        let nowTime = moment(Date.now()).format('HH:mm-DD-MM-YYYY')
        let res = await borrowBookNowService({
            bookId: book.id,
            time: nowTime,
            returnDate: returnDate.trim()
        })
        if (res && res.data && res.data.errCode === 0) {
            toast.success(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            setShowModalBorrow(false)
            setReturnDate('')
            setErrMessage('')
            dispatch(fetchListCartsThunk())
            socketNotify?.emit('send-request-borrow', { senderId: userInfor.id })
            // socketNotify.current?.emit('test')
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    const handleRedirectToInforAuthor = () => {
        localStorage.setItem(SCROLL_BACK_LOCATION, window.scrollY)
        localStorage.setItem(NAME_BACK_LOCATION, `/infor-book/${params.id}`)
        navigate(`/infor-author/${book.authorId}`)
    }

    return (
        <>
            <HomeHeader />
            <Modal title={language === languages.EN ? textEN.bookInfor.checkTitle : textVI.bookInfor.checkTitle}
                open={showModalBorrow}
                onOk={handleSubmitBorrowBook}
                onCancel={() => { setShowModalBorrow(false); setReturnDate('') }}
                width={600}
            >
                <div className="form-group" id="header">
                    <label><FormatedText id="bookInfor.enterReturnDate" /></label>
                    <input className="form-control" type="text"
                        value={returnDate}
                        onChange={e => setReturnDate(e.target.value)}
                    />
                    <p style={{ color: 'red' }}>{errMessage}</p>
                </div>
            </Modal>
            <div className="book-store-details" >
                <div className="book-details-container">
                    <div className="book-details-content row ">
                        <div className="book-details-up col-12 col-md-12 col-lg-4  col-xl-4">
                            <div className="book-details-img">
                                <img src={book.image} />
                            </div>

                        </div>
                        <div className="book-details-down col-12 col-md-12 col-lg-8 col-xl-8">
                            <h1>{book.name}</h1>
                            <div className="book-extra-information ">
                                <p><FormatedText id="bookInfor.author" />: <span onClick={handleRedirectToInforAuthor}>{book.authorData?.name}</span></p>
                                <p><FormatedText id="bookInfor.state" /> {book.quantity}<FormatedText id="bookInfor.book" /></p>
                                <p><FormatedText id="bookInfor.borrowed" />: {book.borrowed} <FormatedText id="bookInfor.times" /></p>
                                <p><FormatedText id="bookInfor.shelf" />: {book.bookInforData?.shelfData?.name}</p>
                            </div>
                            <div className="book-details-button my-3">
                                <button className="col-6" onClick={handleAddToCart}>
                                    <FiShoppingCart className="shopping-icons" />
                                    <FormatedText id="bookInfor.addCart" />
                                </button>
                                <button className="mx-3  col-6" onClick={() => setShowModalBorrow(true)}><FormatedText id="bookInfor.borrowNow" /></button>
                            </div>
                        </div>
                    </div>
                    <div className="book-information-content">
                        <div>

                            <h2>{book.name}</h2>
                            <p className="col-12 col-lg-12 col-md-12">
                                {book.bookInforData?.description}
                            </p>
                        </div>

                    </div>
                    <CommentForm roomId={book.bookInforData?.roomId} socket={socketChat.current} bookId={params?.id} />
                </div>
            </div>
            <HomeFooter />
        </>
    );
}
export default BookInfor;
