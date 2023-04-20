import { io } from 'socket.io-client'
import { NAME_LOCAL_STORED, URL_BACK_END } from '../utils/constant'
require('dotenv').config()

const connectToNotifySocket = () => {
    let url = process.env.REACT_APP_URL_BACK_END ? process.env.REACT_APP_URL_BACK_END + '/notify' : `${URL_BACK_END}/notify`
    let nameLocalStore = process.env.REACT_APP_LOCAL_STORE_TOKEN_NAME ? process.env.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED
    if (localStorage.getItem(nameLocalStore)) {
        return io.connect(url, {
            auth: {
                token: localStorage[nameLocalStore]
            }
        })
    } else {
        return null
    }
}

export {
    connectToNotifySocket
}