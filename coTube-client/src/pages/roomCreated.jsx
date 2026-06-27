import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

export default function RoomCreated() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Room not found</h2>
      </div>
    );
  }

  const { roomId } = state;

  const joinUrl = `${window.location.origin}/room/${roomId}`;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow rounded bg-white text-center">

      <h1 className="text-3xl font-bold mb-6">
        🎉 Room Created
      </h1>

      <p className="mb-2 text-gray-600">
        Share this Room ID
      </p>

      <div className="border rounded p-3 font-mono text-lg">
        {roomId}
      </div>

      <button
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => navigator.clipboard.writeText(roomId)}
      >
        Copy Room ID
      </button>

      <div className="flex justify-center mt-8">
        <QRCode value={joinUrl} size={220} />
      </div>

      <p className="text-sm mt-4 text-gray-500 break-all">
        {joinUrl}
      </p>

      <button
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
        onClick={() => navigate(`/room/${roomId}`)}
      >
        Enter Room
      </button>

    </div>
  );
}