import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { AppRedirect } from './AppRouter'

export const NotAuthRoutes = () => {
  return (
    <Routes>
      <Route
        path={'/'}
        element={
          <div>
            <React.Fragment>
              <div>AuthPageLayout</div>
              <Outlet />
            </React.Fragment>
          </div>
        }
      >
        <Route index element={<AppRedirect path={'login'} />} />
        <Route path={'login'} element={<div>LoginPage</div>} />
        <Route
          path={'password-recovery'}
          element={<div>ResetPasswordPage</div>}
        />
        <Route path={'*'} element={<AppRedirect path={'login'} />} />
      </Route>
      <Route path={'ui'} element={<div>UiPage</div>} />
    </Routes>
  )
}
