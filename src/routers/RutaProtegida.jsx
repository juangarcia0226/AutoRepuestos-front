import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Solo deja pasar si hay sesión, si no, manda al login
export default function RutaProtegida() {
  const { usuario } = useAuth()
  return usuario ? <Outlet /> : <Navigate to="/" replace />
}