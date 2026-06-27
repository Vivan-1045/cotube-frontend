import api from "./axios";

export const createRoom = (data) =>
    api.post("/room/create", data);

export const joinRoom = (roomId, password = null) =>
    api.post(`/room/join/${roomId}`, {
        passWord: password
    });

export const deleteRoom = (roomId) =>
    api.delete(`/room/${roomId}`);

export const getRoomDetails = (roomId) =>
  api.get(`/room/room-info/${roomId}`);

export const getParticipants = (roomId) =>
  api.get(`/rooms/${roomId}/participants`);

export const getParticipantCount = (roomId) =>
  api.get(`/rooms/${roomId}/participants/count`);

export const joinParticipant = (roomId) =>
  api.post(`/rooms/${roomId}/join`);

export const leaveParticipant = (roomId) =>
  api.post(`/rooms/${roomId}/leave`);