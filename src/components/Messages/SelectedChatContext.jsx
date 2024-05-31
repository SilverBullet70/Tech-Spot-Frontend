import { useEffect, useRef,createContext, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../AuthProvider';

export const SelectedChatContext = createContext();

export const SelectedChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState({});

  const clientRef = useRef(null);
  const { user } = useAuth();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: onConnected,
      onStompError: onError,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const onConnected = () => {
    if (clientRef.current) {
      clientRef.current.subscribe(`/user/public`, onMessageReceived);
      clientRef.current.subscribe(`/user/${user}/queue/messages`, onMessageReceived);

      findAndDisplayConnectedUsers();
    }
  };

  const findAndDisplayConnectedUsers = async () => {
    const connectedUsersResponse = await fetch('http://localhost:8080/users');
    let connectedUsers = await connectedUsersResponse.json();
    connectedUsers = connectedUsers.filter(users => users.username !== user);
    setConnectedUsers(connectedUsers);
  };

  const onError = (error) => {
    console.error('Connection error', error);
  };

  const onMessageReceived = (message) => {
    console.log('Message received:', message.body);
    message = JSON.parse(message.body);
    console.log("Selected chat username: " + selectedChat.username);
    console.log("Message senderId: " + message.senderId);
    if(message.senderId == selectedChat.username) {
      console.log("Message from selected chat");
      setMessages([...messages, message]);
    }
    else{
      console.log("New message from out" + message.senderId);

      alert("New message from " + message.senderId);
    }
  };




  return (
    <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat, messages, setMessages, connectedUsers, clientRef }}>
      {children}
    </SelectedChatContext.Provider>
  );
};