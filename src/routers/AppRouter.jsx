import { Routes, Route, Navigate } from 'react-router-dom'
import RutaPublica from './RutaPublica'
import RutaProtegida from './RutaProtegida'
import LayoutPrivado from '../components/LayoutPrivado'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Vehiculos from '../pages/Vehiculos'
import Producto from '../pages/Producto'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<RutaPublica />}>
        <Route path="/" element={<Login />} />
      </Route>

      <Route element={<RutaProtegida />}>
        <Route element={<LayoutPrivado />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/producto/:id" element={<Producto />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}