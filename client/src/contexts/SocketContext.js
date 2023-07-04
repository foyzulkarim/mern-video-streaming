import React, { createContext, useContext, useMemo } from "react";

import { io } from "socket.io-client";

import { API_SERVER } from '../constants';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(API_SERVER), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
