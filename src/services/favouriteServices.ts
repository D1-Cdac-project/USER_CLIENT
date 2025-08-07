// services/favoriteServices.ts
import axios from "axios";

const BASE_URL = "http://localhost:4000/api/user";

export const getAllFavoriteMandaps = async () => {
  const res = await axios.get(`${BASE_URL}/favourite-mandaps`, {
    withCredentials: true,
  });

  return res;
};

export const removeFavoriteMandap = async (mandapId: string) => {
  const res = await axios.delete(`${BASE_URL}/favourite-mandap/${mandapId}`, {
    withCredentials: true,
  });
  return res;
};

// Add a mandap to user's favorites
export const addFavoriteMandap = async (mandapId: string) => {
  const res = await axios.post(
    `${BASE_URL}/add-favorite-mandap`,
    { mandapId },
    {
      withCredentials: true,
    }
  );
  return res.data;
};
