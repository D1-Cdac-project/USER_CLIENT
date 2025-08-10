import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Mandap {
  id: string;
  _id: string;
  mandapName: string;
  address: string;
  capacity: string;
  venuePricing: number;
  rating: number;
  reviews: number;
  venueImages: string;
}

interface MandapState {
  favorites: Mandap[];
  searchTerm: string;
  selectedCity: string;
  selectedDate: string;
  selectedVenueType: string;
  addFavorite: (mandap: Mandap) => void;
  removeFavorite: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedVenueType: (type: string) => void;
  resetFilters: () => void;
  isFavorite: (id: string) => boolean;
}

const useMandapStore = create<MandapState>()(
  persist(
    (set, get) => ({
      favorites: [],
      searchTerm: "",
      selectedCity: "",
      selectedDate: "",
      selectedVenueType: "",
      addFavorite: (mandap) =>
        set((state) => ({
          favorites: [
            ...state.favorites,
            { ...mandap, id: mandap._id ?? mandap.id },
          ],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((m) => m.id !== id),
        })),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSelectedCity: (city) => set({ selectedCity: city }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedVenueType: (type) => set({ selectedVenueType: type }),
      resetFilters: () =>
        set({
          searchTerm: "",
          selectedCity: "",
          selectedDate: "",
          selectedVenueType: "",
        }),
      isFavorite: (id) => get().favorites.some((m) => m.id === id),
    }),
    {
      name: "mandap-store",
    }
  )
);

export default useMandapStore;
