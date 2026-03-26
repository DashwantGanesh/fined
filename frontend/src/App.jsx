import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/authSlice";
import axios from "axios";
import { USER_API_ENDPOINT } from "./components/utils/constant";

import Login from "./components/auth/Login"; // ✅ fixed casing
import Signup from "./components/auth/Signup"; // ✅ fixed casing
import Home from "./components/Home";
import CompareLoans from "./components/CompareLoans";
import LearnFinance from "./components/LearnFinance";
import Profile from "./components/Profile";
import LoanDetails from "./components/LoanDetails";
import UpdateProfile from "./components/UpdateProfile";
import Loans from "./components/Bank/Loans";
import Applicants from "./components/Bank/Applicants";
import PostLoan from "./components/Bank/PostLoan";
import RegisterBank from "./components/Bank/RegisterBank";

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/compare", element: <CompareLoans /> },
  { path: "/loan-details", element: <LoanDetails /> },
  { path: "/learn", element: <LearnFinance /> },
  { path: "/profile", element: <Profile /> },
  { path: "/update-profile", element: <UpdateProfile /> },
  

  //admin(bank) paths
  { path: "/bank/loans", element: <Loans /> },
  { path: "/bank/applicants/:id", element: <Applicants /> },
  { path: "/bank/post-loan", element: <PostLoan /> },
  { path: "/bank/register", element: <RegisterBank /> },
]);

function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  // ✅ Restore user from cookie on every refresh
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const res = await axios.get(`${USER_API_ENDPOINT}/profile`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        // not logged in — fine, user stays null
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
