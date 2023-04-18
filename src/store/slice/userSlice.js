import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCartService } from "../../service/appService"

export const fetchListCartsThunk = createAsyncThunk('app/fetchListCartsThunk', async () => {
    try {
        let response = await getAllCartService()
        return response.data

    } catch (error) {
        console.log(error)
    }
})



export const userSlice = createSlice({
    name: 'user',
    initialState: {
        listCarts: [],
        updateCart: false
    },
    reducers: {
    },
    extraReducers: {
        [fetchListCartsThunk.pending]: (state, action) => { },
        [fetchListCartsThunk.fulfilled]: (state, action) => {
            state.listCarts = action.payload.data
        },
        [fetchListCartsThunk.rejected]: (state, action) => {
            state.listCarts = []
        }
    }
})





export const { updateCart } = userSlice.actions
export default userSlice.reducer