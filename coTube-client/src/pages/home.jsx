import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom, joinParticipant } from "../api/room";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");
  const [roomCapacity,setRoomCapacity] = useState("");

  const [roomPassword, setRoomPassword] = useState("");

  const handleCreate = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if(!roomName.trim()){
      alert("Room name is required.");
      return;
    }

    if(!roomCapacity){
      alert("Select the room capacity.");
      return;
    }

    if (roomCapacity < 2 || roomCapacity > 20) {
      alert("Room capacity must be between 2 and 20.");
      return;
    }


    try {
      const res = await createRoom({
        roomName,
        isPrivate: roomPassword.trim() !== "",
        passWord: roomPassword,
        maxRoomCapacity: roomCapacity
      });

      await joinParticipant(res.data.roomId);

      navigate("/room-created", {
        state: {
          roomId: res.data.roomId,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Unable to create room");
    }
  };

  const handleJoin = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if(!roomCode.trim()){
      alert("Room code is required to join the room.");
      return;
    }

    try {

      await joinRoom(roomCode, password);

      navigate(`/room/${roomCode}`);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to join room");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 space-y-6">
      <h1 className="text-3xl font-bold text-center">CoTube</h1>

      <div className="border rounded p-4">
        <h2 className="font-semibold mb-3">Create Room</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Password (optional)"
          value={roomPassword}
          onChange={(e) => setRoomPassword(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Room capacity."
          type="number"
          min={2}
          max={20}
          value={roomCapacity}
          onChange={(e) =>{
            const val = Number(e.target.value);

            if(val>20){
              alert("Maximum allowed room capacity is 20.");
              return;
            }

            if(val<2){
              alert("Select room capacity atleast 2.");
              return;
            }

            setRoomCapacity(val);
          }}
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Create Room
        </button>
      </div>

      <div className="border rounded p-4">
        <h2 className="font-semibold mb-3">Join Room</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleJoin}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
