import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";
import { CiMail } from "react-icons/ci";
import { FaPhoneAlt } from "react-icons/fa";
import { LuMessageSquareText } from "react-icons/lu";
import {
  FaBriefcase,
  FaCode,
  FaExternalLinkAlt,
  FaGithub,
  FaLinkedin,
  FaMapPin,
  FaTwitter,
} from "react-icons/fa";
import ReviewForm from "./ReviewForm";
import ReviewCard from "./ReviewCard";
import WorkCard from "./WorkCard";

function DevDisplay() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const { authToken, id, role } = useContext(AuthContext);
  const { devId } = useParams();
  const [dev, setDev] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  const handleChatClick = () => {
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
        console.log(response.data.data);
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
  const socialLinks = [
    {
      icon: <FaGithub className="h-5 w-5" />,
      link: dev.github || "#",
      label: "GitHub",
    },
    {
      icon: <FaLinkedin className="h-5 w-5" />,
      link: dev.linkedIn || "#",
      label: "LinkedIn",
    },
    {
      icon: <FaCode className="h-5 w-5" />,
      link: dev.portfolio || "#",
      label: "Portfolio",
    },
  ];

  const skillsList = dev.skills || [];
  const projectsList = dev.completedJobs || [];
  const testimonialsList = dev.review || [];

  const tabs = [
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      {/* Header */}
      <div className="relative">
        {/* Banner */}
        <div className="h-48 lg:h-64 bg-gradient-to-r from-primary/80 to-primary" />

        {/* Profile Info */}
        <div className="container px-4 lg:px-6 mx-auto">
          <div className="relative -mt-20 flex flex-col items-center lg:flex-row lg:items-end lg:space-x-6">
            {/* Avatar */}
            <div className="relative h-32 w-32 sm:h-40 sm:w-40 overflow-hidden rounded-full border-4 border-gray-50 bg-gray-50">
              <img
                src={`${api}/images/${dev.image}`}
                alt="Developer profile"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-green-500 border-2 border-gray-50" />
            </div>

            {/* Name and Title */}
            <div className="mt-4 lg:mt-4 text-center lg:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mt-4 ">
                {dev.name}
              </h1>
              <p className="text-lg sm:text-xl text-gray-500">{dev.tag}</p>
              <div className="mt-2 flex flex-wrap justify-center lg:justify-start gap-2">
                <span className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-0.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                  <FaMapPin className="h-3 w-3" />
                  {dev.location || "Waiting to be updated"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleChatClick}
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <LuMessageSquareText className="h-4 w-4 mr-2" />
                Chat with me
              </button>
              <a
                href={`${api}/resumes/${dev.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Download Resume
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-6 flex justify-center lg:justify-start space-x-4">
            {socialLinks.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                {item.icon}
                <span className="sr-only">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8 lg:px-6 mx-auto">
        <div className="w-full">
          <div className="mb-8 flex overflow-x-auto justify-start">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 text-sm font-medium border-b-2  whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-gray-900 border-[#82c91e]"
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* About Tab */}
          {activeTab === "about" && (
            <div className="space-y-8">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-semibold">
                      About Me
                    </h2>
                    <p>
                      {dev.description ||
                        `I'm a passionate full-stack developer with over 8 years of
                      experience building web and mobile applications. I
                      specialize in React, Node.js, and TypeScript, with a strong
                      focus on creating performant, accessible, and user-friendly
                      experiences.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 lg:grid-cols-3">
                {projectsList.map((project, index) => (
                  <WorkCard job={project} key={index} />
                ))}
              </div>
              <div className="flex justify-center">
                <button className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                  View All Projects
                </button>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div className="space-y-8">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">
                      Technical Skills
                    </h2>
                    <div className="space-y-6">
                      {skillsList.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{skill}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-semibold mb-4">
                        Tools & Platforms
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {dev.tools?.map((item, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-0.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-4 sm:p-6">
                      <h2 className="text-lg sm:text-xl font-semibold mb-4">
                        Soft Skills
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {dev.softSkills?.map((item, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-0.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Testimonials Tab */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              {role == "client" && (
                <ReviewForm revieweeId={dev._id} reviewerId={id} />
              )}
              <div className="grid gap-6 lg:grid-cols-2">
                {testimonialsList.map((testimonial, index) => (
                  <ReviewCard reviewId={testimonial} key={index} />
                ))}
              </div>
            </div>
          )}
          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                    Contact Information
                  </h2>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <CiMail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{dev.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <FaPhoneAlt className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{dev.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <FaMapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{dev.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <FaLinkedin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">LinkedIn</p>
                        <a
                          href={dev.linkedIn || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {dev.linkedIn ? dev.linkedIn : "not found"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                    Availability
                  </h2>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                      <h3 className="font-semibold">Current Status</h3>
                      <p className="text-sm">
                        {dev.availability ||
                          "Available for freelance projects and consulting"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        Preferred Project Length
                      </h3>
                      <p className="text-sm">
                        {dev.projectLength || "3-6 months"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold">Hourly Rate</h3>
                      <p className="text-sm">
                        {dev.rate
                          ? `$${dev.rate} USD/hour`
                          : "$85 - $120 USD/hour"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold">Time Zone</h3>
                      <p className="text-sm">
                        {dev.timeZone || "Pacific Time (GMT-7)"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DevDisplay;
