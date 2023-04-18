import "./Register.scss";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { registerUserService } from "../../service/appService";
import { useSelector, useDispatch } from 'react-redux'
import { toast } from "react-toastify";
import { languages } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { handleRegisterUserThunk } from "../../store/slice/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Loading from "../../components/Loading";
import FormatedText from "../../components/FormatedText/FormatedText";
import { textEN } from "../../translations/en";
import { textVI } from "../../translations/vi";
import { IoIosEye } from 'react-icons/io'
import { IoIosEyeOff } from 'react-icons/io'

function Register() {
    const isLoading = useSelector(state => state.auth.isLoading)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const language = useSelector(state => state.app.language)
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
        password: '',
        rePassword: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showRePassword, setShowRePassword] = useState(false)

    const handleOnchaneFormInput = (event, key) => {
        setInputForm({
            ...inputForm,
            [key]: event.target.value
        })
    }

    const handleRegister = async () => {
        console.log(inputForm)
        let response = await dispatch(handleRegisterUserThunk({
            ...inputForm,
            language: language,
            link: '/register/extra-infor'
        }))
        let data = unwrapResult(response)
        if (data && data.errCode === 0) {
            setInputForm({
                ...inputForm,
                email: '',
                password: '',
                rePassword: ''
            })
            toast.success(language === languages.EN ? data.messageEN : data.messageVI)
            return navigate('/')
        } else {
            toast.error(language === languages.EN ? data.messageEN : data.messageVI)
        }

    }


    const handleEnter = (event) => {
        if (event.keyCode === 13) {
            handleRegister()
        }
    }

    return (
        <>
            {
                isLoading ? <Loading /> :
                    <div className="dog-container">
                        <div className="dog-register-content">
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
                                <div className="dog-input-register-content">
                                    <input
                                        type="text"
                                        placeholder={language === languages.EN ? textEN.register.username : textVI.register.username}
                                        value={inputForm.email}
                                        onChange={(e) => { handleOnchaneStateTk(); handleOnchaneFormInput(e, 'email') }}
                                    ></input>
                                </div>
                                <div className="dog-input-register-up">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={language === languages.EN ? textEN.register.password : textVI.register.password}
                                        value={inputForm.password}
                                        onChange={(e) => { handleOnchaneState(); handleOnchaneFormInput(e, 'password') }}
                                    />
                                    {
                                        showPassword ?
                                            <IoIosEye className='icon-for-enter-password' onClick={() => setShowPassword(false)} /> :
                                            <IoIosEyeOff className='icon-for-enter-password' onClick={() => { setShowPassword(true) }} />
                                    }
                                </div>
                                <div className="dog-input-register-center">
                                    <input
                                        type={showRePassword ? 'text' : 'password'}
                                        placeholder={language === languages.EN ? textEN.register.rePassword : textVI.register.rePassword}
                                        value={inputForm.rePassword}
                                        onChange={(e) => { handleOnchaneState(); handleOnchaneFormInput(e, 'rePassword') }}
                                        onKeyDown={(e) => handleEnter(e)}
                                    />
                                    {
                                        showRePassword ?
                                            <IoIosEye className='icon-for-enter-re-password' onClick={() => setShowRePassword(false)} /> :
                                            <IoIosEyeOff className='icon-for-enter-re-password' onClick={() => { setShowRePassword(true) }} />
                                    }
                                </div>
                                <div className="dog-input-register-down">
                                    <button onClick={handleRegister}><FormatedText id="register.register" /></button>
                                </div>
                                <div className="dog-input-register-end">
                                    <span>
                                        <Link to="/login"><FormatedText id="register.login" /></Link>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
}

export default Register;
