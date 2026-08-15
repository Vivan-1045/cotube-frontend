import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { validateResetToken, resetPassword } from "../api/auth";
import toast from "react-hot-toast";

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
            toast.error("Passwords do not match.");
            return;
        }

        try {

            setSubmitting(true);

            const res = await resetPassword(token, password);
            sessionStorage.removeItem("resetPasswordEmail");

            toast.success(res.data);

            navigate("/login", { replace: true });

        } catch (err) {

            toast.error(
                err.response?.data?.message ||
                "Failed to reset password."
            );

        } finally {

            setSubmitting(false);

        }

    };

    if (loading) {
        return (
            <div className="cotube-page">
                <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
                    <div className="text-center">

                        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />

                        <p className="text-sm font-medium text-slate-300">
                            Validating reset link...
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                            Please wait a moment.
                        </p>

                    </div>
                </main>
            </div>
        );
    }

    if (!validToken) {
        return (
            <div className="cotube-page">
                <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">

                    <div className="w-full max-w-md">

                        <div className="mb-8 text-center">

                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.06] text-2xl">
                                ❌
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                                Reset Link Invalid
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-red-400">
                                {error}
                            </p>

                        </div>

                        <div className="cotube-card space-y-4 p-6 sm:p-8">

                            <button
                                onClick={() => navigate("/forgot-password")}
                                className="cotube-primary-btn w-full"
                            >
                                Request New Reset Link
                            </button>

                            <button
                                onClick={() => navigate("/login")}
                                className="w-full py-2 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                            >
                                ← Back to Login
                            </button>

                        </div>

                    </div>

                </main>
            </div>
        );
    }

    return (
        <div className="cotube-page">
            <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">

                <div className="w-full max-w-md">

                    <div className="mb-8 text-center">

                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Reset Password
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Create a new password for your CoTube account.
                        </p>

                    </div>

                    <form
                        onSubmit={handleReset}
                        className="cotube-card space-y-6 p-6 sm:p-8"
                    >

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                New Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your new password"
                                required
                                minLength={8}
                                className="cotube-input"
                            />

                        </div>

                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                required
                                minLength={8}
                                className="cotube-input"
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="cotube-primary-btn w-full disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? "Resetting..." : "Reset Password"}
                        </button>

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