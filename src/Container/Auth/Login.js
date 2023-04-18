import { useState } from "react";
import "./Login.scss";
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { languages } from "../../utils/constant";
import { handleloginAccountThunk, sendEmailForgotPassword } from "../../store/slice/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Loading from "../../components/Loading";
import { NAME_LOCAL_STORED } from "../../utils/constant";
import { textEN } from "../../translations/en";
import { textVI } from "../../translations/vi";
import FormatedText from "../../components/FormatedText/FormatedText";
import moment from 'moment'
import { IoIosEye } from 'react-icons/io'
import { IoIosEyeOff } from 'react-icons/io'

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const language = useSelector(state => state.app.language)
    const isLoading = useSelector(state => state.auth.isLoading)
    const [showPassword, setShowPassword] = useState(false)

    const handleOnchaneState = () => {
        document.getElementsByClassName("hand-dog-left")[0].style.top = "80px";
        document.getElementsByClassName("hand-dog-left")[0].style.transform =
            "rotate(200deg)";
        document.getElementsByClassName("eye-dog-left")[0].style.backgroundColor =
            "#3befe6";
        document.getElementsByClassName(
            "eye-dog-left-up"
        )[0].style.backgroundColor = "#3befe6";

        document.getElementsByClassName("hand-dog-right")[0].style.top = "80px";
        document.getElementsByClassName("hand-dog-right")[0].style.transform =
            "rotate(170deg)";
        document.getElementsByClassName("eye-dog-right")[0].style.backgroundColor =
            "#26e8ed";
        document.getElementsByClassName(
            "eye-dog-right-up"
        )[0].style.backgroundColor = "#26e8ed";
    };
    const handleOnchaneStateTk = () => {
        document.getElementsByClassName("hand-dog-left")[0].style.top = "220px";
        document.getElementsByClassName("hand-dog-left")[0].style.transform =
            "rotate(0deg)";
        document.getElementsByClassName("eye-dog-left")[0].style.backgroundColor =
            "#233746";
        document.getElementsByClassName(
            "eye-dog-left-up"
        )[0].style.backgroundColor = "#ffffff";

        document.getElementsByClassName("hand-dog-right")[0].style.top = "220px";
        document.getElementsByClassName("hand-dog-right")[0].style.transform =
            "rotate(0deg)";
        document.getElementsByClassName("eye-dog-right")[0].style.backgroundColor =
            "#233746";
        document.getElementsByClassName(
            "eye-dog-right-up"
        )[0].style.backgroundColor = "#ffffff";
    };

    const [inputForm, setInputForm] = useState({
        email: '',
        password: ''
    })

    const handleOnchaneFormInput = (event, key) => {
        setInputForm({
            ...inputForm,
            [key]: event.target.value
        })
    }

    const handleLogin = async () => {
        let response = await dispatch(handleloginAccountThunk({
            email: inputForm.email,
            password: inputForm.password
        }))
        let data = unwrapResult(response)
        let nameLocalStore = process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED
        if (data && data.errCode === 0) {
            toast.success(language === languages.EN ? data.messageEN : data.messageVI)
            localStorage.setItem(nameLocalStore, data.token)
            return navigate('/')
        } else {
            toast.error(language === languages.EN ? data.messageEN : data.messageVI)
        }
    }

    const handleForgotPassword = async () => {
        let response = await dispatch(sendEmailForgotPassword({
            email: inputForm.email,
            language: language
        }))
        let data = unwrapResult(response)
        if (data && data.errCode === 0) {
            toast.success(language === languages.EN ? data.messageEN : data.messageVI)
        } else {
            toast.error(language === languages.EN ? data.messageEN : data.messageVI)
        }
    }

    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleLogin()
        }
    }

    // console.log('check time login', moment(Date.now()).format('HH:mm-DD-MM-YYYY'));


    return (
        <>
            {
                isLoading ? <Loading /> :
                    <div className="dog-container">
                        <div className="dog-content">
                            {/* Tai */}
                            <div className="ears-dog-left"></div>
                            <div className="ears-dog-right"></div>
                            {/* Mắt */}
                            <div className="eye-dog-left">
                                <div className="eye-dog-left-up"></div>
                            </div>
                            <div className="eye-dog-right">
                                <div className="eye-dog-right-up"></div>
                            </div>
                            {/* Mũi */}
                            <div className="nose-dog">
                                <div></div>
                            </div>
                            {/* Miệng */}
                            <div className="mouth-dog">
                                <div></div>
                            </div>
                            {/* Tay */}
                            <div className="hand-dog-container">
                                <div className="hand-dog-content">
                                    <div className="hand-dog-left">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <div className="hand-dog-right">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                            <div className="dog-input-container">
                                <div className="dog-input-content">
                                    <input
                                        type="text"
                                        placeholder={language === languages.EN ? textEN.login.userName : textVI.login.userName}
                                        value={inputForm.email}
                                        onChange={(e) => { handleOnchaneStateTk(); handleOnchaneFormInput(e, 'email') }}
                                    />

                                </div>
                                <div className="dog-input-up">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={language === languages.EN ? textEN.login.password : textVI.login.password}
                                        value={inputForm.password}
                                        onChange={(e) => { handleOnchaneState(); handleOnchaneFormInput(e, 'password') }}
                                        onKeyDown={(e) => handleEnter(e)}
                                        className="enter-password"
                                    />
                                    {
                                        showPassword ?
                                            <IoIosEye className='icon-for-enter-password' onClick={() => setShowPassword(false)} /> :
                                            <IoIosEyeOff className='icon-for-enter-password' onClick={() => { setShowPassword(true) }} />
                                    }
                                </div>
                                <div className="dog-input-down">
                                    <button onClick={handleLogin}><FormatedText id="login.login" /></button>
                                </div>
                                <div className="dog-input-end">
                                    <span>
                                        <a href="#!" onClick={() => handleForgotPassword()}><FormatedText id="login.forgotPass" /></a>
                                    </span>
                                    <span>
                                        <Link to="/register"><FormatedText id="login.register" /></Link>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
}

export default Login;
