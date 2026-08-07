import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetails, joinParticipant, leaveParticipant, getParticipants } from "../api/room";
import { connectSocket, disconnectSocket, subscribeSync, subscribeRoom, subscribeChat, sendMessage, subscribeChatError } from "../websocket/stompClient";
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
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");

  useEffect(() => {

    const connect = async () => {
      try {
        const token = localStorage.getItem("token");

        await joinParticipant(roomId);
        const res = await getParticipants(roomId);
        setParticipants(res.data);

        connectSocket(token, () => {

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

              case "USER_JOINED":
                setParticipants(event.participants);
                break;

              case "USER_LEFT":
                setParticipants(event.participants);
                break;

              default:
                break;
            }
          });

          subscribeChat(roomId, (message) => {
            setMessages((prev) => [...prev, message]);
          });

          subscribeSync((response) => {
            if (response.action === "SYNC_RESPONSE") {
              setVideoId(response.videoId ?? null);
            }
          });

          subscribeChatError((errorMsg) => {
            alert(errorMsg.errMsg);
          });

          sendMessage("/app/video.sync", {
            roomId,
            action: "SYNC_REQUEST",
          });
        });
      } catch (err) {
        navigate("/");
      }
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

  const handleSendMessage = () => {
    if (!chatMessage) {
      return;
    }

    sendMessage("/app/chat.send", {
      roomId,
      message: chatMessage.trim(),
    });

    setChatMessage("");
  }

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
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

          <Participants
            participants={participants}
            host={room.hostName}
          />

          <div className="border rounded mt-6 p-4">

            <h2 className="font-bold text-lg mb-3">
              Chat
            </h2>

            <div className="h-64 overflow-y-auto border rounded p-2 mb-3 space-y-2">

              {messages.map((msg, index) => {

                const isSender = msg.sender === user?.userName;

                return (
                  <div
                    key={index}
                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl ${isSender
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                    >
                      <div className="text-xs font-semibold mb-1 opacity-70">
                        {msg.sender}
                      </div>

                      <div className="break-words">
                        {msg.message}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>

            <div className="flex gap-2">

              <input
                className="border rounded p-2 flex-1"
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) =>
                  setChatMessage(e.target.value)
                }
                onKeyDown={handleChatKeyDown}
              />

              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-3 py-2 rounded"
              >
                Send
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
