import { io } from 'socket.io-client'
import { NAME_LOCAL_STORED, URL_BACK_END } from '../utils/constant'
import env from "react-dotenv";
import { environment } from '../utils/constant';

const connectToNotifySocket = () => {
    // let url = env.REACT_APP_URL_BACK_END ? env.REACT_APP_URL_BACK_END + '/notify' : `${URL_BACK_END}/notify`
    // let nameLocalStore = env.REACT_APP_LOCAL_STORE_TOKEN_NAME ? env.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED

    let url = environment.REACT_APP_URL_BACK_END ? environment.REACT_APP_URL_BACK_END + '/notify' : `${URL_BACK_END}/notify`
    let nameLocalStore = environment.REACT_APP_LOCAL_STORE_TOKEN_NAME ? environment.REACT_APP_LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED

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