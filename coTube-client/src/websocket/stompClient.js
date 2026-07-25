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
            onConnect?.();
        },

        onStompError: (frame) =>{
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
  if(!client || !client.connected){
    console.log("WebSocket is not connected.");
    return;
  }

  client.publish({
    destination,
    body: JSON.stringify(body),
  });
};

export const subscribeChat = (roomId,callback) =>{
  return client.subscribe(
    `/topic/room/${roomId}/chat`,
    (message) =>{
      callback(JSON.parse(message.body));
    }
  )
}

export const subscribeChatError = (callback) => {
  return client.subscribe(
    "/user/queue/chat-error",
    (message) => {
      callback(JSON.parse(message.body));
    }
  );
};

export default client;