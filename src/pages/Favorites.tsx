import React, { useEffect, useState } from "react";
import { Heart, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getAllFavoriteMandaps,
  removeFavoriteMandap,
} from "../services/favouriteServices";

import { getMandapRatingsSummary } from "../services/reviewService";

interface Address {
  _id: string;
  state: string;
  city: string;
  pinCode: string;
  __v: number;
}

interface Mandap {
  _id: string;
  mandapName: string;
  venueImages: string[];
  venuePricing: number;
  address: Address;
  guestCapacity: number;
  reviews?: number;
  rating?: number;
}

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Mandap[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<
    Record<string, { averageRating: number; totalReviews: number }>
  >({});
  const default_img_url =
    "https://res.cloudinary.com/dgglqlhsm/image/upload/v1754673671/BookMyMandap/bjxp4lzznjlflnursrms.png";

  const fetchFavorites = async () => {
    try {
      setLoading(true);

      const favs = await getAllFavoriteMandaps();
      setFavorites(favs.data.data.favoriteMandaps);
    } catch (err) {
      console.error(err);
      setError("Failed to load favorite mandaps.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (mandapId: string) => {
    try {
      await removeFavoriteMandap(mandapId);
      setFavorites((prev) => prev.filter((m) => m._id !== mandapId));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const favs = await getAllFavoriteMandaps();
        setFavorites(favs.data.data.favoriteMandaps);

        const summary = await getMandapRatingsSummary();

        const map = summary.reduce((acc: any, item: any) => {
          acc[item._id] = {
            averageRating: item.averageRating,
            totalReviews: item.totalReviews,
          };
          return acc;
        }, {} as Record<string, { averageRating: number; totalReviews: number }>);

        setRatings(map);
      } catch (err) {
        console.error(err);
        setError("Failed to load favorite mandaps.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading favorites...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Favorite Mandaps</h1>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((venue) => (
            <div
              key={venue._id}
              className="border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <div className="relative">
                <img
                  src={venue.venueImages[0] || default_img_url}
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
                  onClick={() => handleRemoveFavorite(venue._id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{venue.mandapName}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-xs md:text-sm">
                      {ratings[venue._id]?.averageRating?.toFixed(1) ?? "0.0"}
                    </span>
                    <br />
                    <span className="text-xs text-gray-500">
                      ({ratings[venue._id]?.totalReviews ?? "No Reviews yet"})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{venue.address?.city}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {venue.guestCapacity} Guests
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-semibold">
                      ₹{venue.venuePricing?.toLocaleString()}
                    </span>
                    <span className="text-gray-600 text-sm"> per day</span>
                  </div>
                  <button
                    onClick={() => navigate(`/mandaps/${venue._id}`)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No favorites yet
          </h2>
          <p className="text-gray-500">
            Start adding mandaps to your favorites by clicking the heart icon
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
