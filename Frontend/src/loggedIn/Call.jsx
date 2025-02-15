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
  const [localTrack, setLocalTrack] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoContainerRef = useRef(null);
  const api = import.meta.env.VITE_URL;

  const handleRoomNameChange = (e) => setRoomName(e.target.value);

  // ✅ Creates and attaches local video, runs once on mount
  useEffect(() => {
    const createAndAttachLocalVideo = async () => {
      try {
        console.log("Creating local video track on mount");
        const videoTrack = await TwilioVideo.createLocalVideoTrack();
        setLocalTrack(videoTrack);

        if (localVideoRef.current) {
          console.log("Attaching track to localVideoRef on mount", videoTrack);
          videoTrack.attach(localVideoRef.current);
        }
      } catch (error) {
        console.error("Error creating local video track:", error);
        setMessage("Error accessing camera. Please check permissions.");
      }
    };

    createAndAttachLocalVideo();

    return () => {
      if (localTrack) {
        console.log("Cleaning up localTrack on unmount");
        localTrack.detach().forEach((element) => element.remove());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array means run only once on mount

  // ✅ Attach local video on track and ref changes, handles ref change
  useEffect(() => {
    if (localTrack && localVideoRef.current) {
      console.log(
        "Attaching track to localVideoRef:",
        localTrack,
        localVideoRef.current
      );
      localTrack.attach(localVideoRef.current);
    }
    return () => {
      if (localTrack && localVideoRef.current) {
        console.log("Detaching track from localVideoRef", localTrack);
        localTrack
          .detach(localVideoRef.current)
          .forEach((element) => element.remove());
      }
    };
  }, [localTrack, localVideoRef.current]);

  const connectToRoom = async (token) => {
    console.log("Connecting to room with token:", token);
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

      // ✅ Publish existing local track
      if (localTrack) {
        console.log("Publishing local track", localTrack);
        room.localParticipant.publishTrack(localTrack);
      }

      // ✅ Attach remote participants
      room.participants.forEach(handleParticipant);
      room.on("participantConnected", handleParticipant);
      room.on("participantDisconnected", removeParticipantTracks);
    } catch (error) {
      console.error("Error connecting to Twilio room:", error);
      setMessage(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleParticipant = (participant) => {
    console.log("Participant Connected:", participant);

    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        handleTrackSubscribed(publication.track, participant);
      }
    });

    participant.on("trackSubscribed", (track) =>
      handleTrackSubscribed(track, participant)
    );
    participant.on("trackUnsubscribed", handleTrackUnsubscribed);
  };

  const handleTrackSubscribed = (track, participant) => {
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

  const removeParticipantTracks = (participant) => {
    document
      .querySelectorAll(`[data-participant="${participant.sid}"]`)
      .forEach((element) => element.remove());
  };

  const disconnectFromRoom = () => {
    if (twilioRoom) {
      console.log("Disconnecting from room");
      twilioRoom.disconnect();
      setTwilioRoom(null);
    }
  };

  const joinRoom = async () => {
    console.log("Joining Room with name:", roomName);
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

        <div className="flex flex-col items-center">
          <h4 className="text-lg font-bold">Local Video</h4>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            className="border w-[320px] h-[240px] m-4"
          />
          {twilioRoom && (
            <>
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
            </>
          )}
          {!twilioRoom && (
            <button
              className="bg-blue text-white font-bold py-2 px-4 rounded"
              onClick={joinRoom}
              disabled={loading}
            >
              {loading ? "Connecting..." : "Join Room"}
            </button>
          )}
        </div>
        {message && <div className="mt-4 text-red-600">{message}</div>}
      </div>
    </div>
  );
};

export default Call;
