import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import toast from "react-hot-toast";

export default function RoomCreated() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    toast.error("Room not found.");
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Room not found</h2>
      </div>
    );
  }

  const { roomId } = state;

  const joinUrl = `${window.location.origin}/room/${roomId}`;

  return (
    <div className="cotube-page">
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">

        <div className="w-full max-w-lg">

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] text-3xl">
              ✓
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Room Created
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Your watch room is ready. Share the room ID or QR code
              with your friends to invite them.
            </p>

          </div>

          <div className="cotube-card p-6 sm:p-8">

            <div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Room ID
              </p>

              <div className="flex items-center gap-2">

                <div className="flex h-12 min-w-0 flex-1 items-center rounded-xl border border-slate-700/70 bg-slate-900/60 px-4 font-mono text-sm text-slate-200 sm:text-base">
                  <span className="truncate">
                    {roomId}
                  </span>
                </div>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(roomId)
                  }
                  className="h-12 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 text-sm font-semibold text-blue-300 transition-all duration-200 hover:border-blue-400/30 hover:bg-blue-500/15 hover:text-blue-200 active:scale-[0.97]"
                >
                  Copy
                </button>

              </div>

            </div>

            <div className="my-7 h-px bg-slate-800/80" />

            <div className="text-center">

              <p className="text-sm font-semibold text-slate-300">
                Scan to Join
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Your friends can scan this QR code to open the room.
              </p>

              <div className="mx-auto mt-5 flex h-[236px] w-[236px] items-center justify-center rounded-2xl border border-slate-700/70 bg-white p-2 shadow-2xl shadow-black/30">
                <QRCode
                  value={joinUrl}
                  size={220}
                />
              </div>

            </div>


            <div className="mt-6">

              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Invite Link
              </p>

              <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 px-4 py-3">

                <p className="break-all text-xs leading-5 text-slate-400">
                  {joinUrl}
                </p>

              </div>

            </div>

            <button
              className="cotube-primary-btn mt-6 w-full"
              onClick={() => navigate(`/room/${roomId}`)}
            >
              Enter Room
              <span className="ml-2">→</span>
            </button>

          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Share the code • Scan the QR • Start watching together
          </p>

        </div>

      </main>
    </div>
  );
}