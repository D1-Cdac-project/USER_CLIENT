import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById, completePayment } from "../services/bookingService";
import { ArrowLeft } from "lucide-react";
import { useRazorpayPayment } from "../services/useRazorpayPayment";
import toast from "react-hot-toast";

const CompletePayment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    initiatePayment,
    isRazorpayLoaded,
    error: razorpayError,
  } = useRazorpayPayment();
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(id!);
        setBooking(data);
      } catch (err) {
        setError("Failed to fetch booking details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  useEffect(() => {
    if (razorpayError) {
      toast.error(razorpayError);
    }
  }, [razorpayError]);

  const handleCompletePayment = async () => {
    if (!isRazorpayLoaded) {
      toast.error("Payment gateway is not loaded. Please try again.");
      return;
    }

    if (!booking) {
      toast.error("Booking details not available");
      return;
    }

    if (booking.paymentStatus !== "Partial") {
      toast.error("This booking is not eligible for payment completion");
      return;
    }

    const remainingAmount = booking.totalAmount - booking.amountPaid;

    const options = {
      key: "rzp_test_tycpez465i0XsP",
      amount: Math.round(Number(remainingAmount) * 100),
      currency: "INR",
      name: "Mandap Booking",
      description: "Complete Payment for Booking",
      image: "https://via.placeholder.com/150",
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Event Venue",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: () => {
          toast.error("Payment window closed. Please try again.");
        },
      },
    };

    try {
      const response = await initiatePayment(options);
      if (response.razorpay_payment_id) {
        try {
          const paymentData = {
            paymentAmount: remainingAmount,
            paymentId: response.razorpay_payment_id,
          };
          const result = await completePayment(id!, paymentData);
          console.log("Complete payment API response:", result);
          toast.success("Payment completed successfully!");
          navigate("/booking-history");
        } catch (error) {
          console.error("Error completing payment:", error);
          toast.error("Failed to confirm payment");
        }
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error || "Booking not found"}</p>
        <button
          onClick={() => navigate("/booking-history")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Booking History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/booking-history")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Booking History
        </button>
        <h1 className="text-2xl font-bold">Complete Payment</h1>
        <div></div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Mandap</span>
            <span className="font-semibold">{booking.mandapId.mandapName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-semibold">
              ₹{booking.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount Paid</span>
            <span className="font-semibold">
              ₹{booking.amountPaid.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Remaining Amount</span>
            <span className="font-semibold text-blue-600">
              ₹{(booking.totalAmount - booking.amountPaid).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCompletePayment}
            disabled={!isRazorpayLoaded}
            className={`px-8 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all ${
              isRazorpayLoaded
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Complete Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletePayment;
