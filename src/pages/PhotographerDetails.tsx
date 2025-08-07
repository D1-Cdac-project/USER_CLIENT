import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPhotographerById } from "../services/photographerService";
import { ArrowLeft, Star, ChevronLeft, ChevronRight } from "lucide-react";

const PhotographerDetails: React.FC = () => {
  const { photographerId } = useParams<{ photographerId: string }>();
  const navigate = useNavigate();

  const [photographer, setPhotographer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchPhotographer = async () => {
      if (!photographerId) {
        setError("Invalid photographer ID");
        setLoading(false);
        return;
      }
      try {
        const data = await getPhotographerById(photographerId);
        setPhotographer(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch photographer");
      } finally {
        setLoading(false);
      }
    };
    fetchPhotographer();
  }, [photographerId]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error || !photographer) {
    return (
      <div className="text-center py-10 text-red-500">
        {error || "Photographer not found"}
      </div>
    );
  }

  const reviews = photographer.reviews || [];
  const nextReview = () =>
    setCurrentReviewIndex((i) => (i + 1) % reviews.length);
  const prevReview = () =>
    setCurrentReviewIndex((i) => (i - 1 + reviews.length) % reviews.length);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      {/* Info section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src={photographer.profileImage}
              alt={photographer.photographerName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {photographer.photographerName}
            </h1>
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{photographer.rating}</span>
              <span className="text-gray-500 ml-1">
                ({photographer.reviewCount || reviews.length} reviews)
              </span>
            </div>
            <p className="text-gray-600">{photographer.about}</p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <h2 className="text-2xl font-bold mb-8">Photo Gallery</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
        {(photographer.photographyTypes[0]?.sampleWork || []).map(
          (img: string, idx: number) => (
            <div
              key={idx}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedGalleryImage(img)}
            >
              <img
                src={img}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          )
        )}
      </div>

      {selectedGalleryImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedGalleryImage}
              alt="Gallery"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedGalleryImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Categories */}
      <h2 className="text-2xl font-bold mb-8">Photography Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {(photographer.photographyTypes || []).map((cat: any) => (
          <div
            key={cat.phtype}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="aspect-video relative">
              <img
                src={cat.sampleWork[0]}
                alt={cat.phtype}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">
                  {cat.phtype}
                </h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Starting from</span>
                <span className="text-xl font-bold">
                  ₹{cat.pricePerEvent.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {cat.sampleWork.map((s: string, i: number) => (
                  <img
                    key={i}
                    src={s}
                    alt={`Sample ${i}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Print Options */}
      <h2 className="text-2xl font-bold mb-8">Print Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {(photographer.printOption || []).map((opt: any) => (
          <div
            key={opt.printType}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-2">{opt.printType}</h3>
            <p className="text-gray-600 mb-4">{opt.printDesc}</p>
            <div className="text-lg font-bold text-blue-600">
              ₹{opt.printPrice}/print
            </div>
          </div>
        ))}
      </div>

      {/* Reviews */}
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      {reviews.length > 0 && (
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
            >
              {reviews.map((rev: any) => (
                <div key={rev.id} className="w-full flex-shrink-0 px-2">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{rev.name}</h3>
                      <span className="text-gray-500">{rev.date}</span>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < rev.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{rev.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {reviews.length > 1 && (
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotographerDetails;
