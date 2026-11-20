import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Solo deja pasar a administradores; el resto vuelve al dashboard
export default function RutaAdmin() {
  const { esAdmin } = useAuth()
  return esAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}