import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

let client = null;

export const connectSocket = (token,onConnect) =>{
    client = new Client({
        webSocketFactory: () =>
            new SockJS("http://localhost:8080/ws"),

        
        connectHeaders:{
            Authorization: `Bearer ${token}`
        },

        reconnectDelay: 5000,

        onConnect: () => {
            console.log("Connected to WebSocket server");
            onConnect?.();
        },

        onStompError: (frame) =>{
            console.error("STOMP error:", frame);
        }
    
    });
    client.activate();
}

export const disconnectSocket = () =>{
    client?.deactivate();
}

export const subscribeRoom = (roomId, callback) => {
  return client.subscribe(`/topic/room/${roomId}`, (message) => {
    callback(JSON.parse(message.body));
  });
};

export const subscribeSync = (callback) => {
  return client.subscribe("/user/queue/sync", (message) => {
    callback(JSON.parse(message.body));
  });
};

export const sendMessage = (destination, body) => {
  client.publish({
    destination,
    body: JSON.stringify(body),
  });
};

export default client;