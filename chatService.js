import instance from "./interceptor";

const getChats = async (search) => {
  try {
    const response = await instance.get(`chat/getMyChats?search=${search}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getChatDetails = async (chatId, populate = false) => {
  try {
    const response = await instance.get(`chat/${chatId}?populate=${populate}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateChatDetails = async (chatId, name) => {
  try {
    const response = await instance.put(`chat/${chatId}`, { name });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createGroup = async (name , members) => {
  try {
    const response = await instance.post('chat/createGroup', { name, members });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getGroupChats = async () => {
  try {
    const response = await instance.get('chat/getGroupChats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getMyFriends = async () => {
  try {
    const response = await instance.get('chat/getMyFriends');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addGroupMember = async (chatId , members) => {
  try {
    const response = await instance.put('chat/addGroupMember', { chatId, members });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const removeGroupMember = async (chatId , userId) => {
  try {
    console.log({chatId,userId})
    const response = await instance.put('chat/removeGroupMember', { chatId, userId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getMyNonGroupFriends = async (groupId) => {
  try {
    const response = await instance.get(`chat/getMyNonGroupFriends/${groupId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const leaveGroup = async (groupId) => {
  try {
    const response = await instance.delete(`chat/leaveGroup/${groupId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteGroup = async (groupId) => {
  try {
    const response = await instance.delete(`chat/deleteGroup/${groupId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default { getChats,deleteGroup, getChatDetails, createGroup, getGroupChats, getMyFriends, updateChatDetails, addGroupMember, removeGroupMember, getMyNonGroupFriends, leaveGroup };
