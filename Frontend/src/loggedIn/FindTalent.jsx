import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../Nav";
import Footer from "../Footer";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import TalentCard from "./TalentCard";
export default function FindWork() {
  const api = import.meta.env.VITE_URL;
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [devs, setDevs] = useState([]);
  useEffect(() => {
    const fetchJobs = async () => {
      console.log("fetching devs");
      const response = await axios.get(`${api}/developer/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setDevs(response.data.data);
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
            Find <span className="text-green">Talent </span>
          </h1>
        </div>
        <div className="grid lg:grid-cols-2 ">
          {devs &&
            devs.map((element) => {
              console.log(element);
              return <TalentCard dev={element} />;
            })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
