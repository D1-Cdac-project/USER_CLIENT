import axios from "axios";

const BASE_URL = "http://localhost:4000/api/user";

export async function getMandapDetails(mandapId: string) {
  const result = await axios.get(`${BASE_URL}/mandap/${mandapId}`);
  return result.data.data.mandap;
}

export async function getPhotographersByMandapId(mandapId: string) {
  const result = await axios.get(`${BASE_URL}/photographers/${mandapId}`);
  return result.data.data.photographers;
}

export async function getCaterersByMandapId(mandapId: string) {
  const result = await axios.get(`${BASE_URL}/caterers/${mandapId}`);
  return result.data.data.caterers;
}

export async function getRoomsByMandapId(mandapId: string) {
  const result = await axios.get(`${BASE_URL}/rooms/${mandapId}`);

  return result.data.data.rooms;
}

export async function getAllMandaps() {
  const result = await axios.get(`${BASE_URL}/mandaps`);
  return result.data.data.mandaps;
}

export async function getRoomByRoomId(roomId: string) {
  const result = await axios.get(`${BASE_URL}/get-room/${roomId}`);
  return result.data.data.room;
}

export const getVenueCountsFromMandaps = async (): Promise<
  Record<string, number>
> => {
  const response = await axios.get(`${BASE_URL}/mandaps`);
  const mandaps = response.data.data.mandaps || [];

  const cityCounts: Record<string, number> = {};

  mandaps.forEach((mandap: any) => {
    const city = mandap?.address?.city?.trim();
    if (city) {
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    }
  });

  return cityCounts;
};

export const getVenueTypeCountsFromMandaps = async (): Promise<
  Record<string, number>
> => {
  const response = await axios.get(`${BASE_URL}/mandaps`);
  const mandaps = response.data?.data?.mandaps || [];

  const typeCounts: Record<string, number> = {};

  mandaps.forEach((mandap: any) => {
    if (Array.isArray(mandap.venueType)) {
      mandap.venueType.forEach((type: string) => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
    }
  });

  return typeCounts;
};
