import React, { useEffect, useState } from 'react'
import HomeHeader from '../../HomePage/HomeHeader'
import HomeFooter from '../../HomePage/HomeFooter'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { languages } from '../../../utils/constant'
import _ from 'lodash'
import { SiMinutemailer } from 'react-icons/si'
import { HiPhone } from 'react-icons/hi'
import { BsPencilFill } from 'react-icons/bs'
import { TiTick } from 'react-icons/ti'
import { AiOutlineClose } from 'react-icons/ai'
import './ExtraInforUser.scss'
import { changeInforUser } from '../../../store/slice/authSlice'
import Loading from '../../../components/Loading'
import { fetchListGenderThunk } from '../../../store/slice/appSlice'
import { UpdateExtraInforUserService, changePasswordService } from '../../../service/appService'
import { unwrapResult } from '@reduxjs/toolkit'
import { IoIosEye } from 'react-icons/io'
import { IoIosEyeOff } from 'react-icons/io'

import FormatedText from '../../../components/FormatedText/FormatedText'
import CommonUtils from '../../../utils/CommonUtils'
import { textEN } from '../../../translations/en'
import { textVI } from '../../../translations/vi'

export default function ExtraInforUser() {
    const dispatch = useDispatch()
    const language = useSelector(state => state.app.language)
    const userInfor = useSelector(state => state.auth.userInfor)
    const isLoading = useSelector(state => state.auth.isLoading)
    const listGenders = useSelector(state => state.app.listGenders)
    const [inputForm, setInputForm] = useState({
        firstName: userInfor.firstName,
        lastName: userInfor.lastName,
        address: userInfor.address,
        genderId: userInfor.genderId,
        phoneNumber: userInfor.phoneNumber,
        image: userInfor.image
    })
    const [errMessage, setErrMessage] = useState({
        firstName: '',
        lastName: '',
        address: '',
        genderId: '',
        phoneNumber: '',

    })

    const [inputPass, setInputPass] = useState({
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
    })

    const [errMessPassword, setErrMessPassword] = useState({
        oldPassword: '',
        newPassword: '',
        reNewPassword: '',
        message: ''

    })

    const [showPassword, setShowPassword] = useState({
        oldPassword: '',
        newPassword: '',
        reNewPassword: '',
    })

    const [showEdit, setShowEdit] = useState(false)
    const navigate = useNavigate()
    useEffect(async () => {
        if (_.isEmpty(userInfor)) {
            navigate('/')
            toast(language === languages.EN ? 'You must log in to continue' : 'Bạn phải đăng nhập để tiếp tục')
        }
        let response = await dispatch(fetchListGenderThunk())
        let data = unwrapResult(response)
        if (data && data.errCode !== 0) {
            toast.error(language === languages.EN ? data.messageEN : data.messageVI)
        }
    }, [])

    const handleOnchangeInputForm = async (event, key) => {
        if (key === 'image') {
            let data = event.target.files
            let file = data[0]
            if (file) {
                let base64 = await CommonUtils.getBase64(file)
                // let objectUrl = URL.createObjectURL(file)
                setInputForm({ ...inputForm, image: base64 })
                // setPreviewImgUrl(objectUrl)

            }
        } else {
            setInputForm({
                ...inputForm,
                [key]: event.target.value
            })
        }
    }

    const handleSubmitChange = async () => {
        let { firstName, lastName, phoneNumber, address, genderId } = inputForm

        if (!firstName) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                firstName: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!lastName) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                lastName: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!address) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                address: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!genderId) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                genderId: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!phoneNumber) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                phoneNumber: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!isNaN(firstName)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                firstName: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số"
            })
            return
        }
        if (!isNaN(lastName)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                lastName: language === languages.EN ? 'This field must not be a number' : "Trường này phải không thể là số"
            })
            return
        }
        if (isNaN(phoneNumber)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                phoneNumber: language === languages.EN ? 'This field must be number' : "Trường này phải là số"
            })
            return
        }
        if (/^\d+\.\d+$/.test(phoneNumber)) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                phoneNumber: language === languages.EN ? 'This field must be Integer' : "Trường này phải là số nguyên"
            })
            return
        }
        if (phoneNumber.length < 10 || phoneNumber.length > 10) {
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                phoneNumber: '',
                genderId: '',
                phoneNumber: language === languages.EN ? '10 digit phone number' : "Số điện thoại có 10 số"
            })
            return
        }

        let res = await UpdateExtraInforUserService({
            firstName: inputForm.firstName,
            lastName: inputForm.lastName,
            address: inputForm.address,
            phoneNumber: inputForm.phoneNumber,
            genderId: inputForm.genderId,
            image: inputForm.image
        })
        if (res && res.data && res.data.errCode === 0) {
            toast.success(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            dispatch(changeInforUser({
                firstName: inputForm.firstName,
                lastName: inputForm.lastName,
                address: inputForm.address,
                phoneNumber: inputForm.phoneNumber,
                genderId: inputForm.genderId,
                image: inputForm.image
            }))
            setErrMessage({
                firstName: '',
                lastName: '',
                address: '',
                genderId: '',
                phoneNumber: ''
            })
            setShowEdit(false)
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }

    }
    const handleResetImage = () => {
        setInputForm({
            ...inputForm,
            image: userInfor.image
        })
    }

    const handleChangePassword = async () => {
        let { oldPassword, newPassword, reNewPassword } = inputPass
        if (!oldPassword) {
            setErrMessPassword({
                oldPassword: '',
                newPassword: '',
                reNewPassword: '',
                oldPassword: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!newPassword) {
            setErrMessPassword({
                oldPassword: '',
                newPassword: '',
                reNewPassword: '',
                newPassword: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (!reNewPassword) {
            setErrMessPassword({
                oldPassword: '',
                newPassword: '',
                reNewPassword: '',
                reNewPassword: language === languages.EN ? 'Missing' : 'Còn thiếu'
            })
            return
        }
        if (newPassword !== reNewPassword) {
            setErrMessPassword({
                oldPassword: '',
                newPassword: '',
                reNewPassword: '',
                reNewPassword: language === languages.EN ? 'Re enter password is correct' : 'Mật khẩu nhập lại không đúng'
            })
            return
        }
        let res = await changePasswordService({
            oldPassword: oldPassword,
            newPassword: newPassword
        })
        if (res && res.data && res.data.errCode === 0) {
            toast.success(language === languages.EN ? res.data.messageEN : res.data.messageVI)
            setErrMessPassword({
                oldPassword: '',
                newPassword: '',
                reNewPassword: '',
                message: ''
            })
            setInputPass({
                oldPassword: '',
                newPassword: '',
                reNewPassword: ''
            })
        } else {
            setErrMessPassword({
                oldPassword: '',
                newPassword: '',
                reNewPassword: '',
                message: '',
                message: language === languages.EN ? res.data.messageEN : res.data.messageVI
            })
        }

    }

    return (
        <>
            <HomeHeader />
            {
                isLoading && <Loading />
            }
            {
                !_.isEmpty(userInfor) &&
                <div className="extra-infor-user-container">
                    <div className="container">
                        <div className="row ">
                            <div className="extra-infor-body col-12">
                                <div className="extra-infor-body-left col-12 col-md-7 col-lg-5">
                                    <span><FormatedText id="extraInforUser.card" /></span>
                                    <div className="container-image" >
                                        <img src={inputForm.image} />
                                    </div>
                                    <div className="form-infor-contact row">
                                        <div className="container-icon-infor">
                                            <SiMinutemailer />
                                        </div>
                                        <span><FormatedText id="extraInforUser.email" />{userInfor.email}</span>
                                    </div>
                                    <div className="form-infor-contact">
                                        <div className="container-icon-infor">
                                            <HiPhone />
                                        </div>
                                        {
                                            showEdit ?
                                                <>
                                                    <span><FormatedText id="extraInforUser.phoneNumber" /></span>
                                                    <input
                                                        type="text"
                                                        className="form-control col-6"
                                                        value={inputForm.phoneNumber}
                                                        onChange={e => handleOnchangeInputForm(e, 'phoneNumber')}
                                                    />

                                                </> :
                                                <span><FormatedText id="extraInforUser.phoneNumber" />{inputForm.phoneNumber}</span>
                                        }
                                    </div>
                                    <p style={{ color: 'red', fontSize: '15px' }}>{errMessage.phoneNumber}</p>
                                </div>
                                <div className="extra-infor-body-center col-12 col-md-5 col-lg-3">
                                    {
                                        showEdit &&
                                        <div className="form-choose-image">
                                            <input type="file" hidden id="file-image" onChange={e => handleOnchangeInputForm(e, 'image')} />
                                            <label className="btn-choose-image" htmlFor="file-image"><span><FormatedText id="extraInforUser.chooseImage" /></span></label>
                                            {
                                                inputForm.image !== userInfor.image &&
                                                <div className='btn-reset-image' onClick={handleResetImage}><span><FormatedText id="extraInforUser.resetImage" /></span></div>
                                            }
                                        </div>
                                    }
                                    <div >
                                        <label><FormatedText id="extraInforUser.firstName" /></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={inputForm.firstName}
                                            onChange={e => handleOnchangeInputForm(e, 'firstName')}
                                            disabled={showEdit ? false : true}
                                        />
                                        <p style={{ color: 'red', fontSize: '15px' }}>{errMessage.firstName}</p>
                                    </div>
                                    <div >
                                        <label><FormatedText id="extraInforUser.lastName" /></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={inputForm.lastName}
                                            onChange={e => handleOnchangeInputForm(e, 'lastName')}
                                            disabled={showEdit ? false : true}
                                        />
                                        <p style={{ color: 'red', fontSize: '15px' }}>{errMessage.lastName}</p>
                                    </div>
                                    <div >
                                        <label><FormatedText id="extraInforUser.address" /></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={inputForm.address}
                                            onChange={e => handleOnchangeInputForm(e, 'address')}
                                            disabled={showEdit ? false : true}
                                        />
                                        <p style={{ color: 'red', fontSize: '15px' }}>{errMessage.address}</p>
                                    </div>
                                    <div >
                                        <label><FormatedText id="extraInforUser.gender" /></label>
                                        <select value={inputForm.genderId} onChange={e => handleOnchangeInputForm(e, 'genderId')} className="form-control col-12" disabled={showEdit ? false : true}>
                                            <option></option>
                                            {
                                                listGenders && listGenders.length > 0 &&
                                                listGenders.map(item => {
                                                    return (
                                                        <option value={item.keyMap} key={item.id}>{language === languages.EN ? item.valueEn : item.valueVi}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <p style={{ color: 'red', fontSize: '15px' }}>{errMessage.genderId}</p>
                                        {/* <input
                                            type="text"
                                            className="form-control"
                                            value={inputForm.gender}
                                            onChange={e => handleOnchangeInputForm(e, 'firstName')}
                                            disabled={showEdit ? false : true}
                                        /> */}
                                    </div>
                                    {
                                        showEdit ?
                                            <div className="btn-check-edit-infor">
                                                <TiTick className="btn-check-success" onClick={handleSubmitChange} />
                                                <AiOutlineClose className="btn-check-cancel" onClick={() => setShowEdit(false)} />
                                            </div>
                                            :
                                            <div className='btn-edit-infor' onClick={() => setShowEdit(true)}>
                                                <BsPencilFill />
                                            </div>
                                    }
                                </div>
                                <div className="extra-infor-body-right col-12 col-md-12 col col-lg-4" >
                                    <span><FormatedText id="extraInforUser.changePassTitle" /></span>
                                    <div className=" enter-old-password">
                                        <input
                                            type={showPassword.oldPassword ? 'text' : 'password'}
                                            className="form-control"
                                            placeholder={language === languages.EN ? textEN.extraInforUser.enterOldPass : textVI.extraInforUser.enterOldPass}
                                            value={inputPass.oldPassword}
                                            onChange={(e) => setInputPass({ ...inputPass, oldPassword: e.target.value })}
                                        />
                                        {
                                            showPassword.oldPassword ?
                                                <IoIosEye className='icon-for-enter-old-password' onClick={() => setShowPassword({ ...showPassword, oldPassword: !showPassword.oldPassword })} /> :
                                                <IoIosEyeOff className='icon-for-enter-old-password' onClick={() => setShowPassword({ ...showPassword, oldPassword: !showPassword.oldPassword })} />
                                        }
                                    </div>
                                    <p style={{ color: 'red', fontSize: '15px' }}>{errMessPassword.oldPassword}</p>



                                    <div className=" enter-new-password">
                                        <input
                                            type={showPassword.newPassword ? 'text' : 'password'}
                                            className="form-control"
                                            placeholder={language === languages.EN ? textEN.extraInforUser.enterNewPass : textVI.extraInforUser.enterNewPass}
                                            value={inputPass.newPassword}
                                            onChange={(e) => setInputPass({ ...inputPass, newPassword: e.target.value })}
                                        />
                                        {
                                            showPassword.newPassword ?
                                                <IoIosEye className='icon-for-enter-new-password' onClick={() => setShowPassword({ ...showPassword, newPassword: !showPassword.newPassword })} /> :
                                                <IoIosEyeOff className='icon-for-enter-new-password' onClick={() => setShowPassword({ ...showPassword, newPassword: !showPassword.newPassword })} />
                                        }
                                    </div>
                                    <p style={{ color: 'red', fontSize: '15px' }}>{errMessPassword.newPassword}</p>

                                    <div className=" re-enter-new-password">
                                        <input
                                            type={showPassword.reNewPassword ? 'text' : 'password'}
                                            className="form-control"
                                            placeholder={language === languages.EN ? textEN.extraInforUser.reEnterNewPass : textVI.extraInforUser.reEnterNewPass}
                                            value={inputPass.reNewPassword}
                                            onChange={(e) => setInputPass({ ...inputPass, reNewPassword: e.target.value })}
                                        />
                                        {
                                            showPassword.reNewPassword ?
                                                <IoIosEye className='icon-for-re-enter-new-password' onClick={() => setShowPassword({ ...showPassword, reNewPassword: !showPassword.reNewPassword })} /> :
                                                <IoIosEyeOff className='icon-for-re-enter-new-password' onClick={() => setShowPassword({ ...showPassword, reNewPassword: !showPassword.reNewPassword })} />
                                        }
                                    </div>
                                    <p style={{ color: 'red', fontSize: '15px' }}>{errMessPassword.reNewPassword}</p>

                                    <p style={{ color: 'red', fontSize: '15px' }}>{errMessPassword.message}</p>
                                    <button onClick={handleChangePassword} ><FormatedText id="extraInforUser.changePass" /></button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            }
            <HomeFooter />
        </>
    )
}
