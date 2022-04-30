import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/store'
import { NotAuthRoutes } from './NotAuthRoutes'
import { AuthRoutes } from './AuthRoutes'

interface IRedirect {
  path?: string
}

export const AppRedirect = ({ path = '/' }: IRedirect) => {
  const location = useLocation()
  return <Navigate to={path} state={{ from: location }} replace />
}

const RequireAuth = ({
  children,
  routesWithAuth,
}: {
  children: JSX.Element
  routesWithAuth: JSX.Element
}) => {
  const isAuthenticated = useAppSelector(
    (state) => state.auth.credentials.token,
  )
  const rehydrated = useAppSelector((state) => state.system.rehydrated)

  if (!rehydrated) {
    return null
  }

  if (!isAuthenticated) {
    return children
  }

  return routesWithAuth
}

export const AppRouter = () => {
  return (
    <RequireAuth routesWithAuth={<AuthRoutes />}>
      <NotAuthRoutes />
    </RequireAuth>
  )
}
