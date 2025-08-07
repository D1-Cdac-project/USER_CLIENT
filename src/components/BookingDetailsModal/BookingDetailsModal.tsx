import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { X, MapPin, Calendar, Users, IndianRupee, Star } from "lucide-react";

const BookingDetailsModal = ({ booking, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleReviewSubmit = async () => {
    if (!rating || !comment.trim()) {
      return toast.error("Please provide both a rating and comment.");
    }

    setSubmitting(true);
    try {
      await axios.post(
        "http://localhost:4000/api/user/add-review",
        {
          mandapId: booking?.mandapId?._id,
          rating,
          comment,
          bookingId: booking?._id,
        },
        {
          withCredentials: true,
        }
      );

      setSubmitted(true);
      toast.success("Review submitted!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold">Booking Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Venue Details */}
          <div className="border-b pb-6 mb-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <img
                src={booking?.mandapId?.venueImages?.[0]}
                alt={booking?.mandapId?.mandapName}
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold mb-2">
                  {booking?.mandapId?.mandapName}
                </h3>
                <div className="flex flex-wrap items-center text-gray-600 mb-2 gap-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {booking?.mandapId?.address?.city}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {new Date(booking?.orderDates?.[0]).toDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">
                      {booking?.mandapId?.guestCapacity} guests
                    </span>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    <span className="text-sm">{booking?.totalAmount}</span>
                  </div>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    booking?.paymentStatus === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking?.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Photography */}
          {booking?.photographer?.[0] && (
            <div className="border-b pb-6 mb-6">
              <h4 className="text-lg font-semibold mb-4">Photography</h4>
              <p className="mb-2">
                Name: {booking.photographer[0].photographerName}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {booking.photographer[0].photographyTypes.map((type, index) => (
                  <div key={index}>
                    <p className="mb-1">Type: {type.phtype}</p>
                    <p className="mb-3">Price/Event: ₹{type.pricePerEvent}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Catering */}
          {booking?.caterer?.[0] && (
            <div className="border-b pb-6 mb-6">
              <h4 className="text-lg font-semibold mb-4">Catering</h4>
              <p className="mb-2">Name: {booking.caterer[0].catererName}</p>
              <p className="mb-2">Food Type: {booking.caterer[0].foodType}</p>
              <p className="mb-4">
                Price Per Plate: ₹
                {booking.caterer[0].menuCategory.pricePerPlate}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2">Menu Items</h5>
                  <ul className="space-y-1">
                    {booking.caterer[0].menuCategory.menuItems.map(
                      (item, index) => (
                        <li key={index} className="text-sm">
                          {item.itemName} - ₹{item.itemPrice}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                {booking.caterer[0].customizableItems.length > 0 && (
                  <div>
                    <h5 className="font-semibold mb-2">Custom Items</h5>
                    <ul className="space-y-1">
                      {booking.caterer[0].customizableItems.map(
                        (item, index) => (
                          <li key={index} className="text-sm">
                            {item.itemName} - ₹{item.itemPrice}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rooms */}
          {booking?.room && (
            <div className="border-b pb-6 mb-6">
              <h4 className="text-lg font-semibold mb-4">Accommodation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2">AC Rooms</h5>
                  <p>No. of Rooms: {booking.room.AcRoom.noOfRooms}</p>
                  <p>Price/Night: ₹{booking.room.AcRoom.pricePerNight}</p>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Non-AC Rooms</h5>
                  <p>No. of Rooms: {booking.room.NonAcRoom.noOfRooms}</p>
                  <p>Price/Night: ₹{booking.room.NonAcRoom.pricePerNight}</p>
                </div>
              </div>
            </div>
          )}

          {/* Review */}
          {booking?.isReviewAdded === false && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
              <div className="space-y-4">
                <div className="flex items-center mb-4 space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`w-6 h-6 cursor-pointer ${
                        value <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setRating(value)}
                    />
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full h-24 p-4 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
                <button
                  disabled={submitting || submitted}
                  onClick={handleReviewSubmit}
                  className={`px-6 py-2 rounded-lg text-white ${
                    submitted
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-rose-500 hover:bg-rose-600"
                  }`}
                >
                  {submitted
                    ? "Submitted"
                    : submitting
                    ? "Submitting..."
                    : "Submit Review"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default BookingDetailsModal;
