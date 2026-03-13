import { useEffect } from 'react';
import { useSocket as useSocketContext } from '../context/SocketContext';

export const useSocketEvents = (eventName, handler) => {
  const socket = useSocketContext();

  useEffect(() => {
    if (!socket) return;
    socket.on(eventName, handler);
    return () => socket.off(eventName, handler);
  }, [socket, eventName, handler]);
};