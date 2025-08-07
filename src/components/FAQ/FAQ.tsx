import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQProps {
  expandedFaq: string | null;
  toggleFaq: (id: string) => void;
}

const FAQ = ({ expandedFaq, toggleFaq }: FAQProps) => {
  const faqs = [
    {
      id: 'what-is-mandap',
      question: 'What is BookMyMandap.com?',
      answer: "BookMyMandap.com is India's trusted wedding venue discovery platform. Here you can find your dream wedding venue across different cities and states in India. Get all the venue information such as price & availability at the click of a button. You can also register with BookMyMandap.com to get a free assisted venue discovery service. A dedicated relationship manager will be assigned to each customer to facilitate their requirements."
    },
    {
      id: 'contact-number',
      question: 'How can I check the venue contact number?',
      answer: 'You can find the venue contact information on each venue listing page. Additionally, our customer service team is available to help connect you with venue owners.'
    },
    {
      id: 'availability',
      question: 'How can I check the venue availability for my event date?',
      answer: 'Each venue listing includes a calendar showing available dates. You can also use our search filters to find venues available on your preferred dates.'
    }
  ];

  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">Customer FAQ</h2>
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border rounded-lg overflow-hidden">
              <button
                className="w-full px-4 md:px-6 py-3 md:py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                onClick={() => toggleFaq(faq.id)}
              >
                <span className="font-semibold text-left text-sm md:text-base pr-4">{faq.question}</span>
                {expandedFaq === faq.id ? (
                  <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50">
                  <p className="text-gray-600 text-sm md:text-base">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;