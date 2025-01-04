import React, { useState } from "react";
import logo from "./assets/devx.png";
import { CiSearch } from "react-icons/ci";
import { NavLink, Link } from "react-router-dom";

export default function Nav() {
  const [search, setSearch] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleClick = () => {
    console.log("clicked");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="">
      {/* Navbar Section */}
      <div className="relative flex justify-between items-center p-4 bg-white z-50 xl:px-20 lg:px-10 px-5">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-1">
            <img src={logo} alt="DevX Logo" className="w-12 h-12" />
            <span className="font-bold text-xl">DevX</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:block">
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
        <div className="hidden xl:flex items-center space-x-6">
          {/* Search Bar */}
          <div className="flex items-center border border-black rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search"
              className="p-2 pl-3 outline-none xl:w-[100px] 2xl:w-[200px]"
              name="Search"
              onChange={handleChange}
            />
            <button className="p-2 bg-blue" onClick={handleClick}>
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
            <Link
              to="/signUp"
              className="bg-green rounded-lg p-2 px-3  text-white"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="xl:hidden ml-auto flex items-center">
          <button onClick={toggleMobileMenu} className="text-xl">
            {mobileMenuOpen ? "X" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } fixed top-0 left-0 w-full h-full bg-white z-40 flex flex-col items-center justify-start shadow-lg mt-16`}
      >
        <ul className="space-y-6 text-xl font-medium w-full flex flex-col items-center">
          <NavLink
            to="/"
            className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8 w-full text-center py-4"
            onClick={toggleMobileMenu}
          >
            Home
          </NavLink>
          <NavLink
            to="/findTalent"
            className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8 w-full text-center py-4"
            onClick={toggleMobileMenu}
          >
            Find Talent
          </NavLink>
          <NavLink
            to="/findWork"
            className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8 w-full text-center py-4"
            onClick={toggleMobileMenu}
          >
            Find Work
          </NavLink>
          <NavLink
            to="/whyDevX"
            className="cursor-pointer hover:text-blue-500 hover:underline underline-offset-8 w-full text-center py-4"
            onClick={toggleMobileMenu}
          >
            Why DevX
          </NavLink>
          <Link
            to="/login"
            className="text-black hover:underline underline-offset-8"
          >
            Login
          </Link>
          <Link
            to="/signUp"
            className="bg-green rounded-lg p-2 px-3  text-white"
          >
            Sign Up
          </Link>
        </ul>
      </div>
    </nav>
  );
}
