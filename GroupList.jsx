import { React, useState, useEffect, memo } from "react";
import { Stack } from "@mui/material";
import GroupListItem from "../shared/GroupListItem";
import chatService from "../../service/chatService";
import { useDispatch , useSelector } from "react-redux";
import { setGroup } from "../../redux/Slice/groupSlice";

const GroupList = ({
  w = "100%",
  chats,
  chatId,
  setIsNotification,
  setIsGroup,
  setIsNewGroup,
  setIsChatList,
  setIsProfile,
  setIsFriends,
}) => {

  const dispatch = useDispatch()
  const groups = useSelector((state) => state.group.group);

  const fetchGroups = async () => {
    try {
      const result = await chatService.getGroupChats();
      dispatch(setGroup(result.groupChats));
    } catch (error) {
      console.log("Error fetching Groups:", error);
      dispatch(setGroup([]));
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const openCreateGroup = () => {
    setIsChatList(false);
    setIsProfile(false);
    setIsFriends(false);
    setIsGroup(false);
    setIsNewGroup(true);
    setIsNotification(false);
  };

  return (
    <>
      <div className="flex items-center py-8 px-5 text-orange-500">
        <h1 className="text-2xl font-bold">Manage Groups</h1>

        <button
          onClick={openCreateGroup}
          title="Create Groups"
          className="ml-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 22 22"
            className="w-10 h-10 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clipRule="evenodd"
              fill="black"
            />
          </svg>
        </button>
      </div>

      <Stack width={w} direction={"column"} borderTop={"black 1px solid"}>
        {groups.map((data) => {
          const { avatar, _id, name } = data;
            return (
              <GroupListItem
                chatId={_id}
                sameSender={chatId === _id}
                avatar={avatar}
                name={name}
                _id={_id}
                key={_id}
              />
            );
        })}
      </Stack>
    </>
  );
};

export default memo(GroupList) ;
