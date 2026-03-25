import { useState, useEffect } from 'react'
import Navbar from './components/shared/Navbar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'   // ✅ fix casing
import Signup from './components/auth/Signup' // ✅ fix casing
import Home from './components/Home'
import CompareLoans from './components/CompareLoans'
import LearnFinance from './components/LearnFinance'
import Profile from './components/Profile'
import LoanDetails from './components/LoanDetails'
import UpdateProfile from './components/UpdateProfile'
import { useDispatch } from 'react-redux'
import { setUser } from './redux/authSlice'
import axios from 'axios'
import { USER_API_ENDPOINT } from './components/utils/constant'

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/compare", element: <CompareLoans /> },
  { path: "/loan-details", element: <LoanDetails /> },
  { path: "/learn", element: <LearnFinance /> },
  { path: "/profile", element: <Profile /> },
  { path: "/update-profile", element: <UpdateProfile /> },
])

function App() {
  const dispatch = useDispatch()
  const [authChecked, setAuthChecked] = useState(false) // ✅ prevent flash

  // ✅ On every page load/refresh, restore user from cookie
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const res = await axios.get(`${USER_API_ENDPOINT}/profile`, {
          withCredentials: true,
        })
        if (res.data.success) {
          dispatch(setUser(res.data.user)) // ✅ restore user into Redux
        }
      } catch (error) {
        // not logged in — that's fine, user stays null
      } finally {
        setAuthChecked(true) // ✅ always mark as done
      }
    }
    restoreUser()
  }, [])

  // ✅ Don't render app until we know auth status (prevents flicker)
  if (!authChecked) return null

  return <RouterProvider router={appRouter} />
}

export default App