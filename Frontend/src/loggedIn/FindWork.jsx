import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";
import WorkCard from "./WorkCard";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
export default function FindWork() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const fetchJobs = async () => {
      console.log("fetching jobs");
      const response = await axios.get(`${api}/jobs`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setJobs(response.data.data);
      console.log(response.data.data);
    };
    fetchJobs();
  }, []);
  return (
    <div>
      <Nav />

      <div className="xl:px-20 lg:px-10 px-5 my-5 xl:my-10 space-y-8">
        <div className="relative">
          <div className="absolute inset-0 -z-10 mx-auto w-[300px] h-[50px] lg:w-[600px]  bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] rounded-full blur-3xl opacity-50"></div>
          <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
            Find <span className="text-blue">Work </span>
          </h1>
        </div>
        <div className="bg-green text-white p-4 rounded-md flex flex-wrap gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-transparent text-white hover:bg-white/20 rounded-md">
              Filter
            </button>
            <span>Showing 1–16 of 32 results</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select className="w-[70px] bg-white text-black px-2 py-1 border rounded-md">
                <option value="16">16</option>
                <option value="32">32</option>
                <option value="48">48</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span>Sort By</span>
              <select className="w-[120px] bg-white text-black px-2 py-1 border rounded-md">
                <option value="default">Default</option>
                <option value="rate">Hourly Rate</option>
                <option value="projects">Projects</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-5 ">
          {jobs &&
            jobs.map((element) => {
              console.log(element);
              return <WorkCard job={element} />;
            })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
