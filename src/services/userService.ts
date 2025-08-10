// src/services/userService.ts

import axios from "axios";

const API_BASE = "http://localhost:4000/api/user";

// Request payload type
export interface RegisterUserPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// Successful response type
interface RegisterResponse {
  status: string;
  data: {
    user: {
      _id: string;
      fullName: string;
      email: string;
    };
    userToken?: string; // if you're returning JWT
  };
}

// Error response type (optional)
interface ErrorResponse {
  message: string;
}

// -------- Update Profile Types --------

export interface AddressInput {
  state: string;
  city: string;
  pinCode: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  addressId?: string; // If updating address reference
  profileImage?: File; // If sending profile image
}

export interface UpdateProfileWithAddressPayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  address?: AddressInput; // If sending address fields instead of ID
  profileImage?: File; // If sending profile image
}

export interface UpdateProfileResponse {
  status: string;
  message: string;
}

// registerUser function
export const registerUser = async (
  payload: RegisterUserPayload
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(
      `${API_BASE}/signup`,
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    const err: ErrorResponse = error.response?.data || {
      message: "Unknown error occurred",
    };
    throw err;
  }
};

// loginUser function
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE}/login`,
      { email, password },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    const err = error.response?.data || { message: "Login failed" };
    throw err;
  }
};

// logoutUser function

export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${API_BASE}/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    const err = error.response?.data || { message: "Logout failed" };
    throw err;
  }
};

// UpdateProfile function

export const updateProfile = async (
  // payload: UpdateProfilePayload | UpdateProfileWithAddressPayload
  formData: FormData
): Promise<{ message: string }> => {
  try {
    const response = await axios.put(`${API_BASE}/update-profile`, formData, {
      withCredentials: true,
    });
    return response.data.data;
  } catch (error: any) {
    const err = error.response?.data || { message: "Profile update failed" };
    console.error(err);

    throw err;
  }
};

//Get user details for profile page

export async function getUserDetails() {
  try {
    const result = await axios.get(`${API_BASE}/profile`, {
      withCredentials: true,
    });
    return result.data.data;
  } catch (error) {}
}
