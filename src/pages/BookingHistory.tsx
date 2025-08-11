import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingsByUser, deleteBooking } from "../services/bookingService";
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Eye,
  Trash2,
} from "lucide-react";
import BookingDetailsModal from "../components/BookingDetailsModal/BookingDetailsModal";
import toast from "react-hot-toast";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const default_img_url =
    "https://res.cloudinary.com/dgglqlhsm/image/upload/v1754673671/BookMyMandap/bjxp4lzznjlflnursrms.png";

  const currentDate = new Date();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByUser();
        setBookings(data);
      } catch (err) {
        toast.error("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCompletePayment = (booking) => {
    navigate(`/complete-payment/${booking._id}`);
  };

  const handleDeleteBooking = async (bookingId) => {
    setBookingToCancel(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      await deleteBooking(bookingToCancel);
      setBookings(
        bookings.filter((booking) => booking._id !== bookingToCancel)
      );
      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (error) {
      toast.error("Failed to delete booking");
      setShowCancelModal(false);
    }
  };

  const handleUpdateBooking = (bookingId) => {
    toast.error("Update booking feature is not yet implemented");
  };

  const canCancelBooking = (booking) => {
    if (booking.paymentStatus === "Cancelled") return false;
    const bookedDate = new Date(booking?.orderDates?.[0]);
    return currentDate <= bookedDate;
  };

  if (loading) {
    return <div className="text-center py-10">Loading booking history...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        Booking History
      </h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No bookings found.</p>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 h-full">
                  <img
                    src={booking?.mandapId?.venueImages?.[0] || default_img_url}
                    alt={booking?.mandapId?.mandapName || "Mandap"}
                    className="w-full max-h-56 lg:h-full object-cover"
                    onError={(e) => {
                      const target = e.target;
                      if (!target.src.includes(default_img_url)) {
                        target.src = default_img_url;
                      }
                    }}
                  />
                </div>
                <div className="p-4 md:p-6 flex-1">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold">
                        {booking?.mandapId?.mandapName}
                      </h2>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          {booking?.mandapId?.address?.city}
                        </span>
                      </div>
                    </div>
                    {booking.paymentStatus === "Partial" ? (
                      <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                        {booking?.paymentStatus}
                      </span>
                    ) : booking.paymentStatus === "Completed" ? (
                      <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        {booking?.paymentStatus}
                      </span>
                    ) : booking.paymentStatus === "Cancelled" ? (
                      <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                        {booking?.paymentStatus}
                      </span>
                    ) : (
                      <p></p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Event Date</p>
                        <p className="text-sm">
                          {new Date(
                            booking?.orderDates?.[0]
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Guests</p>
                        <p className="text-sm">
                          {booking?.mandapId?.guestCapacity || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <IndianRupee className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Amount</p>
                        <p className="text-sm">
                          ₹{booking?.totalAmount?.toLocaleString() || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="flex items-center justify-center px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    {booking.paymentStatus === "Partial" && (
                      <button
                        onClick={() => handleCompletePayment(booking)}
                        className="flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Complete Payment
                      </button>
                    )}
                    {canCancelBooking(booking) && (
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Cancellation</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCancelBooking}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
