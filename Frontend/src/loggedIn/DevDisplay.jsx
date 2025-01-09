import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
function DevDisplay() {
  const navigate = useNavigate();
  const { authToken, id } = useContext(AuthContext);
  const { devId } = useParams();
  const [dev, setDev] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleClick = () => {
    navigate(`/chat?currentUser=${id}&chatUser=${devId}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/developer/getDevById/${devId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setDev(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [devId]);

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

  if (!dev) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Talent not found</p>
      </div>
    );
  }

  const imagePath = `http://localhost:8000/images/${dev.image}`;
  const resumePath = `http://localhost:8000/resumes/${dev.resume}`;

  return (
    <div className="bg-gray-100 font-sans">
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
          {/* Image Container */}
          <div className="md:w-1/2 p-4 flex flex-col justify-center items-center">
            <img
              src={imagePath}
              alt="Developer's Image"
              className="rounded-full w-48 h-48 mb-4 object-cover shadow-md"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {dev.name}
            </h2>
            <p className="text-gray-600">{dev.tag}</p>
            <button
              className="p-3 bg-green rounded-xl border"
              onClick={handleClick}
            >
              Chat with Me
            </button>
          </div>

          {/* Content Area */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">About Me</h1>
            <p className="text-gray-700 mb-6">{dev.description}</p>

            {/* CV Container */}
            <div className="mb-6 border rounded-md shadow-sm border-gray-200">
              <div className="bg-gray-100 py-2 px-4 text-lg font-semibold text-gray-700 border-b border-gray-200">
                CV/Resume
              </div>
              <div className="p-4">
                <img
                  src={resumePath}
                  alt="CV Image"
                  className="rounded-md mb-4 shadow-md max-w-full h-auto"
                />
                <a
                  href="#"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download CV
                </a>
              </div>
            </div>

            {/* Skills */}
            {dev.skills && dev.skills.length > 0 && (
              <div className="mb-6 border rounded-md shadow-sm border-gray-200">
                <div className="bg-gray-100 py-2 px-4 text-lg font-semibold text-gray-700 border-b border-gray-200">
                  Skills
                </div>
                <ul className="p-4 space-y-2">
                  {dev.skills.map((skill, index) => (
                    <li key={index} className="text-gray-700">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-4">
              <a
                href={`mailto:${dev.email}`}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Contact Me
              </a>
              <a
                href={`tel:${dev.phone}`}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Call me
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DevDisplay;
