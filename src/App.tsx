import {
  BrowserRouter as Router,
  useNavigate,
  useRoutes
} from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from './context/AppContext'
import api from './api'
import { errorMessages } from './constants/errorMessages'
import { SidebarContext } from './context/SidebarContext'
import { getRoutes } from './routes/Routes'
import Loading from './pages/Loading'

function App() {
  const appContext = useContext(AppContext)
  const [authStatusChecked, setAuthStatusChecked] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { isSidebarOpen } = useContext(SidebarContext)

  useEffect(() => {
    setAuthStatusChecked(true)
  }, [appContext.loggedIn])

  useEffect(() => {
    setIsLoading(appContext.isLoading)
  }, [appContext.isLoading])
  const isAuthenticated = appContext.loggedIn
  console.log(isAuthenticated)

  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      const response = await api.delete('/logout')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      appContext.setUserEmail?.('')
      appContext.setLoggedIn?.(false)
      appContext.setDisplayName?.('')
      appContext.setUserRole?.('')
      navigate('/')

      console.log(response.status)
      console.log(appContext.loggedIn)
    } catch (error: any) {
      console.error(error)
      if (error.response.status === 404) {
        navigate('/pagenotfound', { state: errorMessages.pageNotFound }) // And here
      }
      if (error.response.status === 401) {
        navigate('/')
      }
    }
  }

  const routes = useRoutes(
    getRoutes(
      isAuthenticated,
      handleLogout,
      isSidebarOpen,
      appContext.userRole,
      appContext.loggedIn
    )
  )
  if (isLoading) {
    return <Loading />
  }

  return authStatusChecked ? routes : null
}

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default AppWrapper
