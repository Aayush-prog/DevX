import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import Nav from "../Nav";
import Footer from "../Footer";
import axios from "axios";
import { FaFolderOpen } from "react-icons/fa";
import { FaFolderClosed } from "react-icons/fa6";
import { IoCodeWorking } from "react-icons/io5";

function ClientHome() {
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);

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
        console.log(response.data.data);
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
      {user && (
        <div className="xl:px-20 lg:px-10 px-5 mt-5 xl:mt-10 xl:space-y-20 space-y-8">
          <div className="relative">
            <div className="absolute inset-0 -z-10 mx-auto w-[300px] h-[50px] lg:w-[600px]  bg-gradient-to-r from-[#4A90E2] to-[#50E3C2] rounded-full blur-3xl opacity-50"></div>
            <h1 className="mx-auto w-1/2 text-center text-xl lg:text-3xl xl:text-4xl 2xl:text-6xl font-bold ">
              Welcome <span className="text-blue">{user.name} </span> !
            </h1>
          </div>
          <div className="space-y-14">
            <h1 className="text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold">
              Here are your insights
            </h1>
            <div className="grid grid-cols-3 gap-3 items-center">
              <div className="flex items-center gap-5 ">
                <FaFolderOpen className="text-green text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold" />
                <h1 className="2xl:text-2xl xl:text-xl font-semibold  ">
                  {user.openJobs.length}
                </h1>
              </div>
              <div>
                <IoCodeWorking className=" text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold" />
              </div>
              <div>
                <FaFolderClosed className="text-green text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold" />
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

function DevHome() {
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/developer/dashboard",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setUser(response.data.data);
        console.log(response.data.data);
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
      <div>
        <h2>Welcome, Developer!</h2>
        <p>Here's your personalized developer dashboard.</p>
        <p>{user ? user.name : "aaudai cha"}</p>
      </div>
      <Footer />
    </div>
  );
}

export default function Home() {
  const { role } = useContext(AuthContext);

  if (role === "client") {
    return <ClientHome />;
  }

  if (role === "developer") {
    return <DevHome />;
  }

  return <div>Loading...</div>; // Or some default component
}
