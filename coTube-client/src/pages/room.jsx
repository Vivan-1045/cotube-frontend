import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetails, joinParticipant, leaveParticipant } from "../api/room";
import {
  connectSocket,
  disconnectSocket,
  subscribeSync,
  subscribeRoom,
  sendMessage,
} from "../websocket/stompClient";
import Participants from "../component/Participants";
import VideoPlayer from "../component/VideoPlayer";
import { extractVideoId } from "../utils/youtube";
import { useAuth } from "../context/AuthContext";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoId, setVideoId] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [remoteAction, setRemoteAction] = useState(null);

  useEffect(() => {
    const connect = async () => {
      const token = localStorage.getItem("token");

      await joinParticipant(roomId);

      connectSocket(token, () => {
        console.log("Connected!");

        subscribeRoom(roomId, (event) => {

          if (
            event.sender === user?.email &&
            (
              event.action === "PLAY" ||
              event.action === "PAUSE" ||
              event.action === "SEEK"
            )
          ) {
            return;
          }

          console.log("Room Event", event);

          switch (event.action) {
            case "VIDEO_CHANGE":
              setVideoId(event.videoId);
              break;

            case "PLAY":
              setRemoteAction(event);
              break;

            case "PAUSE":
              setRemoteAction(event);
              break;

            case "SEEK":
              setRemoteAction(event);
              break;

            default:
              break;
          }
        });

        subscribeSync((response) => {
          if (response.action === "SYNC_RESPONSE") {
            setVideoId(response.videoId ?? null);
          }
        });

        sendMessage("/app/video.sync", {
          roomId,
          action: "SYNC_REQUEST",
        });
      });
    };

    connect();

    return () => {
      leaveParticipant(roomId).catch(() => { });
      disconnectSocket();
    };
  }, [roomId]);

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  const loadRoom = async () => {
    try {
      const res = await getRoomDetails(roomId);
      setRoom(res.data);
    } catch (err) {
      alert("Room not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (player) => {
    if (user?.userName !== room.hostName) return;

    sendMessage("/app/video.sync", {
      roomId,
      action: "PLAY",
      currentTime: player.getCurrentTime(),
      playing: true,
      videoId
    });
  };

  const handlePause = (player) => {
    if (user?.userName !== room.hostName) return;

    sendMessage("/app/video.sync", {
      roomId,
      action: "PAUSE",
      currentTime: player.getCurrentTime(),
      playing: false,
      videoId
    });
  };

  const handleLoadVideo = () => {
    const id = extractVideoId(videoUrl);

    if (!id) {
      alert("Invalid YouTube URL");
      return;
    }
    sendMessage("/app/video.sync", {
      roomId,
      action: "VIDEO_CHANGE",
      videoId: id,
      currentTime: 0,
      playing: false,
    });
  };

  if (loading) {
    return <div className="text-center mt-10">Loading room...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{room.roomName}</h1>

          <p className="text-gray-500">Room ID: {room.roomId}</p>

          <p className="text-gray-500">Host: {room.hostName}</p>
        </div>
      </div>
      {user?.userName === room.hostName && (
        <div className="mb-4">
          <input
            className="border p-2 w-full"
            placeholder="Paste YouTube URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          <button
            onClick={handleLoadVideo}
            className="bg-red-600 text-white px-4 py-2 rounded mt-2"
          >
            Load Video
          </button>
        </div>
      )}
      <div className="grid grid-cols-4 gap-6 mt-8">
        <div className="col-span-3">
          <VideoPlayer videoId={videoId} onPlay={handlePlay} onPause={handlePause} remoteAction={remoteAction} />
        </div>

        <div className="col-span-1">
          <Participants roomId={room.roomId} />
        </div>
      </div>
    </div>
  );
}
