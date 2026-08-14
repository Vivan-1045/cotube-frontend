import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Room from "./pages/Room";
import Navbar from "./pages/Navbar";
import ProtectedRoute from "./pages/ProtectedRoute";
import RoomCreated from "./pages/RoomCreated";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/verifyEmail";
import GuestRoute from "./pages/GuestRoute";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import Layout from "./component/layout";

export default function App() {
  return (
    <Layout>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/room-created" element={
          <ProtectedRoute>
            <RoomCreated />
          </ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}
