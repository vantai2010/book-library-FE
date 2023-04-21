import React, { useEffect, useState } from 'react';
import './EnterInforUser.scss';
import HomeFooter from '../HomePage/HomeFooter'
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux'
import { languages } from '../../utils/constant';
import { changeLanguage, fetchListGenderThunk } from '../../store/slice/appSlice';
import _ from 'lodash';
import CommonUtils from '../../utils/CommonUtils';
import { registerExtraInforService } from '../../service/appService';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { handleAddExtraInforAfterRegisterThunk } from '../../store/slice/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import Loading from '../../components/Loading';
import FormatedText from '../../components/FormatedText/FormatedText';

function EnterInforUser() {
    const params = useParams()
    const location = useLocation()
    const question = new URLSearchParams(location.search)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const listGenders = useSelector(state => state.app.listGenders)
    const isLoading = useSelector(state => state.auth.isLoading)
    const language = useSelector(state => state.app.language)
    const [inputInforUser, setInputInforUser] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
    })
    const [errMessage, setErrMessage] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        genderId: ''
    })

    const [selectedOption, setSelectedOption] = useState(null)
    const [obtionSelect, setObtionSelect] = useState({})
    const [previewImgUrl, setPreviewImgUrl] = useState(null)
    const [imageBase64, setImageBase64] = useState(null)

    useEffect(() => {
        if (!_.isEmpty(listGenders)) {
            let handleListGender = {}
            handleListGender = listGenders.map(item => {
                if (language === languages.EN) {
                    return {
                        value: item.keyMap,
                        label: item.valueEn
                    }
                } else {
                    return {
                        value: item.keyMap,
                        label: item.valueVi
                    }
                }
            })
            setObtionSelect(handleListGender)
        }

    }, [listGenders])



    useEffect(() => {
        const getDispatch = async () => {
            await dispatch(fetchListGenderThunk())
        }
        getDispatch()
        dispatch(changeLanguage(question.get('language')))
    }, [])

    console.log(obtionSelect)


    const handleChangeSelect = (selectedOption) => {
        setSelectedOption(selectedOption)
    };

    const handleOnchangeInputInfor = (event, key) => {
        setInputInforUser({
            ...inputInforUser,
            [key]: event.target.value
        })
    }


    const handleOnchangeImage = async (e) => {
        let data = e.target.files
        let file = data[0]

        if (file) {
            let getImageBase64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file)
            setPreviewImgUrl(objectUrl)
            setImageBase64(getImageBase64)
        }

    }

    const handleClickSubmit = async () => {
        let { firstName, lastName, address, phoneNumber } = inputInforUser
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
        if (!selectedOption.value) {
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

        let response = await dispatch(handleAddExtraInforAfterRegisterThunk({
            email: question.get('email'),
            firstName: inputInforUser.firstName,
            lastName: inputInforUser.lastName,
            address: inputInforUser.address,
            phoneNumber: inputInforUser.phoneNumber,
            genderId: selectedOption.value,
            image: imageBase64 ? imageBase64 : null
        }))
        let data = unwrapResult(response)
        if (data && data.errCode === 0) {
            toast.success(language === languages.EN ? data.messageEN : data.messageVI)
            return navigate('/login')
        } else {
            toast.success(language === languages.EN ? data.messageEN : data.messageVI)
        }
    }

    return (
        <>
            {
                isLoading ? <Loading /> :
                    <div>
                        <div className="title-form-enter-infor-container">
                            <div className="title text-form-enter-infor"><FormatedText id="register.tilteEnter" /></div>
                        </div>
                        <div className="body-form-enter-infor">
                            <div className="container">
                                <div className='row'>
                                    <div className='form-group col-6 '>
                                        <label className='text-form-enter-infor'><FormatedText id="register.firstName" /></label>
                                        <input type="text" className="form-control"
                                            value={inputInforUser.firstName}
                                            onChange={(e) => handleOnchangeInputInfor(e, 'firstName')}
                                        />
                                        <p style={{ color: 'red', fontSize: '13px' }}>{errMessage.firstName}</p>
                                    </div>
                                    <div className='form-group col-6'>
                                        <label className='text-form-enter-infor'><FormatedText id="register.lastName" /></label>
                                        <input type="text" className="form-control"
                                            value={inputInforUser.lastName}
                                            onChange={(e) => handleOnchangeInputInfor(e, 'lastName')}
                                        />
                                        <p style={{ color: 'red', fontSize: '13px' }}>{errMessage.lastName}</p>
                                    </div>
                                    <div className='form-group col-6'>
                                        <label className='text-form-enter-infor'><FormatedText id="register.address" /></label>
                                        <input type="text" className="form-control"
                                            value={inputInforUser.address}
                                            onChange={(e) => handleOnchangeInputInfor(e, 'address')}
                                        />
                                        <p style={{ color: 'red', fontSize: '13px' }}>{errMessage.address}</p>
                                    </div>
                                    <div className='form-group col-6'>
                                        <label className='text-form-enter-infor'><FormatedText id="register.phoneNumber" /></label>
                                        <input type="text" className="form-control"
                                            value={inputInforUser.phoneNumber}
                                            onChange={(e) => handleOnchangeInputInfor(e, 'phoneNumber')}
                                        />
                                        <p style={{ color: 'red', fontSize: '13px' }}>{errMessage.phoneNumber}</p>
                                    </div>
                                    <div className='form-group col-6'>
                                        <label className='text-form-enter-infor'><FormatedText id="register.gender" /></label>
                                        <Select
                                            value={selectedOption}
                                            onChange={handleChangeSelect}
                                            options={obtionSelect}
                                        />
                                        <p style={{ color: 'red', fontSize: '13px' }}>{errMessage.genderId}</p>
                                    </div>
                                    <div className='col-6 form-group'>
                                        <label className='text-form-enter-infor'><FormatedText id="register.image" /></label>
                                        <div className="preview-img-container">
                                            <input id="choise-image" className="form-control" type="file" hidden
                                                onChange={(e) => handleOnchangeImage(e)}
                                            />
                                            <label htmlFor="choise-image" className="btn-choise-image"><FormatedText id="register.chooseImage" /></label>
                                            <div>
                                                <img className="preview-image" src={`${previewImgUrl}`} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='col-12 btn-confirm-form-enter-infor-container'>
                                        <button className='btn btn-success' onClick={() => handleClickSubmit()}><FormatedText id="register.confirm" /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <HomeFooter />
                    </div>
            }
        </>

    );
}

export default EnterInforUser;
