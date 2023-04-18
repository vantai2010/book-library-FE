import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { handleLogoutAccount } from '../../store/slice/authSlice'
import { languages } from '../../utils/constant'
import { changeLanguage } from '../../store/slice/appSlice'
import _ from 'lodash'
import { AiOutlineHome, AiOutlineLogout } from "react-icons/ai";
import './Header.scss'
import { useNavigate } from 'react-router'
import FormatedText from '../../components/FormatedText/FormatedText'
import Notifycation from '../Notifycation'

export default function Header() {
    const language = useSelector(state => state.app.language)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleRedirect = (location) => {
        return navigate(location)
    }

    return (
        <div className="header-system-container">

            <div className="header-tabs-container">
                <AiOutlineHome className='btn-home-icon' onClick={() => handleRedirect('/')} />
                <div className='nav-system'>
                    <div className="nav-system-link" onClick={() => handleRedirect('/system/manage-borrow')}><FormatedText id="manage.nameLinkBorrow" /></div>
                    <div className="nav-system-link" onClick={() => handleRedirect('/system/manage-user')}><FormatedText id="manage.nameLinkUser" /></div>
                    <div className="nav-system-link" onClick={() => handleRedirect('/system/manage-book')}><FormatedText id="manage.nameLinkBook" /></div>
                    <div className="nav-system-link" onClick={() => handleRedirect('/system/manage-author')}><FormatedText id="manage.nameLinkAuthor" /></div>
                    <div className="nav-system-link" onClick={() => handleRedirect('/system/manage-shelf')}><FormatedText id="manage.nameLinkShelf" /></div>
                    <div className="nav-system-link" onClick={() => handleRedirect('/system/manage-history')}><FormatedText id="manage.nameLinkHistory" /></div>
                </div>
            </div>

            <div className="languages-system">
                {/* <Notifycation /> */}
                <span className={language === languages.VI ? "language-vi active" : "language-vi"} onClick={() => dispatch(changeLanguage(languages.VI))}>VI</span>
                <span className={language === languages.EN ? "language-en active" : "language-en"} onClick={() => dispatch(changeLanguage(languages.EN))}>EN</span>

                <div className="btn btn-logout" onClick={() => dispatch(handleLogoutAccount())}>
                    <AiOutlineLogout className='btn-logout-content' title="logout" onClick={() => { dispatch(handleLogoutAccount()); handleRedirect('/'); }} />
                </div>
            </div>

        </div>
    )
}
