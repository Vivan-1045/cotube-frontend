import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
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
            background:
              "linear-gradient(135deg, rgba(24, 24, 35, 0.96), rgba(12, 12, 20, 0.94))",
            color: "#ffffff",

            border: "1px solid rgba(255, 255, 255, 0.10)",
            borderRadius: "18px",

            padding: "15px 18px",
            minWidth: "340px",
            maxWidth: "440px",

            fontSize: "14px",
            fontWeight: "500",
            lineHeight: "1.5",

            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",

            boxShadow: `
              0 24px 70px rgba(0, 0, 0, 0.45),
              0 8px 30px rgba(0, 0, 0, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.08),
              inset 0 0 0 1px rgba(255, 255, 255, 0.02)
            `,

            letterSpacing: "-0.01em",
          },

          success: {
            iconTheme: {
              primary: "#ffffff",
              secondary: "#10b981",
            },

            style: {
              border: "1px solid rgba(16, 185, 129, 0.25)",
              boxShadow: `
                0 24px 70px rgba(0, 0, 0, 0.45),
                0 0 35px rgba(16, 185, 129, 0.10),
                inset 0 1px 0 rgba(255, 255, 255, 0.08)
              `,
            },
          },

          error: {
            iconTheme: {
              primary: "#ffffff",
              secondary: "#ef4444",
            },

            style: {
              border: "1px solid rgba(239, 68, 68, 0.25)",
              boxShadow: `
                0 24px 70px rgba(0, 0, 0, 0.45),
                0 0 35px rgba(239, 68, 68, 0.10),
                inset 0 1px 0 rgba(255, 255, 255, 0.08)
              `,
            },
          },

          loading: {
            style: {
              border: "1px solid rgba(139, 92, 246, 0.28)",
              boxShadow: `
                0 24px 70px rgba(0, 0, 0, 0.45),
                0 0 35px rgba(139, 92, 246, 0.12),
                inset 0 1px 0 rgba(255, 255, 255, 0.08)
              `,
            },
          },
        }}
      />
    </BrowserRouter>
  </AuthProvider>
);

