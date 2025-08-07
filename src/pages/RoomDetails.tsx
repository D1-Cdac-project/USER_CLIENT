import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  Check,
  ArrowLeft,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getRoomByRoomId } from "../services/mandapServices";

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({
    ac: 0,
    nonAc: 0,
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) {
        setError("Invalid room ID");
        setLoading(false);
        return;
      }
      try {
        const result = await getRoomByRoomId(roomId);
        setRoomData(result);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch room details");
      } finally {
        setLoading(false);
      }
    };
    fetchRoomData();
  }, [roomId]);

  const nextImage = (type) => {
    const images =
      type === "ac"
        ? roomData?.AcRoom?.roomImages || []
        : roomData?.NonAcRoom?.roomImages || [];
    if (images.length > 0) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [type]: (prev[type] + 1) % images.length,
      }));
    }
  };

  const prevImage = (type) => {
    const images =
      type === "ac"
        ? roomData?.AcRoom?.roomImages || []
        : roomData?.NonAcRoom?.roomImages || [];
    if (images.length > 0) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [type]: (prev[type] - 1 + images.length) % images.length,
      }));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !roomData) {
    return (
      <div className="text-center py-16 text-red-600 font-semibold text-lg">
        {error || "Room not found"}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-gray-100 min-h-screen font-inter">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-3 mb-8 px-5 py-3 bg-gradient-to-br from-white to-indigo-50 hover:bg-indigo-100 rounded-2xl shadow-lg text-indigo-800 font-semibold transition-all duration-300"
      >
        <ArrowLeft className="w-6 h-6" />
        Back to Booking
      </button>

      {/* Room Info Header */}
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-xl p-10 mb-12">
        <div className="flex items-center gap-4 mb-8">
          <Building2 className="w-10 h-10 text-indigo-700" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Room Accommodations
          </h1>
        </div>

        {/* AC Rooms */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">AC Rooms</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="relative">
                <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-lg">
                  <img
                    src={
                      roomData.AcRoom?.roomImages?.[currentImageIndex.ac] ||
                      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    }
                    alt="AC Room"
                    className="w-full h-full object-cover"
                  />
                </div>
                {roomData.AcRoom?.roomImages?.length > 1 && (
                  <>
                    <button
                      onClick={() => prevImage("ac")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300"
                    >
                      <ChevronLeft className="w-6 h-6 text-indigo-800" />
                    </button>
                    <button
                      onClick={() => nextImage("ac")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300"
                    >
                      <ChevronRight className="w-6 h-6 text-indigo-800" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xl font-semibold text-gray-800">
                <strong>Number of Rooms:</strong>{" "}
                {roomData.AcRoom?.noOfRooms || 0}
              </p>
              <p className="text-xl font-semibold text-gray-800">
                <strong>Price per Night:</strong>{" "}
                {roomData.AcRoom?.pricePerNight
                  ? `₹${Number(roomData.AcRoom.pricePerNight).toLocaleString()}`
                  : "N/A"}
              </p>
              <p className="text-xl font-semibold text-gray-800">
                <strong>Amenities:</strong>
              </p>
              <ul className="space-y-3">
                {roomData.AcRoom?.amenities &&
                roomData.AcRoom.amenities.length > 0 ? (
                  roomData.AcRoom.amenities.map((amenity, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-lg text-gray-700"
                    >
                      <Check className="w-5 h-5 text-green-600" />
                      {amenity}
                    </li>
                  ))
                ) : (
                  <li className="text-lg text-gray-700">No amenities listed</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Non-AC Rooms */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Non-AC Rooms
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="relative">
                <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-lg">
                  <img
                    src={
                      roomData.NonAcRoom?.roomImages?.[
                        currentImageIndex.nonAc
                      ] ||
                      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    }
                    alt="Non-AC Room"
                    className="w-full h-full object-cover"
                  />
                </div>
                {roomData.NonAcRoom?.roomImages?.length > 1 && (
                  <>
                    <button
                      onClick={() => prevImage("nonAc")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300"
                    >
                      <ChevronLeft className="w-6 h-6 text-indigo-800" />
                    </button>
                    <button
                      onClick={() => nextImage("nonAc")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300"
                    >
                      <ChevronRight className="w-6 h-6 text-indigo-800" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xl font-semibold text-gray-800">
                <strong>Number of Rooms:</strong>{" "}
                {roomData.NonAcRoom?.noOfRooms || 0}
              </p>
              <p className="text-xl font-semibold text-gray-800">
                <strong>Price per Night:</strong>{" "}
                {roomData.NonAcRoom?.pricePerNight
                  ? `₹${Number(
                      roomData.NonAcRoom.pricePerNight
                    ).toLocaleString()}`
                  : "N/A"}
              </p>
              <p className="text-xl font-semibold text-gray-800">
                <strong>Amenities:</strong>
              </p>
              <ul className="space-y-3">
                {roomData.NonAcRoom?.amenities &&
                roomData.NonAcRoom.amenities.length > 0 ? (
                  roomData.NonAcRoom.amenities.map((amenity, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-lg text-gray-700"
                    >
                      <Check className="w-5 h-5 text-green-600" />
                      {amenity}
                    </li>
                  ))
                ) : (
                  <li className="text-lg text-gray-700">No amenities listed</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
