import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '../store/rootReducer'
import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import {
  FetchArgs,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query/fetchBaseQuery'

export interface ICustomErrorDto {
  data: { status_code: number; status_text: string }
  status: number
}

export const api = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `https://${process.env.REACT_APP_DOMAIN}/api/`,
    prepareHeaders: (headers, { getState }) => {
      headers.set('Content-Type', 'application/json')
      const token = (getState() as RootState).auth.credentials.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }) as BaseQueryFn<
    string | FetchArgs,
    unknown,
    ICustomErrorDto,
    {},
    FetchBaseQueryMeta
  >,
  tagTypes: ['User'],
  endpoints: (builder) => ({}),
})

export const {} = api
