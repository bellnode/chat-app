import { createContext, useContext, useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'
import storageService from '../service/storageService'
import { useNavigate } from 'react-router-dom';

const SocketContext = createContext()
const API_URL = import.meta.env.VITE_API_URL;

const getSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }) => {
  const navigate = useNavigate()
  const socket = useMemo(() =>{
    const newSocket = io(API_URL, {
      extraHeaders: {
        'Tangy-token': storageService.getToken()
      }
    })
    newSocket.on('connect_error',(err)=>{
      if(err.message==='jwt expired'){
       storageService.removeToken();
        navigate("/");
      }
    })
    return newSocket
  }, [storageService.getToken()])

  //   useEffect(() => {
  //     return () => {
  //         if (socket) socket.disconnect();
  //     };
  // }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, getSocket }