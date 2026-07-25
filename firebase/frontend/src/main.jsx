import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./context/AuthContext.jsx"
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import About from "./pages/About.jsx"

const routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />  
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/about",
    element: (
      <ProtectedRoute>
        <About />
      </ProtectedRoute>
    )
  },

])

createRoot(document.getElementById('root')).render(
  <AuthProvider>         
    <RouterProvider router={routes} />
  </AuthProvider>
)