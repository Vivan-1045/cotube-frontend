import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetails } from "../api/room";
import Participants from "../component/Participants";
import VideoPlayer from "../component/VideoPlayer";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoom();
  }, []);

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

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading room...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            {room.roomName}
          </h1>

          <p className="text-gray-500">
            Room ID: {room.roomId}
          </p>

          <p className="text-gray-500">
            Host: {room.hostName}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-4 gap-6 mt-8">

        <div className="col-span-3">
          <VideoPlayer />
        </div>

        <div className="col-span-1">
          <Participants roomId={room.roomId} />
        </div>

      </div>

    </div>
  );
}