import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Utensils,
  Building,
  ChevronRight,
  X,
  Calendar,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

import {
  getMandapDetailsById,
  getPhotographersByMandapId,
  getCaterersByMandapId,
  getRoomsByMandapId,
} from "../../services/mandapServices";
import { ca } from "date-fns/locale";
import { set } from "date-fns";

interface BookingFormProps {
  mandapId: string;
  onClose: () => void;
  availableDates: Date[];
}

interface PhotographyOption {
  id: string;
  name: string;
  categories: string[];
  basePrice: number;
  portfolio: string;
}

interface CateringPlan {
  name: string;
  price: number;
  items: string[];
}

interface CateringOption {
  id: string;
  name: string;
  plans: CateringPlan[];
  details: string;
}

const photographyOptions: PhotographyOption[] = [
  {
    id: "1",
    name: "John Doe Photography",
    categories: ["Candid", "Cinematic", "Drone", "Traditional"],
    basePrice: 25000,
    portfolio: "/photographer/1",
  },
  {
    id: "2",
    name: "Creative Shots",
    categories: ["Pre-wedding", "Portrait", "Documentary"],
    basePrice: 35000,
    portfolio: "/photographer/2",
  },
];

const cateringOptions: CateringOption[] = [
  {
    id: "1",
    name: "Royal Caterers",
    plans: [
      {
        name: "Basic",
        price: 800,
        items: ["North Indian", "South Indian", "Chinese"],
      },
      {
        name: "Premium",
        price: 1200,
        items: ["North Indian", "South Indian", "Chinese", "Continental"],
      },
      {
        name: "Luxury",
        price: 1500,
        items: ["All Cuisines", "Live Counters", "Dessert Station"],
      },
    ],
    details: "/caterer/1",
  },
];

const roomPrices = {
  ac: 5000,
  nonAc: 3000,
};

export const BookingForm = ({
  mandapId,
  onClose,
  availableDates,
}: BookingFormProps) => {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [mandap, setMandap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [photographerList, setPhotographerList] = useState([]);
  const [catererList, setCatererList] = useState([]);
  const [formData, setFormData] = useState({
    address: "",
    includePhotography: false,
    includeCatering: false,
    includeRooms: false,
    selectedPhotographer: "",
    photographyCategory: "",
    photographyPrice: 0,
    selectedCaterer: "",
    cateringPlan: "",
    acRooms: 0,
    nonAcRooms: 0,
  });

  const fetchMandapDetails = async () => {
    try {
      console.log(mandapId);
      setIsLoading(true);
      const result = await getMandapDetailsById(mandapId);
      setMandap(result.data.data.mandap);
    } catch (error) {
      console.error("Error fetching mandap details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPhotographerList = async () => {
    try {
      const result = await getPhotographersByMandapId(mandapId);

      setPhotographerList(result.data.data.photographers);
    } catch (error) {
      console.error("Error fetching photographer list:", error);
    }
  };

  const getCatererList = async () => {
    try {
      const result = await getCaterersByMandapId(mandapId);
      console.log(result);
      setCatererList(result.data.data.caterers);
    } catch (error) {
      console.error("Error fetching caterer list:", error);
    }
  };

  const [roomList, setRoomList] = useState({});

  const getRoomsList = async () => {
    try {
      const result = await getRoomsByMandapId(mandapId);
      console.log(result);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchMandapDetails(),
      getPhotographerList(),
      getCatererList(),
      getRoomsList();
  }, [mandapId]);

  const calculateTotalPrice = () => {
    let total = mandap.venuePricing || 0;
    // let total = 0;

    // Photography
    if (
      formData.includePhotography &&
      formData.selectedPhotographer &&
      formData.photographyCategory
    ) {
      const photographer = photographyOptions.find(
        (p) => p.id === formData.selectedPhotographer
      );
      if (photographer) {
        total += photographer.basePrice;
      }
    }

    // Catering
    if (
      formData.includeCatering &&
      formData.selectedCaterer &&
      formData.cateringPlan
    ) {
      const caterer = cateringOptions.find(
        (c) => c.id === formData.selectedCaterer
      );
      const plan = caterer?.plans.find((p) => p.name === formData.cateringPlan);
      if (plan) {
        total += plan.price;
      }
    }

    // Rooms
    if (formData.includeRooms) {
      total +=
        formData.acRooms * roomPrices.ac +
        formData.nonAcRooms * roomPrices.nonAc;
    }

    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const stripe = await loadStripe("your_publishable_key");

      // Here you would typically make an API call to your backend to create a payment intent
      // For now, we'll just redirect to the Stripe setup page
      window.location.href = "https://bolt.new/setup/stripe";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Book Your Perfect Venue
            </h2>
            <p className="text-blue-100 mt-1">
              Complete your booking with additional services
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Selection Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Select Your Event Dates
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto border rounded-xl p-4 bg-white">
                {availableDates.map((date, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDates.some(
                        (d) => d.getTime() === date.getTime()
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDates([...selectedDates, date]);
                        } else {
                          setSelectedDates(
                            selectedDates.filter(
                              (d) => d.getTime() !== date.getTime()
                            )
                          );
                        }
                      }}
                      className="rounded w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">
                      {date.toLocaleDateString()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Event Address
              </label>
              <textarea
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Enter the complete address for your event..."
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            {/* Photography Section */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Camera className="w-6 h-6 mr-3 text-purple-600" />
                  <div>
                    <span className="text-lg font-semibold">
                      Photography Services
                    </span>
                    <p className="text-sm text-gray-600">
                      Capture your special moments
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.includePhotography}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        includePhotography: e.target.checked,
                      })
                    }
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {formData.includePhotography && (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] bg-white rounded-lg overflow-hidden shadow-sm">
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
                        {/* {photographyOptions.map((photographer) => ( */}
                        {photographerList.map((photographer, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={
                                  formData.selectedPhotographer ===
                                  photographer._id
                                }
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    selectedPhotographer: e.target.checked
                                      ? photographer._id
                                      : "",
                                  })
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
                                        p._id === formData.selectedPhotographer
                                    );
                                  const selectedType =
                                    selectedPhotographer?.phtypes.find(
                                      (pt) => pt.phtype === selectedCategory
                                    );
                                  setFormData({
                                    ...formData,
                                    photographyCategory: selectedCategory,
                                    photographyPrice: selectedType
                                      ? selectedType.pricePerEvent
                                      : 0,
                                  });
                                }}
                                disabled={
                                  formData.selectedPhotographer !==
                                  photographer._id
                                }
                              >
                                <option value="">Select Category</option>
                                {photographer.photographyTypes.map(
                                  (category, index) => (
                                    <option key={index} value={category.phtype}>
                                      {category.phtype}
                                    </option>
                                  )
                                )}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600">
                              ₹{photographer.photographyTypes[0].pricePerEvent}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                // onClick={() => navigate(photographer.portfolio)}
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

            {/* Catering Section */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Utensils className="w-6 h-6 mr-3 text-green-600" />
                  <div>
                    <span className="text-lg font-semibold">
                      Catering Services
                    </span>
                    <p className="text-sm text-gray-600">
                      Delicious food for your guests
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.includeCatering}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        includeCatering: e.target.checked,
                      })
                    }
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {formData.includeCatering && (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] bg-white rounded-lg overflow-hidden shadow-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Select
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Caterer
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Plan
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold">
                            Price/Plate
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
                                  setFormData({
                                    ...formData,
                                    selectedCaterer: e.target.checked
                                      ? caterer._id
                                      : "",
                                  })
                                }
                                className="w-4 h-4 text-green-600 rounded"
                              />
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              {caterer.catereName}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                className="border rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-green-500"
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    cateringPlan: e.target.value,
                                  })
                                }
                                disabled={
                                  formData.selectedCaterer !== caterer.id
                                }
                              >
                                <option value="">Select Plan</option>
                                {caterer.plans.map((plan) => (
                                  <option key={plan.name} value={plan.name}>
                                    {plan.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600">
                              ₹
                              {formData.cateringPlan
                                ? caterer.plans
                                    .find(
                                      (p) => p.name === formData.cateringPlan
                                    )
                                    ?.price.toLocaleString()
                                : "Select plan"}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => navigate(caterer.details)}
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

            {/* Rooms Section */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Building className="w-6 h-6 mr-3 text-orange-600" />
                  <div>
                    <span className="text-lg font-semibold">Room Booking</span>
                    <p className="text-sm text-gray-600">
                      Comfortable stay for your guests
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.includeRooms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        includeRooms: e.target.checked,
                      })
                    }
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              {formData.includeRooms && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      AC Rooms (₹{roomPrices.ac}/night)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={formData.acRooms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          acRooms: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Non-AC Rooms (₹{roomPrices.nonAc}/night)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={formData.nonAcRooms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nonAcRooms: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Total Price */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Total Booking Amount
                </h3>
                {!isLoading ? (
                  <div className="text-3xl font-bold text-blue-600">
                    ₹{calculateTotalPrice().toLocaleString()}
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-gray-400">
                    Loading...
                  </div>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  All services included
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg transform hover:scale-105 transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
