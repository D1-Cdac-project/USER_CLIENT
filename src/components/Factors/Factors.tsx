import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FactorsProps {
  expandedFactor: string | null;
  toggleFactor: (id: string) => void;
}

const Factors = ({ expandedFactor, toggleFactor }: FactorsProps) => {
  const factors = [
    {
      id: 'location',
      title: 'Location',
      content: "Choose a venue that's easily accessible to most of your guests. Consider factors like parking, proximity to hotels, and public transportation."
    },
    {
      id: 'space',
      title: 'Space and seating availability',
      content: "This is a fundamental question to be answered. If a venue is smaller than the space you need, you're going to have an obvious congestion problem. But if it's too big, then the wedding functions will look dull and empty. You need a wedding venue that's just the right size for the number of people attending your wedding. It should be sized in a way that the wedding venue feels cozy and comfortable."
    },
    {
      id: 'indoor-outdoor',
      title: 'Indoor and outdoor space',
      content: "Consider whether you want an indoor or outdoor venue, or a combination of both. Weather conditions and season should influence this decision."
    },
    {
      id: 'logistics',
      title: 'Logistics & Cost',
      content: "Understand all costs involved including rentals, catering, decorations, and any additional services. Check payment terms and cancellation policies."
    },
    {
      id: 'staffing',
      title: 'Staffing & Security',
      content: "Ensure the venue has adequate staff and security arrangements for your event size."
    },
    {
      id: 'amenities',
      title: 'Basic Amenities',
      content: "Check for essential amenities like restrooms, air conditioning, power backup, and accessibility features."
    },
    {
      id: 'weather',
      title: 'Dealing With Different Weathers',
      content: "Have contingency plans for weather-related issues, especially for outdoor venues."
    },
    {
      id: 'technical',
      title: 'Technical Arrangements',
      content: "Verify the availability of sound systems, lighting, and other technical requirements for your event."
    }
  ];

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">8 factors to select the right venue</h2>
        <div className="space-y-3 md:space-y-4">
          {factors.map((factor) => (
            <div key={factor.id} className="border rounded-lg overflow-hidden">
              <button
                className="w-full px-4 md:px-6 py-3 md:py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                onClick={() => toggleFactor(factor.id)}
              >
                <span className="font-semibold text-left text-sm md:text-base">{factor.title}</span>
                {expandedFactor === factor.id ? (
                  <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {expandedFactor === factor.id && (
                <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50">
                  <p className="text-gray-600 text-sm md:text-base">{factor.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Factors;