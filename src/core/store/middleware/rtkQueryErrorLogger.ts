import {
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from '@reduxjs/toolkit'
import { deleteCredentials } from '../auth/authSlice'

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      if (action.payload.status === 401) {
        api.dispatch(deleteCredentials())
      }
      console.warn('We got a rejected action!')
      console.log('action => ', action)
    }

    return next(action)
  }
