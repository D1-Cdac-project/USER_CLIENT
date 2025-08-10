import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import MandapList from "./components/MandapList/MandapList";
import MandapDetails from "./pages/MandapDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import BookingHistory from "./pages/BookingHistory";
import BookingDetails from "./pages/BookingDetails";
import Booking from "./pages/Booking";
import ExploreVenue from "./pages/ExploreVenue";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Favorites from "./pages/Favorites";
import Footer from "./components/Footer/Footer";
import PhotographerDetails from "./pages/PhotographerDetails";
import CatererDetails from "./pages/CatererDetails";
import RoomDetails from "./pages/RoomDetails";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CompletePayment from "./pages/CompletePayment";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: { style: { background: "#10B981", color: "#fff" } },
          error: { style: { background: "#EF4444", color: "#fff" } },
        }}
      />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mandaps" element={<MandapList />} />
            <Route path="/mandaps/:mandapId" element={<MandapDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="/booking/:mandapId" element={<BookingDetails />} />
            <Route path="/complete-payment/:id" element={<CompletePayment />} />
            <Route path="/mandaps/:mandapId/book" element={<Booking />} />
            <Route path="/explore-venue" element={<ExploreVenue />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route
              path="/photographer/:photographerId"
              element={<PhotographerDetails />}
            />
            <Route path="/caterer/:catererId" element={<CatererDetails />} />
            <Route
              path="/mandap/:mandapId/book/caterer/:catererId"
              element={<CatererDetails />}
            />
            <Route path="/room/:roomId" element={<RoomDetails />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
