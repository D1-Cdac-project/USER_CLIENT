import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Eye,
  BookIcon,
} from "lucide-react";
import BookingDetailsModal from "../components/BookingDetailsModal/BookingDetailsModal";
import { getBookingsByUser } from "../services/bookingService";
import { useNavigate } from "react-router-dom";

const BookingHistory = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByUser();
        setBookings(data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const navigate = useNavigate();
  const handleCompletePayment = (booking) => {
  // Example: redirect to payment page
  navigate(`/complete-payment/${booking._id}`);
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
                    src={
                      booking?.mandapId?.venueImages?.[0] ||
                      "https://via.placeholder.com/300"
                    }
                    alt={booking?.mandapId?.mandapName || "Mandap"}
                    className="w-full max-h-56 lg:h-full object-cover"
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
                    {booking.paymentStatus == "Partial" ? (
                        <div className="flex flex-col items-start gap-2 mt-2 sm:mt-0">
                          <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                            {booking?.paymentStatus}
                          </span>
                        </div>
                      ) : booking.paymentStatus == "Completed" ? (
                        <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          {booking?.paymentStatus}
                        </span>
                      ) : booking.paymentStatus == "Cancelled" ? (
                        <span className="mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm bg-danger-100 text-red-800">
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
                          {booking?.mandapId?.venuePricing || "₹—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
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
    </div>
  );
};

export default BookingHistory;
