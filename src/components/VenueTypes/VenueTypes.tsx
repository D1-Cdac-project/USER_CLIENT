import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useMandapStore from "../../store/useMandapStore";
import { useState } from "react";
interface VenueTypesProps {
  venueTypes: Array<{
    type: string;
    count: string;
    image: string;
  }>;
}

const VenueTypes = ({ venueTypes }: VenueTypesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setSelectedVenueType, resetFilters } = useMandapStore();
  const [searchTerm, setSearchTerm] = useState("");

  const handleVenueTypeClick = (venueType: string) => {
    // Reset all filters first
    resetFilters();
    // Set the venue type as search term so it searches for that venue type
    setSearchTerm(venueType);
    setSelectedVenueType(venueType);
    navigate("/mandaps");
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollLeft +=
        direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <section className="py-8 md:py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          Wedding venues by type
        </h2>
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-4 md:gap-6 px-4 md:px-12"
            style={{ scrollBehavior: "smooth" }}
          >
            {venueTypes.map((venue) => (
              <div
                key={venue.type}
                className="flex-none w-48 md:w-64 cursor-pointer transform hover:scale-105 transition-transform duration-300"
                onClick={() => handleVenueTypeClick(venue.type)}
              >
                <div className="text-center">
                  <div className="rounded-full overflow-hidden w-32 h-32 md:w-40 md:h-40 mx-auto mb-3 md:mb-4">
                    <img
                      src={venue.image}
                      alt={venue.type}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">
                    {venue.type}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {venue.count} venues
                  </p>
                  <div className="mt-2">
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
                      Click to explore
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 hidden md:block"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default VenueTypes;
