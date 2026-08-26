import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

let client = null;

let roomSubscription = null;
let syncSubscription = null;
let chatSubscription = null;
let chatErrorSubscription = null;

export const connectSocket = (token, onConnect) => {

    if (client?.active) {
        return;
    }

    client = new Client({
        webSocketFactory: () =>
            new SockJS(import.meta.env.VITE_WEBSOCKET_STOMP_URL),

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,

        onConnect: () => {
            onConnect?.();
        },

        onStompError: (frame) => {
            console.error("STOMP error:", frame);
        },
    });

    client.activate();
};


export const disconnectSocket = async () => {

    if (!client) {
        return;
    }

    roomSubscription?.unsubscribe();
    syncSubscription?.unsubscribe();
    chatSubscription?.unsubscribe();
    chatErrorSubscription?.unsubscribe();

    roomSubscription = null;
    syncSubscription = null;
    chatSubscription = null;
    chatErrorSubscription = null;

    await client.deactivate();

    client = null;
};


export const subscribeRoom = (roomId, callback) => {

    if (!client?.connected) {
        console.error("Cannot subscribe: WebSocket not connected.");
        return null;
    }

    roomSubscription?.unsubscribe();

    roomSubscription = client.subscribe(
        `/topic/room/${roomId}`,
        (message) => {
            callback(JSON.parse(message.body));
        }
    );

    return roomSubscription;
};


export const subscribeSync = (callback) => {

    if (!client?.connected) {
        return null;
    }

    syncSubscription?.unsubscribe();

    syncSubscription = client.subscribe(
        "/user/queue/sync",
        (message) => {
            callback(JSON.parse(message.body));
        }
    );

    return syncSubscription;
};


export const subscribeChat = (roomId, callback) => {

    if (!client?.connected) {
        return null;
    }

    chatSubscription?.unsubscribe();

    chatSubscription = client.subscribe(
        `/topic/room/${roomId}/chat`,
        (message) => {
            callback(JSON.parse(message.body));
        }
    );

    return chatSubscription;
};


export const subscribeChatError = (callback) => {

    if (!client?.connected) {
        return null;
    }

    chatErrorSubscription?.unsubscribe();

    chatErrorSubscription = client.subscribe(
        "/user/queue/chat-error",
        (message) => {
            callback(JSON.parse(message.body));
        }
    );

    return chatErrorSubscription;
};


export const sendMessage = (destination, body) => {

    if (!client?.connected) {
        console.log("WebSocket is not connected.");
        return;
    }

    client.publish({
        destination,
        body: JSON.stringify(body),
    });
};