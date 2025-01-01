import React, { useState, useContext } from "react";
import axios from "axios";
import Nav from "./Nav.jsx";
import Footer from "../Footer.jsx";
import { AuthContext } from "../AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AuthForms() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can now use formData values
    console.log("Form Submitted:", formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Ensure you're sending JSON
          },
        }
      );
      console.log(response);
      if (response.data.status === "success") {
        login(response.data.token, response.data.role);
      }
    } catch (error) {
      setError(` ${error.response?.data?.msg || "error occured"} `);
    }
  };

  return (
    <div>
      <Nav />
      <div className="grid place-items-center ">
        <section className="bg-white ">
          <div className="py-8 pb-0 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">
              Log In
            </h1>
            <p className="text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 ">
              At UniSphere, we focus on creating a vibrant student community
              where academics, social experiences, and local culture come
              together to inspire growth, foster innovation, and build lifelong
              connections.
            </p>
          </div>
        </section>
        <form onSubmit={handleSubmit} className="w-2/3 md:w-1/2 py-10 ">
          <div className="mb-6">
            <label
              for="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="john.doe@company.com"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              for="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="•••••••••"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error && (
              <span className="font-semibold text-lg text-red-500">
                {error}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
        <span className="px-4 text-center mb-10">
          <p className="text-gray-500 dark:text-gray-400">
            Don't have an account?
            <br></br>
            <Link
              to="/signup"
              className="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Sign Up Now
              <svg
                className="w-4 h-4 ms-2 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </Link>
          </p>
        </span>
      </div>
      <Footer />
    </div>
  );
}
