export default function Participants({ participants, host }) {
  return (
    <div className="space-y-2">
      {participants.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-600">
          No participants yet.
        </div>
      ) : (
        participants.map((p) => {
          const isHost = p.userName === host;

          return (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-[#070d1d]/70 px-3 py-2.5 transition hover:border-slate-700"
            >
              <div className="flex min-w-0 items-center gap-3">
                {/* Avatar */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    isHost
                      ? "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {p.userName?.charAt(0)?.toUpperCase() || "?"}
                </div>

                {/* Name */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {p.userName}
                  </p>

                  {isHost && (
                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-blue-400">
                      Host
                    </p>
                  )}
                </div>
              </div>

              {/* Online indicator */}
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                title="Online"
              />
            </div>
          );
        })
      )}
    </div>
  );
}