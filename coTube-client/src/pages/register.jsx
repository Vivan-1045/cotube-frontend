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
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    if (isRegistering) return;
    e.preventDefault();

    setIsRegistering(true);

    try {
      const res = await registerUser(form);
      sessionStorage.setItem("verificationEmail", form.email);

      toast.success(res.data);

      navigate("/verify-email", {
        state: {
          email: form.email,
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    } finally {
      setIsRegistering(false);
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
                placeholder="Enter username here"
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
                placeholder="your@example.com"
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

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  required
                  minLength={8}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                  onFocus={() => setShowPasswordRules(true)}
                  onBlur={() => setShowPasswordRules(false)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      passWord: e.target.value,
                    })
                  }
                  className="cotube-input pr-16"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 transition hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

                {showPasswordRules && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-xl">
                    <p className="mb-2 text-sm font-semibold text-white">
                      Password requirements
                    </p>

                    <div className="space-y-1 text-xs text-slate-400">
                      <p>• At least 8 characters</p>
                      <p>• One uppercase letter</p>
                      <p>• One lowercase letter</p>
                      <p>• One number</p>
                      <p>• One special character</p>
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                At least 8 characters with uppercase, lowercase, number and
                special character.
              </p>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="cotube-primary-btn w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRegistering ? "Creating..." : "Create Account"}
            </button>
            {/* className="cotube-join-btn w-full"
          >
            Create Account
          </button> */}

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
