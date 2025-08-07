import React from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface CustomerReviewsProps {
  currentReviewIndex: number;
  prevReview: () => void;
  nextReview: () => void;
}

const CustomerReviews = ({ currentReviewIndex, prevReview, nextReview }: CustomerReviewsProps) => {
  const reviews = [
    {
      name: "Priya Sharma",
      venue: "Royal Gardens, Mumbai",
      rating: 5,
      comment: "Found my dream wedding venue through Mandap.com. The platform made it so easy to compare different venues and their services.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
    },
    {
      name: "Rahul Verma",
      venue: "Grand Palace, Delhi",
      rating: 5,
      comment: "Excellent service! The venue recommendations were perfect for our budget and requirements. Highly recommended!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80"
    },
    {
      name: "Anjali Patel",
      venue: "Sunset Resort, Bangalore",
      rating: 5,
      comment: "The customer service team was incredibly helpful. They helped us find the perfect venue within our budget.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80"
    },
    {
      name: "Vikram Singh",
      venue: "Beach Paradise, Goa",
      rating: 5,
      comment: "Mandap.com made our destination wedding planning so much easier. Great platform with excellent venues!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">What our customers say</h2>
        <div className="relative">
          <div className="flex overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div 
                  key={index}
                  className="w-full flex-shrink-0 px-2 md:px-4"
                >
                  <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-sm md:text-base">{review.name}</h3>
                        <p className="text-gray-600 text-xs md:text-sm">{review.venue}</p>
                      </div>
                    </div>
                    <div className="flex mb-3 md:mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 hidden md:block"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 hidden md:block"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Mobile navigation dots */}
          <div className="flex justify-center mt-6 md:hidden">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  index === currentReviewIndex ? 'bg-red-500' : 'bg-gray-300'
                }`}
                onClick={() => {
                  const diff = index - currentReviewIndex;
                  if (diff > 0) {
                    for (let i = 0; i < diff; i++) nextReview();
                  } else if (diff < 0) {
                    for (let i = 0; i < Math.abs(diff); i++) prevReview();
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;