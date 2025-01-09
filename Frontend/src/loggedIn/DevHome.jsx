import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import Nav from "../Nav";
import Footer from "../Footer";
import axios from "axios";
import { FaFolderOpen } from "react-icons/fa";
import { FaFolderClosed } from "react-icons/fa6";
import { IoCodeWorking } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
export default function DevHome() {
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
