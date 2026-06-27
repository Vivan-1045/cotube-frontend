import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Room from "./pages/Room";
import Navbar from "./pages/Navbar";
import ProtectedRoute from "./pages/ProtectedRoute";
import RoomCreated from "./pages/RoomCreated";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />

        <Route path="/profile" element={<Profile />} />

        <Route path="/room-created" element={<RoomCreated />} />
      </Routes>
    </>
  );
}
