import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Utensils,
  Star,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ICaterer, getCatererById } from "../services/catererServices";
import { useDispatch } from "react-redux";
import { setCatererBooking } from "../features/booking/catererBookingSlice";


const CatererDetails = () => {
  const { mandapId } = useParams();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [plates, setPlates] = useState(100);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const { catererId } = useParams<{ catererId: string }>();

  const [caterer, setCaterer] = useState<ICaterer | null>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCaterer = async () => {
      try {
        if (!catererId) return;
        const data = await getCatererById(catererId);
        console.log(data);
        setCaterer(data);
      } catch (error) {
        console.error("Error fetching public caterer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaterer();
  }, [catererId]);

  if (loading) return <p>Loading...</p>;
  if (!caterer) return <p>No caterer found</p>;

  if (!caterer) {
    return <div>Caterer not found</div>;
  }

  // Custom Menu Total
  const customMenuTotal = selectedItems.reduce((total, item) => {
    const itemPrice =
      caterer.customizableItems.find((i) => i.itemName === item)?.itemPrice ||
      0;
    return total + itemPrice * plates;
  }, 0);

  // Plan Total
  const planTotal = selectedPlan
    ? (caterer.menuCategory.find((p) => p.category === selectedPlan)
        ?.pricePerPlate || 0) * plates
    : 0;

  const totalPrice = planTotal + customMenuTotal;

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % caterer.reviewsList.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex(
      (prev) =>
        (prev - 1 + caterer.reviewsList.length) % caterer.reviewsList.length
    );
  };

  dispatch(
  setCatererBooking({
    catererId: caterer._id,
    catererName: caterer.catererName,
    totalPrice: totalPrice,
  })
);


  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Booking
      </button>

      {/* Caterer Info */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src={caterer.profileImage}
              alt={caterer.catererName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{caterer.catererName}</h1>
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{caterer.rating || 4.5}</span>
              <span className="text-gray-500 ml-1">
                ({caterer.reviewsList?.length || 10} reviews)
              </span>
            </div>
            <p className="text-gray-600">{caterer.about}</p>
          </div>
        </div>
      </div>

      {/* Pre-defined Plans */}
      <h2 className="text-2xl font-bold mb-8">Our Plans</h2>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {caterer.menuCategory.map((plan) => (
          <div
            key={plan.category}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{plan.category}</h3>
                <input
                  type="radio"
                  name="selectedPlan"
                  checked={selectedPlan === plan.category}
                  onChange={() =>
                    setSelectedPlan(selectedPlan === plan.category ? "" : plan.category)
                  }
                  className="w-5 h-5"
                />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-4">
                ₹{plan.pricePerPlate}/plate
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <img
                  src={plan.categoryImage}
                  alt={`${plan.category} image`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>

              <div className="space-y-6">
                <h4 className="font-medium text-lg">Menu Items</h4>

                {/* Grouped Items by Type */}
                {["Starter", "Main Course", "Dessert"].map((type) => {
                  const filteredItems = plan.menuItems.filter(
                    (item) => item.itemType === type
                  );
                  return filteredItems.length > 0 ? (
                    <div key={type}>
                      <h5 className="font-semibold mb-2">{type}</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {filteredItems.map((item) => (
                          <li key={item._id}>
                            {item.itemName} <span className="text-gray-500">– ₹{item.itemPrice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Menu Builder */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-8">Build Your Custom Menu</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {["Starter", "Main Course", "Dessert"].map((type) => {
            const items = caterer.customizableItems.filter(
              (item) => item.itemType === type
            );

            if (items.length === 0) return null;

            return (
              <div key={type}>
                <h4 className="text-lg font-semibold mb-4 text-purple-700">{type}</h4>
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between py-2"
                  >
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.itemName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.itemName]);
                          } else {
                            setSelectedItems(
                              selectedItems.filter((i) => i !== item.itemName)
                            );
                          }
                        }}
                        className="mr-2"
                      />
                      {item.itemName}
                    </label>
                    <span>₹{item.itemPrice}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <label className="block font-medium mb-2">Number of Plates</label>
          <input
            type="number"
            min="50"
            value={plates}
            onChange={(e) => setPlates(parseInt(e.target.value))}
            className="w-32 px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="mt-8 text-right">
          {selectedPlan && (
            <div className="mb-4">
              <div className="text-lg font-semibold">
                Selected Plan: {selectedPlan}
              </div>
              <div className="text-xl font-bold text-blue-600">
                Plan Total: ₹{planTotal.toLocaleString()}
              </div>
            </div>
          )}

          {customMenuTotal > 0 && (
            <div className="mb-4">
              <div className="text-lg font-semibold">
                Custom Menu Total: ₹{customMenuTotal.toLocaleString()}
              </div>
            </div>
          )}

          <div className="text-2xl font-bold">
            Grand Total: ₹{totalPrice.toLocaleString()}
          </div>
          <div className="text-gray-600">{plates} plates</div>
        </div>
      </div>


      {/* Reviews */}
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
          >
            {caterer.reviewsList?.map((review) => (
              <div key={review.id} className="w-full flex-shrink-0 px-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{review.name}</h3>
                    <span className="text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {caterer.reviewsList?.length > 1 && (
          <>
            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Review indicators */}
            <div className="flex justify-center mt-6">
              {caterer.reviewsList?.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${
                    index === currentReviewIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentReviewIndex(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CatererDetails;
