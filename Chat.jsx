import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Stack } from '@mui/material'
import { AttachFile } from '@mui/icons-material'
import FileMenu from '../components/dialogues/FileMenu'
import MessageComponent from '../components/shared/MessageComponent'
import { SampleMessage } from '../constants/SampleData'
import { getSocket } from '../context/Socket'
import { NEW_MESSAGE, TYPING_ENDED, TYPING_STARTED } from '../constants/event'
import { Link, useParams } from 'react-router-dom'
import chatService from '../service/chatService'
import messageService from '../service/messageService'
import { useSocketEventHandler } from '../utils/helper'
import { useDispatch, useSelector } from 'react-redux'
import { useInfiniteScrollTop } from '6pp'
import { AppContext } from '../context/SideMenuStates'
import toast from 'react-hot-toast'
import { moveChatToTop, removeMessageAlert, setChatLastMessage } from '../redux/Slice/chatSlice'
import AvatarCard from '../components/shared/AvatarCard'
import { EllipsisVertical } from 'lucide-react'
import { ThreeDots } from 'react-loader-spinner'

const Chat = ({ }) => {
  let chatId
  chatId = useParams().chatId
  const chatIdRef = useRef(chatId)
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user.user);

  const [chatDetails, setChatDetails] = useState({})
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [messageData, setMessageData] = useState({})
  const [page, setPage] = useState(1)
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null)
  const { setIsFileMenu } = useContext(AppContext)
  const [IamTyping, setIamTyping] = useState(false)
  const [userTyping, setUserTyping] = useState(false)
  const [userTypingName, setUserTypingName] = useState('')
  const typingTimeout = useRef(null)
  const bottomRef = useRef(null)
  const [filteredMembers, setFilteredMembers] = useState([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)

  useEffect(() => {
    if (user?._id) {
      socket.emit('MESSAGES_READ', { chatId, userId: user._id })
    }
  }, [chatId, user]);


  useEffect(() => {
    console.log('Chat opened with id : ', chatId)
    chatIdRef.current = chatId;

    const fetchChatDetails = async () => {
      try {
        const [chatData, messageData] = await Promise.all([
          chatService.getChatDetails(chatId, true),
          messageService.getMessages(chatId)
        ])
        if (chatData.success) {
          setChatDetails(chatData.chat);
        }
        if (messageData.success) {
          setPage(messageData.currentPage)
          setMessageData(messageData)
        }
      } catch (error) {
        console.error('Error fetching chat details:', error);
      }
    };
    dispatch(removeMessageAlert(chatId))
    fetchChatDetails();

    return (() => {
      setMessages([])
      setOldMessages([])
      setPage(1)
    })

  }, [chatId]);

  const fetchChatMessages = async (chatId, page) => {
    const response = await messageService.getMessages(chatId, page)
    setMessageData(response)
  }

  useEffect(() => {
    if (chatDetails.members && user) {
      setFilteredMembers(chatDetails?.members.filter((member) => member._id.toString() !== user._id.toString()))
    }

  }, [chatDetails.members, user])

  useEffect(() => {
    if (page > 1) {
      setIsLoadingMessages(true)
      fetchChatMessages(chatId, page)
      setIsLoadingMessages(false)
    }
  }, [page])



  const containerRef = useRef(null)
  const socket = getSocket()
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(containerRef, messageData?.totalPages, page, setPage, messageData?.messages)


  const sendMessageHandler = () => {
    console.log('message wrote by', user)
    if (!message.trim()) returns
    socket.emit(NEW_MESSAGE, { chatId, members: chatDetails.members, message })
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    socket.emit(TYPING_ENDED, { chatId, members: chatDetails.members })
    setIamTyping(false)
    setMessage("")
  }

  const newMessageHandler = useCallback(({ chatId, message }) => {
    console.log("New message received----------")
    console.log({ chatId, message })

    dispatch(setChatLastMessage({
      chatId,
      latestMessage: message.content,
      latestMessageCreatedAt: message.createdAt,
      latestMessageSender: message.sender._id
    }))

    dispatch(moveChatToTop(chatId))

    if (chatId.toString() === chatIdRef.current.toString()) {
      message?.readBy.push(user._id)
      setMessages(prev => [...prev, message])
      console.log(user, '-----------------')
      socket.emit('MESSAGES_READ', { chatId, userId: user._id })
      return
    }
    console.log('ChatId not same-------')
  }, [])

  const startTypingHandler = useCallback((data) => {
    console.log('Typing-handled')
    if (data.chatId.toString() !== chatIdRef.current.toString())
      return
    setUserTyping(true)
    setUserTypingName(data.username)
    console.log('--Typing--', data.username)
  }, [])

  const endTypingHandler = useCallback((data) => {
    if (data.chatId.toString() !== chatIdRef.current.toString())
      return
    setUserTyping(false)
  }, [])

  const eventHandler = {
    [NEW_MESSAGE]: newMessageHandler,
    [TYPING_STARTED]: startTypingHandler,
    [TYPING_ENDED]: endTypingHandler
  }
  useSocketEventHandler(socket, eventHandler)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessageHandler();
    }
  };

  const allMessages = [...oldMessages, ...messages]

  const handleFileMenu = (e) => {
    setIsFileMenu(true)
    setFileMenuAnchor(e.currentTarget)
  }


  const messageChangeHandler = (e) => {
    if (!IamTyping) {
      socket.emit(TYPING_STARTED, { chatId, members: filteredMembers })
      setIamTyping(true)
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current)

    typingTimeout.current = setTimeout(() => {
      socket.emit(TYPING_ENDED, { chatId, members: filteredMembers })
      setIamTyping(false)
    }, [1500]);
    setMessage(e.target.value)
  }

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({
      behavior: "smooth"
    })
  }, [messages])





  return (
    <>
      <div className="bg-white box-border h-[4rem] border-b border-gray-200 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 relative">
            <AvatarCard avatar={chatDetails?.groupChat ? chatDetails.avatar : [chatDetails?.avatar]} />
            <div className='relative flex flex-col h-[2rem]'>
              <h3 className="font-semibold text-gray-800">{chatDetails?.name}</h3>
              <p className={`text-xs text-green-400 ${userTyping ? 'block' : "hidden"}`}>{chatDetails?.groupChat ? `${userTypingName} is ` : ''}Typing...</p>
            </div>
          </div>
          {
            chatDetails?.groupChat && <Link to={`/group/${chatIdRef.current}`}><EllipsisVertical size={18} /></Link>

          }

        </div>
      </div>
      {
        isLoadingMessages ? <div style={{ height: 'calc(100% - 7.5rem)' }} className="h-80 flex flex-row items-center justify-center">
          <ThreeDots color={'#4F46E5'} width={120} />
        </div> :
          <Stack className='bg-slate-100 ' ref={containerRef} height={'calc(100% - 7.5rem)'} sx={{ overflowY: 'auto', overflowX: 'hidden' }} padding={'1rem'} spacing={'1rem'}>
            {
              allMessages.length > 0 && allMessages.map((message,index) => {
                // Check if the message is unread for the current user
                const isUnreadMessage = message.readBy && !message?.readBy.includes(user._id);
                const previousMessageReadStatus = index > 0 ? allMessages[index - 1].readBy.includes(user._id) : true;

                return (
                  <React.Fragment key={message._id}>
                    {/* Display "Unread Messages" heading before the first unread message */}
                    {isUnreadMessage && previousMessageReadStatus && (
                      <div className="text-center bg-gray-500 text-white rounded-3xl w-52 font-semibold self-center">
                        Unread Messages
                      </div>
                    )}
                    <MessageComponent message={message} user={user} />
                  </React.Fragment>
                );
              })
            }
            <div ref={bottomRef} ></div>
          </Stack>
      }
      <div className='h-[3.5rem] border-t border-gray-200 px-10 w-full flex justify-between space-x-5 items-center flex-row'>
        <IconButton onClick={handleFileMenu} style={{ cursor: 'pointer' }} >
          <AttachFile sx={{ width: '1.3rem', height: '1.3rem' }} />
        </IconButton>
        <input onKeyDown={handleKeyDown} value={message} onChange={messageChangeHandler} type="text" placeholder='Send a message...' id="small-input" className="w-full rounded-full px-2 py-1 text-gray-900 border border-gray-300 bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        <button onClick={sendMessageHandler} type="button" className="focus:outline-none text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-full text-sm px-1.5 py-1.5 me-2 ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 -rotate-45 text-white">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </div>
      <FileMenu anchor={fileMenuAnchor} />
    </>
  )
}

export default AppLayout()(Chat)