import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  Camera,
  Utensils,
  Building,
  ChevronRight,
  Calendar,
  ArrowLeft,
  MapPin,
  Users,
  IndianRupee,
} from "lucide-react";
import {
  getCaterersByMandapId,
  getMandapDetails,
  getPhotographersByMandapId,
  getRoomsByMandapId,
} from "../services/mandapServices";
import {
  setMandap,
  setPhotographerList,
  setCatererList,
  setRoomList,
  setAvailableDates,
  setSelectedDates,
  updateFormData,
  resetBookingState,
  startBooking,
} from "../features/booking/bookingSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { clearCatererBooking } from "../features/booking/catererBookingSlice";
import { addBooking } from "../services/bookingService";
import { useRazorpayPayment } from "../services/useRazorpayPayment";
import { toast } from "react-hot-toast";
const default_img_url =
  "https://res.cloudinary.com/dgglqlhsm/image/upload/v1754673671/BookMyMandap/bjxp4lzznjlflnursrms.png";

const Booking = () => {
  const { mandapId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const preSelectedDate = searchParams.get("date");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentOption, setPaymentOption] = useState<"full" | "advance">(
    "full"
  );
  const {
    initiatePayment,
    isRazorpayLoaded,
    error: razorpayError,
  } = useRazorpayPayment();

  const storedMandapId = useSelector((state: any) => state.booking.mandapId);
  const bookingState = useSelector((state: RootState) => state.catererBooking);
  const catererBooking = useSelector(
    (state: RootState) => state.catererBooking
  );
  const {
    mandap,
    photographerList,
    catererList,
    roomList,
    availableDates,
    selectedDates,
    formData,
  } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    if (razorpayError) {
      toast.error(razorpayError);
    }
  }, [razorpayError]);

  useEffect(() => {
    const path = location.pathname;
    const bookingPages = [
      new RegExp(`^/mandaps/${mandapId}/book$`),
      /^\/photographer\/[^/]+$/,
      /^\/caterer\/[^/]+$/,
      /^\/room\/[^/]+$/,
    ];
    const isBookingFlow = bookingPages.some((regex) => regex.test(path));

    if (isBookingFlow) {
      if (!storedMandapId || storedMandapId !== mandapId) {
        dispatch(startBooking(mandapId!));
      }
    } else {
      dispatch(resetBookingState());
    }
  }, [location.pathname, mandapId, storedMandapId, dispatch]);

  useEffect(() => {
    if (bookingState.mandapId && bookingState.mandapId !== mandapId) {
      dispatch(clearCatererBooking());
    }
  }, [mandapId, dispatch]);

  const fetchMandapDetails = async () => {
    try {
      setIsLoading(true);
      const result = await getMandapDetails(mandapId);
      dispatch(setMandap(result));
      dispatch(
        setAvailableDates(
          result.availableDates.map((date: string) =>
            new Date(date).toISOString()
          )
        )
      );
    } catch (error) {
      console.error("Error fetching mandap details:", error);
      toast.error("Failed to fetch mandap details");
    } finally {
      setIsLoading(false);
    }
  };

  const getPhotographerList = async () => {
    try {
      const result = await getPhotographersByMandapId(mandapId);
      dispatch(setPhotographerList(result));
    } catch (error) {
      console.error("Error fetching photographer list:", error);
      toast.error("Failed to fetch photographer list");
    }
  };

  const getCatererList = async () => {
    try {
      const result = await getCaterersByMandapId(mandapId);
      dispatch(setCatererList(result));
    } catch (error) {
      console.error("Error fetching caterer list:", error);
      toast.error("Failed to fetch caterer list");
    }
  };

  const getRoomsList = async () => {
    try {
      const result = await getRoomsByMandapId(mandapId);
      dispatch(setRoomList(result));
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    }
  };

  useEffect(() => {
    if (mandapId) {
      fetchMandapDetails();
      getPhotographerList();
      getCatererList();
      getRoomsList();
    }
  }, [mandapId]);

  const calculateTotalPrice = () => {
    let total = (mandap.venuePricing || 0) + (mandap.securityDeposit || 0);

    if (
      formData.includePhotography &&
      formData.selectedPhotographer &&
      formData.photographyCategory
    ) {
      const photographer = photographerList.find(
        (p) => p._id === formData.selectedPhotographer
      );
      const selectedType = photographer?.photographyTypes.find(
        (pt) => pt.phtype === formData.photographyCategory
      );
      if (selectedType) {
        total += selectedType.pricePerEvent;
      }
    }

    if (formData.includeCatering && formData.selectedCaterer) {
      const caterer = catererList.find(
        (c) => c._id === formData.selectedCaterer
      );
      const plan = caterer?.plans?.find(
        (p) => p.name === formData.cateringPlan
      );
      total += catererBooking.totalPrice;
    }

    if (formData.includeRooms && roomList && roomList[0]) {
      total +=
        formData.acRooms * (roomList[0].AcRoom?.pricePerNight || 0) +
        formData.nonAcRooms * (roomList[0].NonAcRoom?.pricePerNight || 0);
    }

    total *= selectedDates.length || 1;
    return total;
  };

  const calculateAdvancePrice = () => {
    const total = calculateTotalPrice();
    const advancePercentage = mandap.advancePayment || 0;
    return (total * advancePercentage) / 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!localStorage.getItem("userToken")) {
      toast.error("Please login to make a payment");
      navigate("/login");
      return;
    }

    if (selectedDates.length === 0) {
      toast.error("Please select at least one date for your event");
      return;
    }

    if (!isRazorpayLoaded) {
      toast.error("Payment gateway is not loaded. Please try again.");
      return;
    }

    const totalAmount = calculateTotalPrice();
    const amountToPay =
      paymentOption === "full" ? totalAmount : calculateAdvancePrice();

    const options = {
      key: "rzp_test_tycpez465i0XsP",
      amount: Math.round(Number(amountToPay) * 100),
      currency: "INR",
      name: "Mandap Booking",
      description: `Event Booking Payment (${
        paymentOption === "full" ? "Full" : "Advance"
      })`,
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
      if (!response.razorpay_payment_id) {
        throw new Error("Payment ID not received from Razorpay");
      }
      const bookingData = {
        mandapId: mandapId!,
        orderDates: selectedDates.map((date) => {
          const dateObj = typeof date === "string" ? new Date(date) : date;
          if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
            throw new Error(`Invalid date format: ${date}`);
          }
          return dateObj.toISOString().split("T")[0];
        }),
        photographer: formData.includePhotography
          ? [formData.selectedPhotographer]
          : [],
        caterer: formData.includeCatering ? [formData.selectedCaterer] : [],
        room:
          formData.includeRooms &&
          (formData.acRooms > 0 || formData.nonAcRooms > 0)
            ? roomList[0]?._id
            : null,
        totalAmount: totalAmount,
        amountPaid: amountToPay,
        paymentId: response.razorpay_payment_id,
      };

      try {
        const result = await addBooking(bookingData);

        if (result.status) {
          toast.success("Booking placed successfully!");
          dispatch(clearCatererBooking());
          dispatch(resetBookingState());
          setTimeout(() => {
            navigate("/booking-history");
          }, 200);
        } else {
          toast.error(result.data.message || "Failed to confirm booking");
        }
      } catch (error: any) {
        console.error(
          "Error confirming booking:",
          error.response?.data || error.message
        );
        toast.error("An error occurred while confirming your booking");
      }
    } catch (error: any) {
      console.error("Error initiating payment:", error.message);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Venue Details
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Complete Your Booking
            </h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Venue Details</h2>
                <div className="flex items-start gap-4">
                  <img
                    src={mandap.venueImages?.[0] || default_img_url}
                    alt={mandap.mandapName}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes(default_img_url)) {
                        target.src = default_img_url;
                      }
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {mandap.mandapName}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{mandap.address?.city}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{mandap.guestCapacity} guests</span>
                      </div>
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        <span>₹{mandap.venuePricing?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        <span>
                          Security Deposit: ₹
                          {mandap.securityDeposit?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Select Your Event Dates
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto border rounded-xl p-4 bg-gray-50">
                  {availableDates.map((dateStr, index) => {
                    const date = new Date(dateStr);
                    return (
                      <label
                        key={index}
                        className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors bg-white border"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDates.some(
                            (d) => new Date(d).getTime() === date.getTime()
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              dispatch(
                                setSelectedDates([
                                  ...selectedDates,
                                  date.toISOString(),
                                ])
                              );
                            } else {
                              dispatch(
                                setSelectedDates(
                                  selectedDates.filter(
                                    (d) =>
                                      new Date(d).getTime() !== date.getTime()
                                  )
                                )
                              );
                            }
                          }}
                          className="rounded w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm font-medium">
                          {date.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Camera className="w-6 h-6 mr-3 text-purple-600" />
                    <div>
                      <span className="text-lg font-semibold">
                        Photography Services
                      </span>
                      <p className="text-sm text-gray-600">
                        Capture your special moments (Optional)
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.includePhotography}
                      onChange={(e) =>
                        dispatch(
                          updateFormData({
                            ...formData,
                            includePhotography: e.target.checked,
                          })
                        )
                      }
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {formData.includePhotography && (
                  <div className="space-y-6">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] bg-white rounded-lg overflow-hidden shadow-sm border">
                        <thead>
                          <tr className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                            <th className="px-4 py-3 text-left text-sm font-semibold">
                              Select
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">
                              Photographer
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">
                              Category
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">
                              Price
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {photographerList.map((photographer, index) => (
                            <tr
                              key={index}
                              className="border-t hover:bg-gray-50"
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={
                                    formData.selectedPhotographer ===
                                    photographer._id
                                  }
                                  onChange={(e) =>
                                    dispatch(
                                      updateFormData({
                                        ...formData,
                                        selectedPhotographer: e.target.checked
                                          ? photographer._id
                                          : "",
                                      })
                                    )
                                  }
                                  className="w-4 h-4 text-blue-600 rounded"
                                />
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">
                                {photographer.photographerName}
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  className="border rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500"
                                  onChange={(e) => {
                                    const selectedCategory = e.target.value;
                                    const selectedPhotographer =
                                      photographerList.find(
                                        (p) =>
                                          p._id ===
                                          formData.selectedPhotographer
                                      );
                                    const selectedType =
                                      selectedPhotographer?.photographyTypes.find(
                                        (pt) => pt.phtype === selectedCategory
                                      );
                                    dispatch(
                                      updateFormData({
                                        ...formData,
                                        photographyCategory: selectedCategory,
                                        photographyPrice: selectedType
                                          ? selectedType.pricePerEvent
                                          : 0,
                                      })
                                    );
                                  }}
                                  disabled={
                                    formData.selectedPhotographer !==
                                    photographer._id
                                  }
                                >
                                  <option value="">Select Category</option>
                                  {photographer.photographyTypes?.map(
                                    (category: any, index: number) => (
                                      <option
                                        key={index}
                                        value={category.phtype}
                                      >
                                        {category.phtype}
                                      </option>
                                    )
                                  )}
                                </select>
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-green-600">
                                ₹
                                {(() => {
                                  if (
                                    formData.selectedPhotographer ===
                                      photographer._id &&
                                    formData.photographyCategory
                                  ) {
                                    const selectedType =
                                      photographer.photographyTypes.find(
                                        (pt) =>
                                          pt.phtype ===
                                          formData.photographyCategory
                                      );
                                    return selectedType?.pricePerEvent ?? 0;
                                  }
                                  return 0;
                                })()}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/photographer/${photographer._id}`
                                    )
                                  }
                                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium hover:underline"
                                >
                                  View Work
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Utensils className="w-6 h-6 mr-3 text-green-600" />
                    <div>
                      <span className="text-lg font-semibold">
                        Catering Services
                      </span>
                      <p className="text-sm text-gray-600">
                        Delicious food for your guests (Optional)
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.includeCatering}
                      onChange={(e) =>
                        dispatch(
                          updateFormData({
                            ...formData,
                            includeCatering: e.target.checked,
                          })
                        )
                      }
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                {formData.includeCatering && (
                  <div className="space-y-6">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] bg-white rounded-lg overflow-hidden shadow-sm border">
                        <thead>
                          <tr className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                            <th className="px-4 py-3 text-left text-sm font-semibold">
                              Select
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">
                              Caterer
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {catererList.map((caterer, index) => (
                            <tr
                              key={caterer._id}
                              className="border-t hover:bg-gray-50"
                            >
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={
                                    formData.selectedCaterer === caterer._id
                                  }
                                  onChange={(e) =>
                                    dispatch(
                                      updateFormData({
                                        ...formData,
                                        selectedCaterer: e.target.checked
                                          ? caterer._id
                                          : "",
                                      })
                                    )
                                  }
                                  className="w-4 h-4 text-green-600 rounded"
                                />
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">
                                {caterer.catererName}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/mandap/${mandapId}/book/caterer/${caterer._id}`
                                    )
                                  }
                                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium hover:underline"
                                >
                                  View Details
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Building className="w-6 h-6 mr-3 text-orange-600" />
                    <div>
                      <span className="text-lg font-semibold">
                        Room Booking
                      </span>
                      <p className="text-sm text-gray-600">
                        Comfortable stay for your guests (Optional)
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.includeRooms}
                      onChange={(e) =>
                        dispatch(
                          updateFormData({
                            ...formData,
                            includeRooms: e.target.checked,
                          })
                        )
                      }
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                {formData.includeRooms && roomList && roomList[0] && (
                  <div className="space-y-6">
                    <div className="text-sm text-gray-600">
                      <p className="font-family: 'Roboto', sans-serif; font-weight: 600; color: #1a202c; mb-2">
                        Total AC Rooms Available:{" "}
                        {roomList[0].AcRoom?.noOfRooms || 0}
                      </p>
                      <p className="font-family: 'Roboto', sans-serif; font-weight: 600; color: #1a202c; mb-2">
                        Total Non-AC Rooms Available:{" "}
                        {roomList[0].NonAcRoom?.noOfRooms || 0}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/room/${roomList[0]._id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                    >
                      View Details
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          AC Rooms to Book (₹
                          {roomList[0].AcRoom?.pricePerNight || 0}/night)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={roomList[0].AcRoom?.noOfRooms || 0}
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          value={formData.acRooms}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            if (value <= (roomList[0].AcRoom?.noOfRooms || 0)) {
                              dispatch(
                                updateFormData({
                                  ...formData,
                                  acRooms: value,
                                })
                              );
                            } else {
                              toast.error(
                                `Maximum ${
                                  roomList[0].AcRoom?.noOfRooms || 0
                                } AC rooms can be booked.`
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Non-AC Rooms to Book (₹
                          {roomList[0].NonAcRoom?.pricePerNight || 0}/night)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={roomList[0].NonAcRoom?.noOfRooms || 0}
                          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          value={formData.nonAcRooms}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            if (
                              value <= (roomList[0].NonAcRoom?.noOfRooms || 0)
                            ) {
                              dispatch(
                                updateFormData({
                                  ...formData,
                                  nonAcRooms: value,
                                })
                              );
                            } else {
                              toast.error(
                                `Maximum ${
                                  roomList[0].NonAcRoom?.noOfRooms || 0
                                } Non-AC rooms can be booked.`
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="full"
                      checked={paymentOption === "full"}
                      onChange={() => setPaymentOption("full")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Pay Full Amount (₹{calculateTotalPrice().toLocaleString()}
                      )
                    </label>
                  </div>
                  {mandap.advancePayment > 0 && (
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentOption"
                        value="advance"
                        checked={paymentOption === "advance"}
                        onChange={() => setPaymentOption("advance")}
                        className="w-4 h-4 text-blue-600"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Pay Advance ({mandap.advancePayment}% - ₹
                        {calculateAdvancePrice().toLocaleString()})
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isRazorpayLoaded}
                  className={`px-8 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all ${
                    isRazorpayLoaded
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Booking Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Venue Cost ({selectedDates.length}{" "}
                    {selectedDates.length === 1 ? "day" : "days"})
                  </span>
                  <span className="font-semibold">
                    ₹
                    {(mandap.venuePricing || 0) *
                      selectedDates.length.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Security Deposit ({selectedDates.length}{" "}
                    {selectedDates.length === 1 ? "day" : "days"})
                  </span>
                  <span className="font-semibold">
                    ₹
                    {(mandap.securityDeposit || 0) *
                      selectedDates.length.toLocaleString()}
                  </span>
                </div>
                {formData.includePhotography &&
                  formData.selectedPhotographer &&
                  formData.photographyCategory && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Photography</span>
                      <span className="font-semibold">
                        ₹
                        {(formData.photographyPrice || 0) *
                          selectedDates.length.toLocaleString()}
                      </span>
                    </div>
                  )}
                {formData.includeCatering && formData.selectedCaterer && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Catering</span>
                    <span className="font-semibold">
                      ₹
                      {(catererBooking.totalPrice || 0) *
                        selectedDates.length.toLocaleString()}
                    </span>
                  </div>
                )}
                {formData.includeRooms &&
                  (formData.acRooms > 0 || formData.nonAcRooms > 0) &&
                  roomList &&
                  roomList[0] && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Accommodation</span>
                      <span className="font-semibold">
                        ₹
                        {(formData.acRooms *
                          (roomList[0].AcRoom?.pricePerNight || 0) +
                          formData.nonAcRooms *
                            (roomList[0].NonAcRoom?.pricePerNight || 0)) *
                          selectedDates.length.toLocaleString()}
                      </span>
                    </div>
                  )}
                {selectedDates.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="text-sm text-gray-600 mb-2">
                      Selected Dates:
                    </div>
                    <div className="space-y-1">
                      {selectedDates.map((dateStr, index) => {
                        const date = new Date(dateStr);
                        return (
                          <div
                            key={index}
                            className="text-sm bg-blue-50 px-2 py-1 rounded"
                          >
                            {date.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-blue-600">
                      {selectedDates.length > 0
                        ? `₹${calculateTotalPrice().toLocaleString()}`
                        : "₹0"}
                    </span>
                  </div>
                  {paymentOption === "advance" && (
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span>Advance Payment ({mandap.advancePayment}%)</span>
                      <span className="text-blue-600">
                        ₹{calculateAdvancePrice().toLocaleString()}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    All services included
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
