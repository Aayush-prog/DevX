import React, { useContext, useEffect } from "react";
import AuthContext from "../AuthContext";
import Nav from "../Nav";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ClientHome({ authToken, role }) {
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
    fetchProfile();
  }, []);
  return (
    <div>
      <Nav />
      <div>
        <h2>Welcome, Client!</h2>
        <p>Here's your personalized client dashboard.</p>
        <p>{user}</p>
      </div>
      <Footer />
    </div>
  );
}
function DevHome({ authToken, role }) {
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
      } catch (e) {
        console.log(e);
      }
    };
    fetchProfile();
  }, []);
  return (
    <div>
      <Nav />
      <div>
        <h2>Welcome, Developer!</h2>
        <p>Here's your personalized developer dashboard.</p>
        <p>{user}</p>
      </div>
      <Footer />
    </div>
  );
}
export default function Home() {
  const { authToken, role } = useContext(AuthContext);
  if (role === "client") {
    return <ClientHome authToken={authToken} role={role} />;
  }

  if (role === "developer") {
    return <DevHome authToken={authToken} role={role} />;
  }
}
