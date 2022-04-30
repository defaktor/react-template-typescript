import { combineReducers } from '@reduxjs/toolkit'
import { SystemReducer } from './system/systemSlice'
import { AuthReducer } from './auth/authSlice'
import { api } from '../api/BaseApi'

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  system: SystemReducer,
  auth: AuthReducer,
})

export type RootState = ReturnType<typeof rootReducer>
