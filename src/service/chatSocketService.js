import { io } from 'socket.io-client'
import { URL_BACK_END } from '../utils/constant'
import env from "react-dotenv";
import { environment } from '../utils/constant';

const connectToChatSocket = () => {
    // let url = env.REACT_APP_URL_BACK_END ? env.REACT_APP_URL_BACK_END + '/chat' : `${URL_BACK_END}/chat`
    let url = environment.REACT_APP_URL_BACK_END ? environment.REACT_APP_URL_BACK_END + '/chat' : `${URL_BACK_END}/chat`

    return io.connect(url)
}

export {
    connectToChatSocket
}