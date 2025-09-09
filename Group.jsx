import React, { useEffect, useState, lazy, Suspense } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Done, Edit } from "@mui/icons-material";
import { Backdrop, TextField, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserItem from "../components/shared/UserItem";
import { orange } from "../constants/color";
import chatService from "../service/chatService";
import { useSelector, useDispatch } from "react-redux";
import { setGroup } from "../redux/Slice/groupSlice";
import { setCreator } from "../redux/Slice/creatorSlice";
import { toast } from "react-hot-toast";
import { Check, LogOut, Pencil, Plus, Trash2, UserMinus, Users, X } from "lucide-react";
import { transformImage } from "../libs/Features";

const Group = () => {
  const ConfirmDeleteDialogue = lazy(() =>
    import("../components/dialogues/ConfirmDeleteDialogue")
  );
  const AddMembersDialogue = lazy(() =>
    import("../components/dialogues/AddMembersDialogue")
  );
  const LeaveGroupDialogue = lazy(() =>
    import("../components/dialogues/LeaveGroupDialogue")
  );
  const [groupNewName, setGroupNewName] = useState("");
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isLeaveDialog, setIsLeaveDialog] = useState(false);
  const [isAddMembers, setIsAddMembers] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const currentUser = useSelector((state) => state.user.user || {});
  const creatorId = useSelector((state) => state.creator.creator);

  const { chatId } = useParams();

  const updateGroupName = async () => {
    try {
      await chatService.updateChatDetails(chatId, groupNewName);
      toast.success("Updated Group Name!")
      setIsEdit(false);
    } catch (error) {
      console.log("Error updating Group Name:", error);
      toast.error("Error updating Group Name")
    }
  };

  const fetchGroupDetail = async () => {
    try {
      const result = await chatService.getChatDetails(chatId);
      setGroupNewName(result.chat.name);
      setGroupMembers(result.chat.members);
      dispatch(setCreator(result.chat.creator));
    } catch (error) {
      console.log("Error fetching Group Details:", error);
    }
  };

  const refreshGroupDetails = () => {
    fetchGroupDetail();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchGroupDetail();
      } catch (error) {
        console.log("Error fetching Group Details:", error);
      }
    };

    fetchData();
  }, [chatId]);

  const closeConfirmDeleteDialog = () => {
    setIsDeleteDialog(false);
  };

  const closeleaveDialog = () => {
    setIsLeaveDialog(false);
  };

  const leaveHandler = async () => {
    try {
      await chatService.leaveGroup(chatId);
      const result = await chatService.getGroupChats();
      console.log(result)
      toast.success("Group left!")
      dispatch(setGroup(result.groupChats));
      closeConfirmDeleteDialog();
      navigate('/home')
    } catch (error) {
      console.log("Error leaving Group :", error);
      toast.error("Error leaving Group");
    }
  };

  const deleteHandler = async () => {
    try {
      await chatService.deleteGroup(chatId);
      const result = await chatService.getGroupChats();
      console.log(result)
      toast.success("Group Deleted!")
      dispatch(setGroup(result.groupChats));
      closeleaveDialog();
      navigate('/home')
    } catch (error) {
      console.log("Error leaving Group :", error);
      toast.error("Error leaving Group");
    }
  };

  const removeMemberHandler = async (_id) => {
    try {
      const result = await chatService.removeGroupMember(chatId, _id);
      toast.success(`${result.removedUser} removed from Group`)
      fetchGroupDetail();
    } catch (error) {
      console.log("Error in deleting group member:", error);
      toast.error("Error in deleting group member")
    }
  };

  return (
    <>
      
      <div className="h-full w-full bg-white flex flex-col">
        <div className="relative h-64 bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center px-6">
          <Link
            to={`/chat/${chatId}`}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="text-white" size={24} />
          </Link>

          <div className="text-center">
            <div className="mb-4 bg-white/10 p-4 rounded-full inline-block backdrop-blur-sm">
              <Users className="text-white" size={32} />
            </div>
            {isEdit ? (
              <div className="flex flex-row">
                <input
                  type="text"
                  value={groupNewName}
                  onChange={(e) => setGroupNewName(e.target.value)}
                  className="text-2xl font-bold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white text-center w-full max-w-md"
                />
                <button
                  onClick={updateGroupName}
                  className="p-1.5 ml-4 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Check className="text-white/80" size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <h2 className="text-2xl font-bold text-white">{groupNewName}</h2>
                {
                  currentUser?._id === creatorId &&
                  <button
                    onClick={() => setIsEdit(true)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                    <Pencil className="text-white/80" size={16} />
                  </button>
                }

              </div>
            )}
            <p className="text-white/80 mt-2">{groupMembers.length} members</p>
          </div>
        </div>

        <div className="flex-1 px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Members</h3>
              {
                currentUser?._id === creatorId &&
                <button
                onClick={() => setIsAddMembers(true)}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <Plus size={20} />
                <span>Add Member</span>
              </button>
              }
              
            </div>

            <div className="space-y-3 overflow-y-auto h-54">
              {groupMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={member?.avatar?.url ? transformImage(member?.avatar?.url) : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZw4HYx8PHlE8ZniW1hqck5nZeKaYZSqG56g&s"}
                      alt={member.username}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{member.username}</h4>
                      {
                        member._id === creatorId && <span className={`text-sm ${member._id === creatorId ? 'text-indigo-600' : 'text-gray-500'
                          }`}>
                          Admin
                        </span>
                      }

                    </div>
                  </div>
                  {currentUser._id === creatorId && member._id !== creatorId && (
                    <button
                      onClick={() => removeMemberHandler(member._id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <UserMinus size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className=" space-x-3  flex items-center justify-center pt-20">
            {currentUser?._id === creatorId && (
              <button
                onClick={() => setIsDeleteDialog(true)}
                className="w-40 py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 size={20} />
                <span>Delete Group</span>
              </button>
            ) }
              <button
              onClick={()=>setIsLeaveDialog(true)}
                className="w-40 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              >
                <LogOut size={20} />
                <span>Leave Group</span>
              </button>
            
          </div>
          </div>
        </div>
        
      </div>
      {isAddMembers && (
        <Suspense fallback={<Backdrop open />}>
          <AddMembersDialogue
            handleClose={() => setIsAddMembers(false)}
            open={isAddMembers}
            refreshGroupDetails={refreshGroupDetails}
          />
        </Suspense>
      )}
      {isDeleteDialog && (
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteDialogue
              handleClose={closeConfirmDeleteDialog}
              deleteHandler={deleteHandler}
              open={isDeleteDialog}
            />
          </Suspense>
        )}
        {isLeaveDialog && (
          <Suspense fallback={<Backdrop open />}>
            <LeaveGroupDialogue
              handleClose={closeleaveDialog}
              deleteHandler={leaveHandler}
              open={isLeaveDialog}
            />
          </Suspense>
        )}
    </>
  );
};



export default AppLayout()(Group);
