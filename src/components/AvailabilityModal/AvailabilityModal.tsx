import React, { useState, useMemo } from "react";
import { X, Calendar, Search } from "lucide-react";

interface AvailabilityModalProps {
  venueName: string;
  availableDates: Date[];
  onClose: () => void;
  onDateSelect?: (date: Date) => void;
}

const AvailabilityModal = ({
  venueName,
  availableDates,
  onClose,
  onDateSelect,
}: AvailabilityModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
      onClose();
    }
  };

  const filteredDates = useMemo(() => {
    if (!searchTerm) return availableDates;

    return availableDates.filter((date) => {
      const dateString = date
        .toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
        .toLowerCase();

      const searchLower = searchTerm.toLowerCase();

      // Search by various date formats
      return (
        dateString.includes(searchLower) ||
        date.toLocaleDateString().includes(searchTerm) ||
        date.getDate().toString().includes(searchTerm) ||
        date
          .toLocaleDateString("en-US", { month: "long" })
          .toLowerCase()
          .includes(searchLower) ||
        date
          .toLocaleDateString("en-US", { month: "short" })
          .toLowerCase()
          .includes(searchLower) ||
        date
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase()
          .includes(searchLower) ||
        date
          .toLocaleDateString("en-US", { weekday: "short" })
          .toLowerCase()
          .includes(searchLower) ||
        date.getFullYear().toString().includes(searchTerm)
      );
    });
  }, [availableDates, searchTerm]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold">Available Dates</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{venueName}</h3>
            <p className="text-gray-600">Available dates for booking</p>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search dates (e.g., 'January', 'Monday', '15', '2024')"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-2">
                Showing {filteredDates.length} of {availableDates.length} dates
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {filteredDates.map((date, index) => (
              <div
                key={index}
                className="flex items-center p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => handleDateClick(date)}
              >
                <Calendar className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">
                    {date.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {date.getFullYear()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDates.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No dates found matching "{searchTerm}"
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Try searching with different terms like:
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  Month names (January, Feb)
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  Day names (Monday, Tue)
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  Numbers (15, 25)
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  Year (2024)
                </span>
              </div>
            </div>
          )}

          {availableDates.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No available dates at the moment</p>
              <p className="text-sm text-gray-400 mt-1">
                Please check back later
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;
