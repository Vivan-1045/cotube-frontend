import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Profile from "./Profile";
import logo from "../assets/cotube-logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed left-3 right-3 top-3 z-50 overflow-hidden rounded-2xl bg-transparent">
      <div className="absolute inset-0 -z-10 rounded-2xl bg-white/[0.01] backdrop-blur-sm" />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-3 sm:h-24 sm:px-6 lg:px-8">

        <Link
          to="/"
          className="flex h-full items-center transition-transform duration-200 hover:scale-105"
        >
          <img
            src={logo}
            alt="CoTube"
            className="h-16 w-16 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
          />
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-1.5 sm:gap-3">

          {user ? (
            <>
              <span className="hidden text-sm font-medium text-slate-400 sm:block">
                Hi, {user.username}
              </span>

              <Link
                to="/profile"
                className="rounded-xl border border-slate-700/50 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-blue-500/40 hover:bg-white/[0.06] hover:text-white sm:px-3.5 sm:text-sm"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-xl border border-red-500/25 bg-red-500/[0.04] px-3 py-2 text-xs font-medium text-red-400 transition hover:border-red-500/50 hover:bg-red-500/[0.08] hover:text-red-300 sm:px-3.5 sm:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white sm:px-3.5 sm:text-sm"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-blue-500/30 bg-blue-500/[0.06] px-3 py-2 text-xs font-medium text-blue-400 transition hover:border-blue-500/50 hover:bg-blue-500/[0.12] hover:text-blue-300 sm:px-3.5 sm:text-sm"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
