import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import Nav from "../Nav";
import Footer from "../Footer";
import axios from "axios";

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
        <h2>Welcome, Client!</h2>
        <p>Here's your personalized client dashboard.</p>
        <p>{user ? user.name : "aaudai cha"}</p>
      </div>
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
