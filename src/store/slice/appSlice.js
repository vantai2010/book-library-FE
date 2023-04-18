import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCodeByTypeService } from "../../service/appService"

export const fetchListGenderThunk = createAsyncThunk('app/fetchListGenderThunk', async () => {
    try {
        let response = await getAllCodeByTypeService('GENDER')
        return response.data

    } catch (error) {
        console.log(error)
    }
})


export const fetchListRoleThunk = createAsyncThunk('app/fetchListRoleThunk', async () => {
    try {
        let response = await getAllCodeByTypeService('ROLE')
        return response.data

    } catch (error) {
        console.log(error)
    }
})

export const fetchListCategoryThunk = createAsyncThunk('app/fetchListCategoryThunk', async () => {
    try {
        let response = await getAllCodeByTypeService('CATEGORY')
        return response.data

    } catch (error) {
        console.log(error)
    }
})

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        language: 'vi',
        listUserOnline: [],
        listGenders: [],
        listRoles: [],
        listCategories: [],
    },
    reducers: {
        changeLanguage: (state, action) => {
            state.language = action.payload
        },
        changeListUserOnline: (state, action) => {
            state.listUserOnline = action.payload
        }
    },
    extraReducers: {
        [fetchListGenderThunk.pending]: (state, action) => { },
        [fetchListGenderThunk.fulfilled]: (state, action) => {
            state.listGenders = action.payload.data
        },
        [fetchListGenderThunk.rejected]: (state, action) => {
            state.listGenders = {}
        },
        [fetchListRoleThunk.pending]: (state, action) => { },
        [fetchListRoleThunk.fulfilled]: (state, action) => {
            state.listRoles = action.payload.data
        },
        [fetchListRoleThunk.rejected]: (state, action) => {
            state.listRoles = {}
        },
        [fetchListCategoryThunk.fulfilled]: (state, action) => {
            state.listCategories = action.payload.data
        },
        [fetchListCategoryThunk.rejected]: (state, action) => {
            state.listCategories = {}
        },
    }
})





export const { changeLanguage, changeListUserOnline } = appSlice.actions
export default appSlice.reducer