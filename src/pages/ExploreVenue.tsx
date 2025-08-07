import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Users, Globe, Clock, Shield, CreditCard, Building, ArrowRight } from 'lucide-react';

const benefits = [
  {
    icon: Globe,
    title: 'Wider Reach',
    description: 'Connect with thousands of potential customers looking for venues like yours'
  },
  {
    icon: Users,
    title: 'More Bookings',
    description: 'Increase your bookings with our large customer base and efficient booking system'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Your venue is visible to customers round the clock, maximizing booking opportunities'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Receive payments securely through our trusted payment gateway'
  },
  {
    icon: Building,
    title: 'Venue Management',
    description: 'Easy-to-use dashboard to manage your venue listings and bookings'
  },
  {
    icon: CreditCard,
    title: 'Zero Commission',
    description: 'No commission on bookings for the first 3 months'
  }
];

const stats = [
  { number: '40,000+', label: 'Venues Listed' },
  { number: '1M+', label: 'Monthly Visitors' },
  { number: '98%', label: 'Customer Satisfaction' },
  { number: '20+', label: 'Cities Covered' }
];

const ExploreVenue = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                List Your Venue With India's Largest Venue Discovery Platform
              </h1>
              <p className="text-xl mb-8">
                Join thousands of venue owners who trust us to grow their business
              </p>
              <div className="space-x-4">
                <Link
                  to="/register-venue"
                  className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100"
                >
                  Register as Provider
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login-venue"
                  className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-purple-600"
                >
                  Login as Provider
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80"
                alt="Venue"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why List With Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join our platform and experience the benefits of being part of India's largest venue discovery network
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <benefit.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Chart Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Grow Your Business With Us</h2>
              <p className="text-gray-600 mb-8">
                Our platform has helped venue owners increase their bookings by up to 300% in the first year
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <BarChart className="h-8 w-8 text-purple-600" />
                  <div>
                    <h4 className="font-semibold">Increased Visibility</h4>
                    <p className="text-gray-600">Reach millions of potential customers</p>
                  </div>
                </div>
                {/* Add more growth points here */}
              </div>
            </div>
            <div className="bg-purple-100 p-8 rounded-xl">
              {/* Add a chart or graph here */}
              <div className="h-64 flex items-center justify-center">
                <p className="text-purple-600 font-medium">Growth Chart Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of successful venue owners on our platform
          </p>
          <div className="space-x-4">
            <Link
              to="/register-venue"
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreVenue;