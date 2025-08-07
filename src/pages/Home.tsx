import { useEffect, useState } from "react";
import Hero from "../components/Hero/Hero";
import Cities from "../components/Cities/Cities";
import VenueTypes from "../components/VenueTypes/VenueTypes";
import WhyMandap from "../components/WhyMandap/WhyMandap";
import Factors from "../components/Factors/Factors";
import VenueOwnerCTA from "../components/VenueOwnerCTA/VenueOwnerCTA";
import CustomerReviews from "../components/CustomerReviews/CustomerReviews";
import FAQ from "../components/FAQ/FAQ";
import {
  getVenueCountsFromMandaps,
  getVenueTypeCountsFromMandaps,
} from "../services/mandapServices";
import { STATIC_CITIES, STATIC_VENUE_TYPES } from "../utils/mock_data";

function Home() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(
    "what-is-mandap"
  );
  const [expandedFactor, setExpandedFactor] = useState<string | null>("space");
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [filteredCities, setFilteredCities] = useState<typeof STATIC_CITIES>(
    []
  );
  const [filteredVenueTypes, setFilteredVenueTypes] = useState<
    typeof STATIC_VENUE_TYPES
  >([]);

  useEffect(() => {
    const loadCityData = async () => {
      try {
        const cityCounts = await getVenueCountsFromMandaps();
        const mergedCities = STATIC_CITIES.filter(
          (city) => cityCounts[city.name]
        ).map((city) => ({
          ...city,
          venues: cityCounts[city.name].toLocaleString(),
        }));
        setFilteredCities(mergedCities);
      } catch (err) {
        console.error("Error loading venue counts:", err);
        setFilteredCities(STATIC_CITIES);
      }
    };

    const loadVenueTypeData = async () => {
      try {
        const typeCounts = await getVenueTypeCountsFromMandaps();
        const mergedTypes = STATIC_VENUE_TYPES.filter(
          (typeObj) => typeCounts[typeObj.type]
        ).map((typeObj) => ({
          ...typeObj,
          count: typeCounts[typeObj.type].toLocaleString(),
        }));
        setFilteredVenueTypes(mergedTypes);
      } catch (err) {
        console.error("Error loading venue type counts:", err);
        setFilteredVenueTypes(STATIC_VENUE_TYPES);
      }
    };

    loadCityData();
    loadVenueTypeData();
  }, []);

  return (
    <>
      <Hero
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        cities={filteredCities}
      />
      <Cities cities={filteredCities} />
      <VenueTypes venueTypes={filteredVenueTypes} />
      <WhyMandap />
      <Factors
        expandedFactor={expandedFactor}
        toggleFactor={(id) =>
          setExpandedFactor(expandedFactor === id ? null : id)
        }
      />
      <VenueOwnerCTA />
      <CustomerReviews
        currentReviewIndex={currentReviewIndex}
        prevReview={() => setCurrentReviewIndex((prev) => (prev - 1 + 4) % 4)}
        nextReview={() => setCurrentReviewIndex((prev) => (prev + 1) % 4)}
      />
      <FAQ
        expandedFaq={expandedFaq}
        toggleFaq={(id) => setExpandedFaq(expandedFaq === id ? null : id)}
      />
    </>
  );
}

export default Home;
