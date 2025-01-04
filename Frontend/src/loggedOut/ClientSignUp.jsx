import React, { useState } from "react";
import Nav from "../Nav";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
const ClientSignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [formData, setFormData] = useState({
    profilePicture: null,
    name: "",
    description: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/signup?role=client",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.data.status === "success") {
        navigate("/login");
      }
    } catch (error) {
      setError(` ${error.response?.data?.msg || "error occured"} `);
    }
  };

  return (
    <div>
      <Nav />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded-lg space-y-4 mx-auto"
      >
        <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl  font-bold">
          Turn your <span className="text-green">ideas</span> into{" "}
          <span className="text-blue">reality</span> right now!
        </h1>

        {/* Profile Picture Upload */}
        <div>
          <label className="block text-sm font-medium">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
            className="block w-full mt-1 text-sm text-gray file:mr-4 file:py-2 file:px-4 file:border file:text-sm file:font-semibold file:bg-green file:text-white hover:file:bg-green"
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium ">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="John Doe"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-3">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="example@gmail.com"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              placeholder="e.g. +9779800000000"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-3">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        {/* Agree to Terms */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            required
            className="h-4 w-4 text-green-500 border rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm ">
            I agree to the{" "}
            <a href="#" className="text-blue-500 underline">
              terms and conditions
            </a>
          </label>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 text-white bg-green hover:bg-blue rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default ClientSignUp;
