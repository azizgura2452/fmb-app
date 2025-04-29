import { IUser } from "../interfaces";

export const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
    weekday: 'short', // Short form of the day (e.g., "Fri")
    day: 'numeric',   // Numeric day (e.g., "16")
    month: 'short',   // Short form of the month (e.g., "Oct")
});

export const getDateParts = (date) => {
    const dateObj = new Date(date);
    return {
        weekday: dateObj.toLocaleDateString('en-US', { weekday: 'short' }), // e.g., "Fri"
        day: dateObj.getDate(), // e.g., 16
        month: dateObj.toLocaleDateString('en-US', { month: 'long' }) // e.g., "Oct"
    };
};


export const isFriday = (dateString) => {
    const date = new Date(dateString);
    return date.getDay() === 5; // 5 represents Friday
};

export const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

export const isTomorrow = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    // Add 1 day to today's date
    today.setDate(today.getDate() + 1);

    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

export const isPast = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    // Remove the time portion for accurate comparison
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return date < today; // Returns true if the date is in the past
};

export const titleCase = (str) => str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export const isDateInPausedRange = (user: IUser, menuDate = '') => {
    let today;
    if (menuDate !== '') {
        today = new Date(menuDate); // Use the provided menu date
    } else {
        today = new Date(); // Current date and time
    }

    // Normalize today's date to midnight to avoid time comparison issues
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Parse start and end dates
    const startDate = new Date(user?.thaali_status?.start_date);
    const endDate = new Date(user?.thaali_status?.end_date);

    // Normalize start and end dates to midnight
    const normalizedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const normalizedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    // console.log(today,normalizedToday, normalizedToday >= normalizedStartDate && normalizedToday <= normalizedEndDate)

    // Check if today is within the range (inclusive)
    return normalizedToday >= normalizedStartDate && normalizedToday <= normalizedEndDate;
};
