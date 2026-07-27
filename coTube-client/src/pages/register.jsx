import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

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

      alert(res.data);

      navigate("/verify-email", {
        state: {
          email: form.email,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-white">
          Create Account
        </h2>

        <p className="text-center text-gray-300 text-sm">
          Sign up to get started
        </p>

        {/* Username */}
        <input
          placeholder="Username"
          required
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          required
          minLength={8}
          title="Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
          onChange={(e) => setForm({ ...form, passWord: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition transform hover:scale-[1.02] active:scale-95"
        >
          Register
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-green-400 hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
