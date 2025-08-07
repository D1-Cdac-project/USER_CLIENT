import React from 'react';
import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin, PointerIcon as PinterestIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-white py-8 md:py-16">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-red-500 mb-4 md:mb-6">BookMyMandap</h3>
          <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">India's trusted wedding venue discovery platform.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <PinterestIcon size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Quick Links</h4>
          <ul className="space-y-3 md:space-y-4">
            <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">About Us</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Contact Us</Link></li>
            <li><Link to="/explore-venue" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">List Your Venue</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Legal</h4>
          <ul className="space-y-3 md:space-y-4">
            <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Terms & Conditions</Link></li>
            <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm md:text-base">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Contact Us</h4>
          <ul className="space-y-3 md:space-y-4">
            <li className="flex items-center text-gray-400 text-sm md:text-base">
              <Phone size={16} className="mr-3 flex-shrink-0" />
              <span>+91 1800 000 0000</span>
            </li>
            <li className="flex items-center text-gray-400 text-sm md:text-base">
              <Mail size={16} className="mr-3 flex-shrink-0" />
              <span>support@bookmymandap.com</span>
            </li>
            <li className="flex items-start text-gray-400 text-sm md:text-base">
              <MapPin size={16} className="mr-3 mt-1 flex-shrink-0" />
              <span>123 Wedding Street, Pune, Maharashtra 411041</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 md:pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
            © {new Date().getFullYear()} bookmymandap.com - All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;