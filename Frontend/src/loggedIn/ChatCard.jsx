import React, { useContext } from "react";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function ChatCard({ user }) {
  const { id } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/chat?currentUser=${id}&chatUser=${user._id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 w-full max-w-sm mx-auto cursor-pointer hover:shadow-lg transition duration-200"
      onClick={handleChatClick}
    >
      {user && (
        <>
          <div className="flex items-center mb-2">
            <FaUser className="text-gray-500 mr-2" />
            <div className="text-lg font-semibold text-gray-800">
              {user.name}
            </div>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="text-gray-500 mr-2" />
            <div className="text-sm text-gray-600">{user.email}</div>
          </div>
        </>
      )}
    </div>
  );
}
