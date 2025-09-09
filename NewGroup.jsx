import { React, useState, useEffect } from "react";
import { List } from "@mui/material";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";
import chatService from "../../service/chatService";
import { toast } from "react-hot-toast";
import { ArrowLeft, MoveLeft } from "lucide-react";

const NewGroup = ({
  setIsNotification,
  setIsGroup,
  setIsNewGroup,
  setIsChatList,
  setIsProfile,
  setIsFriends,
}) => {
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const groupName = useInputValidation("");

  const fetchUsers = async () => {
    try {
      const result = await chatService.getMyFriends();
      setMembers(result.friends);
    } catch (error) {
      console.log("Error fetching Members:", error);
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedMembers]);

  const selectMemberHandler = (_id) => {
    setSelectedMembers((prev) =>
      prev.includes(_id) ? prev.filter((e) => e !== _id) : [...prev, _id]
    );
  };

  const cancelGroup = () => {
    setSelectedMembers([]);
  };

  const handleGroup = async () => {
    try {
      const result = await chatService.createGroup(
        groupName.value,
        selectedMembers
      );
      toast.success("Group Created Successfully!")
    } catch (error) {
      console.log("Error making Group:", error);
      toast.error("Error making Group")
    }
  };

  const openChat = () => {
    setIsChatList(true);
    setIsProfile(false);
    setIsFriends(false);
    setIsGroup(false);
    setIsNewGroup(false);
    setIsNotification(false);
  };

  return (
    <div className="w-full h-full flex flex-col border-r border-gray-200">
      <div className="flex items-center mt-6">
        <button
          onClick={openChat}
          className="flex items-center mr-4 ml-4 px-2 py-1 rounded-lg cursor-pointer"
        >
          <MoveLeft size={20}/>
        </button>

        <h1 className="text-2xl font-bold text-indigo-500 ml-4">New Group</h1>
      </div>

      <div className="w-full h-[82%]">
        <div className="py-4 px-3 w-full ">
        <div>
            
              <input
                id="groupName"
                type="text"
                value={groupName.value}
                onChange={groupName.changeHandler}
                placeholder="Enter group name"
                className="w-full px-4 mt-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
        </div>
        <span className="px-3 py-2 block mb-2 text-md font-medium text-gray-900 ">
          Add Members
        </span>
        <List
          sx={{
            width: "100%",
            height: "70%",
            padding: "0px",
            margin: "0px",
            overflow: "auto",
          }}
        >
          {members.map((user) => (
            <UserItem
              addMembers={true}
              isGroupMember={selectedMembers.includes(user._id)}
              user={user}
              key={user._id}
              handler={selectMemberHandler}
            />
          ))}
        </List>
      </div>
      <div className="flex items-center justify-center mb-3">
        <button
          onClick={cancelGroup}
          type="button"
          className="focus:outline-none rounded-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium text-sm px-5 py-2.5 me-2 mx-3 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleGroup();
            openChat();
          }}
          type="button"
          className="text-white bg-blue-700 mx-3 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default NewGroup;
