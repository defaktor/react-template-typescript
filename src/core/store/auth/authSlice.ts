import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authInitialState } from './authState'

const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    setCredentials: (
      state,
      { payload }: PayloadAction<{ token: string | null }>,
    ) => {
      state.credentials = payload
    },
    deleteCredentials: (state) => {
      state.credentials.token = null
    },
  },
})

export const { setCredentials, deleteCredentials } = authSlice.actions
export const { reducer: AuthReducer } = authSlice
