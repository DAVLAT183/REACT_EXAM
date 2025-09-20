import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API = "http://37.27.29.18:8001/api/to-dos"

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const { data } = await axios.get(API)
    return data.data
  },
)
export const fetchUsersById = createAsyncThunk(
  'users/fetchByIdStatus',
  async (id) => {
    const { data } = await axios.get(`${API}/${id}`)
    return data.data
  },
)
export const Delete = createAsyncThunk(
  'users/Delete',
  async (id, { dispatch }) => {
    const data = await axios.delete(`${API}?id=${id}`)
    dispatch(fetchUsers())
    return data
  },
)
export const DeleteImage = createAsyncThunk(
  'users/DeleteImage',
  async (id, { dispatch }) => {
    const data = await axios.delete(`${API}/images/${id}`)
    dispatch(fetchUsers())
    return data
  },
)
export const AddImage = createAsyncThunk(
  'users/AddImage',
  async (id,img, { dispatch }) => {
    const data = await axios.delete(`${API}/${id}/images/`,img)
    dispatch(fetchUsers())
    return data
  },
)
export const AddTodo = createAsyncThunk(
  "todos/AddTodo",
  async (obj, { dispatch }) => {
    try {
      await axios.post(API, obj, { "Content-Type": "multypart-formdata" });
      dispatch(fetchUsers());
    } catch (error) {
      console.log(error);
    }
  }
);

export const EditUser = createAsyncThunk(
  "todos/EditUser",
  async (obj, { dispatch }) => {
    try {
      await axios.put(API, obj);
      dispatch(fetchUsers());
    } catch (error) {
      console.log(error);
    }
  }
);


const initialState = {
  users: [],
  usersID: {},
  Loading: false,
  LoadingID: false,
  error: null,
  errorID: null

}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload
        state.Loading = false
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.Loading = false
        state.error = action.error.message
      })
      .addCase(fetchUsers.pending, (state, action) => {
        state.Loading = true
        state.error = null
      })

      .addCase(fetchUsersById.fulfilled, (state, action) => {
        state.usersID = action.payload
        state.LoadingID = false
        state.errorID = null
      })
      .addCase(fetchUsersById.rejected, (state, action) => {
        state.Loading = false
        state.errorID = action.error.message
      })
      .addCase(fetchUsersById.pending, (state, action) => {
        state.LoadingID = true
        state.errorID = null
      })
  },
})


export default counterSlice.reducer