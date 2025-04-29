import axiosInstance from "./base.api";
import qs from "qs";

export const login = (formData) => {
    return axiosInstance.post(`login`, qs.stringify(formData));
}

export const getThaaliData = (id) => {
    return axiosInstance.get(`thaali/${id}`);
}

export const pauseThaali = (formData) => {
    return axiosInstance.post(`pause-thaali`, qs.stringify(formData));
}

export const pauseSingle = (formData) => {
    return axiosInstance.post(`stop-single`, qs.stringify(formData));
}

export const startSingle = (formData) => {
    return axiosInstance.post(`start-single`, qs.stringify(formData));
}

export const checkStatus = (formData) => {
    return axiosInstance.post(`check-status`, qs.stringify(formData));
}

export const reduceSingle = (formData) => {
    return axiosInstance.post(`reduce-single`, qs.stringify(formData));
}

export const fullThaali = (formData) => {
    return axiosInstance.post(`full-thaali`, qs.stringify(formData));
}

export const getReducedMenuItems = (formData) => {
    return axiosInstance.post(`get-reduced-menu-items`, qs.stringify(formData));
};

export const updateThaaliSize = (formData) => {
    return axiosInstance.post(`reduce-thaali`, qs.stringify(formData));
}

export const activateThaali = (userId) => {
    return axiosInstance.get(`activate-thaali`, { params: { user_id: userId } });
}

export const submitContribution = (formData) => {
    return axiosInstance.post('submit-contribution', qs.stringify(formData))
}

export const getContribution = (type, userId) => {
    return axiosInstance.get(`contribution-list/${type}`,  { params: { user_id: userId } })
}

export const getWeeklyThaaliStatus = () => {
    return axiosInstance.get(`get-weekly-status`);
}

export const getPausedThaali = () => {
    return axiosInstance.get(`get-paused-thaali`);
}

export const getPausedThaaliRange = () => {
    return axiosInstance.get(`get-paused-thaali-range`);
}