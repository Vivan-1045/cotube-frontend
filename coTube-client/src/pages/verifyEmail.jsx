import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { resendVerificationEmail, verifyEmail } from "../api/auth";

export default function VerifyEmail() {

    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = location.state?.email;

    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState("");
    const [resendCoolDown, setResendCoolDown] = useState(120);


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


    const formatCoolDown = () => {
        const min = Math.floor(resendCoolDown / 60);
        const sec = resendCoolDown % 60;

        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }


    const handleResend = async () => {

        if (!email) {
            alert("Email not found. Please register again.");
            navigate("/register");
            return;
        }

        if (resendCoolDown > 0) {
            return;
        }

        try {

            setLoading(true);

            await resendVerificationEmail(email);

            alert(
                "Verification email sent again. Please check your inbox or spam folder."
            );

            setResendCoolDown(120);

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to resend verification email."
            );

        } finally {

            setLoading(false);

        }
    };


    if (verifying) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">

                <div className="text-white text-xl">
                    Verifying your email...
                </div>

            </div>
        );
    }


    if (verified) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">

                <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-center space-y-6">

                    <div className="text-5xl">
                        ✅
                    </div>

                    <h2 className="text-3xl font-bold text-white">
                        Email Verified Successfully
                    </h2>

                    <p className="text-gray-300">
                        Your account has been successfully verified.
                    </p>

                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >
                        Go to Login
                    </button>

                </div>

            </div>
        );
    }


    if (error) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">

                <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-center space-y-6">

                    <div className="text-5xl">
                        ❌
                    </div>

                    <h2 className="text-3xl font-bold text-white">
                        Verification Failed
                    </h2>

                    <p className="text-red-400">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/register")}
                        className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition"
                    >
                        Register Again
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">

            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 text-center space-y-6">

                <div className="text-5xl">
                    📧
                </div>

                <h2 className="text-3xl font-bold text-white">
                    Check Your Email
                </h2>

                <p className="text-gray-300">
                    We have sent a verification link to:
                </p>

                <p className="text-green-400 font-semibold break-all">
                    {email}
                </p>

                <p className="text-gray-400 text-sm">
                    Please click the verification link in your email to activate
                    your account. The link will expire after a limited time.
                </p>

                <button
                    onClick={handleResend}
                    disabled={loading || resendCoolDown > 0}
                    className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold transition"
                >
                    {loading
                        ? "Sending..."
                        : resendCoolDown > 0
                            ? `Resend available in ${formatCoolDown()}`
                            : "Resend Verification Email"}
                </button>

                {resendCoolDown > 0 && !loading && (
                    <p className="text-gray-400 text-sm">
                        You can request another verification email in{" "}
                        <span className="text-green-400 font-semibold">
                            {formatCoolDown()}
                        </span>
                    </p>
                )}

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