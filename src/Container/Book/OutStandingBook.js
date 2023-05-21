import React, { useEffect, useState } from 'react'
import FormatedText from '../../components/FormatedText/FormatedText'
import { getOutStandingBookService } from '../../service/appService'
import { NAME_BACK_LOCATION, SCROLL_BACK_LOCATION, languages } from '../../utils/constant'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'

export default function OutStandingBook() {
    const location = useLocation()
    const navigate = useNavigate()
    const [listOutStandingBook, setListOutStandingBook] = useState([])
    const language = useSelector(state => state.app.language)

    const handlegetOutStandingBook = async () => {
        let res = await getOutStandingBookService()
        if (res && res.data && res.data.errCode === 0) {
            setListOutStandingBook(res.data.data)
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }


    useEffect(async () => {
        await handlegetOutStandingBook()
        if (location && location.state && location.state.scroll_Y) {
            window.scrollTo(0, location.state.scroll_Y)
        }
    }, [])

    const handleRedirect = (id) => {
        localStorage.setItem(SCROLL_BACK_LOCATION, window.scrollY)
        localStorage.setItem(NAME_BACK_LOCATION, '/home')
        navigate(`/infor-book/${id}`)
    }


    return (
        <>
            {
                listOutStandingBook && listOutStandingBook.length > 0 &&
                <div className="product-container">
                    <div className="product-content container">
                        <div className="product-content-up">
                            <h2 className=""><FormatedText id="homePage.outstadingBook" /></h2>
                        </div>
                        <div className="product-content-down mt-5 container">
                            <div className="book-content row">
                                {
                                    listOutStandingBook.length >= 4 &&
                                    listOutStandingBook.map(item => {
                                        return (
                                            <div className="   col-md-4 col-6 col-sm-6 col-lg-3" onClick={() => handleRedirect(item.id)}>
                                                <div className="book-image">
                                                    <img src={item.image} />
                                                    <p className='book-name'>{item.name}</p>
                                                    <p><FormatedText id="bookInfor.author" />: {item.auhtorData?.name}</p>
                                                    <p><FormatedText id="bookInfor.borrowed" />{item.borrowed} <FormatedText id="bookInfor.times" /></p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            <div className="book-content list-short row">
                                {
                                    listOutStandingBook.length < 4 &&
                                    listOutStandingBook.map(item => {
                                        return (
                                            <div className="   col-md-4 col-6 col-sm-6 col-lg-3" onClick={() => handleRedirect(item.id)}>
                                                <div className="book-image">
                                                    <img src={item.image} />
                                                    <p className='book-name'>{item.name}</p>
                                                    <p><FormatedText id="bookInfor.author" />: {item.auhtorData?.name}</p>
                                                    <p><FormatedText id="bookInfor.borrowed" />{item.borrowed} <FormatedText id="bookInfor.times" /></p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                    </div>
                </div>

            }
        </>
    )
}
