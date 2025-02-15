import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import * as TwilioVideo from "twilio-video";

const Call = () => {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { authToken } = useContext(AuthContext);
  const [twilioRoom, setTwilioRoom] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoContainerRef = useRef(null);
  const api = import.meta.env.VITE_URL;

  const handleRoomNameChange = (e) => setRoomName(e.target.value);

  const connectToRoom = async (token) => {
    setLoading(true);
    setMessage("");
    try {
      const room = await TwilioVideo.connect(token, {
        name: roomName,
        audio: true,
        video: true,
      });
      setTwilioRoom(room);
      console.log("Connected to Twilio Room:", room);

      room.localParticipant.tracks.forEach((publication) => {
        if (publication.track) {
          if (publication.track.kind === "video") {
            publication.track.attach(localVideoRef.current);
          } else if (publication.track.kind === "audio") {
            publication.track.enable();
          }
        }
      });

      room.participants.forEach((participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed) {
            handleTrackSubscribed(publication.track, participant);
          }
        });
        participant.on("trackSubscribed", (track) =>
          handleTrackSubscribed(track, participant)
        );
        participant.on("trackUnsubscribed", handleTrackUnsubscribed);
      });

      room.on("participantConnected", (participant) => {
        participant.on("trackSubscribed", (track) =>
          handleTrackSubscribed(track, participant)
        );
        participant.on("trackUnsubscribed", handleTrackUnsubscribed);
      });

      room.on("participantDisconnected", (participant) => {
        setRemoteParticipants((prev) => {
          const newParticipants = new Map(prev);
          newParticipants.delete(participant.sid);
          return newParticipants;
        });
      });
    } catch (error) {
      console.error("Error connecting to Twilio room:", error);
      setMessage(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubscribed = (track, participant) => {
    console.log("Track Subscribed:", track, participant);

    if (track.kind === "video") {
      let existingVideo = remoteVideoContainerRef.current.querySelector(
        `[data-participant="${participant.sid}"]`
      );
      if (!existingVideo) {
        const videoElement = document.createElement("video");
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.setAttribute("data-participant", participant.sid);
        track.attach(videoElement);
        remoteVideoContainerRef.current.appendChild(videoElement);
      }
    } else if (track.kind === "audio") {
      let existingAudio = document.querySelector(
        `audio[data-participant="${participant.sid}"]`
      );
      if (!existingAudio) {
        const audioElement = document.createElement("audio");
        audioElement.autoplay = true;
        audioElement.setAttribute("data-participant", participant.sid);
        track.attach(audioElement);
        document.body.appendChild(audioElement);
      }
    }
  };

  const handleTrackUnsubscribed = (track) => {
    track.detach().forEach((element) => element.remove());
  };

  const disconnectFromRoom = () => {
    if (twilioRoom) {
      twilioRoom.disconnect();
      setTwilioRoom(null);
    }
  };

  const joinRoom = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        `${api}/join-room`,
        { roomName },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const { token } = response.data;
      await connectToRoom(token);
    } catch (error) {
      console.error("Error Joining Room:", error);
      setMessage(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Connect to Room
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Room Name
          </label>
          <input
            className="shadow border rounded w-full py-2 px-3 text-gray-700"
            type="text"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={handleRoomNameChange}
          />
        </div>
        {twilioRoom ? (
          <div className="flex flex-col items-center">
            <h4 className="text-lg font-bold">Local Video</h4>
            <video
              ref={localVideoRef}
              autoPlay
              className="border w-[320px] h-[240px] m-4"
            />
            <h4 className="text-lg font-bold">Remote Participants</h4>
            <div
              ref={remoteVideoContainerRef}
              className="flex flex-wrap m-4"
            ></div>
            <button
              className="bg-red text-white font-bold py-2 px-4 rounded mt-4"
              onClick={disconnectFromRoom}
            >
              Leave Room
            </button>
          </div>
        ) : (
          <button
            className="bg-blue text-white font-bold py-2 px-4 rounded"
            onClick={joinRoom}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Join Room"}
          </button>
        )}
        {message && <div className="mt-4 text-red-600">{message}</div>}
      </div>
    </div>
  );
};

export default Call;
