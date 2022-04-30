import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { AppRedirect } from './AppRouter'

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route
        path={'/'}
        element={
          <div>
            <React.Fragment>
              <div>MainPageLayout</div>
              <Outlet />
            </React.Fragment>
          </div>
        }
      >
        <Route index element={<div>Content</div>} />
        <Route path={'/logout'} element={<div>LogoutPage</div>} />
        <Route path={'*'} element={<AppRedirect path={'/'} />} />
      </Route>
      <Route path={'ui'} element={<div>UiPage</div>} />
    </Routes>
  )
}
