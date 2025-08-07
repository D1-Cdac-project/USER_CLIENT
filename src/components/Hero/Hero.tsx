import React from 'react';
import { MapPin, ChevronDown, Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import useMandapStore from '../../store/useMandapStore';

interface HeroProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  cities: Array<{
    name: string;
    venues: string;
    image: string;
  }>;
}

const Hero = ({ selectedCity, setSelectedCity, selectedDate, setSelectedDate, cities }: HeroProps) => {
  const navigate = useNavigate();
  const { setSearchTerm, setSelectedCity: setStoreCity, setSelectedDate: setStoreDate } = useMandapStore();
  const [searchInput, setSearchInput] = React.useState('');
  const [localCity, setLocalCity] = React.useState('');
  const [localDate, setLocalDate] = React.useState('');

  const handleCityClick = (cityName: string) => {
    // Set search input to city name and trigger search
    setSearchInput(cityName);
    setLocalCity(cityName);
    handleSearch(cityName, localDate);
  };

  const handleSearch = (searchTerm?: string, dateValue?: string) => {
    const searchValue = searchTerm || searchInput.trim();
    const dateVal = dateValue || localDate;
    
    // Reset all filters first
    setSearchTerm('');
    setSelectedCity('');
    setStoreDate('');
    
    // Apply new filters
    if (searchValue) {
      setSearchTerm(searchValue);
    }
    if (dateVal) {
      setStoreDate(dateVal);
    }
    
    // Navigate to mandaps page
    navigate('/mandaps');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative h-[500px] md:h-[600px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80)' }}>
      <div className="absolute inset-0 bg-black bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center pt-16 md:pt-0">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            Find Your Perfect{' '}
            <span className="text-red-500">
              <Typewriter
                options={{
                  strings: ['Wedding Venue', 'Party Mandap', 'Celebration Mandap'],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 50,
                  delay: 50
                }}
              />
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-6 md:mb-8 max-w-2xl px-4">
            Discover and book from over 400+ wedding venues across India
          </p>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-2xl w-full max-w-4xl mx-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  placeholder="Enter city, locality or venue"
                  className="w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm md:text-base"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              
              <div className="md:col-span-4 relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="date"
                  className="w-full pl-10 pr-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm md:text-base"
                  value={localDate}
                  onChange={(e) => setLocalDate(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              
              <div className="md:col-span-3">
                <button 
                  onClick={() => handleSearch()}
                  className="w-full bg-red-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <Search size={20} />
                  Search
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-gray-600 text-sm">Popular cities:</span>
              {cities.slice(0, 4).map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleCityClick(city.name)}
                  className="text-xs md:text-sm px-2 md:px-3 py-1 rounded-full transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6 md:mt-8 flex flex-wrap justify-center items-center gap-4 md:gap-8 px-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                <MapPin className="text-red-500" size={20} />
              </div>
              <div className="text-white text-left">
                <div className="text-lg md:text-2xl font-bold">400+</div>
                <div className="text-xs md:text-sm">Venues</div>
              </div>
            </div>
            
            <div className="w-px h-8 md:h-12 bg-white/30 hidden sm:block"></div>
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                <MapPin className="text-red-500" size={20} />
              </div>
              <div className="text-white text-left">
                <div className="text-lg md:text-2xl font-bold">15+</div>
                <div className="text-xs md:text-sm">Cities</div>
              </div>
            </div>
            
            <div className="w-px h-8 md:h-12 bg-white/30 hidden sm:block"></div>
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center">
                <MapPin className="text-red-500" size={20} />
              </div>
              <div className="text-white text-left">
                <div className="text-lg md:text-2xl font-bold">1000+</div>
                <div className="text-xs md:text-sm">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;