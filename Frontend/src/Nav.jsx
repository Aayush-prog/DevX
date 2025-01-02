import React from "react";
import logo from "./assets/devx.png";
import { CiSearch } from "react-icons/ci";
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
export default function Nav() {
  const [search, setSearch] = useState(null);
  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };
  const handleClick = () => {
    console.log("clicked");
  };
  return (
    <div className="flex justify-between items-center p-4">
      {/* Left Section */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-1">
          <img src={logo} alt="DevX Logo" className="w-12 h-12 " />
          <span className="font-bold text-xl ">DevX</span>
        </div>
        <div>
          <ul className="flex space-x-6 font-medium">
            <NavLink
              to="/"
              className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8"
            >
              Home
            </NavLink>
            <NavLink
              to="/findTalent"
              className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8"
            >
              Find Talent
            </NavLink>
            <NavLink
              to="/findWork"
              className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8"
            >
              Find Work
            </NavLink>
            <NavLink
              to="/whyDevX"
              className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8"
            >
              Why DevX
            </NavLink>
          </ul>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <div className="flex items-center border border-black rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search"
            className="p-2 pl-3 outline-none"
            name="Search"
            onChange={handleChange}
          />
          <button className="p-2 bg-blue " onClick={handleClick}>
            <CiSearch className="text-2xl" />
          </button>
        </div>

        {/* Login & Signup Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-black hover:underline underline-offset-8"
          >
            Login
          </Link>
          <Link to="/signUp" className="bg-green rounded-lg p-2 text-white">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
