import React from 'react';
import { Shield, MapPin, CheckCircle, HeadphonesIcon } from 'lucide-react';

const WhyMandap = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 md:w-12 md:h-12 text-red-500" />,
      title: "Trusted",
      subtitle: "trusted by 1000+ users",
      bgColor: "bg-red-50"
    },
    {
      icon: <MapPin className="w-8 h-8 md:w-12 md:h-12 text-blue-500" />,
      title: "400+ venues in 15+",
      subtitle: "cities",
      bgColor: "bg-blue-50"
    },
    {
      icon: <CheckCircle className="w-8 h-8 md:w-12 md:h-12 text-green-500" />,
      title: "100%",
      subtitle: "verified profiles",
      bgColor: "bg-green-50"
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8 md:w-12 md:h-12 text-cyan-500" />,
      title: "FREE assistance to",
      subtitle: "find your venue",
      bgColor: "bg-cyan-50"
    }
  ];

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Why BookMyMandap.com?</h2>
        <p className="text-gray-600 mb-8 md:mb-12 text-sm md:text-base">
          BookMyMandap is a India's trusted wedding venue booking platform.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div key={index} className={`${feature.bgColor} rounded-lg p-4 md:p-6 text-center`}>
              <div className="flex justify-center mb-3 md:mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-sm md:text-lg">{feature.title}</h3>
              <p className="text-gray-600 text-xs md:text-base">{feature.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyMandap;