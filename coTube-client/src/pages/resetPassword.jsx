import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateResetToken, resetPassword } from "../api/auth";

export default function ResetPassword() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [validToken, setValidToken] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        if (!token) {
            setError("Invalid password reset link.");
            setLoading(false);
            return;
        }

        const verify = async () => {

            try {

                await validateResetToken(token);

                setValidToken(true);

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Password reset link is invalid or expired."
                );

            } finally {

                setLoading(false);

            }

        };

        verify();

    }, [token]);

    const handleReset = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {

            setSubmitting(true);

            const res = await resetPassword(token, password);
            sessionStorage.removeItem("resetPasswordEmail");
            
            alert(res.data);

            navigate("/login", { replace: true });

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to reset password."
            );

        } finally {

            setSubmitting(false);

        }

    };

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <div className="text-white text-xl">
                    Validating reset link...
                </div>
            </div>
        );

    }

    if (!validToken) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">

                <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-center space-y-6">

                    <div className="text-5xl">❌</div>

                    <h2 className="text-3xl font-bold text-white">
                        Reset Link Invalid
                    </h2>

                    <p className="text-red-400">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/forgot-password")}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >
                        Request New Reset Link
                    </button>

                    <button
                        onClick={() => navigate("/login")}
                        className="text-blue-400 hover:underline text-sm"
                    >
                        Back to Login
                    </button>

                </div>

            </div>
        );

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">

            <form
                onSubmit={handleReset}
                className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6"
            >

                <h2 className="text-3xl font-bold text-center text-white">
                    Reset Password
                </h2>

                <p className="text-center text-gray-300 text-sm">
                    Enter your new password
                </p>

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold transition"
                >
                    {submitting ? "Resetting..." : "Reset Password"}
                </button>

            </form>

        </div>

    );
}