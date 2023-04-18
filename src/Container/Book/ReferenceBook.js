import React, { useEffect, useState } from 'react'
import FormatedText from '../../components/FormatedText/FormatedText'
import { getAllBookByCategorySerive } from '../../service/appService'
import { NAME_BACK_LOCATION, SCROLL_BACK_LOCATION, category_book, languages } from '../../utils/constant'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router'

export default function ReferenceBook() {
    const location = useLocation()
    const navigate = useNavigate()
    const [listRefBook, setListRefBook] = useState([])
    const language = useSelector(state => state.app.language)

    const handlegetRefBook = async () => {
        let res = await getAllBookByCategorySerive({ categoryId: category_book.REFBOOK, limit: 8 })
        if (res && res.data && res.data.errCode === 0) {
            setListRefBook(res.data.data)
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    useEffect(async () => {
        await handlegetRefBook()
        if (location && location.state && location.state.scroll_Y) {
            window.scrollTo(0, location.state.scroll_Y)
        }
    }, [])

    const handleRedirect = (id) => {
        localStorage.setItem(SCROLL_BACK_LOCATION, window.scrollY)
        localStorage.setItem(NAME_BACK_LOCATION, '/home')
        navigate(`/infor-book/${id}`)
    }

    const handleRedirectToListBook = () => {
        localStorage.setItem(SCROLL_BACK_LOCATION, window.scrollY)
        localStorage.setItem(NAME_BACK_LOCATION, '/home')
        navigate(`/list-books/${category_book.REFBOOK}/20`)
    }

    return (
        <>
            {
                listRefBook && listRefBook.length > 0 &&
                <div className="product-container">
                    <div className="product-content container">
                        <div className="product-content-up">
                            <h2 className=""><FormatedText id="homePage.refBook" /></h2>
                        </div>
                        <div className="product-content-down mt-5 container">
                            <div className="book-content row">
                                {
                                    listRefBook.map(item => {
                                        return (
                                            <div className="col-md-4 col-6 col-sm-6 col-lg-3" onClick={() => handleRedirect(item.id)}>
                                                <div className="book-image">
                                                    <img src={item.image} />
                                                    <p className='book-name'>{item.name}</p>
                                                    <p><FormatedText id="bookInfor.author" />: {item.authorData?.name}</p>
                                                    <p><FormatedText id="bookInfor.borrowed" /> {item.borrowed} <FormatedText id="bookInfor.times" /></p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            <div className="my-3 see-more-book-link">
                                <span onClick={handleRedirectToListBook}><FormatedText id="header.seeMore" /></span>
                            </div>
                        </div>
                    </div>
                </div>

            }
        </>
    )
}
