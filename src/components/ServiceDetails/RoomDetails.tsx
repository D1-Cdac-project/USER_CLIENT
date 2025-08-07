import React from 'react';
import { Building2, Check } from 'lucide-react';

const rooms = {
  ac: {
    count: 10,
    price: 5000,
    amenities: [
      'Air Conditioning',
      'TV',
      'Mini Fridge',
      'Room Service',
      'Free Wi-Fi'
    ],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80'
    ]
  },
  nonAc: {
    count: 5,
    price: 3000,
    amenities: [
      'Fan',
      'TV',
      'Room Service',
      'Free Wi-Fi'
    ],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80'
    ]
  }
};

const RoomDetails = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="flex items-center gap-4 mb-8">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Room Accommodations</h1>
        </div>
        
        {/* AC Rooms */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">AC Rooms</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="aspect-video rounded-xl overflow-hidden mb-4">
                <img
                  src={rooms.ac.images[0]}
                  alt="AC Room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {rooms.ac.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`AC Room ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-6">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  ₹{rooms.ac.price.toLocaleString()}/night
                </div>
                <div className="text-gray-600">
                  {rooms.ac.count} rooms available
                </div>
              </div>
              <h3 className="font-semibold mb-4">Amenities</h3>
              <ul className="grid grid-cols-2 gap-y-2">
                {rooms.ac.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Non-AC Rooms */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Non-AC Rooms</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="aspect-video rounded-xl overflow-hidden mb-4">
                <img
                  src={rooms.nonAc.images[0]}
                  alt="Non-AC Room"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {rooms.nonAc.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Non-AC Room ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-6">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  ₹{rooms.nonAc.price.toLocaleString()}/night
                </div>
                <div className="text-gray-600">
                  {rooms.nonAc.count} rooms available
                </div>
              </div>
              <h3 className="font-semibold mb-4">Amenities</h3>
              <ul className="grid grid-cols-2 gap-y-2">
                {rooms.nonAc.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;