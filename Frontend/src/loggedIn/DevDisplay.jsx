import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";
import { CiMail } from "react-icons/ci";
import { FaPhoneAlt } from "react-icons/fa";

function DevDisplay() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const { authToken, id } = useContext(AuthContext);
  const { devId } = useParams();
  const [dev, setDev] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const handleClick = () => {
    navigate(`/chat?currentUser=${id}&chatUser=${devId}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${api}/developer/getDevById/${devId}`,
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
  const handleDownloadResume = () => {
    // For direct download you need to have your images in your `public` folder
    const link = document.createElement("a");
    link.href = resumePath;
    link.download = resumePath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const imagePath = `http://localhost:8000/images/${dev.image}`;
  const resumePath = `http://localhost:8000/resumes/${dev.resume}`;

  return (
    <div className=" ">
      <Nav />
      <div className="flex flex-col lg:flex-row gap-6 p-4 xl:px-20 lg:px-10 px-5 mt-5 xl:mt-10  ">
        {/* Developer Info Section */}
        <div className="flex flex-col items-center backdrop-blur-md bg-white/30 border border-white/50 p-6 rounded-lg shadow-lg w-full lg:w-1/3 lg:h-[550px] mb-8 lg:mb-0">
          <img
            src={imagePath}
            alt="Developer Image"
            className="w-32 h-32 rounded-full object-cover mb-4 border shadow"
          />
          <h2 className="text-lg font-bold text-gray-800 mb-2">{dev.name}</h2>
          <button
            className="bg-blue text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            onClick={handleClick}
          >
            Book an Appointment
          </button>

          <div className="mt-6 space-y-4 text-gray-700">
            <div className="flex items-center gap-2">
              <CiMail className="text-green-500" />
              <p>{dev.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-green-500" />
              <p>{dev.phone}</p>
            </div>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="w-full lg:w-2/3  bg-white/30 border border-white/50 p-6 rounded-lg shadow-lg lg:h-[550px] m-0">
          {/* Tabs and Content Container */}
          <div className="p-4 rounded-lg">
            {/* Tab Selection */}
            <div className="flex justify-center lg:justify-start space-x-4 mb-4">
              <div
                className={`cursor-pointer border rounded-lg p-3 w-32 text-center ${
                  activeTab === "about"
                    ? "bg-blue text-white"
                    : "bg-gray-100  hover:bg-gray-200 transition"
                }`}
                onClick={() => handleTabClick("about")}
              >
                About
              </div>
              <div
                className={`cursor-pointer border rounded-lg p-3 w-32 text-center ${
                  activeTab === "resume"
                    ? "bg-blue text-white"
                    : "bg-gray-100  hover:bg-gray-200 transition"
                }`}
                onClick={() => handleTabClick("resume")}
              >
                Resume
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === "about" ? (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    About Me
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {dev.description}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={resumePath}
                    alt="Resume"
                    className="max-w-full h-auto mb-4 border rounded-lg shadow-md"
                  />
                  <a
                    href={resumePath}
                    download
                    className="bg-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-green transition"
                  >
                    Download Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default DevDisplay;
