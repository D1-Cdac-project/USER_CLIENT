import React, { useState } from 'react';
import { Utensils, Check } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: 800,
    items: {
      starters: ['Paneer Tikka', 'Veg Spring Roll', 'Mushroom 65'],
      mains: ['Dal Makhani', 'Mixed Veg', 'Jeera Rice', 'Butter Naan'],
      desserts: ['Gulab Jamun', 'Ice Cream']
    },
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80'
    ]
  },
  {
    name: 'Premium',
    price: 1200,
    items: {
      starters: ['Malai Tikka', 'Hara Bhara Kebab', 'Chilli Paneer', 'Corn Seekh'],
      mains: ['Paneer Butter Masala', 'Dal Makhani', 'Veg Biryani', 'Assorted Breads'],
      desserts: ['Rasmalai', 'Ice Cream', 'Gajar Ka Halwa']
    },
    images: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80'
    ]
  }
];

const customItems = {
  starters: [
    { name: 'Paneer Tikka', price: 120 },
    { name: 'Veg Spring Roll', price: 100 },
    { name: 'Mushroom 65', price: 150 }
  ],
  mains: [
    { name: 'Dal Makhani', price: 200 },
    { name: 'Paneer Butter Masala', price: 250 },
    { name: 'Mixed Veg', price: 180 }
  ],
  desserts: [
    { name: 'Gulab Jamun', price: 80 },
    { name: 'Rasmalai', price: 100 },
    { name: 'Ice Cream', price: 60 }
  ]
};

const CateringDetails = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [plates, setPlates] = useState(100);

  const totalPrice = selectedItems.reduce((total, item) => {
    const itemPrice = [...customItems.starters, ...customItems.mains, ...customItems.desserts]
      .find(i => i.name === item)?.price || 0;
    return total + (itemPrice * plates);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Caterer Info */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80"
              alt="Caterer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">Royal Caterers</h1>
            <p className="text-gray-600 max-w-2xl">
              Specializing in authentic Indian cuisine with a modern twist. Our experienced chefs
              create memorable dining experiences for your special occasions.
            </p>
          </div>
        </div>
      </div>

      {/* Pre-defined Plans */}
      <h2 className="text-2xl font-bold mb-8">Our Plans</h2>
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="text-2xl font-bold text-blue-600 mb-4">
                ₹{plan.price}/plate
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {plan.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${plan.name} sample ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Starters</h4>
                  <ul className="space-y-1">
                    {plan.items.starters.map((item) => (
                      <li key={item} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Main Course</h4>
                  <ul className="space-y-1">
                    {plan.items.mains.map((item) => (
                      <li key={item} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Desserts</h4>
                  <ul className="space-y-1">
                    {plan.items.desserts.map((item) => (
                      <li key={item} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Menu Builder */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-8">Build Your Custom Menu</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Starters</h3>
            {customItems.starters.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.name]);
                      } else {
                        setSelectedItems(selectedItems.filter(i => i !== item.name));
                      }
                    }}
                    className="mr-2"
                  />
                  {item.name}
                </label>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-4">Main Course</h3>
            {customItems.mains.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.name]);
                      } else {
                        setSelectedItems(selectedItems.filter(i => i !== item.name));
                      }
                    }}
                    className="mr-2"
                  />
                  {item.name}
                </label>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-4">Desserts</h3>
            {customItems.desserts.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, item.name]);
                      } else {
                        setSelectedItems(selectedItems.filter(i => i !== item.name));
                      }
                    }}
                    className="mr-2"
                  />
                  {item.name}
                </label>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <label className="block font-medium mb-2">Number of Plates</label>
          <input
            type="number"
            min="50"
            value={plates}
            onChange={(e) => setPlates(parseInt(e.target.value))}
            className="w-32 px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mt-8 text-right">
          <div className="text-2xl font-bold">
            Total: ₹{totalPrice.toLocaleString()}
          </div>
          <div className="text-gray-600">
            {selectedItems.length} items × {plates} plates
          </div>
        </div>
      </div>
    </div>
  );
};

export default CateringDetails;