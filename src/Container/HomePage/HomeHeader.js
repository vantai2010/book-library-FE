import './HomeHeader.scss';
import { BiSearch, BiBook, BiStar } from "react-icons/bi";
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './HomeHeader.scss';
import Avatar from '../../components/Avatar';
import { NAME_BACK_LOCATION, SCROLL_BACK_LOCATION, languages, user_role } from '../../utils/constant';
import { changeLanguage } from '../../store/slice/appSlice';
import FormatedText from '../../components/FormatedText/FormatedText'
import { textEN } from '../../translations/en';
import { textVI } from '../../translations/vi';
import _ from 'lodash'
import { TfiWorld } from 'react-icons/tfi'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import Cart from '../Cart.js'
import Notifycation from '../Notifycation';
import Search from '../../components/Search';

function HomeHeader({ id }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const locationBack = useSelector(state => state.app.locationBack)
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleRedirectToLogin = () => {
        navigate('/login')
    }

    const handleRedirectToRegister = () => {
        navigate('/register')
    }

    const handleChangeLanguage = (language) => {
        dispatch(changeLanguage(language))
    }

    const handleRedirectBackToRoute = () => {
        if (localStorage[NAME_BACK_LOCATION]) {
            navigate(localStorage[NAME_BACK_LOCATION], { state: { scroll_Y: localStorage[SCROLL_BACK_LOCATION] } })
            localStorage.removeItem(NAME_BACK_LOCATION)
            localStorage.removeItem(SCROLL_BACK_LOCATION)
        } else {
            navigate('/')
        }

    }

    const handleNavigate = (location) => {

        navigate(location)
    }

    return (
        <>
            <div className="header-container">
                <div className="header-content container">
                    <div className="header-content-up row">
                        <ul className="row">
                            <li className="mx-2">
                                <a href="#!"><FormatedText id="header.bookcase" /></a>
                            </li>
                            <li className="mx-2">
                                <a href="#!"><FormatedText id="header.sellBook" /></a>
                            </li>
                            <li className="mx-2">
                                <a href="#!"><FormatedText id="header.connect" /></a>
                            </li>
                        </ul>
                        <ul className="row" style={{ alignItems: 'inherit' }}>
                            {isAuthenticated && !_.isEmpty(userInfor) && userInfor.roleId === user_role.ADMIN && <li onClick={() => handleNavigate('/system')} className="mx-2"><FormatedText id="header.admin" /></li>}
                            {
                                isAuthenticated &&
                                <>
                                    <Notifycation />
                                </>
                            }
                            <li className="mx-2"><AiOutlineQuestionCircle /><FormatedText id="header.support" /></li>
                            <li className="mx-2 homepage-language"><TfiWorld className='mx-1' /><FormatedText id="header.language" />
                                <ul className="box-select-language">
                                    <li className={language === languages.VI ? "language-vi active" : "language-vi"} onClick={() => handleChangeLanguage(languages.VI)}>VI</li>
                                    <li className={language === languages.EN ? "language-en active" : "language-en"} onClick={() => handleChangeLanguage(languages.EN)}>EN</li>
                                </ul>
                            </li>
                            {
                                isAuthenticated ? <Avatar isShowObtion={true} /> : <>

                                    <li className="mx-2" onClick={() => handleRedirectToRegister()}><FormatedText id="header.register" /></li>
                                    <li className="mx-2" onClick={() => handleRedirectToLogin()}><FormatedText id="header.login" /></li>
                                </>
                            }
                        </ul>
                    </div>
                    <div className="header-content-down row">
                        <div className="content-left col-2 " onClick={() => handleRedirectBackToRoute()} >
                            <BiBook className="left-icons" />
                        </div>

                        {/* <div className="content-center col-8">
                            <input type="text" placeholder={language === languages.EN ? textEN.header.search : textVI.header.search} />
                            <button className="">
                                <BiSearch className="button-icons" />
                            </button>
                        </div> */}
                        <Search />

                        <div className="content-right col-2">
                            <Cart />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default HomeHeader;
