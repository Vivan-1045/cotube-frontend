import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, getPasswordResetStatus } from "../api/auth";

export default function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [coolDown, setCoolDown] = useState(0);

    useEffect(() => {

        if (coolDown <= 0) return;

        const timer = setInterval(() => {
            setCoolDown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);

    }, [coolDown]);

    useEffect(() => {

        const storedEmail = sessionStorage.getItem("resetPasswordEmail");

        if (!storedEmail) return;

        setEmail(storedEmail);

        const loadCooldown = async () => {

            try {

                const res = await getPasswordResetStatus(storedEmail);

                setCoolDown(Number(res.data.remainingSeconds));

            } catch {

                sessionStorage.removeItem("resetPasswordEmail");
                setCoolDown(0);

            }

        };

        loadCooldown();

    }, []);

    const formatTime = () => {
        const min = Math.floor(coolDown / 60);
        const sec = coolDown % 60;
        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (coolDown > 0) return;

        try {

            setLoading(true);

            const res = await forgotPassword(email);

            sessionStorage.setItem("resetPasswordEmail", email);

            const status = await getPasswordResetStatus(email);

            setCoolDown(Number(status.data.remainingSeconds));

            alert(res.data.message);

        } catch (err) {

            const remaining = err.response?.data?.remainingSecond;

            if (remaining !== undefined) {

                setCoolDown(Number(remaining));

                alert(
                    `Please wait ${remaining} seconds before requesting another reset email.`
                );

            } else {

                alert(
                    err.response?.data?.message ||
                    "Failed to send password reset email."
                );

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6"
            >

                <h2 className="text-3xl font-bold text-center text-white">
                    Forgot Password
                </h2>

                <p className="text-center text-gray-300 text-sm">
                    Enter your registered email address
                </p>

                <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                <button
                    type="submit"
                    disabled={loading || coolDown > 0}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold transition"
                >
                    {loading
                        ? "Sending..."
                        : coolDown > 0
                            ? `Send again in ${formatTime()}`
                            : "Send Reset Link"}
                </button>

                {coolDown > 0 && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                        <p className="text-green-400 font-semibold">
                            Reset link sent successfully!
                        </p>
                        <p className="text-gray-300 text-sm mt-2">
                            Please check your inbox and spam folder.
                        </p>
                    </div>
                )}

                {coolDown > 0 && !loading && (
                    <p className="text-center text-gray-400 text-sm">
                        You can request another email to reset the password in {formatTime()}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-blue-400 hover:underline text-sm w-full text-center"
                >
                    Back to Login
                </button>

            </form>

        </div>

    );
}