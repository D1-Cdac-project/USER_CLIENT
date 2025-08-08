import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Play,
  Heart,
  MoreVertical,
  Star,
  Check,
  Calendar,
  Pencil,
  Trash,
} from "lucide-react";

import AvailabilityModal from "../components/AvailabilityModal/AvailabilityModal";
import { getMandapDetails } from "../services/mandapServices";

import {
  getRatingSummaryByMandapId,
  getReviewsByMandapId,
  deleteReviewById,
  getMandapRatingsSummary,
} from "../services/reviewService";
import { getUserDetails } from "../services/userService";
import { toast } from "react-toastify";
import EditReviewModal from "../components/EditReviewModal/EditReviewModal";

// Generate sample available dates
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    // Skip some dates to simulate unavailability
    if (i % 3 !== 0) {
      dates.push(date);
    }
  }
  return dates;
};

const MandapDetails = () => {
  const { mandapId } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedTab, setSelectedTab] = useState("about");
  const [showAvailability, setShowAvailability] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [mandap, setMandap] = useState({});
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [reviews, setReviews] = useState([]);
  const [showAllImagesModal, setShowAllImagesModal] = useState(false);
  const [rating, setRating] = useState<{
    averageRating: number;
    totalReviews: number;
  } | null>(null);

  const [user, setUser] = useState();
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const default_img_url = "https://res.cloudinary.com/dgglqlhsm/image/upload/v1754673671/BookMyMandap/bjxp4lzznjlflnursrms.png";
  const getVenue = async () => {
    try {
      setIsLoading(true);
      const result = await getMandapDetails(mandapId);
      setMandap(result);

      setAvailableDates(
        result.availableDates.map((date: string) => new Date(date))
      );
      setSelectedImage(result.venueImages?.[0] || default_img_url);
    } catch (error) {
      console.error("Error fetching mandap details:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const year = mandap.createdAt ? new Date(mandap.createdAt).getFullYear() : "";

  const getReview = async () => {
    const result = await getReviewsByMandapId(mandapId);
    setReviews(result);
    console.log("Reviews:", result);

    const rating = await getMandapRatingsSummary();
    setAverageRating(rating[1].averageRating.toFixed(1));
    setTotalReviews(rating[1].totalReviews);
  };

  const getUser = async () => {
    const userDetails = await getUserDetails();
    setUser(userDetails);
  };
  const currentUser = user?.user?._id;

  const deleteReview = async (reviewId: string) => {
    const originalReviews = [...reviews];
    setReviews(reviews.filter((review) => review._id !== reviewId));
    try {
      const response = await deleteReviewById(reviewId);
      console.log(response);
    } catch (error) {
      setReviews(originalReviews); // Restore original reviews on error
      console.error("Error deleting review:", error);
    }
  };

  useEffect(() => {
    getVenue();
    getReview();
    getUser();
  }, []);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await getRatingSummaryByMandapId(mandapId);
        console.log(res.data);
        setRating(res.data.data);
      } catch (err) {
        console.error("Failed to fetch rating summary:", err);
      }
    };

    if (mandapId) {
      fetchRating();
    }
  }, [mandapId]);

  const handleDateSelect = (date: Date) => {
    if (isLoggedIn) {
      navigate(`/mandaps/${mandapId}/book?date=${date.toISOString()}`);
    } else {
      navigate("/login");
    }
  };

  const venueImages = mandap.venueImages || [];
  const displayImages = [];
  const defaultImage = default_img_url;

  if (venueImages.length === 0) {
    displayImages.push(
      { url: defaultImage },
      { url: defaultImage },
      { url: defaultImage },
      { url: defaultImage }
    );
  } else if (venueImages.length <= 3) {
    venueImages.forEach(img => displayImages.push({ url: img }));
    while (displayImages.length < 4) {
      displayImages.push({ url: defaultImage });
    }
  } else if (venueImages.length === 4) {
    venueImages.forEach(img => displayImages.push({ url: img }));
  } else {
    venueImages.slice(0, 3).forEach(img => displayImages.push({ url: img }));
    displayImages.push({
      url: defaultImage,
      count: venueImages.length - 3,
      isCount: true,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <a href="/mandaps" className="text-rose-500">
          Home
        </a>
        <span className="mx-2">/</span>
        <span className="truncate">{mandap.mandapName}</span>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6 md:mb-8">
        {/* Main Image */}
        <div className="lg:col-span-4 relative rounded-lg overflow-hidden">
          <img
            src={selectedImage}
            alt={mandap.mandapName}
            className="w-full h-64 md:h-[500px] object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = default_img_url;
              if (target.src !== fallback) {
                target.src = fallback;
              }
            }}
          />
        </div>

        {/* Thumbnail Grid */}
        <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-24 h-24 lg:w-full lg:h-[120px] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => {
                if (image.isCount) {
                  setShowAllImagesModal(true);
                } else {
                  setSelectedImage(image.url);
                }
              }}
            >
              {image.isCount ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-semibold">
                  +{image.count} more
                </div>
              ) : (
                <img
                  src={image.url}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes(default_img_url)) {
                      target.src = defaultImage;
                    }
                  }}
                />
              )}
            </div>
          ))}

        </div>
      </div>

      {/* Venue Info */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-6 md:mb-8 gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center mb-2 gap-2">
            {averageRating >= 4.5 ? (
              <span className="bg-emerald-100 text-emerald-800 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full">
                Most Preferred
              </span>
            ) : (
              <div></div>
            )}
            <button className="lg:hidden">
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
            {mandap.mandapName}
          </h1>
          <p className="text-gray-600 mb-2 text-sm md:text-base">
            {mandap.address?.city || "City"}
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-xs md:text-sm">
              {rating?.averageRating?.toFixed(1) || "0.0"}
            </span>
            <br />
            <span className="text-xs text-gray-500">
              ({rating?.totalReviews || "No Reviews Yet"})
            </span>
          </div>
        </div>
        <div className="text-left lg:text-right w-full lg:w-auto">
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            ₹{mandap.venuePricing}
          </div>
          <div className="text-gray-500 text-sm md:text-base">Per Day</div>
          <div className="mt-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2">
            <button
              onClick={() => setShowAvailability(true)}
              className="flex items-center justify-center px-4 md:px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 text-sm md:text-base"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Check Availability
            </button>
            <button
              onClick={() => {
                if (isLoggedIn) {
                  navigate(`/mandaps/${mandap._id}/book`);
                } else {
                  navigate("/login");
                }
              }}
              className="px-4 md:px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 text-sm md:text-base"
            >
              Book Mandap
            </button>
          </div>
        </div>
      </div>

      {showAvailability && (
        <AvailabilityModal
          venueName={mandap.mandapName}
          availableDates={availableDates}
          onClose={() => setShowAvailability(false)}
          onDateSelect={handleDateSelect}
        />
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 md:mb-8">
        <nav className="flex space-x-4 md:space-x-8 overflow-x-auto">
          {["about", "amenities", "photos", "reviews"].map((tab) => (
            <button
              key={tab}
              className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap text-sm md:text-base ${
                selectedTab === tab
                  ? "border-rose-500 text-rose-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === "about" && (
        <div className="space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              About Venue
            </h2>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <img
                src={selectedImage}
                alt={mandap.mandapName}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const fallback = default_img_url;
                  if (target.src !== fallback) {
                    target.src = fallback;
                  }
                }}
              />
              <div>
                <h3 className="font-medium">Owned By {mandap.providerName}</h3>
                <p className="text-gray-500 text-sm">
                  On BookMyMandap since {year}
                </p>
                <p className="mt-4 text-gray-600 text-sm md:text-base">
                  {mandap.mandapDesc}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Policies</h2>
            <div>
              <div className="border border-gray-200 rounded-lg divide-y">
                <div className="p-4 flex justify-between items-center">
                  <div className="text-sm md:text-base">
                    Security deposit ({mandap.securityDepositType})
                  </div>
                  <div className="font-medium text-sm md:text-base">
                    ₹{mandap.securityDeposit}
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="text-sm md:text-base">Advance payment</div>
                  <div className="font-medium text-sm md:text-base">
                    {mandap.advancePayment || 30}%
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </section>
        </div>
      )}

      {selectedTab === "amenities" && (
        <div className="space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mandap.amenities?.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Check className="h-4 md:h-5 w-4 md:w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm md:text-base">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Policies</h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start space-x-2">
                <Check className="h-4 md:h-5 w-4 md:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">
                  {mandap.cancellationPolicy}
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              Other Information
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start space-x-2">
                <Check className="h-4 md:h-5 w-4 md:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm md:text-base">
                  Property Type - {mandap.venueType?.join(", ")}
                </span>
              </div>
              {Object.entries(mandap.outdoorFacilities)
                .filter(([key]) => key !== "propertyType")
                .map(([key, value], index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Check className="h-4 md:h-5 w-4 md:w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{value}</span>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}

      {selectedTab === "photos" && (
        <div className="space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Photo Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {venueImages.length > 0
                ? venueImages.map((image: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt="Mandap"
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const fallback = default_img_url;
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                      />
                    </div>
                  ))
                : Array(4)
                    .fill(defaultImage)
                    .map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt="Default Mandap"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
            </div>
          </section>
        </div>
      )}

      {selectedTab === "reviews" && (
        <div className="space-y-6 md:space-y-8">
          <section>
            <h2 className="text-lg md:text-xl font-semibold mb-4">Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <div>
                        <h3 className="font-medium text-sm md:text-base">
                          {review.userId.fullName}
                        </h3>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 md:h-4 w-3 md:w-4 ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col justify-between h-14">
                        <div className="text-xs md:text-sm text-gray-500">
                          {`${new Date(review.createdAt).getDate()}/${new Date(
                            review.createdAt
                          ).getMonth()}/${new Date(
                            review.createdAt
                          ).getFullYear()}`}
                        </div>
                        {currentUser === review.userId._id ? (
                          <div className="flex justify-end">
                            <button onClick={() => setSelectedReview(review)}>
                              <Pencil className="h-5 w-5 text-green-500 hover:text-green-700" />
                            </button>
                            <button onClick={() => deleteReview(review._id)}>
                              <Trash className="h-5 w-5 text-red-500 hover:text-red-700 ml-4" />
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">
                      {review.comment}
                    </p>
                    {review.isVerifiedBooking && (
                      <div className="mt-2 flex items-center text-emerald-600 text-xs md:text-sm">
                        <Check className="h-3 md:h-4 w-3 md:w-4 mr-1" />
                        Verified Booking
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Book this venue to add a review
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      {showAllImagesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">All Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {venueImages.map((image: string, index: number) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt="Gallery Image"
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAllImagesModal(false)}
              className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedReview && (
        <EditReviewModal
          reviewId={selectedReview._id}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
};

export default MandapDetails;
