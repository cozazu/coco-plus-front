import { axiosApi } from '../api';

const getAllUsers = async (url?: string) => {
  try {
    const response = await axiosApi.get(`/users${url || ''}`);
    console.log("response", response.data);
    return response.data;
  } catch (error: any) {
    let message = '';
    if (error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = error.message;
    }
    throw message;
  }
};

export default getAllUsers;
