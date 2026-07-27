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

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

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

        <Route path="/room-created" element={<RoomCreated />} />
      </Routes>
    </>
  );
}
