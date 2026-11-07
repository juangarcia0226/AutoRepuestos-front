import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Si ya hay sesión, va al dashboard
export default function RutaPublica() {
  const { usuario } = useAuth()
  return usuario ? <Navigate to="/dashboard" replace /> : <Outlet />
}