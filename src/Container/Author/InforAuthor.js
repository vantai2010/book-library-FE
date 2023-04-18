import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import HomeHeader from '../HomePage/HomeHeader'
import HomeFooter from '../HomePage/HomeFooter'
import { getInforAuthorByIdService, getBookOfAuthorByAuthorIdService } from '../../service/appService'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { NAME_BACK_LOCATION, SCROLL_BACK_LOCATION, languages } from '../../utils/constant'
import FormatedText from '../../components/FormatedText/FormatedText'
import './InforAuthor.scss'

export default function InforAuthor() {
    const navigate = useNavigate()
    const params = useParams()
    const [inforDoctor, setInforDoctor] = useState({})
    const language = useSelector(state => state.app.language)

    const getInforAuthor = async () => {
        let infor = {}
        let resAuthor = await getInforAuthorByIdService(params?.id)
        if (resAuthor && resAuthor.data && resAuthor.data.errCode === 0) {
            infor.author = resAuthor.data.data
            let resBookOfAuthor = await getBookOfAuthorByAuthorIdService(params?.id)
            if (resBookOfAuthor && resBookOfAuthor.data && resBookOfAuthor.data.errCode === 0) {
                infor.bookOfAuthor = resBookOfAuthor.data.data
                setInforDoctor(infor)
            } else {
                toast.error(language === languages.EN ? resAuthor.data.messageEN : resAuthor.data.messageVI)
            }
        } else {
            toast.error(language === languages.EN ? resAuthor.data.messageEN : resAuthor.data.messageVI)
        }
    }

    useEffect(() => {
        getInforAuthor()
    }, [])

    const handleRedirect = (id) => {
        localStorage.setItem(SCROLL_BACK_LOCATION, window.scrollY)
        localStorage.setItem(NAME_BACK_LOCATION, `/infor-author/${params?.id}`)
        navigate(`/infor-book/${id}`)
    }

    return (
        <>
            <div className="homepage-container">
                <HomeHeader />
                <div className="infor-author container my-3">
                    <div className="row">
                        <div className="infor-author-content-left col-12 col-md-4">
                            <img src={inforDoctor.author?.image} />
                        </div>

                        <div className="infor-author-content-right col-12 col-md-8">
                            <p><FormatedText id="homePage.name" />{inforDoctor.author?.name}</p>
                            <p><FormatedText id="homePage.gender" />{language === languages.EN ? inforDoctor.author?.genderAuthorData?.valueEn : inforDoctor.author?.genderAuthorData?.valueVi}</p>
                            <p><FormatedText id="homePage.birthDay" />{inforDoctor.author?.birthDay}</p>
                            <p>{inforDoctor.author?.description}</p>
                        </div>
                    </div>
                </div>


                <div className="product-container">
                    <div className="product-content container">
                        <div className="product-content-up">
                            <h2 className=""><FormatedText id="homePage.bookOfAuthor" />{inforDoctor.author?.name}</h2>
                        </div>
                        <div className="product-content-down mt-5 container">
                            <div className="book-content row">
                                {
                                    inforDoctor && inforDoctor.bookOfAuthor && inforDoctor.bookOfAuthor.length >= 2 &&
                                    inforDoctor.bookOfAuthor.map(item => {
                                        return (
                                            <div className="col-md-4 col-6 col-sm-6 col-lg-3" onClick={() => handleRedirect(item.id)}>
                                                <div className="book-image">
                                                    <img src={item.image} />
                                                    <p className='book-name'>{item.name}</p>
                                                    <p><FormatedText id="bookInfor.borrowed" /> {item.borrowed} <FormatedText id="bookInfor.times" /></p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className="book-content list short row">
                                {
                                    inforDoctor && inforDoctor.bookOfAuthor && inforDoctor.bookOfAuthor.length === 1 &&
                                    inforDoctor.bookOfAuthor.map(item => {
                                        return (
                                            <div className="col-md-4 col-6 col-sm-6 col-lg-3" onClick={() => handleRedirect(item.id)}>
                                                <div className="book-image">
                                                    <img src={item.image} />
                                                    <p className='book-name'>{item.name}</p>
                                                    <p><FormatedText id="bookInfor.borrowed" /> {item.borrowed} <FormatedText id="bookInfor.times" /></p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            {
                                inforDoctor && inforDoctor.bookOfAuthor && inforDoctor.bookOfAuthor.length === 0 &&
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <p style={{ textAlign: 'center', color: 'blue', fontSize: '15px' }}><FormatedText id="extraInforUser.noData" /></p>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <HomeFooter />
            </div>
        </>
    )
}
