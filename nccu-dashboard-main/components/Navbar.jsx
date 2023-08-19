import React from "react";
import { useRouter } from "next/router";
import { BiLogOut, BiCart, BiUser } from "react-icons/bi";
import { BsStar } from "react-icons/bs";
import { MdOutlineFastfood } from "react-icons/md";
const Navbar = ({ children }) => {
  const router = useRouter();

  const handlePush = (path) => {
    // check if user is login or not when press the button
    const user = localStorage.getItem("token");
    if (user) {
      router.push(path);
    } else {
      alert("Please login first");
      router.push("/");
    }
  };

  return (
    <>
      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* <!-- Page content here --> */}
          <div className="w-full navbar bg-base-300 lg:hidden fixed z-50">
            <div className="flex-none">
              <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2 mx-2 lg:hidden font-bold text-xl text-accent">
              NCCU Dashboard
            </div>
          </div>
          {children}
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-300 text-base-content">
            {/* <!-- Sidebar content here --> */}
            <li>
              <a
                className="font-bold text-3xl text-accent"
                onClick={() => {
                  handlePush("/dashboard");
                }}
              >
                NCCU DashBoard
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  handlePush("/dashboard/");
                }}
              >
                <BiUser />
                User
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  handlePush("/dashboard/order");
                }}
              >
                <BiCart />
                Order
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  handlePush("/dashboard/dish");
                }}
              >
                <MdOutlineFastfood />
                Dish
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  handlePush("/dashboard/rating");
                }}
              >
                <BsStar />
                Rating
              </a>
            </li>

            <li>
              <a
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/");
                }}
              >
                <BiLogOut />
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
