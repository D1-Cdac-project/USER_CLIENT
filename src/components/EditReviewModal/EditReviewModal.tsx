  import React from 'react'
  import { X ,  Star} from 'lucide-react'

  import { getReviewByReviewId , updateReview } from '../../services/reviewService';
  import { useEffect } from 'react';

  interface EditReviewModalProps {
      reviewId: string;
      onClose: () => void
  }

  function EditReviewModal({reviewId , onClose}: EditReviewModalProps) {
    const [rating , setRating] = React.useState(0);
    const [comment , setComment] = React.useState("");

    const populateReview = async() =>{
      try {
        const review = await getReviewByReviewId(reviewId);
        // Populate the form with review data
        console.log(review);
        setRating(review.rating);
        setComment(review.comment);
      } catch (error) {
        console.error("Error fetching review:", error);
      }
    }

    const handleSubmit = async () =>{
      try{
        const updatedReview = await updateReview(reviewId, rating, comment);
        onClose()
      }
      catch (error) {
        console.error("Error updating review:", error);
      }
    }

    useEffect(() => {
      populateReview();
    }, []);
      
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl md:text-2xl font-bold">Edit your review</h2>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                      <X className='w-5 h-5'/>
                  </button>
              </div>
              <div className='flex items-center mb-4 mt-4 ml-3'>
                <div className='text-md  mr-2'> Your Rating:</div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 cursor-pointer ${
                      i < rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                    }`}
                    fill="currentColor"
                    onClick={() => setRating(i + 1)}
                  />
                ))}    
              </div>
              <div className='flex flex-col items-start mb-4 ml-3 mr-3'>
                <div className='text-md mb-2'>Your Comment:</div>
                <textarea
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full  h-24 p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none mb-3"
                  />
              </div>
              <div className='flex justify-center p-4'>
                <button
                className="px-6 py-2 rounded-lg text-white bg-rose-500 hover:bg-rose-600"
                onClick={handleSubmit}>
                  Submit
                </button>
              </div>
          </div>
      </div>
    )
  }

  export default EditReviewModal
