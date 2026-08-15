import { Toaster } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import App from "../App";

export default function AppWithToaster() {
    const { theme } = useTheme();

    const isDark = theme === "dark";

    return (
        <>
            <App />

            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={14}
                containerStyle={{
                    top: 24,
                    right: 24,
                }}
                toastOptions={{
                    duration: 4000,

                    style: {
                        background: "var(--toast-bg)",
                        color: "var(--toast-text)",
                        border: "1px solid var(--toast-border)",

                        borderRadius: "18px",

                        padding: "15px 18px",
                        minWidth: "340px",
                        maxWidth: "440px",

                        fontSize: "14px",
                        fontWeight: "500",
                        lineHeight: "1.5",

                        backdropFilter: "blur(24px) saturate(180%)",
                        WebkitBackdropFilter: "blur(24px) saturate(180%)",

                        boxShadow: isDark
                            ? `
                0 24px 70px rgba(0, 0, 0, 0.45),
                0 8px 30px rgba(0, 0, 0, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.08),
                inset 0 0 0 1px rgba(255, 255, 255, 0.02)
              `
                            : `
                0 24px 70px rgba(15, 23, 42, 0.12),
                0 8px 30px rgba(15, 23, 42, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.8),
                inset 0 0 0 1px rgba(15, 23, 42, 0.03)
              `,

                        letterSpacing: "-0.01em",
                    },

                    success: {
                        iconTheme: {
                            primary: isDark ? "#ffffff" : "#ffffff",
                            secondary: "#10b981",
                        },

                        style: {
                            border: "1px solid rgba(16, 185, 129, 0.30)",
                            boxShadow: isDark
                                ? `
                  0 24px 70px rgba(0, 0, 0, 0.45),
                  0 0 35px rgba(16, 185, 129, 0.10),
                  inset 0 1px 0 rgba(255, 255, 255, 0.08)
                `
                                : `
                  0 24px 70px rgba(15, 23, 42, 0.12),
                  0 0 35px rgba(16, 185, 129, 0.08),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `,
                        },
                    },

                    error: {
                        iconTheme: {
                            primary: "#ffffff",
                            secondary: "#ef4444",
                        },

                        style: {
                            border: "1px solid rgba(239, 68, 68, 0.30)",
                            boxShadow: isDark
                                ? `
                  0 24px 70px rgba(0, 0, 0, 0.45),
                  0 0 35px rgba(239, 68, 68, 0.10),
                  inset 0 1px 0 rgba(255, 255, 255, 0.08)
                `
                                : `
                  0 24px 70px rgba(15, 23, 42, 0.12),
                  0 0 35px rgba(239, 68, 68, 0.08),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `,
                        },
                    },

                    loading: {
                        style: {
                            border: "1px solid rgba(139, 92, 246, 0.28)",
                            boxShadow: isDark
                                ? `
                  0 24px 70px rgba(0, 0, 0, 0.45),
                  0 0 35px rgba(139, 92, 246, 0.12),
                  inset 0 1px 0 rgba(255, 255, 255, 0.08)
                `
                                : `
                  0 24px 70px rgba(15, 23, 42, 0.12),
                  0 0 35px rgba(139, 92, 246, 0.10),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `,
                        },
                    },
                }}
            />
        </>
    );
}