import { useState } from 'react'
import Navbar from './components/shared/Navbar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/login'
import Signup from './components/auth/signup'
import Home from './components/Home'
import CompareLoans from './components/CompareLoans'
import LearnFinance from './components/LearnFinance'
import Profile from './components/Profile'
import LoanDetails from './components/LoanDetails'
import UpdateProfile from './components/UpdateProfile'


const appRouter=createBrowserRouter([
  {
    path:"/",
    element:<Home />
  },
  {
    path:"/login",
    element:<Login />
  },
  {
    path:"/signup",
    element:<Signup />
  },
  {
    path:"/compare",
    element:<CompareLoans />
  },
  {
    path:"/loan-details",
    element:<LoanDetails />
  },
  {
    path:"/learn",
    element:<LearnFinance />
  },
  {
    path:"/profile",
    element:<Profile />
  },
  {
    path:"/update-profile",
    element:<UpdateProfile />
  }
])

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App
