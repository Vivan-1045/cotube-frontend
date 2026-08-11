import { useState } from "react";
import { loginUser as apiLoginUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    passWord: "",
  });

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiLoginUser(form);

      loginUser(res.data);
      toast.success("Login Successful");
      navigate("/");
    } catch (err) {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className="cotube-page">
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">

        <div className="w-full max-w-md">

          <div className="mb-8 text-center">

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome Back
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Login to continue to your CoTube account.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="cotube-card space-y-6 p-6 sm:p-8"
          >

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="cotube-input"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">

                <label className="block text-sm font-medium text-slate-300">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                  Forgot Password?
                </button>

              </div>

              <input
                type="password"
                placeholder="Enter your password"
                required
                onChange={(e) =>
                  setForm({
                    ...form,
                    passWord: e.target.value,
                  })
                }
                className="cotube-input"
              />
            </div>

            <button
              type="submit"
              className="cotube-primary-btn w-full"
            >
              Login
            </button>

            <div className="border-t border-slate-800/80 pt-6 text-center">

              <p className="text-sm text-slate-500">
                Don't have an account?
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="ml-1.5 font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                  Register
                </button>
              </p>

            </div>

          </form>

          <p className="mt-6 text-center text-xs text-slate-600">
            Watch together • Stay synchronized • Have fun
          </p>

        </div>

      </main>
    </div>
  );
}
