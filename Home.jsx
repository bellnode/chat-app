import React, { useCallback } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { NEW_MESSAGE } from '../constants/event'
import { useSocketEventHandler } from '../utils/helper'
import { getSocket } from '../context/Socket'
import { useDispatch } from 'react-redux'
import { setChatLastMessage } from '../redux/Slice/chatSlice'

const Home = () => {
  const socket = getSocket();
  const dispatch = useDispatch()
  const newMessageHandler = useCallback(({ chatId, message }) => {
    console.log("New message received----------")
    console.log({ chatId, message })

    dispatch(setChatLastMessage({
      chatId,
      latestMessage: message.content,
      latestMessageCreatedAt: message.createdAt,
      latestMessageSender: message.sender._id
    }))
  }, [])

  const eventHandler = {
    [NEW_MESSAGE]: newMessageHandler,
    
  };
  useSocketEventHandler(socket, eventHandler);

  return (
    <>
      <div className={`h-full w-full flex items-center justify-center`}>
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
          <span>Select a friend to chat</span>
        </div>

      </div>
    </>
  )
}

export default AppLayout()(Home);