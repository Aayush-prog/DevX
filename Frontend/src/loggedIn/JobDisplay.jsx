import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";
const JobDisplay = () => {
  const { jobId } = useParams();
  const { authToken, role } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log(response.data.data);
        setJob(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <div className="max-w-5xl mx-auto my-8 p-4 md:p-8 bg-white rounded-lg shadow-md">
      {/* Image container */}
      <div className="mb-6 flex flex-col md:flex-row">
        {/* Job details container */}
        <div className="md:w-2/3 p-4">
          <h2 className="text-2xl font-bold mb-2 text-primary">{job.title}</h2>
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
    </div>
  );
};

export default JobDisplay;
