import axios from 'axios'
import { NAME_LOCAL_STORED } from '../utils/constant'
import setAuthToken from '../utils/setAuthToken'
import dotenv from 'dotenv'
dotenv.config()

const URL_BACK_END = process.env.REACT_APP_URL_BACK_END ? process.env.REACT_APP_URL_BACK_END : 'http://localhost:5000'

let getAllCodeByTypeService = (type) => {
    return axios.get(`${URL_BACK_END}/api/get-allcode-by-type?type=${type}`)
}

let registerUserService = (data) => {
    return axios.post(`${URL_BACK_END}/api/auth/register`, data)
}

let registerExtraInforService = (data) => {
    return axios.post(`${URL_BACK_END}/api/auth/register-extra-infor`, data)
}

let handleLoginService = (data) => {
    return axios.post(`${URL_BACK_END}/api/auth/login`, data)
}


let handleForgotPasswordService = (data) => {
    return axios.put(`${URL_BACK_END}/api/auth/forgot-password`, data)
}

let sendEmailForgotPasswordService = (data) => {
    return axios.post(`${URL_BACK_END}/api/auth/send-email-forgot-password`, data)
}

let loginFromTokenService = () => {
    return axios.get(`${URL_BACK_END}/api/auth`)
}

let handleGetUserByRoleIdService = (roleId) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.get(`${URL_BACK_END}/api/system/get-user-by-role?role=${roleId}`)
}

let handleDeleteUserService = (id) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.delete(`${URL_BACK_END}/api/system/delete-user-by-id?id=${id}`)
}

let handleUpdateUserService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.put(`${URL_BACK_END}/api/system/update-user-by-id?id=${data.id}`, data)
}

let handleAddNewUserService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.post(`${URL_BACK_END}/api/system/add-new-user`, data)
}


let handleGetAllAuthorService = () => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.get(`${URL_BACK_END}/api/system/get-all-author`)
}

let handleDeleteAuthorService = (id) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.delete(`${URL_BACK_END}/api/system/delete-author-by-id?id=${id}`)
}

let handleUpdateAuthorService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.put(`${URL_BACK_END}/api/system/update-author-by-id?id=${data.id}`, data)
}

let handleAddNewAuthorService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.post(`${URL_BACK_END}/api/system/add-new-author`, data)
}

let getAllBookService = () => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.get(`${URL_BACK_END}/api/system/get-all-book`)
}

let handleGetBookByCategoryIdService = (category) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.get(`${URL_BACK_END}/api/system/get-book-by-category?category=${category}`)
}

let handleDeleteBookService = (id) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.delete(`${URL_BACK_END}/api/system/delete-book-by-id?id=${id}`)
}

let handleUpdateBookService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.put(`${URL_BACK_END}/api/system/update-book-by-id?id=${data.id}`, data)
}

let handleAddNewBookService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.post(`${URL_BACK_END}/api/system/add-new-book`, data)
}


let handleGetAllShelfService = () => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.get(`${URL_BACK_END}/api/system/get-all-shelf`)
}

let handleDeleteShelfService = (id) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.delete(`${URL_BACK_END}/api/system/delete-shelf-by-id?id=${id}`)
}

let handleUpdateShelfService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.put(`${URL_BACK_END}/api/system/update-shelf-by-id?id=${data.id}`, data)
}

let handleAddNewShelfService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.post(`${URL_BACK_END}/api/system/add-new-shelf`, data)
}

let handleGetAllUserService = () => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])

    return axios.get(`${URL_BACK_END}/api/system/get-all-user`)
}

let getAllHistoryService = () => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.get(`${URL_BACK_END}/api/system/get-all-history`)
}

let getOutStandingBookService = () => {
    return axios.get(`${URL_BACK_END}/api/get-outstanding-book`)
}

let getAllBookByCategorySerive = ({ categoryId, limit, page }) => {
    if (limit && page) {
        return axios.get(`${URL_BACK_END}/api/get-all-book-by-category?categoryId=${categoryId}&limit=${limit}&page=${page}`)
    }
    if (limit && !page) {
        return axios.get(`${URL_BACK_END}/api/get-all-book-by-category?categoryId=${categoryId}&limit=${limit}`)
    } else {
        return axios.get(`${URL_BACK_END}/api/get-all-book-by-category?categoryId=${categoryId}`)
    }
}

let getInforBookByIdService = (id) => {
    return axios.get(`${URL_BACK_END}/api/get-infor-book-by-id?id=${id}`)
}

let getAllCartService = () => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.get(`${URL_BACK_END}/api/auth/get-all-cart`)
}

let getAllNotifycationService = () => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.get(`${URL_BACK_END}/api/auth/get-all-notifycation`)
}

let getAllCommentByRoomIdService = (roomId) => {
    return axios.get(`${URL_BACK_END}/api/get-all-message-by-roomId?roomId=${roomId}`)
}

let deleteOneCommentByIdService = (id) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.delete(`${URL_BACK_END}/api/delete-one-message-by-id?id=${id}`)
}

let postOneCommentByRoomService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.post(`${URL_BACK_END}/api/post-one-message-by-room`, data)
}

let updateCommentByRoomService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.put(`${URL_BACK_END}/api/update-one-message-by-id`, data)
}

let addNewBookToCartService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.post(`${URL_BACK_END}/api/auth/add-one-cart`, data)
}

let deleteOneCartService = (id) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.delete(`${URL_BACK_END}/api/auth/delete-one-cart?id=${id}`)
}

let borrowBookNowService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.post(`${URL_BACK_END}/api/auth/handle-borrow-now`, data)
}

let getListCartToManageService = () => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.get(`${URL_BACK_END}/api/auth/get-list-cart-to-manage`)
}

let addOneNotifycationService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.post(`${URL_BACK_END}/api/auth/add-one-notifycation`, data)
}

let deleteOneNotificationService = (id) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.delete(`${URL_BACK_END}/api/auth/delete-one-notifycation?id=${id}`)
}

let createNewTransactionService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.post(`${URL_BACK_END}/api/system/create-new-transaction`, data)
}

let updateOneTransactionService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.put(`${URL_BACK_END}/api/system/update-one-transaction`, data)
}

let confirmTransactionSuccessService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.put(`${URL_BACK_END}/api/system/confirm-one-transaction-success`, data)
}

let confirmCartBorrowSuccessService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.put(`${URL_BACK_END}/api/system/update-one-cart-borrow-success`, data)
}

let getAllHistoryByTimeService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.get(`${URL_BACK_END}/api/system/get-history-by-time?startDate=${data.startDate}&endDate=${data.endDate}`)
}

let UpdateExtraInforUserService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.put(`${URL_BACK_END}/api/auth/edit-extra-infor`, data)
}


let changePasswordService = (data) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.put(`${URL_BACK_END}/api/auth/change-pass`, data)
}


let getCartByStatusIdService = (statusId) => {
    setAuthToken(localStorage[process.env.LOCAL_STORE_TOKEN_NAME ? process.env.LOCAL_STORE_TOKEN_NAME : NAME_LOCAL_STORED])
    return axios.get(`${URL_BACK_END}/api/auth/get-all-cart-by-statusId?statusId=${statusId}`)
}

let getLengthListBooksService = (categoryId) => {
    return axios.get(`${URL_BACK_END}/api/get-length-list-book?categoryId=${categoryId}`)
}

let getInforAuthorByIdService = (id) => {
    return axios.get(`${URL_BACK_END}/api/get-infor-author-by-id?id=${id}`)
}

let getBookOfAuthorByAuthorIdService = (authorId) => {
    return axios.get(`${URL_BACK_END}/api/get-book-of-author-by-authorId?authorId=${authorId}`)
}

let getOptionSearchService = (searchContent) => {
    return axios.get(`${URL_BACK_END}/api/search-book-or-author?searchContent=${searchContent}`)
}

export {
    getOptionSearchService,
    createNewTransactionService,
    getBookOfAuthorByAuthorIdService,
    getInforAuthorByIdService,
    getCartByStatusIdService,
    getLengthListBooksService,
    changePasswordService,
    UpdateExtraInforUserService,
    getAllHistoryByTimeService,
    confirmCartBorrowSuccessService,
    confirmTransactionSuccessService,
    updateOneTransactionService,
    addOneNotifycationService,
    deleteOneNotificationService,
    getInforBookByIdService,
    getListCartToManageService,
    borrowBookNowService,
    deleteOneCartService,
    updateCommentByRoomService,
    deleteOneCommentByIdService,
    getAllCommentByRoomIdService,
    postOneCommentByRoomService,
    getAllNotifycationService,
    getAllCartService,
    getAllBookByCategorySerive,
    addNewBookToCartService,
    getOutStandingBookService,
    handleGetAllUserService,
    getAllHistoryService,
    getAllCodeByTypeService,
    handleGetAllShelfService,
    handleDeleteShelfService,
    handleAddNewShelfService,
    handleUpdateShelfService,
    registerUserService,
    handleDeleteBookService,
    registerExtraInforService,
    handleUpdateBookService,
    handleLoginService,
    handleForgotPasswordService,
    sendEmailForgotPasswordService,
    handleAddNewBookService,
    loginFromTokenService,
    handleDeleteUserService,
    handleUpdateUserService,
    handleGetUserByRoleIdService,
    handleAddNewUserService,
    handleGetAllAuthorService,
    handleDeleteAuthorService,
    handleUpdateAuthorService,
    handleAddNewAuthorService,
    handleGetBookByCategoryIdService,
    getAllBookService,
}

