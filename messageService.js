import instance from "./interceptor";
import storageService from "./storageService";
const token = storageService.getToken()

const getMessages = async (chatId,page=1) => {
  try {
    const response = await instance.get(`message/${chatId}?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const sendAttachments = async (form) => {
  const headers = {
    "Content-Type": "multipart/form-data",
    "Tangy-token": token
  };
  try {
    const response = await instance.post(`chat/sendAttachment`,form,{
      headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {getMessages , sendAttachments}