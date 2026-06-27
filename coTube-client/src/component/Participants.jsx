import { useEffect, useState } from "react";
import { getParticipants } from "../api/room";

export default function Participants({ roomId }) {

  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    loadParticipants();
  }, [roomId]);

  const loadParticipants = async () => {
    try {
      const res = await getParticipants(roomId);
      setParticipants(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="border rounded-lg p-4">

      <h2 className="font-bold mb-3">
        Participants ({participants.length})
      </h2>

      {participants.map((p) => (
        <div
          key={p.id}
          className="border-b py-2"
        >
          {p.user.userName}
        </div>
      ))}

    </div>
  );
}