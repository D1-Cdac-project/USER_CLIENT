import React from "react";
import { useParams } from "react-router-dom";
import { MapPin, Calendar, Users, IndianRupee, Star } from "lucide-react";

const BookingDetails = () => {
  const { mandapId } = useParams();

  // This would be fetched from your backend
  const booking = {
    id: 1,
    venueName: "The Grand Pavilion",
    location: "Whitefield, Bangalore",
    date: "2024-03-15",
    guests: 500,
    amount: "₹1,25,000",
    status: "Confirmed",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80",
    photography: {
      type: "Candid",
      price: "₹50,000",
      sampleImages: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80",
      ],
    },
    catering: {
      type: "Premium",
      pricePerPlate: "₹1,200",
      menu: {
        starters: ["Paneer Tikka", "Mushroom 65"],
        mains: ["Dal Makhani", "Butter Naan"],
        desserts: ["Gulab Jamun", "Ice Cream"],
      },
    },
    rooms: {
      total: 5,
      ac: 3,
      nonAc: 2,
      pricePerNight: "₹5,000",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Booking Details</h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Venue Details */}
        <div className="p-6 border-b">
          <div className="flex items-start gap-6">
            <img
              src={booking.image}
              alt={booking.venueName}
              className="w-48 h-32 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {booking.venueName}
              </h2>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{booking.location}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-600" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-gray-600" />
                  <span>{booking.guests} guests</span>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="w-4 h-4 mr-1 text-gray-600" />
                  <span>{booking.amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photography */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold mb-4">Photography</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-2">Type: {booking.photography.type}</p>
              <p>Price: {booking.photography.price}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {booking.photography.sampleImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Sample ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Catering */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold mb-4">Catering</h3>
          <p className="mb-4">
            Package: {booking.catering.type} (₹{booking.catering.pricePerPlate}{" "}
            per plate)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Starters</h4>
              <ul className="space-y-1">
                {booking.catering.menu.starters.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Main Course</h4>
              <ul className="space-y-1">
                {booking.catering.menu.mains.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Desserts</h4>
              <ul className="space-y-1">
                {booking.catering.menu.desserts.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Rooms */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Accommodation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p>Total Rooms: {booking.rooms.total}</p>
              <p>AC Rooms: {booking.rooms.ac}</p>
              <p>Non-AC Rooms: {booking.rooms.nonAc}</p>
              <p>Price per night: {booking.rooms.pricePerNight}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star
                key={rating}
                className="w-6 h-6 text-gray-300 cursor-pointer hover:text-yellow-400"
              />
            ))}
          </div>
          <textarea
            placeholder="Share your experience..."
            className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
          <button className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600">
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
