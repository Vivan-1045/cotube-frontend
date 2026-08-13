import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, getPasswordResetStatus } from "../api/auth";
import toast from "react-hot-toast";

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

            toast.success(res.data.message);

        } catch (err) {

            const remaining = err.response?.data?.remainingSecond;

            if (remaining !== undefined) {

                setCoolDown(Number(remaining));

                toast.error(
                    `Please wait ${remaining} seconds before requesting another reset email.`
                );

            } else {

                toast.error(
                    err.response?.data?.message ||
                    "Failed to send password reset email."
                );

            }

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="cotube-page">
            <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">

                <div className="w-full max-w-md">

                    <div className="mb-8 text-center">

                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Forgot Password
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Enter your registered email to reset your password.
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@example.com"
                                required
                                className="cotube-input"
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading || coolDown > 0}
                            className="cotube-primary-btn w-full disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Sending..."
                                : coolDown > 0
                                    ? `Send again in ${formatTime()}`
                                    : "Send Reset Link"}
                        </button>

                        {coolDown > 0 && (
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-center">

                                <p className="font-semibold text-emerald-400">
                                    Reset link sent successfully
                                </p>

                                <p className="mt-2 text-sm leading-5 text-slate-400">
                                    Check your inbox and spam folder for the reset link.
                                </p>

                            </div>
                        )}

                        {coolDown > 0 && !loading && (
                            <p className="text-center text-sm leading-5 text-slate-500">
                                You can request another reset email in{" "}
                                <span className="font-medium text-slate-300">
                                    {formatTime()}
                                </span>
                            </p>
                        )}

                        <div className="border-t border-slate-800/80 pt-6 text-center">

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                            >
                                ← Back to Login
                            </button>

                        </div>

                    </form>

                    <p className="mt-6 text-center text-xs text-slate-600">
                        Secure password recovery • CoTube
                    </p>

                </div>

            </main>
        </div>
    );
}