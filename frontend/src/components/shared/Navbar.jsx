import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_ENDPOINT } from "../utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";

const Navbar = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {user}=useSelector(store=>store.auth);
  const logoutHandler = async()=>{
    try {
      const res= await axios.get(`${USER_API_ENDPOINT}/logout`,{withCredentials:true});
      if(res.data.success){
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className="bg-gray-50">
      <div className="flex items-center justify-between mx-auto h-16 max-w-7xl ">
        <div>
          <h1 className="text-2xl font-bold">
            Fin<span className="text-[#F83002]">Ed </span>
            <img src="/loan.png" className="inline-block w-10 h-10 " />
          </h1>
        </div>
        <div className="flex gap-12 items-center">
          <ul className="flex font-medium items-center gap-5">
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/compare'>Compare</Link></li>
            <li><Link to="/learn">Learn</Link></li>
          </ul>
          {
          !user ? (
            <div className="flex gap-2 items-center ">
              <Link to={'/login'}><Button variant="outline" className='cursor-pointer'>Login</Button></Link>
              <Link to={'/signup'}><Button className="bg-[#6A38C2] hover:bg-[#4a0bb8] cursor-pointer">SignUp</Button></Link>
              
              
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div>
                  <div className="flex gap-5 space-y-2">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Manish Agarwal</h4>
                      <p className="text-sm text-muted-foreground">
                        Lorem ipsum dolor sit amet.
                      </p>
                    </div>
                  </div>

                  <div className=" flex flex-col my-2 cursor-pointer">
                    <div className="flex w-fit gap-2 items-center cursor-pointer">
                      <User2 />
                      <Button variant="link" className="cursor-pointer">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                    <div className="flex w-fit gap-2 items-center cursor-pointer">
                      <LogOut />
                      <Button onClick={logoutHandler} variant="link" className="cursor-pointer">
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
