import { useEffect, useState } from "react";
import { getProfile } from "../api/profileApi";
import { deleteRoom } from "../api/room";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch (err) {
      const msg = (err.response?.data?.message || "Unable to connect to the server. Please try again.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (roomId) => {
    toast.custom(
      (t) => (
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(24, 24, 35, 0.98), rgba(12, 12, 20, 0.98))",
            color: "#fff",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            borderRadius: "18px",
            padding: "18px",
            minWidth: "340px",
            boxShadow: `
            0 24px 70px rgba(0, 0, 0, 0.45),
            0 0 35px rgba(239, 68, 68, 0.10)
          `,
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "600",
                marginBottom: "5px",
              }}
            >
              Delete room?
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              Delete this room permanently?
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
            }}
          >
            <button
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: "8px 14px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await deleteRoomHandler(roomId);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "10px",
                border: "none",
                background: "#ef4444",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      }
    );
  };

  const deleteRoomHandler = async (roomId) => {
    try {
      await deleteRoom(roomId);

      setProfile((prev) => ({
        ...prev,
        totalRoomsCreated: prev.totalRoomsCreated - 1,
        rooms: prev.rooms.filter((room) => room.roomId !== roomId),
      }));

      toast.success("Room deleted successfully.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to delete room"
      );
    }
  };

  if (loading) {
    return (
      <div className="cotube-page">
        <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="text-center">

            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />

            <p className="text-sm font-medium text-slate-300">
              Loading profile...
            </p>

          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cotube-page">
        <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md text-center">

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl">
              ⚠️
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
              Connection Error
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              Unable to load profile
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {error}
            </p>

            <div className="mt-7 flex justify-center gap-3">
              <button
                type="button"
                onClick={loadProfile}
                className="rounded-xl border border-blue-500/30 bg-blue-500/[0.08] px-5 py-2.5 text-sm font-semibold text-blue-400 transition hover:border-blue-500/50 hover:bg-blue-500/[0.14] hover:text-blue-300 active:scale-[0.98]"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-xl border border-slate-700/60 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white active:scale-[0.98]"
              >
                Go Home
              </button>
            </div>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cotube-page">
      <main className="relative z-10 mx-auto min-h-screen max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="mb-10">

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
            Account
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage your account and view your watch rooms.
          </p>

        </div>


        <section className="cotube-card mb-8 p-6 sm:p-8">

          <div className="mb-7 flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-lg font-bold text-blue-300">
              {profile.userName?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                User Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your CoTube account details
              </p>
            </div>

          </div>


          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">

              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Username
              </p>

              <p className="mt-2 truncate text-sm font-semibold text-slate-200">
                {profile.userName}
              </p>

            </div>


            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">

              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Email
              </p>

              <p className="mt-2 truncate text-sm font-semibold text-slate-200">
                {profile.email}
              </p>

            </div>


            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">

              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Rooms Created
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {profile.totalRoomsCreated}
              </p>

            </div>


            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4">

              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Active Rooms
              </p>

              <div className="mt-2 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

                <p className="text-2xl font-bold text-white">
                  {profile.activeRooms}
                </p>

              </div>

            </div>

          </div>


          <div className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-semibold text-slate-200">
                Password
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Keep your account secure by updating your password regularly.
              </p>

            </div>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="shrink-0 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300"
            >
              Change Password →
            </button>

          </div>

        </section>


        <section className="cotube-card p-6 sm:p-8">

          <div className="mb-7 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold tracking-tight text-white">
                Rooms Created
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Rooms you've created on CoTube
              </p>

            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-xs font-medium text-slate-400">
              {profile.rooms.length}{" "}
              {profile.rooms.length === 1 ? "Room" : "Rooms"}
            </div>

          </div>


          {profile.rooms.length === 0 ? (

            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 px-6 py-12 text-center">

              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60 text-xl">
                ◫
              </div>

              <p className="text-sm font-medium text-slate-300">
                No rooms created yet
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Create your first watch room to get started.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {profile.rooms.map((room) => (

                <div
                  key={room.roomId}
                  className="group flex flex-col gap-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="min-w-0">

                    <div className="flex items-center gap-3">

                      <h3 className="truncate text-sm font-semibold text-slate-200">
                        {room.roomName}
                      </h3>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${room.active
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border border-red-500/20 bg-red-500/10 text-red-400"
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${room.active
                            ? "bg-emerald-400"
                            : "bg-red-400"
                            }`}
                        />

                        {room.active ? "Active" : "Closed"}
                      </span>

                    </div>


                    <p className="mt-2 truncate font-mono text-xs text-slate-500">
                      {room.roomId}
                    </p>

                  </div>


                  <button
                    onClick={() => handleDelete(room.roomId)}
                    className="shrink-0 rounded-lg border border-red-500/10 bg-red-500/[0.06] px-4 py-2 text-xs font-semibold text-red-400 transition-all duration-200 hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300 active:scale-[0.97]"
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>

          )}

        </section>


        <p className="mt-6 text-center text-xs text-slate-600">
          Manage your account • Create rooms • Watch together
        </p>

      </main>
    </div>
  );
}