import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { LogOut, User2, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_ENDPOINT } from "../utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const avatarSrc = user?.profile?.avatar || "https://github.com/shadcn.png";

  return (
    <div className="bg-gray-50 border-b">
      <div className="flex items-center justify-between mx-auto h-16 max-w-7xl px-6">

        {/* Logo */}
        <div className="cursor-pointer" onClick={() => navigate(user?.role === "bank" ? "/bank/dashboard" : "/")}>
          <h1 className="text-2xl font-bold">
            Fin<span className="text-[#F83002]">Ed </span>
            <img src="/loan.png" className="inline-block w-10 h-10" />
          </h1>
        </div>

        <div className="flex gap-12 items-center">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "bank" ? (
              <>
                <li><Link to="/bank/dashboard" className="hover:text-blue-600 transition">Dashboard</Link></li>
                <li><Link to="/bank/loans" className="hover:text-blue-600 transition">Loans</Link></li>
                {/* ✅ Now goes to dedicated All Applications page */}
                <li><Link to="/bank/applications" className="hover:text-blue-600 transition">Applications</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
                <li><Link to="/compare" className="hover:text-blue-600 transition">Compare</Link></li>
                <li><Link to="/learn" className="hover:text-blue-600 transition">Learn</Link></li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex gap-2 items-center">
              <Link to="/login"><Button variant="outline" className="cursor-pointer">Login</Button></Link>
              <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#4a0bb8] cursor-pointer">SignUp</Button></Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={avatarSrc} alt={user.fullname} />
                  <AvatarFallback>{user.fullname?.[0]}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div>
                  <div className="flex gap-4 items-center pb-3 border-b">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={avatarSrc} alt={user.fullname} />
                      <AvatarFallback className="text-lg">{user.fullname?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-gray-800">{user.fullname}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 mt-1 inline-block capitalize">
                        {user.role === "bank" ? "🏦 Bank Manager" : "👤 Recipient"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col mt-2">
                    {user?.role === "recipient" && (
                      <div className="flex w-fit gap-2 items-center">
                        <User2 className="w-4 h-4 text-gray-600" />
                        <Button variant="link" className="cursor-pointer p-0">
                          <Link to="/profile">View Profile</Link>
                        </Button>
                      </div>
                    )}
                    {user?.role === "bank" && (
                      <div className="flex w-fit gap-2 items-center">
                        <LayoutDashboard className="w-4 h-4 text-gray-600" />
                        <Button variant="link" className="cursor-pointer p-0">
                          <Link to="/bank/dashboard">Dashboard</Link>
                        </Button>
                      </div>
                    )}
                    <div className="flex w-fit gap-2 items-center mt-1">
                      <LogOut className="w-4 h-4 text-gray-600" />
                      <Button onClick={logoutHandler} variant="link" className="cursor-pointer p-0 text-red-500 hover:text-red-700">
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;