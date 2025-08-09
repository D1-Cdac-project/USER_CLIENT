import React, { useState, useMemo, useEffect } from "react";
import { Heart, MapPin, Star, X, Filter, Calendar, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useMandapStore from "../../store/useMandapStore";
import { getAllMandaps } from "../../services/mandapServices";
import {
  getAllFavoriteMandaps,
  addFavoriteMandap,
  removeFavoriteMandap,
} from "../../services/favouriteServices";
import {
  getMandapRatingsSummary,
  getReviewsByMandapId,
} from "../../services/reviewService";
import { toast } from "react-hot-toast";

interface Venue {
  _id: string;
  mandapName: string;
  address: { city: string };
  guestCapacity: string | number;
  venuePricing: number;
  venueImages: string[];
  availableDates: string[];
  venueType: string[]; // Updated to array
}

const MandapList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCapacity, setSelectedCapacity] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string[]>([]);
  const [selectedFoodType, setSelectedFoodType] = useState<string>("");
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localSelectedDate, setLocalSelectedDate] = useState("");
  const [localSelectedCity, setLocalSelectedCity] = useState("");

  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [ratings, setRatings] = useState<
    Record<string, { averageRating: number; totalReviews: number }>
  >({});

  const [mandaps, setMandaps] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const default_img_url = "https://res.cloudinary.com/dgglqlhsm/image/upload/v1754673671/BookMyMandap/bjxp4lzznjlflnursrms.png";

  const {
    searchTerm,
    setSearchTerm,
    selectedCity,
    selectedDate,
    selectedVenueType,
    setSelectedCity,
    setSelectedDate,
    setSelectedVenueType,
    resetFilters,
  } = useMandapStore();

  // Fetch all mandaps and their ratings
  const fetchMandaps = async () => {
    try {
      setLoading(true);
      const result = await getAllMandaps();
      setMandaps(result);
    } catch (error) {
      console.error("Error fetching mandaps:", error);
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorite mandaps
  const fetchFavorites = async () => {
    try {
      const res = await getAllFavoriteMandaps();
      setFavoriteIds(res.data.data.favoriteMandaps.map((m: any) => m._id));
    } catch (err) {
      console.error("Error fetching favorites", err);
      toast.error("Failed to load favorites");
    }
  };

  // Fetch ratings summary
  const fetchRatingsSummary = async () => {
    try {
      const summary = await getMandapRatingsSummary();
      const ratingsMap = summary.reduce(
        (
          acc: Record<string, { averageRating: number; totalReviews: number }>,
          item: any
        ) => {
          acc[item._id] = {
            averageRating: item.averageRating,
            totalReviews: item.totalReviews,
          };
          return acc;
        },
        {}
      );
      setRatings((prev) => ({ ...prev, ...ratingsMap }));
    } catch (err) {
      console.error("Error fetching ratings", err);
    }
  };

  useEffect(() => {
    fetchMandaps();
    fetchFavorites();
    fetchRatingsSummary();
  }, []);

  // Reset filters on direct navigation
  useEffect(() => {
    const hasActiveFilters =
      searchTerm || selectedCity || selectedDate || selectedVenueType;

    if (location.pathname === "/mandaps" && !hasActiveFilters) {
      resetFilters();
      setLocalSearchTerm("");
      setLocalSelectedDate("");
      setLocalSelectedCity("");
      setSelectedCapacity([]);
      setSelectedBudget([]);
      setSelectedFoodType("");
    } else {
      setLocalSearchTerm(searchTerm);
      setLocalSelectedDate(selectedDate);
      setLocalSelectedCity(selectedCity);
    }
  }, [location.pathname, resetFilters, searchTerm, selectedDate]);

  const filteredVenues = useMemo(() => {
    return mandaps.filter((venue) => {
      const effectiveSearchTerm = searchTerm.trim();
      const effectiveDate = selectedDate;
      const effectiveCity = selectedCity;

      // Parse selectedDate to Date object
      const selectedDateObj = effectiveDate ? new Date(effectiveDate) : null;
      // Parse availableDates to Date objects and compare dates only (ignoring time)
      const availableDateMatches = effectiveDate
        ? venue.availableDates.some((availableDate) => {
            const availableDateObj = new Date(availableDate);
            return (
              availableDateObj.toISOString().split("T")[0] ===
              selectedDateObj?.toISOString().split("T")[0]
            );
          })
        : true;

      // Search by name, city, or venue type (handling venueType as an array)
      const matchesSearch =
        !effectiveSearchTerm ||
        venue.mandapName
          .toLowerCase()
          .includes(effectiveSearchTerm.toLowerCase()) ||
        venue.address?.city
          .toLowerCase()
          .includes(effectiveSearchTerm.toLowerCase()) ||
        (Array.isArray(venue.venueType) &&
          venue.venueType.some((type) =>
            type.toLowerCase().includes(effectiveSearchTerm.toLowerCase())
          ));

      const matchesCity =
        !effectiveCity ||
        venue.address?.city.toLowerCase().includes(effectiveCity.toLowerCase());

      const matchesVenueType =
        !selectedVenueType ||
        (Array.isArray(venue.venueType) &&
          venue.venueType.some(
            (type) => type.toLowerCase() === selectedVenueType.toLowerCase()
          ));

      const matchesCapacity =
        selectedCapacity.length === 0 ||
        selectedCapacity.some((capacity) => {
          const venueCapacityNum = parseInt(
            typeof venue.guestCapacity === "string"
              ? venue.guestCapacity.split("-")[0] ||
                  venue.guestCapacity.split(" ")[0]
              : venue.guestCapacity
          );
          switch (capacity) {
            case "Upto 100":
              return venueCapacityNum <= 100;
            case "100-250":
              return venueCapacityNum >= 100 && venueCapacityNum <= 250;
            case "250-500":
              return venueCapacityNum >= 250 && venueCapacityNum <= 500;
            case "500-1000":
              return venueCapacityNum >= 500 && venueCapacityNum <= 1000;
            case "Above 1,000":
              return venueCapacityNum > 1000;
            default:
              return true;
          }
        });

      const matchesBudget =
        selectedBudget.length === 0 ||
        selectedBudget.some((budget) => {
          const budgetNum = parseInt(budget.replace(/[₹,]/g, ""));
          return venue.venuePricing <= budgetNum;
        });

      const matchesFoodType = !selectedFoodType || selectedFoodType === "Both";

      return (
        matchesSearch &&
        matchesCity &&
        availableDateMatches &&
        matchesVenueType &&
        matchesCapacity &&
        matchesBudget &&
        matchesFoodType
      );
    });
  }, [
    mandaps,
    searchTerm,
    selectedDate,
    selectedCity,
    selectedVenueType,
    selectedCapacity,
    selectedBudget,
    selectedFoodType,
  ]);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const toggleCapacity = (capacity: string) => {
    setSelectedCapacity((prev) =>
      prev.includes(capacity)
        ? prev.filter((c) => c !== capacity)
        : [...prev, capacity]
    );
  };

  const toggleBudget = (budget: string) => {
    setSelectedBudget((prev) =>
      prev.includes(budget)
        ? prev.filter((b) => b !== budget)
        : [...prev, budget]
    );
  };

  const isFavorite = (mandapId: string) => favoriteIds.includes(mandapId);

  const toggleFavorite = async (venue: Venue) => {
    try {
      if (isFavorite(venue._id)) {
        await removeFavoriteMandap(venue._id);
        setFavoriteIds((prev) => prev.filter((id) => id !== venue._id));
        toast.success("Removed from favorites");
      } else {
        await addFavoriteMandap(venue._id);
        setFavoriteIds((prev) => [...prev, venue._id]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
      console.error("Toggle favorite error:", error);
    }
  };

  const handleSearch = () => {
    setSearchTerm(localSearchTerm.trim());
    setSelectedDate(localSelectedDate);
    setSelectedCity(localSelectedCity.trim());
    setSelectedVenueType(""); // Reset venue type for now (add logic if needed)
    setIsFilterOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Search Section */}
      <div className="mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Enter city, locality, venue or venue type"
              className="w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="md:col-span-4 relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
              value={localSelectedDate}
              onChange={(e) => setLocalSelectedDate(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="md:col-span-3">
            <button
              onClick={handleSearch}
              className="w-full bg-red-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            Wedding Venues Near You
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Found {filteredVenues.length} venues matching your criteria
          </p>
          {selectedCity && (
            <p className="text-sm text-blue-600">City: {selectedCity}</p>
          )}
          {selectedVenueType && (
            <p className="text-sm text-purple-600">
              Venue type: {selectedVenueType}
            </p>
          )}
          {searchTerm && (
            <p className="text-sm text-orange-600">Search: "{searchTerm}"</p>
          )}
          {selectedDate && (
            <p className="text-sm text-green-600">
              Date: {new Date(selectedDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <button
          onClick={toggleFilter}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm md:text-base"
        >
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredVenues.map((venue) => (
          <div
            key={venue._id}
            className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img
                src={
                  venue.venueImages[0] || default_img_url
                }
                alt={venue.mandapName}
                className="w-full h-40 md:h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes("default-venue-placeholder")) {
                    target.src = default_img_url;
                  }
                }}
              />
              <button
                onClick={() => toggleFavorite(venue)}
                className="absolute top-3 md:top-4 right-3 md:right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    isFavorite(venue._id)
                      ? "text-red-500 fill-current"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </div>
            <div className="p-3 md:p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base md:text-lg font-semibold truncate pr-2">
                  {venue.mandapName}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                  <span className="text-xs md:text-sm">
                    {ratings[venue._id]?.averageRating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({ratings[venue._id]?.totalReviews || "No Reviews Yet"})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span className="text-xs md:text-sm truncate">
                  {venue.address?.city || ""}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <span className="text-xs md:text-sm bg-gray-100 px-2 py-1 rounded">
                  {venue.guestCapacity}
                </span>
                {venue.availableDates.length > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {venue.availableDates.length} dates available
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-base md:text-lg font-semibold">
                    ₹{venue.venuePricing.toLocaleString()}
                  </span>
                  <span className="text-gray-600 text-xs md:text-sm">
                    {" "}
                    per day
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/mandaps/${venue._id}`)}
                  className="bg-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded text-xs md:text-sm hover:bg-red-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No venues found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}

      {/* Filter Drawer - Responsive */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-semibold">Filters</h2>
              <button
                onClick={toggleFilter}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Capacity</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Upto 100",
                    "100-250",
                    "250-500",
                    "500-1000",
                    "Above 1,000",
                  ].map((capacity) => (
                    <button
                      key={capacity}
                      onClick={() => toggleCapacity(capacity)}
                      className={`px-3 py-2 border rounded-lg text-sm transition-colors text-left ${
                        selectedCapacity.includes(capacity)
                          ? "bg-red-500 text-white border-red-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {capacity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Budget - Per Day</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "₹25,000",
                    "₹50,000",
                    "₹1,00,000",
                    "₹2,00,000",
                    "₹5,00,000",
                  ].map((budget) => (
                    <button
                      key={budget}
                      onClick={() => toggleBudget(budget)}
                      className={`px-3 py-2 border rounded-lg text-sm transition-colors text-left ${
                        selectedBudget.includes(budget)
                          ? "bg-red-500 text-white border-red-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t">
            <button
              onClick={() => {
                setIsFilterOpen(false);
                handleSearch();
              }}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Show Results ({filteredVenues.length})
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile filter */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleFilter}
        />
      )}
    </div>
  );
};

export default MandapList;
