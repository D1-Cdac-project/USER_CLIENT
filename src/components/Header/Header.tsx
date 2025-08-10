import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { User, Menu, LogOut, Heart, Building2, X } from "lucide-react";
import useMandapStore from "../../store/useMandapStore";
import { logoutUser } from "../../services/userService";
import { toast } from "react-toastify";
import { RootState } from "../../app/store";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resetFilters } = useMandapStore();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isUserLoggedIn
  );

  const handleMandapsClick = () => {
    resetFilters();
    navigate("/mandaps");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      dispatch(logoutAction()); //Update Redux state
      setIsMenuOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Logout failed");
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
          <span className="text-lg md:text-2xl font-bold text-red-500">
            BookMyMandap
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={handleMandapsClick}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Mandaps
          </button>
          <Link
            to="/about"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Contact Us
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/booking-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Booking History
                  </Link>
                  <Link
                    to="/favorites"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Favorite Mandaps
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}

        {isLoggedIn ? (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        ) : (
          <Link
            to="/login"
            className="lg:hidden bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && isLoggedIn && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <button
              onClick={() => {
                handleMandapsClick();
                setIsMobileMenuOpen(false);
              }}
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              Mandaps
            </button>
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>

            {isLoggedIn ? (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/booking-history"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Booking History
                </Link>
                <Link
                  to="/favorites"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Favorite Mandaps
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  to="/login"
                  className="block px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
