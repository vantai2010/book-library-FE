import { io } from 'socket.io-client'
import { URL_BACK_END } from '../utils/constant'
require('dotenv').config()

const connectToChatSocket = () => {
    let url = process.env.REACT_APP_URL_BACK_END ? process.env.REACT_APP_URL_BACK_END + '/chat' : `${URL_BACK_END}/chat`
    return io.connect(url)
}

export {
    connectToChatSocket
}