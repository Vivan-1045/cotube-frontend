import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    passWord: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(form);
      sessionStorage.setItem("verificationEmail",form.email);
      
      toast.success(res.data);

      navigate("/verify-email", {
        state: {
          email: form.email,
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
  <div className="cotube-page">
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Create Account
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Create your CoTube account and start watching together.
          </p>

        </div>

    
        <form
          onSubmit={handleSubmit}
          className="cotube-card space-y-6 p-6 sm:p-8"
        >

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Username
            </label>

            <input
              placeholder="Choose a username"
              required
              onChange={(e) =>
                setForm({
                  ...form,
                  userName: e.target.value,
                })
              }
              className="cotube-input"
            />
          </div>

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
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a strong password"
              required
              minLength={8}
              title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
              onChange={(e) =>
                setForm({
                  ...form,
                  passWord: e.target.value,
                })
              }
              className="cotube-input"
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              At least 8 characters with uppercase, lowercase, number and
              special character.
            </p>
          </div>

          <button
            type="submit"
            className="cotube-join-btn w-full"
          >
            Create Account
          </button>

          <div className="border-t border-slate-800/80 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Already have an account?
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="ml-1.5 font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                Login
              </button>
            </p>

          </div>

        </form>

        <p className="mt-6 text-center text-xs text-slate-600">
          Create your room • Invite your friends • Watch together
        </p>

      </div>

    </main>
  </div>
);
}
