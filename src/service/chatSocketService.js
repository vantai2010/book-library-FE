import { io } from 'socket.io-client'
import { URL_BACK_END } from '../utils/constant'
import env from "react-dotenv";


const connectToChatSocket = () => {
    let url = env.REACT_APP_URL_BACK_END ? env.REACT_APP_URL_BACK_END + '/chat' : `${URL_BACK_END}/chat`
    return io.connect(url)
}

export {
    connectToChatSocket
}