import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetails, joinParticipant, leaveParticipant, getParticipants } from "../api/room";
import { connectSocket, disconnectSocket, subscribeSync, subscribeRoom, subscribeChat, sendMessage, subscribeChatError } from "../websocket/stompClient";
import Participants from "../component/Participants";
import VideoPlayer from "../component/VideoPlayer";
import { extractVideoId } from "../utils/youtube";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

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
            toast.error(errorMsg.errMsg);
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
      toast.error("Room not found");
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
      toast.error("Invalid YouTube URL");
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
    return (
      <div className="min-h-screen bg-[#070b18] flex items-center justify-center">
        <div className="text-slate-300 text-sm">
          Loading room...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b18] text-white">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.08),transparent_30%)]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      <main className="relative mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {room.roomName}
            </h1>

            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 sm:text-sm">
              <span>
                Room ID:{" "}
                <span className="text-slate-400">
                  {room.roomId}
                </span>
              </span>

              <span>
                Host:{" "}
                <span className="text-slate-400">
                  {room.hostName}
                </span>
              </span>
            </div>
          </div>

        </div>



        {user?.userName === room.hostName && (
          <div className="mb-5 rounded-2xl border border-slate-800/80 bg-[#0b1224]/90 p-3 shadow-xl sm:p-4">

            <div className="flex flex-col gap-2 sm:flex-row">

              <input
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate-700/70 bg-[#070d1d] px-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                placeholder="Paste YouTube URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />

              <button
                onClick={handleLoadVideo}
                className="h-11 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.98]"
              >
                Load Video
              </button>

            </div>
          </div>
        )}


        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">


          <section className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

              <div className="flex items-center justify-between border-b border-slate-800/70 bg-[#0b1224] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  <span className="text-sm font-medium text-slate-300">
                    Watch Together
                  </span>
                </div>

                <span className="text-xs text-slate-500">
                  Live Sync
                </span>
              </div>

              <div className="w-full bg-black">
                <div className="relative w-full aspect-video">
                  <VideoPlayer
                    videoId={videoId}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    remoteAction={remoteAction}
                  />
                </div>
              </div>

            </div>
          </section>


          <aside className="min-w-0 space-y-5">

            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1224]/90 shadow-xl">

              <div className="border-b border-slate-800/70 px-4 py-3">

                <h2 className="text-sm font-semibold text-white">
                  Participants
                </h2>

              </div>

              <div className="p-4">
                <Participants
                  participants={participants}
                  host={room.hostName}
                />
              </div>

            </div>



            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1224]/90 shadow-xl">

              <div className="border-b border-slate-800/70 px-4 py-3">

                <div className="flex items-center justify-between">

                  <h2 className="text-sm font-semibold text-white">
                    Live Chat
                  </h2>

                  <span className="text-xs text-slate-500">
                    {messages.length} messages
                  </span>

                </div>

              </div>


              <div className="h-64 overflow-y-auto p-3 sm:h-72">

                {messages.length === 0 ? (

                  <div className="flex h-full items-center justify-center text-center">

                    <p className="text-xs text-slate-600">
                      No messages yet.
                      <br />
                      Start the conversation.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-3">

                    {messages.map((msg, index) => {

                      const isSender =
                        msg.sender === user?.userName;

                      return (
                        <div
                          key={index}
                          className={`flex ${isSender
                              ? "justify-end"
                              : "justify-start"
                            }`}
                        >

                          <div
                            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${isSender
                                ? "rounded-br-md bg-blue-600 text-white"
                                : "rounded-bl-md bg-slate-800 text-slate-200"
                              }`}
                          >

                            <div
                              className={`mb-1 text-[10px] font-semibold ${isSender
                                  ? "text-blue-100"
                                  : "text-slate-500"
                                }`}
                            >
                              {msg.sender}
                            </div>

                            <div className="break-words leading-5">
                              {msg.message}
                            </div>

                          </div>

                        </div>
                      );
                    })}

                  </div>

                )}

              </div>


              <div className="border-t border-slate-800/70 p-3">

                <div className="flex gap-2">

                  <input
                    className="min-w-0 flex-1 rounded-xl border border-slate-700/70 bg-[#070d1d] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/60"
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) =>
                      setChatMessage(e.target.value)
                    }
                    onKeyDown={handleChatKeyDown}
                  />

                  <button
                    onClick={handleSendMessage}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 active:scale-95"
                  >
                    Send
                  </button>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>
    </div>
  );
}
