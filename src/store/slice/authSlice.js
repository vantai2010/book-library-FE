import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendEmailForgotPasswordService, handleLoginService, registerUserService, registerExtraInforService, handleForgotPasswordService, loginFromTokenService } from "../../service/appService"

export const sendEmailForgotPassword = createAsyncThunk('auth/sendEmailForgotPassword', async (data) => {
    try {
        let response = await sendEmailForgotPasswordService(data)
        return response.data
    } catch (error) {
        console.log(error.message)
    }
})


export const handleForotPasswordThunk = createAsyncThunk('auth/handleForotPassword', async (data) => {
    try {
        let response = await handleForgotPasswordService(data)
        return response.data
    } catch (error) {
        console.log(error.message)
    }
})

export const handleloginAccountThunk = createAsyncThunk('auth/handleLoginAccount', async (data) => {
    try {
        let response = await handleLoginService(data)
        return response.data
    } catch (error) {
        console.log(error.message)
    }
})



export const handleRegisterUserThunk = createAsyncThunk('auth/handleRegisterAccount', async (data) => {
    try {
        let response = await registerUserService(data)
        return response.data
    } catch (error) {
        console.log(error.message)
    }
})


export const handleAddExtraInforAfterRegisterThunk = createAsyncThunk('auth/handleAddExtraInforAfterRegister', async (data) => {
    try {
        let response = await registerExtraInforService(data)
        return response.data
    } catch (error) {
        console.log(error.message)
    }
})


export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        isLoading: false,
        userInfor: {},
        socketNotify: null
    },
    reducers: {
        handleLoginFromTokenSuccess: (state, action) => {
            state.isAuthenticated = true
            state.userInfor = action.payload
        },
        handleLoginFromTokenFailed: (state, action) => {
            state.isAuthenticated = false
            state.userInfor = {}
        },
        handleLogoutAccount: (state, action) => {
            state.isAuthenticated = false
            state.userInfor = {}
        },
        connectSocketNotify: (state, action) => {
            state.socketNotify = action.payload
        },
        changeInforUser: (state, action) => {
            state.userInfor = { ...state.userInfor, ...action.payload }
        }
    },
    extraReducers: {
        [sendEmailForgotPassword.pending]: (state, action) => {
            state.isLoading = true
        },
        [sendEmailForgotPassword.fulfilled]: (state, action) => {
            state.isLoading = false
        },
        [sendEmailForgotPassword.rejected]: (state, action) => {
            state.isLoading = false
        },
        [handleloginAccountThunk.pending]: (state, action) => {
            state.isLoading = true
            state.isAuthenticated = false
        },
        [handleloginAccountThunk.fulfilled]: (state, action) => {
            state.userInfor = action.payload.user
            state.isLoading = false
            state.isAuthenticated = true
        },
        [handleloginAccountThunk.rejected]: (state, action) => {
            state.userInfor = {}
            state.isLoading = false
            state.isAuthenticated = false
        },
        [handleRegisterUserThunk.pending]: (state, action) => {
            state.isLoading = true
        },
        [handleRegisterUserThunk.fulfilled]: (state, action) => {
            state.isLoading = false
        },
        [handleRegisterUserThunk.rejected]: (state, action) => {
            state.isLoading = false
        },
        [handleForotPasswordThunk.pending]: (state, action) => {
            state.isLoading = true
        },
        [handleForotPasswordThunk.fulfilled]: (state, action) => {
            state.isLoading = false
        },
        [handleForotPasswordThunk.rejected]: (state, action) => {
            state.isLoading = false
        },

    }
})




export const { handleLoginFromTokenSuccess, handleLoginFromTokenFailed, handleLogoutAccount, connectSocketNotify, changeInforUser } = authSlice.actions
export default authSlice.reducer