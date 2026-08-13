import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { resendVerificationEmail, verifyEmail, getverificationStatus } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function VerifyEmail() {

    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = location.state?.email || sessionStorage.getItem("verificationEmail");

    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const [resendCoolDown, setResendCoolDown] = useState(0);
    const { user } = useAuth();


    useEffect(() => {

        const token = searchParams.get("token");

        if (!token) {

            setVerifying(false);

            if (!email) {
                navigate("/", { replace: true });
            }

            return;
        }

        const verify = async () => {

            try {

                await verifyEmail(token);
                sessionStorage.removeItem("verificationEmail");
                setVerified(true);

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Verification link is invalid or expired."
                );

            } finally {

                setVerifying(false);

            }
        };

        verify();

    }, [searchParams, navigate, email]);


    useEffect(() => {
        if (resendCoolDown <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setResendCoolDown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendCoolDown]);

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) return;
        if (!email) return;

        const loadCoolDown = async () => {
            try {
                const res = await getverificationStatus(email);
                setResendCoolDown(Number(res.data.remainingSeconds));
            } catch (err) {
                setResendCoolDown(0);
            }
        }

        loadCoolDown();
    }, [email, searchParams]);


    const formatCoolDown = () => {
        const min = Math.floor(resendCoolDown / 60);
        const sec = resendCoolDown % 60;

        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }


    const handleResend = async () => {

        if (user) {
            toast.success("You are already logged in.");
            navigate("/");
            return;
        }

        if (!email) {
            toast.error("Email not found. Please register again.");
            navigate("/register");
            return;
        }

        if (resendCoolDown > 0) {
            return;
        }

        try {

            setLoading(true);

            const res = await resendVerificationEmail(email);

            const remainingSec = Number(res.data.remainingSecond);

            setResendCoolDown(remainingSec);

            toast.success(res.data.message);

        } catch (err) {

            const remainingSec = err.response?.data?.remainSec;

            if (remainingSec !== undefined) {

                setResendCoolDown(Number(remainingSec));

                toast.error(
                    `Please wait ${remainingSec} seconds before requesting another email.`
                );

            } else {

                toast.error(
                    err.response?.data?.message ||
                    "Failed to resend verification email."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    if (verifying) {
        return (
            <div className="cotube-page">
                <main className="relative z-10 flex min-h-screen items-center justify-center px-4">

                    <div className="text-center">

                        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />

                        <p className="text-sm font-medium text-slate-300">
                            Verifying your email...
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                            Please wait while we verify your account.
                        </p>

                    </div>

                </main>
            </div>
        );
    }


    if (verified) {
        return (
            <div className="cotube-page">
                <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">

                    <div className="w-full max-w-md">

                        <div className="cotube-card p-6 text-center sm:p-8">

                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] text-3xl">
                                ✓
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                                Email Verified
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Your email has been successfully verified.
                                Your CoTube account is now active.
                            </p>

                            <button
                                onClick={() => navigate("/login")}
                                className="cotube-primary-btn mt-7 w-full"
                            >
                                Go to Login
                            </button>

                        </div>

                    </div>

                </main>
            </div>
        );
    }


    if (error) {
        return (
            <div className="cotube-page">
                <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">

                    <div className="w-full max-w-md">

                        <div className="cotube-card p-6 text-center sm:p-8">


                            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.06] text-2xl">
                                ✕
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight text-white">
                                Verification Failed
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-red-400">
                                {error}
                            </p>

                            <p className="mt-4 text-sm leading-6 text-slate-500">
                                You can request a new verification email after
                                the cooldown period.
                            </p>

                            <button
                                onClick={handleResend}
                                disabled={loading || resendCoolDown > 0}
                                className="cotube-join-btn mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Sending..."
                                    : resendCoolDown > 0
                                        ? `Resend available in ${formatCoolDown()}`
                                        : "New Verification Email"}
                            </button>


                            {resendCoolDown > 0 && !loading && (
                                <p className="mt-4 text-sm text-slate-500">
                                    You can request another verification email in{" "}
                                    <span className="font-semibold text-emerald-400">
                                        {formatCoolDown()}
                                    </span>
                                </p>
                            )}


                            <div className="mt-6 border-t border-slate-800/80 pt-6">

                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                                >
                                    ← Back to Login
                                </button>

                            </div>

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

                    <div className="cotube-card p-6 text-center sm:p-8">

                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] text-2xl">
                            ✉
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-white">
                            Check Your Email
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            We've sent a verification link to:
                        </p>

                        <p className="mt-3 break-all text-sm font-semibold text-blue-400">
                            {email}
                        </p>

                        <p className="mt-5 text-sm leading-6 text-slate-500">
                            Click the verification link in your email to activate
                            your account.
                        </p>

                        <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-900/40 px-4 py-3">

                            <p className="text-xs text-slate-500">
                                This verification link expires after{" "}
                                <span className="font-semibold text-slate-300">
                                    5 minutes
                                </span>.
                            </p>

                        </div>


                        <button
                            onClick={handleResend}
                            disabled={loading || resendCoolDown > 0}
                            className="cotube-join-btn mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Sending..."
                                : resendCoolDown > 0
                                    ? `Resend available in ${formatCoolDown()}`
                                    : "New Verification Email"}
                        </button>


                        {resendCoolDown > 0 && !loading && (
                            <p className="mt-4 text-sm text-slate-500">
                                You can request another verification email in{" "}
                                <span className="font-semibold text-emerald-400">
                                    {formatCoolDown()}
                                </span>
                            </p>
                        )}

                        <div className="mt-6 border-t border-slate-800/80 pt-6">

                            <button
                                onClick={() => navigate("/login")}
                                className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                            >
                                ← Back to Login
                            </button>

                        </div>

                    </div>

                    <p className="mt-6 text-center text-xs text-slate-600">
                        Secure email verification • CoTube
                    </p>

                </div>

            </main>
        </div>
    );
}