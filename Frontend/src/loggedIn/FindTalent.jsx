import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";
import { AuthContext } from "../AuthContext";
import TalentCard from "./TalentCard";

const jobRoles = [
  "Data Scientist",
  "Database Engineer",
  "Designer",
  "DevOps Engineer",
  "DotNet Developer",
  "Information Technology",
  "Java Developer",
  "Network Security Engineer",
  "Python Developer",
  "QA",
  "React Developer",
  "SAP Developer",
  "SQL Developer",
];

export default function FindWork() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allDevs, setAllDevs] = useState([]);
  const [devs, setDevs] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" });
  const [projectRange, setProjectRange] = useState({ min: "", max: "" });
  const [showCount, setShowCount] = useState(16);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${api}/developer/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setAllDevs(response.data.data);
      } catch (error) {
        console.error("Error fetching developers:", error);
      }
    };
    fetchJobs();
  }, [authToken, api]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [selectedRoles, salaryRange, projectRange, showCount, sortBy, allDevs]);

  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRoles((prevRoles) =>
      event.target.checked
        ? [...prevRoles, role]
        : prevRoles.filter((r) => r !== role)
    );
  };

  const handleSalaryChange = (event) => {
    const { name, value } = event.target;
    setSalaryRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };

  const handleProjectChange = (event) => {
    const { name, value } = event.target;
    setProjectRange((prevRange) => ({
      ...prevRange,
      [name]: value,
    }));
  };

  const handleShowChange = (event) => {
    setShowCount(parseInt(event.target.value, 10));
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const applyFiltersAndSort = () => {
    let filteredAndSortedDevs = [...allDevs];

    if (selectedRoles.length > 0) {
      filteredAndSortedDevs = filteredAndSortedDevs.filter((dev) =>
        selectedRoles.includes(dev.tag)
      );
    }

    if (salaryRange.min !== "" && salaryRange.max !== "") {
      filteredAndSortedDevs = filteredAndSortedDevs.filter((dev) => {
        const rate = parseFloat(dev.rate);
        if (isNaN(rate)) return false;

        const minSalary = parseFloat(salaryRange.min);
        const maxSalary = parseFloat(salaryRange.max);

        return rate >= minSalary && rate <= maxSalary;
      });
    } else if (salaryRange.min !== "") {
      filteredAndSortedDevs = filteredAndSortedDevs.filter((dev) => {
        const rate = parseFloat(dev.rate);
        if (isNaN(rate)) return false;
        const minSalary = parseFloat(salaryRange.min);
        return rate >= minSalary;
      });
    } else if (salaryRange.max !== "") {
      filteredAndSortedDevs = filteredAndSortedDevs.filter((dev) => {
        const rate = parseFloat(dev.rate);
        if (isNaN(rate)) return false;
        const maxSalary = parseFloat(salaryRange.max);
        return rate <= maxSalary;
      });
    }

    if (projectRange.min !== "" && projectRange.max !== "") {
      filteredAndSortedDevs = filteredAndSortedDevs.filter((dev) => {
        const projectCount = dev.completedJobs.length;
        const minProjects = parseInt(projectRange.min, 10);
        const maxProjects = parseInt(projectRange.max, 10);
        return projectCount >= minProjects && projectCount <= maxProjects;
      });
    } else if (projectRange.min !== "") {
      filteredAndSortedDevs = filteredAndSortedDevs.filter((dev) => {
        const projectCount = dev.completedJobs.length;
        const minProjects = parseInt(projectRange.min, 10);
        return projectCount >= minProjects;
      });
    } else if (projectRange.max !== "") {
      filteredAndSortedDevs = filteredAndSortedDevs.filter((dev) => {
        const projectCount = dev.completedJobs.length;
        const maxProjects = parseInt(projectRange.max, 10);
        return projectCount <= maxProjects;
      });
    }

    if (sortBy === "rate") {
      filteredAndSortedDevs.sort((a, b) => {
        const rateA = parseFloat(a.rate);
        const rateB = parseFloat(b.rate);

        const isANegotiable = isNaN(rateA);
        const isBNegotiable = isNaN(rateB);

        if (isANegotiable && isBNegotiable) return 0;
        if (isANegotiable) return 1;
        if (isBNegotiable) return -1;

        return rateA - rateB;
      });
    } else if (sortBy === "projects") {
      filteredAndSortedDevs.sort(
        (a, b) => b.completedJobs.length - a.completedJobs.length
      );
    }

    filteredAndSortedDevs = filteredAndSortedDevs.slice(0, showCount);
    setDevs(filteredAndSortedDevs);
  };

  const chunkArray = (array, size) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const roleRows = chunkArray(jobRoles, 2);

  return (
    <div>
      <Nav />
      <div className="xl:px-20 lg:px-10 px-5 my-5 xl:my-10 space-y-8">
        <div className="relative">
          <div className="absolute inset-0 -z-10 mx-auto w-[300px] h-[50px] lg:w-[600px]  bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] rounded-full blur-3xl opacity-50"></div>
          <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
            Find <span className="text-green">Talent </span>
          </h1>
        </div>

        <div className="flex">
          <aside className="w-80 bg-[#23a6f0] text-white p-4 rounded-md">
            <div className="flex flex-col mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>Show:</span>
                  <select
                    className="w-20 bg-white text-black px-2 py-1 border rounded-md"
                    onChange={handleShowChange}
                    value={showCount}
                  >
                    <option value="16">16</option>
                    <option value="32">32</option>
                    <option value="48">48</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span>Sort:</span>
                  <select
                    className="w-24 bg-white text-black px-2 py-1 border rounded-md"
                    onChange={handleSortChange}
                    value={sortBy}
                  >
                    <option value="default">Default</option>
                    <option value="rate">Hourly Rate</option>
                    <option value="projects">Projects</option>
                  </select>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Filter Options</h2>

            <div className="mb-4">
              <span>Roles:</span>
              <div className="">
                {roleRows.map((row, index) => (
                  <div className="flex justify-between" key={index}>
                    {row.map((role) => (
                      <label
                        key={role}
                        className="flex items-center gap-1 text-sm w-1/2"
                      >
                        <input
                          type="checkbox"
                          value={role}
                          checked={selectedRoles.includes(role)}
                          onChange={handleRoleChange}
                          className="mr-1"
                        />
                        {role}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <span>Salary Range:</span>
              <div className="flex flex-col">
                <input
                  type="number"
                  name="min"
                  placeholder="Min"
                  value={salaryRange.min}
                  onChange={handleSalaryChange}
                  className="w-full bg-white text-black px-2 py-1 border rounded-md mb-2"
                />
                <input
                  type="number"
                  name="max"
                  placeholder="Max"
                  value={salaryRange.max}
                  onChange={handleSalaryChange}
                  className="w-full bg-white text-black px-2 py-1 border rounded-md"
                />
              </div>
            </div>

            <div className="mb-4">
              <span>Project Range:</span>
              <div className="flex flex-col">
                <input
                  type="number"
                  name="min"
                  placeholder="Min"
                  value={projectRange.min}
                  onChange={handleProjectChange}
                  className="w-full bg-white text-black px-2 py-1 border rounded-md mb-2"
                />
                <input
                  type="number"
                  name="max"
                  placeholder="Max"
                  value={projectRange.max}
                  onChange={handleProjectChange}
                  className="w-full bg-white text-black px-2 py-1 border rounded-md"
                />
              </div>
            </div>
          </aside>

          <main className="flex-1 pl-4">
            <div>
              <span>
                Showing {devs.length} of {allDevs.length} results
              </span>
            </div>
            <div className="grid lg:grid-cols-2 gap-5 ">
              {devs &&
                devs.map((element) => {
                  return <TalentCard key={element._id} dev={element} />;
                })}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
