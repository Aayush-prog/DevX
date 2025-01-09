import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import Nav from "../Nav";
import Footer from "../Footer";
import axios from "axios";
import { FaFolderOpen } from "react-icons/fa";
import { FaFolderClosed } from "react-icons/fa6";
import { IoCodeWorking } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import WorkCard from "./WorkCard";

export default function ClientHome() {
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [createJob, setCreateJob] = useState(false);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    budget: "",
    requiredTags: [""],
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobForm({ ...jobForm, [name]: value });
  };
  const handleTagsChange = (index, value) => {
    console.log("on tag change");
    const newTags = [...jobForm.requiredTags];
    newTags[index] = value;
    setJobForm({ ...jobForm, requiredTags: newTags });
  };
  const addTag = () => {
    console.log("on tag change");
    setJobForm({ ...jobForm, requiredTags: [...jobForm.requiredTags, ""] });
  };
  const removeTag = (index) => {
    const newTag = jobForm.requiredTags.filter((_, i) => i !== index);
    setJobForm({ ...jobForm, requiredTags: newTag });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", jobForm.title);
    data.append("description", jobForm.description);
    data.append("budget", jobForm.budget);
    jobForm.requiredTags.forEach((item, index) => {
      data.append(`requiredTags[${index}]`, item);
    });
    try {
      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }
      const response = await axios.post(
        "http://localhost:8000/client/createJob",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setCreateJob(false);
      navigate("/home");
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/client/dashboard",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUser(response.data.data);
        setJobs(response.data.jobs);
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    if (authToken) {
      // Only fetch if authToken is available
      fetchProfile();
    }
  }, [authToken]); // Add authToken to the dependency array

  return (
    <div>
      <Nav />
      {createJob && (
        <div className="xl:px-20 lg:px-10 px-5 mt-5 xl:mt-10 space-y-8">
          <h1 className="text-2xl lg:text-4xl xl:text-5xl 2xl:text-5xl font-bold text-center">
            Pitch your <span className="text-green">idea</span> for{" "}
            <span className="text-blue">talents</span> to be hired!
          </h1>
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium">Job Title</label>
              <input
                type="text"
                name="title"
                value={jobForm.title}
                onChange={handleChange}
                className=" p-2 mt-1 block w-full border rounded-md shadow-sm"
                placeholder="Enter your job title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Job Description
              </label>
              <textarea
                name="description"
                value={jobForm.description}
                onChange={handleChange}
                className=" p-2 mt-1 block w-full border rounded-md shadow-sm"
                placeholder="Enter your job description"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Job Budget</label>
              <input
                type="text"
                name="budget"
                value={jobForm.budget}
                onChange={handleChange}
                className=" p-2 mt-1 block w-full border rounded-md shadow-sm"
                placeholder="Enter your job budget or keep it negotiable"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium ">
                Required Tags for better talent finds
              </label>
              {jobForm.requiredTags.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleTagsChange(index, e.target.value)}
                    className="mt-1 block p-2 w-full border  rounded-md shadow-sm"
                    placeholder={`Required Tag ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className=" bg-red p-2 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="mt-2 inline-flex items-center px-3 py-2 bg-blue text-white text-sm font-medium rounded-md "
              >
                Add Syllabus Item
              </button>
            </div>
            <button
              type="submit"
              className=" text-center p-2 bg-green text-white text-sm font-medium rounded-md w-full"
            >
              Submit
            </button>
          </form>
        </div>
      )}
      {user && !createJob && (
        <div className="xl:px-20 lg:px-10 px-5 mt-5 xl:mt-10 xl:space-y-20 space-y-8">
          <div className="relative">
            <div className="absolute inset-0 -z-10 mx-auto w-[300px] h-[50px] lg:w-[600px]  bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] rounded-full blur-3xl opacity-50"></div>
            <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
              Welcome <span className="text-blue">{user.name} </span> !
            </h1>
          </div>
          <div className="space-y-14">
            <h1 className="text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold">
              Here are your insights
            </h1>
            <div className="grid grid-cols-3 gap-3 items-center">
              <div className="flex items-center gap-5 ">
                <FaFolderOpen className="text-green text-5xl font-bold" />
                <h1 className="2xl:text-2xl xl:text-xl font-semibold  ">
                  {user.openJobs.length}
                </h1>
              </div>
              <div className="flex items-center gap-5 ">
                <IoCodeWorking className=" text-5xl font-bold" />
                <h1 className="2xl:text-2xl xl:text-xl font-semibold  ">
                  {user.ongoingJobs.length}
                </h1>
              </div>
              <div className="flex items-center gap-5 ">
                <FaFolderClosed className="text-green text-5xl font-bold" />
                <h1 className="2xl:text-2xl xl:text-xl font-semibold  ">
                  {user.completedJobs.length}
                </h1>
              </div>
            </div>
          </div>
          <div>
            {jobs.map((element, index) => {
              return <WorkCard job={element} key={index} />;
            })}
          </div>
        </div>
      )}
      <button
        className="fixed bottom-6 right-6 bg-blue hover:bg-green text-white p-4 rounded-full shadow-lg focus:outline-none"
        aria-label="Floating Action Button"
        onClick={(e) => {
          setCreateJob(!createJob);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
      <Footer />
    </div>
  );
}
