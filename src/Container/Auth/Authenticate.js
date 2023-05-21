import React, { Children, useEffect } from 'react'
import setAuthToken from '../../utils/setAuthToken'
import { NAME_LOCAL_STORED } from '../../utils/constant'
import { loginFromTokenService } from '../../service/appService'
import { useDispatch, useSelector } from 'react-redux'
import { handleLoginFromTokenSuccess, handleLoginFromTokenFailed, connectSocketNotify } from '../../store/slice/authSlice'
import { connectToNotifySocket } from '../../service/notifySocketService'
import { changeListUserOnline } from '../../store/slice/appSlice'
import env from "react-dotenv";
import { environment } from '../../utils/constant'

export default function Authenticate({ children }) {
    const dispatch = useDispatch()
    const socketNotify = useSelector(state => state.auth.socketNotify)
    const loadUser = async () => {
        // let nameLocalStore = env.REACT_APP_LOCAL_STORE_TOKEN_NAME ? env.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED
        let nameLocalStore = environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED
        if (localStorage.getItem(nameLocalStore)) {
            setAuthToken(localStorage[nameLocalStore])
            dispatch(connectSocketNotify(connectToNotifySocket()))
        }
        try {
            let response = await loginFromTokenService()
            if (response && response.data && response.data.errCode === 0) {
                dispatch(handleLoginFromTokenSuccess(response.data.user))

            }
            else {
                dispatch(handleLoginFromTokenFailed())
                setAuthToken(null)
                localStorage.removeItem(nameLocalStore)
            }
        } catch (error) {
            console.log('loi authentica: ', error)
            dispatch(handleLoginFromTokenFailed())
            setAuthToken(null)
            localStorage.removeItem(nameLocalStore)
        }
    }

    useEffect(async () => {
        await loadUser()
        // return () => {
        //     socketNotify?.disconnect()
        // }
    }, [])

    useEffect(async () => {
        socketNotify?.on('get-list-user-online', ({ listUserOnline }) => {
            dispatch(changeListUserOnline(listUserOnline))
        })
        return () => {
            socketNotify?.disconnect()
        }
    }, [socketNotify])


    return (
        <>
            {children}
        </>
    )
}
