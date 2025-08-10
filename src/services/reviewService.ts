import axios from "axios";

const BASE_URL = "http://localhost:4000/api/user";

export const getMandapRatingsSummary = async () => {
  const res = await axios.get(`${BASE_URL}/reviews/mandap-rating-summary`);
  return res.data.data.summary;
};

export const getRatingSummaryByMandapId = async (mandapId: string) => {
  const res = await axios.get(`${BASE_URL}/reviews/summary/${mandapId}`);
  return res;
};

export async function getReviewsByMandapId(mandapId: string) {
  const result = await axios.get(`${BASE_URL}/reviews/${mandapId}`);
  return result.data.data.reviews;
}

export async function deleteReviewById(reviewId: string) {
  const result = await axios.delete(`${BASE_URL}/delete-review/${reviewId}`, {
    withCredentials: true,
  });
}

export async function getReviewByReviewId(reviewId: string) {
  const result = await axios.get(`${BASE_URL}/review/${reviewId}`, {
    withCredentials: true,
  });
  return result.data.data.review;
}

export async function updateReview(
  reviewId: string,
  rating: number,
  comment: string
) {
  const result = await axios.put(
    `${BASE_URL}/update-review/${reviewId}`,
    {
      rating,
      comment,
    },
    {
      withCredentials: true,
    }
  );
  return result.data.data.review;
}
