import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import HomeHeader from '../HomePage/HomeHeader'
import { getAllBookByCategorySerive, getLengthListBooksService } from '../../service/appService'
import HomeFooter from '../HomePage/HomeFooter'
import FormatedText from '../../components/FormatedText/FormatedText'
import { NAME_BACK_LOCATION, SCROLL_BACK_LOCATION, category_book, languages } from '../../utils/constant'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import '../HomePage/HomePage.scss'
import Pagination from './HandleListBook/Pagination'

export default function ListComicBook() {
    const language = useSelector(state => state.app.language)
    const location = useLocation()
    const params = useParams()
    const navigate = useNavigate()
    const { categoryId, limit } = params
    const [listBooks, setListBooks] = useState([])
    const [page, setPage] = useState(1)

    const handlegetListBooks = async (data) => {
        let res = await getAllBookByCategorySerive({ categoryId: data.categoryId, limit: data.limit, page: data.page })
        if (res && res.data && res.data.errCode === 0) {
            setListBooks(res.data.data)
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }



    useEffect(() => {
        if (location && location.search) {
            let searchParams = new URLSearchParams(location.search);
            let getPage = searchParams.get("page");
            setPage(getPage)
        }
    }, [location])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [listBooks])

    useEffect(async () => {
        await handlegetListBooks({ categoryId, limit, page })
        if (location && location.state && location.state.scroll_Y) {
            window.scrollTo(0, location.state.scroll_Y)
        }
    }, [categoryId, limit, page])

    const handleRedirect = (id) => {
        localStorage.setItem(SCROLL_BACK_LOCATION, window.scrollY)
        localStorage.setItem(NAME_BACK_LOCATION, `/list-books/${categoryId}/20?page=${page}`)
        navigate(`/infor-book/${id}`)
    }


    return (
        <>
            <HomeHeader />
            <div className="homepage-container">
                <div className="product-container">
                    <div className="product-content container">
                        <div className="product-content-up">
                            {
                                categoryId && categoryId === category_book.COMIC &&
                                <h2 className=""><FormatedText id="homePage.comic" /></h2>
                            }
                            {
                                categoryId && categoryId === category_book.TEXTBOOKS &&
                                <h2 className=""><FormatedText id="homePage.textBook" /></h2>
                            }
                            {
                                categoryId && categoryId === category_book.REFBOOK &&
                                <h2 className=""><FormatedText id="homePage.refBook" /></h2>
                            }
                            {
                                categoryId && categoryId === category_book.SKILLBOOK &&
                                <h2 className=""><FormatedText id="homePage.skillBook" /></h2>
                            }
                        </div>
                        <div className="product-content-down mt-5 container">
                            <div className="book-content row">
                                {
                                    listBooks && listBooks.length > 0 &&
                                    listBooks.map(item => {
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
                        </div>
                        <Pagination setPage={setPage} categoryId={categoryId} />
                    </div>
                </div>
            </div>
            <HomeFooter />
        </>
    )
}
