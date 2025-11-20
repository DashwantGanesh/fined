import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";

const Navbar = () => {
  const user = false;
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto h-16 max-w-7xl ">
        <div>
          <h1 className="text-2xl font-bold">
            Fin<span className="text-[#F83002]">Ed </span>
            <img src="/loan.jpg" className="inline-block w-10 h-10 " />
          </h1>
        </div>
        <div className="flex gap-12 items-center">
          <ul className="flex font-medium items-center gap-5">
            <li>Home</li>
            <li>Loans</li>
            <li>Browse</li>
          </ul>
          {
          !user ? (
            <div className="flex gap-2 items-center ">
              <Button variant="outline" className='cursor-pointer'>Login</Button>
              <Button className="bg-[#6A38C2] hover:bg-[#4a0bb8] cursor-pointer">SignUp</Button>
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
                        View Profile
                      </Button>
                    </div>
                    <div className="flex w-fit gap-2 items-center cursor-pointer">
                      <LogOut />
                      <Button variant="link" className="cursor-pointer">
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
