import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useMandapStore from "../../store/useMandapStore";

interface CitiesProps {
  cities: Array<{
    name: string;
    venues: string;
    image: string;
  }>;
}

const Cities = ({ cities }: CitiesProps) => {
  const navigate = useNavigate();
  const { setSelectedCity, resetFilters } = useMandapStore();
  const [showAllCities, setShowAllCities] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const displayedCities = showAllCities ? cities : cities.slice(0, 3);

  const handleCityClick = (cityName: string) => {
    // Reset all filters first
    resetFilters();
    // Set the city as search term so it searches for venues in that city
    setSearchTerm(cityName);
    setSelectedCity(cityName);
    navigate("/mandaps");
  };

  return (
    <section className="py-8 md:py-16 max-w-7xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        Wedding venues by city
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {displayedCities.map((city) => (
          <div
            key={city.name}
            className="relative rounded-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-transform duration-300"
            onClick={() => handleCityClick(city.name)}
          >
            <img
              src={city.image}
              alt={city.name}
              className="w-full h-48 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 group-hover:bg-opacity-50 transition-all">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white text-lg md:text-xl font-semibold">
                    {city.name}
                  </h3>
                  <p className="text-white text-sm md:text-base">
                    {city.venues} Venues
                  </p>
                </div>
                <ChevronRight
                  className="text-white transition-transform group-hover:translate-x-1"
                  size={24}
                />
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                Click to explore
              </span>
            </div>
          </div>
        ))}
      </div>

      {!showAllCities && cities.length > 3 && (
        <div className="flex justify-center mt-6 md:mt-8">
          <button
            onClick={() => setShowAllCities(true)}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base"
          >
            View More Cities
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Cities;
