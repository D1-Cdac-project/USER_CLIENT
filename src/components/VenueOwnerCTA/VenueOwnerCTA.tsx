import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VenueOwnerCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 md:py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Are you a Venue owner?</h2>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">List your venue for FREE</p>
            <button 
              onClick={() => navigate('/explore-venue')}
              className="bg-cyan-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2 mx-auto lg:mx-0 text-sm md:text-base"
            >
              Explore now
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"
              alt="Venue listing"
              className="rounded-lg max-w-full w-full max-w-sm object-cover h-48 md:h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueOwnerCTA;