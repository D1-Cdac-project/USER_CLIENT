import React from 'react';
import { Camera, Star } from 'lucide-react';

const categories = [
  {
    name: 'Candid',
    samples: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80',
    ],
    price: 25000
  },
  {
    name: 'Cinematic',
    samples: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80',
    ],
    price: 35000
  },
  {
    name: 'Drone',
    samples: [
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80',
    ],
    price: 45000
  }
];

const paperTypes = [
  { name: 'Glossy', price: 150, description: 'High shine finish, vibrant colors', sample: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80' },
  { name: 'Matte', price: 120, description: 'Non-reflective, elegant finish', sample: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80' },
  { name: 'Pearl', price: 200, description: 'Subtle shimmer, premium look', sample: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80' }
];

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    comment: "Amazing photography! Captured our special moments beautifully.",
    date: "2024-02-15"
  },
  {
    id: 2,
    name: "Rahul Verma",
    rating: 4,
    comment: "Professional service and great attention to detail.",
    date: "2024-02-10"
  }
];

const PhotographyDetails = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Photographer Info */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80"
              alt="Photographer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">John Doe Photography</h1>
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">4.8</span>
              <span className="text-gray-500 ml-1">(120 reviews)</span>
            </div>
            <p className="text-gray-600 max-w-2xl">
              Professional photographer with over 10 years of experience specializing in wedding photography.
              Capturing your special moments with a unique blend of traditional and contemporary styles.
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <h2 className="text-2xl font-bold mb-8">Photography Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {categories.map((category) => (
          <div key={category.name} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={category.samples[0]}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">{category.name}</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Starting from</span>
                <span className="text-xl font-bold">₹{category.price.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {category.samples.map((sample, index) => (
                  <img
                    key={index}
                    src={sample}
                    alt={`${category.name} sample ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paper Types */}
      <h2 className="text-2xl font-bold mb-8">Print Options</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {paperTypes.map((paper) => (
          <div key={paper.name} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={paper.sample}
              alt={paper.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{paper.name}</h3>
              <p className="text-gray-600 mb-4">{paper.description}</p>
              <div className="text-lg font-bold text-blue-600">
                ₹{paper.price}/print
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{review.name}</h3>
              <span className="text-gray-500">{review.date}</span>
            </div>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotographyDetails;