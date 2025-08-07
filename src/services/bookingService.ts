import axios from "axios";

const BASE_URL = "http://localhost:4000/api/user";

export const getBookingsByUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/bookings`, {
      withCredentials: true,
    });
    return response.data?.data?.bookings || [];
  } catch (error: any) {
    console.error("Failed to fetch bookings", error);
    throw error;
  }
};

export const getBookingById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/booking/${id}`, {
      withCredentials: true,
    });
    return response.data.data.booking;
  } catch (error: any) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};
