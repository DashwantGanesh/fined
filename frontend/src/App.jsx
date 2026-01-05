import { useState } from 'react'
import Navbar from './components/shared/Navbar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/login'
import Signup from './components/auth/signup'
import Home from './components/Home'
import CompareLoans from './components/CompareLoans'
import LearnFinance from './components/LearnFinance'

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
    path:"/learn",
    element:<LearnFinance />
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
