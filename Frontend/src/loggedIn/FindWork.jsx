import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";
import WorkCard from "./WorkCard";
export default function FindWork() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(null);
  useEffect(() => {
    const fetchJobs = async () => {
      const response = await axios.get("http://localhost:8000/jobs/", {
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
      <div className="xl:px-20 lg:px-10 px-5 mt-5 xl:mt-10 space-y-8">
        <div className="relative">
          <div className="absolute inset-0 -z-10 mx-auto w-[300px] h-[50px] lg:w-[600px]  bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] rounded-full blur-3xl opacity-50"></div>
          <h1 className="mx-auto text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
            Find <span className="text-blue">Work </span>
          </h1>
        </div>
        <div>
          {jobs.array.forEach((element) => {
            <WorkCard job={element} />;
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
