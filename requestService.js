import instance from "./interceptor";


const requestNotification = async () => {
  try {
    const response = await instance.get('request/notification');
    return response.data;
  } catch (error) {
    throw error;
  }
};

const sendFriendRequestAPI = async (receiverId) => {
  try {
    const response = await instance.post('request/send', { receiverId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const acceptRequest = async (requestId , accept) => {
  try {
    const response = await instance.post('request/accept', { requestId , accept });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default { requestNotification , sendFriendRequestAPI , acceptRequest };
