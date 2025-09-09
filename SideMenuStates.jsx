import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isProfile, setIsProfile] = useState(false);
  const [isChatList, setIsChatList] = useState(true);
  const [isFriends, setIsFriends] = useState(false);
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [isGroup, setIsGroup] = useState(false);
  const [isNotification , setIsNotification] = useState(false);
  const [isFileMenu,setIsFileMenu] = useState(false)

  const openNewGroupMenu = ()=>{
    setIsChatList(false)
    setIsGroup(false)
    setIsProfile(false)
    setIsNotification(false)
    setIsFriends(false)
    setIsNewGroup(true)
  }

  return (
    <AppContext.Provider value={{
      isProfile, setIsProfile,
      isChatList, setIsChatList,
      isFriends, setIsFriends,
      isNewGroup, setIsNewGroup,
      isGroup, setIsGroup,
      isNotification,setIsNotification,
      isFileMenu,setIsFileMenu , openNewGroupMenu
    }}>
      {children}
    </AppContext.Provider>
  );
};
