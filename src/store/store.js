import { configureStore } from '@reduxjs/toolkit'
import appSlice from './slice/appSlice'
import authSlice from './slice/authSlice'
import userSlice from './slice/userSlice'

const store = configureStore({
    reducer: {
        app: appSlice,
        auth: authSlice,
        user: userSlice
    }
})

export default store