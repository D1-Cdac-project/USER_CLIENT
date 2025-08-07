import axios from "axios";

const BASE_URL = "http://localhost:4000/api/user";

export interface ICaterer {
  _id: string;
  catererName: string;
  mandapId: {
    _id: string;
    mandapName: string;
    // Add more mandap fields if needed
  };
  menuCategory: {
    category: "Basic" | "Standard" | "Premium" | "Luxury";
    menuItems: {
      itemName: string;
      itemPrice: number;
    }[];
    pricePerPlate: number;
    categoryImage?: string;
  }[];
  foodType: ("Veg" | "Non-Veg" | "Both" | "Jain")[];
  isCustomizable: boolean;
  customizableItems: {
    itemName: string;
    itemPrice: number;
  }[];
  hasTastingSession: boolean;
  isActive: boolean;
  createdAt: string;
}

// services/catererService.ts

export const getCatererById = async (catererId: string): Promise<ICaterer> => {
  const res = await axios.get(`${BASE_URL}/caterer/${catererId}`, {
    withCredentials: true,
  });

  return res.data?.data?.caterer;
};
