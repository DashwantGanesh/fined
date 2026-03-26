import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/authSlice";
import axios from "axios";
import { USER_API_ENDPOINT } from "./components/utils/constant";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import CompareLoans from "./components/CompareLoans";
import LearnFinance from "./components/LearnFinance";
import Profile from "./components/Profile";
import LoanDetails from "./components/LoanDetails";
import UpdateProfile from "./components/UpdateProfile";
import ProtectedRoute from "./components/ProtectedRoute";

// Bank (admin) pages
import Dashboard from "./components/Bank/Dashboard";
import Loans from "./components/Bank/Loans";
import Applicants from "./components/Bank/Applicants";
import PostLoan from "./components/Bank/PostLoan";
import RegisterBank from "./components/Bank/RegisterBank";
import EditBank from "./components/Bank/EditBank";

const appRouter = createBrowserRouter([
  // ===== Public routes =====
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/learn", element: <LearnFinance /> },

  // ===== Recipient only =====
  { path: "/compare",       element: <ProtectedRoute role="recipient"><CompareLoans /></ProtectedRoute> },
  { path: "/loan-details",  element: <ProtectedRoute role="recipient"><LoanDetails /></ProtectedRoute> },
  { path: "/profile",       element: <ProtectedRoute role="recipient"><Profile /></ProtectedRoute> },
  { path: "/update-profile",element: <ProtectedRoute role="recipient"><UpdateProfile /></ProtectedRoute> },

  // ===== Bank admin only =====
  { path: "/bank/dashboard",          element: <ProtectedRoute role="bank"><Dashboard /></ProtectedRoute> },
  { path: "/bank/loans",              element: <ProtectedRoute role="bank"><Loans /></ProtectedRoute> },
  { path: "/bank/applicants/:loanId", element: <ProtectedRoute role="bank"><Applicants /></ProtectedRoute> },
  { path: "/bank/post-loan",          element: <ProtectedRoute role="bank"><PostLoan /></ProtectedRoute> },
  { path: "/bank/register",           element: <ProtectedRoute role="bank"><RegisterBank /></ProtectedRoute> },
  { path: "/bank/edit/:id",           element: <ProtectedRoute role="bank"><EditBank /></ProtectedRoute> },
]);

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const res = await axios.get(`${USER_API_ENDPOINT}/profile`, { withCredentials: true });
        if (res.data.success) dispatch(setUser(res.data.user));
      } catch (error) {
        // not logged in
      } finally {
        setAuthChecked(true);
      }
    };
    restoreUser();
  }, []);

  if (!authChecked) return null;
  return <RouterProvider router={appRouter} />;
}

export default App;