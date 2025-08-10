import axios from "axios";

const API_URL = "http://localhost:4000/api/user";

export const getPhotographerById = async (photographerId: string) => {
  const res = await axios.get(`${API_URL}/get-photographer/${photographerId}`);
  return res.data.data.photographer;
};

export const getAllPhotographerByMandapId = async (mandapId: string) => {
  const res = await axios.get(`${API_URL}/photographers/${mandapId}`);
  return res.data.data.photographers;
};
