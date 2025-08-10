import axios from "axios";

const BASE_URL = "http://localhost:4000/api/user";

export const addBooking = async (bookingData: {
  mandapId: string;
  orderDates: string[];
  photographer: string[];
  caterer: string[];
  room: string | null;
  totalAmount: number;
  amountPaid: number;
  paymentId: string;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/add-booking`, bookingData, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error adding booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getBookingsByUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/bookings`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    return response.data?.data?.bookings || [];
  } catch (error: any) {
    console.error(
      "Failed to fetch bookings:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getBookingById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/booking/${id}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    return response.data.data.booking;
  } catch (error: any) {
    console.error(
      "Error fetching booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteBooking = async (id: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error deleting booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateBooking = async (id: string, data: any) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/${id}`, data, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating booking:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const completePayment = async (
  id: string,
  paymentData: { paymentAmount: number; paymentId: string }
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/complete-payment/${id}`,
      paymentData,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error completing payment:",
      error.response?.data || error.message
    );
    throw error;
  }
};
