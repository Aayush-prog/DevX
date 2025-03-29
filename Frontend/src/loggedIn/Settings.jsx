import React, { useContext, useEffect, useState } from "react";
import Nav from "../Nav";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { FaCamera, FaPlus, FaMinus } from "react-icons/fa";

export default function SettingsPage() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const { authToken, role } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [user, setUser] = useState();
  const [formData, setFormData] = useState({
    image: null,
    resume: null,
    name: "",
    description: "",
    email: "",
    phone: "",
    password: "",
    rate: 0,
    github: "",
    linkedIn: "",
    portfolio: "",
    location: "",
    tools: [],
    softSkills: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [newTool, setNewTool] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");

  let url = `${api}/client/dashboard`;

  useEffect(() => {
    if (role === "developer") {
      url = `${api}/developer/dashboard`;
    }
    const fetchProfile = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUser(response.data.data);
        setLoading(false);
        console.log(response.data);
      } catch (e) {
        console.log(e);
        setLoading(false);
        setError("Failed to fetch user data.");
      }
    };

    if (authToken) {
      // Only fetch if authToken is available
      fetchProfile();
    }
  }, [authToken, role, api, url]);

  useEffect(() => {
    if (user) {
      setFormData({
        image: null,
        description: user.description,
        rate: user.rate || null,
        email: user.email,
        resume: null,
        name: user.name,
        phone: user.phone,
        github: user.github || "",
        linkedIn: user.linkedIn || "",
        portfolio: user.portfolio || "",
        location: user.location || "",
        tools: user.tools || [],
        softSkills: user.softSkills || [],
      });
      if (user.image) {
        setImagePreview(`${api}/images/${user.image}`);
      }
    }
  }, [user, api]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData({ ...formData, [name]: file });

    if (name === "image" && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTool = () => {
    if (newTool.trim() !== "") {
      setFormData({ ...formData, tools: [...formData.tools, newTool] });
      setNewTool("");
    }
  };

  const handleRemoveTool = (index) => {
    const updatedTools = formData.tools.filter((_, i) => i !== index);
    setFormData({ ...formData, tools: updatedTools });
  };

  const handleAddSoftSkill = () => {
    if (newSoftSkill.trim() !== "") {
      setFormData({
        ...formData,
        softSkills: [...formData.softSkills, newSoftSkill],
      });
      setNewSoftSkill("");
    }
  };

  const handleRemoveSoftSkill = (index) => {
    const updatedSoftSkills = formData.softSkills.filter((_, i) => i !== index);
    setFormData({ ...formData, softSkills: updatedSoftSkills });
  };

  const formDataToSend = new FormData();
  formDataToSend.append("name", formData.name);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("password", formData.password);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("rate", formData.rate);
  formDataToSend.append("phone", formData.phone);
  formDataToSend.append("github", formData.github);
  formDataToSend.append("linkedIn", formData.linkedIn);
  formDataToSend.append("portfolio", formData.portfolio);
  formDataToSend.append("location", formData.location);
  formDataToSend.append("tools", JSON.stringify(formData.tools));
  formDataToSend.append("softSkills", JSON.stringify(formData.softSkills));

  if (formData.image) {
    formDataToSend.append("image", formData.image);
  }
  if (formData.resume) {
    formDataToSend.append("resume", formData.resume);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/settings`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.status === "success") {
        navigate("/login");
      }
    } catch (error) {
      setError(` ${error.response?.data?.msg || "error occurred"} `);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-7xl bg-white p-6 rounded-lg space-y-4 mx-auto"
      >
        <h1 className="mx-auto text-center text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4">
          Update your <span className="text-blue">Profile</span>
        </h1>
        <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center col-span-full md:col-span-1 lg:col-span-1">
            <label className="block text-sm font-medium">Profile Picture</label>
            <div
              onClick={() => document.getElementById("imageInput").click()}
              className="cursor-pointer border border-gray-300 p-2 rounded-full w-20 h-20 flex justify-center items-center overflow-hidden relative mt-2"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>Click to upload Profile</span>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition">
                <FaCamera className="text-primary text-5xl" />
              </div>
            </div>
            <input
              type="file"
              id="imageInput"
              name="image"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium ">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-primary">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@gmail.com"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-primary">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g. +9779800000000"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Rate, Password, Resume */}
          {role === "developer" && (
            <div className="col-span-full md:col-span-2 lg:col-span-3 xl:col-span-4 grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {/* Rate */}
              <div>
                <label className="block text-sm font-medium text-primary">
                  Rate
                </label>
                <input
                  type="string"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  placeholder="e.g. Negotiable"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-primary">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {/* Upload Resume */}
              <div>
                <label className="block text-sm font-medium text-primary">
                  Upload Resume
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  className="block w-full mt-1 text-sm text-primary file:mr-4 file:py-2 file:px-4 file:border file:text-sm file:font-semibold file:bg-blue file:text-white hover:file:bg-blue"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="col-span-full md:col-span-2 lg:col-span-3 xl:col-span-4">
            <label className="block text-sm font-medium text-primary">
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

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium text-primary">
              GitHub
            </label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              placeholder="e.g., https://github.com/yourusername"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-primary">
              LinkedIn
            </label>
            <input
              type="text"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleInputChange}
              placeholder="e.g., https://linkedin.com/in/yourprofile"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Portfolio */}
          <div>
            <label className="block text-sm font-medium text-primary">
              Portfolio
            </label>
            <input
              type="text"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              placeholder="e.g., https://yourportfolio.com"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-primary">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Kathmandu, Nepal"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tools */}
          <div className="col-span-full md:col-span-2">
            <label className="block text-sm font-medium text-primary">
              Tools
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                placeholder="Add a tool"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddTool}
                className="p-2 bg-blue text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FaPlus />
              </button>
            </div>
            {formData.tools.length > 0 && (
              <ul className="space-y-1">
                {formData.tools.map((tool, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-md bg-gray-100"
                  >
                    <span>{tool}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(index)}
                      className="p-1 text-white rounded-full bg-red hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <FaMinus />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Soft Skills */}
          <div className="col-span-full md:col-span-2">
            <label className="block text-sm font-medium text-primary">
              Soft Skills
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newSoftSkill}
                onChange={(e) => setNewSoftSkill(e.target.value)}
                placeholder="Add a soft skill"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddSoftSkill}
                className="p-2 bg-blue text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FaPlus />
              </button>
            </div>
            {formData.softSkills.length > 0 && (
              <ul className="space-y-1">
                {formData.softSkills.map((skill, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-md bg-gray-100"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSoftSkill(index)}
                      className="p-1 text-white rounded-full bg-red hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <FaMinus />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {error && (
            <div className="text-red col-span-full text-center">{error}</div>
          )}
          {/* Submit Button */}
          <div className="col-span-full flex justify-center">
            <button
              type="submit"
              className="w-full md:w-1/2 lg:w-1/3 py-2 text-white bg-blue hover:bg-green rounded-md focus:outline-none focus:ring-2 focus:ring-green"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
}
