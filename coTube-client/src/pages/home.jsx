import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom, joinParticipant } from "../api/room";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("");

  const [roomPassword, setRoomPassword] = useState("");

  const handleCreate = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!roomName.trim()) {
      toast.error("Room name is required.");
      return;
    }

    const capacity = Number(roomCapacity);

    if (!roomCapacity) {
      toast.error("Select the room capacity.");
      return;
    }

    if (capacity < 2 || capacity > 20) {
      toast.error("Room capacity must be between 2 and 20.");
      return;
    }


    try {
      const res = await createRoom({
        roomName,
        isPrivate: roomPassword.trim() !== "",
        passWord: roomPassword,
        maxRoomCapacity: capacity
      });

      await joinParticipant(res.data.roomId);

      navigate("/room-created", {
        state: {
          roomId: res.data.roomId,
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to create room");
    }
  };

  const handleJoin = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!roomCode.trim()) {
      toast.error("Room code is required to join the room.");
      return;
    }

    try {

      await joinRoom(roomCode, password);

      navigate(`/room/${roomCode}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to join room");
    }
  };

  return (
    <div className="cotube-page">

      <main className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">

        <div className="w-full">

          <div className="mb-12 text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.06] px-4 py-2 text-xs font-medium tracking-wide text-blue-300">

              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />

              WATCH TOGETHER • IN REAL TIME

            </div>

            <h3 className="text-5xl font-extrabold tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">

              Watch Together.

              <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">

                Anywhere.

              </span>

            </h3>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">

              Create a private room, invite your friends,
              and enjoy YouTube together with perfectly
              synchronized playback.

            </p>

          </div>


          <div className="grid gap-6 md:grid-cols-2">

            <div className="cotube-card p-6 sm:p-8">

              <div className="mb-7">

                <div className="cotube-create-icon mb-4">

                  <span className="text-xl">
                    ✨
                  </span>

                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Create a Room
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Start a watch party and invite your friends.
                </p>

              </div>


              <div className="space-y-5">

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Room Name
                  </label>

                  <input
                    className="cotube-input"
                    placeholder="My watch party"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">

                    Password

                    <span className="ml-2 text-xs font-normal text-slate-500">
                      Optional
                    </span>

                  </label>

                  <input
                    type="password"
                    className="cotube-input"
                    placeholder="Protect your room"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Room Capacity
                  </label>

                  <input
                    className="cotube-input"
                    type="number"
                    min={2}
                    max={20}
                    placeholder="2 - 20 people"
                    value={roomCapacity}
                    onChange={(e) => {

                      const value = e.target.value;

                      if (value === "") {
                        setRoomCapacity("");
                        return;
                      }

                      const val = Number(value);

                      if (val > 20) {
                        toast.error(
                          "Maximum allowed room capacity is 20."
                        );
                        return;
                      }

                      setRoomCapacity(value);

                    }}
                  />

                </div>

                <button
                  onClick={handleCreate}
                  className="cotube-primary-btn w-full"
                >
                  <span className="mr-2 text-lg">+</span>
                  Create Room
                </button>

              </div>

            </div>

            <div className="cotube-card p-6 sm:p-8">

              <div className="mb-7">

                <div className="cotube-join-icon mb-4">

                  <span className="text-xl">
                    🚀
                  </span>

                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Join a Room
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Enter a room code and join the watch party.
                </p>

              </div>


              <div className="space-y-5">

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Room Code
                  </label>

                  <input
                    className="cotube-input"
                    placeholder="Enter room code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                  />

                </div>



                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">

                    Password

                    <span className="ml-2 text-xs font-normal text-slate-500">
                      Optional
                    </span>

                  </label>

                  <input
                    type="password"
                    className="cotube-input"
                    placeholder="Enter room password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                </div>


                <div className="pt-1">

                  <button
                    onClick={handleJoin}
                    className="cotube-join-btn w-full"
                  >
                    Join Room
                  </button>

                </div>

              </div>

            </div>

          </div>



          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">

            <span>Real-time sync</span>

            <span className="h-1 w-1 rounded-full bg-slate-700" />

            <span>Live chat</span>

            <span className="h-1 w-1 rounded-full bg-slate-700" />

            <span>Private rooms</span>

          </div>

        </div>

      </main>

    </div>
  );
}
