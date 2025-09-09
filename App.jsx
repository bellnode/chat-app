import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { LayoutLoader } from "./components/layout/Loaders";
import { AppProvider } from "./context/SideMenuStates";
import { SocketProvider } from "./context/Socket";
import { useDispatch } from "react-redux";
import userService from "./service/userService";
import { setUser } from "./redux/Slice/userSlice";
import { addUnreadMessages, setChatLoading, setChats } from "./redux/Slice/chatSlice";
import chatService from "./service/chatService";
import { setIsNotificationLoading, setNotification } from "./redux/Slice/notificationSlice";
import requestService from "./service/requestService";

const Home = lazy(() => import("./pages/Home"));
const Chat = lazy(() => import("./pages/Chat"));
const Group = lazy(() => import("./pages/Group"));
const Login = lazy(() => import("./pages/Login"));
const Notfound = lazy(() => import("./pages/Notfound"));

function App() {
  const dispatch = useDispatch()

  const getMyProfile = async () => {
    const res = await userService.getMyProfileAPI();
    dispatch(setUser(res.user));
    console.log('Getting---------profile')
  };

  const getMyChats = async (searchTerm = "") => {
    console.log('App JSX---------------------got chats')
    dispatch(setChatLoading(true));
    const res = await chatService.getChats(searchTerm);
    dispatch(setChats(res.groupChats));
    const unreadMessages = res.groupChats.map((chat) => ({
      chatId: chat._id,
      count: chat.unreadCount || 0,  // Ensure count defaults to 0 if not provided
    }));
    dispatch(addUnreadMessages(unreadMessages))
    dispatch(setChatLoading(false));
  };

  const getNotifications = async () => {
        dispatch(setIsNotificationLoading(true));
        const result = await requestService.requestNotification();
        dispatch(setNotification(result.allRequest));
        dispatch(setIsNotificationLoading(false));
  };
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return
    getMyProfile();
    getMyChats()
    getNotifications()
  }, []);

  return (
    <BrowserRouter>
      <AppProvider>
        <Suspense fallback={<LayoutLoader />}>
          <Routes>
            {/* Public route: Login */}
            <Route exact path="/" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute >
                  <SocketProvider>
                    <Routes>
                      <Route path="/chat/:chatId" element={<Chat />} />
                      <Route path="/group/:chatId" element={<Group />} />
                      <Route path="/home" element={<Home />} />
                    </Routes>
                  </SocketProvider>
                </ProtectedRoute>
              }
            />
            {/* 404 Route */}
            <Route path="*" element={<Notfound />} />
          </Routes>
        </Suspense>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
