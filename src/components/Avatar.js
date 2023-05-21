import React, { useState, useEffect, useLayoutEffect } from 'react'
import './Avatar.scss'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { handleLogoutAccount } from '../store/slice/authSlice'
import { NAME_LOCAL_STORED } from '../utils/constant'
import { gender, linkAvatarDefault } from '../utils/constant'
import FormatedText from '../components/FormatedText/FormatedText'
import { useNavigate } from 'react-router'
import env from "react-dotenv";
import { environment } from '../utils/constant'

export default function Avatar({ isShowObtion, dataUser }) {
    const dispatch = useDispatch()
    const userInfor = useSelector(state => state.auth.userInfor)
    const navigate = useNavigate()
    const [srcImage, setSrcImage] = useState('')


    useLayoutEffect(() => {
        if (dataUser) {
            if (dataUser.image) {
                setSrcImage(dataUser.image)
            } else if (dataUser.genderId === gender.MALE) {
                setSrcImage(linkAvatarDefault.MALE)
            } else if (dataUser.genderId === gender.FEMALE) {
                setSrcImage(linkAvatarDefault.FEMALE)

            } else if (dataUser.genderId === gender.OTHER) {
                setSrcImage(linkAvatarDefault.OTHER)
            }
        } else {
            if (userInfor.image) {
                setSrcImage(userInfor.image)
            } else if (userInfor.genderId === gender.MALE) {
                setSrcImage(linkAvatarDefault.MALE)
            } else if (userInfor.genderId === gender.FEMALE) {
                setSrcImage(linkAvatarDefault.FEMALE)
            } else if (userInfor.genderId === gender.OTHER) {
                setSrcImage(linkAvatarDefault.OTHER)
            }
        }

    }, [userInfor, dataUser])

    const handleLogout = () => {

        // localStorage.removeItem(env.LOCAL_STORE_TOKEN_NAME ? env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED)

        localStorage.removeItem(environment.LOCAL_STORE_TOKEN_NAME ? environment.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED)
        dispatch(handleLogoutAccount())
    }

    const handleRedirect = (location) => {
        navigate(location)
    }

    return (
        <>
            <div className="avatar-user-container">
                <div className="avatar-user-body">
                    <img src={srcImage} />
                </div>
                {
                    isShowObtion &&
                    <div className="obtion-user-container">
                        <ul className="obtion-user-body">
                            <li onClick={() => handleRedirect('/extra-infor-user')}><FormatedText id="header.personalInformation" /></li>
                            <li onClick={() => handleRedirect('/history-transaction')}><FormatedText id="header.history" /></li>
                            <li onClick={() => handleLogout()}><FormatedText id="header.logOut" /></li>
                        </ul>

                    </div>
                }

            </div>

        </>
    )
}
