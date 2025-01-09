import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const Chat = () => {
  const [searchParams] = useSearchParams();

  const currentUserId = searchParams.get("currentUser");
  const chatWithUserId = searchParams.get("chatUser");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    // Start the chat by creating or joining a room
    const generatedRoomId = [currentUserId, chatWithUserId].sort().join("_");
    setRoomId(generatedRoomId);

    socket.emit("start_chat", {
      userId1: currentUserId,
      userId2: chatWithUserId,
    });

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Clean up when component unmounts
    return () => {
      socket.off("receive_message");
    };
  }, [currentUserId, chatWithUserId]);

  const sendMessage = () => {
    socket.emit("send_message", { roomId, message, senderId: currentUserId });
    setMessages((prev) => [...prev, { senderId: currentUserId, message }]);
    setMessage("");
  };

  return (
    <div>
      <h1>Chat with User {chatWithUserId}</h1>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.senderId}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
