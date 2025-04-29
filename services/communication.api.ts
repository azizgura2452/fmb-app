import axiosInstance from "./base.api"
import qs from "qs"

export const getCommunication = () => {
    return axiosInstance.get('communications');
}

export const getMembers = () => {
    return axiosInstance.get('members-tree');
}

export const sendNotificationToken = (formData) => {
    return axiosInstance.post('save_token', qs.stringify(formData));
}