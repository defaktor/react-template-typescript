import { SystemInitialState } from './systemState'
import { createSlice } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist/es/constants'

export const systemSlice = createSlice({
  name: 'system',
  initialState: SystemInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state) => {
      state.rehydrated = true
    })
  },
})

export const { reducer: SystemReducer } = systemSlice
