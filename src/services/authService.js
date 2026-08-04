import axiosClient from "../config/axios";
import API from "../constants/api";

const authService = {

    register: async (userData) => {
        const response = await axiosClient.post(
            API.AUTH.REGISTER,
            userData
        );
        return response.data;
    },

    login: async (credentials) => {
        const response = await axiosClient.post(
            API.AUTH.LOGIN,
            credentials
        );
        return response.data;
    },

};

export default authService;