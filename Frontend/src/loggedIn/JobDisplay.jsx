import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../AuthContext";
import axios from "axios";
import Footer from "../Footer";
import Nav from "../Nav";

const JobDisplay = () => {
  const { jobId } = useParams();
  const { authToken, role, id } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [owner, setOwner] = useState(false);
  const [editJob, setEditJob] = useState(false);
  const navigate = useNavigate();

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    budget: "",
    requiredTags: [],
    status: "",
  });

  useEffect(() => {
    if (job) {
      setJobForm({
        title: job.title,
        description: job.description,
        budget: job.budget,
        requiredTags: job.requiredTags || [],
        status: job.status,
      });
    }
  }, [job]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobForm({ ...jobForm, [name]: value });
  };

  const handleTagsChange = (index, value) => {
    const newTags = [...jobForm.requiredTags];
    newTags[index] = value;
    setJobForm({ ...jobForm, requiredTags: newTags });
  };

  const addTag = () => {
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
      const response = await axios.patch(
        `http://localhost:8000/client/editJob/${jobId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setEditJob(false);

      // Update local job state with edited data
      setJob((prevJob) => ({ ...prevJob, ...jobForm }));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleClientClick = () => {
    navigate(`/chat?currentUser=${id}&chatUser=${job.client}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/jobs/getJobById/${jobId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        setJob(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId, authToken]);

  useEffect(() => {
    if (job && id === job.client) {
      setOwner(true);
    } else {
      setOwner(false);
    }
  }, [job, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Job not found</p>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="max-w-5xl mx-auto my-8 p-4 md:p-8 bg-white rounded-lg shadow-md">
        {editJob && (
          <div className="xl:px-20 lg:px-10 px-5 mt-5 xl:mt-10 space-y-8">
            <h1 className="text-2xl lg:text-4xl xl:text-5xl 2xl:text-5xl font-bold text-center">
              Edit your <span className="text-green">job</span> post!
            </h1>
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto space-y-4"
            >
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
        {!editJob && (
          <div className="mb-6 flex flex-col md:flex-row">
            {/* Job details container */}
            <div className="md:w-2/3 p-4">
              <h2 className="text-2xl font-bold mb-2 text-primary">
                {job.title}
              </h2>
              <button className="p-2 bg-green" onClick={handleClientClick}>
                Chat with client
              </button>
              <div className="flex mb-4">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-200 text-gray-800 mr-2">
                  {job.budget}
                </span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-200 text-gray-800 mr-2">
                  {job.status}
                </span>
              </div>

              <p className="text-gray-800 leading-relaxed mb-6">
                {job.description}
              </p>
              {/* Apply Now Button (conditionally rendered) */}
              {role && role === "developer" && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Apply Now
                </button>
              )}
            </div>
          </div>
        )}
        {owner && (
          <button
            className="fixed bottom-6 right-6 bg-blue hover:bg-green text-white p-4 rounded-full shadow-lg focus:outline-none"
            aria-label="Floating Action Button"
            onClick={(e) => {
              setEditJob(!editJob);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default JobDisplay;
