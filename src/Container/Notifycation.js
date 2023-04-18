import { MdOutlineNotificationsNone } from 'react-icons/md'
import { ImPointRight } from 'react-icons/im'
import React, { useEffect, useRef, useState } from 'react'
import FormatedText from '../components/FormatedText/FormatedText';
import { getAllNotifycationService } from '../service/appService';
import { useSelector } from 'react-redux';
import { languages } from '../utils/constant';
import { toast } from 'react-toastify';
import { deleteOneNotificationService } from '../service/appService';
import { useNavigate } from 'react-router-dom';

export default function Notifycation() {
    const navigate = useNavigate()
    const language = useSelector(state => state.app.language)
    const socketNotify = useSelector(state => state.auth.socketNotify)
    const [listNotifycation, setListNotifycation] = useState([])
    const getAllNotifications = async () => {
        let res = await getAllNotifycationService()
        if (res && res.data && res.data.data) {
            setListNotifycation(res.data.data)
        }
    }

    useEffect(() => {
        getAllNotifications()
        socketNotify?.on('update-notification', () => {
            toast(language === languages.EN ? 'You have new notification' : "Bạn có một thông báo mới")
            getAllNotifications()
        })
    }, [])

    const handleDeleteNotifycation = async (id) => {
        let res = await deleteOneNotificationService(id)
        if (res && res.data && res.data.errCode === 0) {
            getAllNotifications()
        } else {
            toast.error(language === languages.EN ? res.data.messageEN : res.data.messageVI)
        }
    }

    const handleRedirect = (item) => {
        // console.log(navigate)
        navigate(item.location)
        handleDeleteNotifycation(item.id)
    }

    return (
        <li className='notifycation-parent'><MdOutlineNotificationsNone className='notification-icon' /><FormatedText id="header.notification" />

            {
                listNotifycation && listNotifycation.length > 0 &&
                <div className='notification-quantity'>{listNotifycation.length}</div>
            }
            <div className='box-notifycation-container'>
                {
                    listNotifycation && listNotifycation.length > 0 &&
                    listNotifycation.map(item => {
                        return (
                            <div className="box-notifycation-content" key={item.id}>
                                <div className="box-notifycation-title">
                                    <p>{language === languages.EN ? item.notifyTitleData?.valueEn : item.notifyTitleData?.valueVi}</p>
                                    {
                                        item.location && <div className='notifycation-naviagte' onClick={() => handleRedirect(item)}><ImPointRight /><FormatedText id="header.check" /></div>
                                    }
                                    <div className="btn-close-notifycation" onClick={() => handleDeleteNotifycation(item.id)}>x</div>
                                </div>
                                <div className="box-notifycation-message">
                                    {language === languages.EN ? item.messageEn : item.messageVi}
                                </div>
                            </div>
                        )
                    })
                }
                {
                    listNotifycation && listNotifycation.length === 0 &&
                    <div className='box-message-notifycation'>
                        <FormatedText id="header.notifycationMess" />
                    </div>
                }


            </div>
        </li>
    )
}
