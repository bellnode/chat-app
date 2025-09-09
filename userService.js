import instance from "./interceptor";
import storageService from "./storageService";

const signupAPI = async (formData) => {
  try {
    const response = await instance.post("user/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const signInAPI = async (email, password) => {
  try {
    const response = await instance.post('user/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUsersAPI = async (name) => {
  try {
    const response = await instance.get(`user/search?name=${name}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getMyProfileAPI =async () => {
  try {
    const response = await instance.get(`user/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProfileAPI = async (formData,IsAvatar=false) => {
  try {
    const headers = IsAvatar
      ? {
          "Content-Type": "multipart/form-data",
          "Tangy-token": storageService.getToken(),
        }
      : {};
    const response = await instance.put("user/updateMyProfile", formData, { headers});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default { signupAPI, signInAPI , getUsersAPI , getMyProfileAPI,updateProfileAPI };
