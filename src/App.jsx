import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import AppRouter from './routers/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}