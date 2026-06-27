import { useEffect, useState } from "react";
import { getProfile } from "../api/profileApi";
import { deleteRoom } from "../api/room";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    const confirmDelete = window.confirm(
      "Delete this room permanently?"
    );

    if (!confirmDelete) return;

    try {
      await deleteRoom(roomId);

      setProfile((prev) => ({
        ...prev,
        totalRoomsCreated: prev.totalRoomsCreated - 1,
        rooms: prev.rooms.filter((room) => room.roomId !== roomId),
      }));

      alert("Room deleted successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete room");
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6">

      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>

      <div className="border rounded-lg p-5 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          User Information
        </h2>

        <p><strong>Username:</strong> {profile.userName}</p>

        <p><strong>Email:</strong> {profile.email}</p>

        <p><strong>Total Rooms Created:</strong> {profile.totalRoomsCreated}</p>

        <p><strong>Active Rooms:</strong> {profile.activeRooms}</p>

      </div>

      <div className="border rounded-lg p-5">

        <h2 className="text-xl font-semibold mb-4">
          Rooms Created
        </h2>

        {profile.rooms.length === 0 ? (
          <p>No rooms created.</p>
        ) : (
          profile.rooms.map((room) => (
            <div
              key={room.roomId}
              className="flex justify-between items-center border rounded p-3 mb-3"
            >
              <div>
                <p className="font-semibold">{room.roomName}</p>

                <p className="text-sm text-gray-500">
                  {room.roomId}
                </p>

                <p className="text-sm">
                  {room.active ? "🟢 Active" : "🔴 Closed"}
                </p>
              </div>

              <button
                onClick={() => handleDelete(room.roomId)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}