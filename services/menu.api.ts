import axiosInstance from "./base.api"
import qs from "qs";

export const getLast30DaysMenu = () => {
    return axiosInstance.get('monthly-menu');
}

export const submitFeedback = (formData) => {
    return axiosInstance.post('submit-feedback', qs.stringify(formData))
}

export const getWeeklyMenu = () => {
    return axiosInstance.get('weekly-menu');
}
export const getPreviousWeekMenu = () => {
    return axiosInstance.get('previous-week-menu');
}

export const getDailyMenu = () => {
    try {
        return axiosInstance.get('daily-menu');
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

export const getNextDayMenu = () => {
    try {
        return axiosInstance.get('next-day');
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}