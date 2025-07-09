import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  FaUserCircle,
  FaRegEnvelope,
  FaMobileAlt,
  FaCarrot,
  FaDrumstickBite,
  FaBaby,
  FaUsers
} from 'react-icons/fa';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+44',
    guests: {
      adults: { veg: 0, nonVeg: 1 },
      children6to12: { veg: 0, nonVeg: 0 },
      childrenBelow6: 0,
      visitingParents: { veg: 0, nonVeg: 0 },
    },
  });
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'childrenBelow6') {
      setFormData(prev => ({
        ...prev,
        guests: {
          ...prev.guests,
          childrenBelow6: parseInt(value),
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setEmailError('Please enter a valid email address.');
      setLoading(false);
      return;
    } else {
      setEmailError('');
    }
    const phoneRegex = /^\+44\s?\d{10}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setPhoneError('Please enter a valid UK phone number starting with +44 and 10 digits.');
      setLoading(false);
      return;
    } else {
      setPhoneError('');
    }

    try {
      // Send updated guest structure
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper for disabling +/-
  function canIncrement(category: 'adults' | 'children6to12' | 'visitingParents', pref: 'veg' | 'nonVeg') {
    const total = formData.guests[category].veg + formData.guests[category].nonVeg;
    return total < 99; // arbitrary max
  }
  function canDecrement(category: 'adults' | 'children6to12' | 'visitingParents', pref: 'veg' | 'nonVeg') {
    return formData.guests[category][pref] > 0;
  }
  function canIncrementPref(category: 'adults' | 'children6to12' | 'visitingParents', pref: 'veg' | 'nonVeg') {
    const total = formData.guests[category].veg + formData.guests[category].nonVeg;
    // Don't allow veg+nonveg > 99, and don't allow veg+nonveg > current total for this category
    return total < 99;
  }
  function canDecrementPref(category: 'adults' | 'children6to12' | 'visitingParents', pref: 'veg' | 'nonVeg') {
    return formData.guests[category][pref] > 0;
  }
  function canAddVeg(category: 'adults' | 'children6to12' | 'visitingParents') {
    const { veg, nonVeg } = formData.guests[category];
    return veg + nonVeg < 99;
  }
  function canAddNonVeg(category: 'adults' | 'children6to12' | 'visitingParents') {
    const { veg, nonVeg } = formData.guests[category];
    return veg + nonVeg < 99;
  }
  function canRemoveVeg(category: 'adults' | 'children6to12' | 'visitingParents') {
    return formData.guests[category].veg > 0;
  }
  function canRemoveNonVeg(category: 'adults' | 'children6to12' | 'visitingParents') {
    return formData.guests[category].nonVeg > 0;
  }
  function canIncrementFoodPref(category: 'adults' | 'children6to12' | 'visitingParents', pref: 'veg' | 'nonVeg') {
    const { veg, nonVeg } = formData.guests[category];
    return veg + nonVeg < 99;
  }
  function canDecrementFoodPref(category: 'adults' | 'children6to12' | 'visitingParents', pref: 'veg' | 'nonVeg') {
    return formData.guests[category][pref] > 0;
  }
  function isPlusDisabled(category: 'adults' | 'children6to12' | 'visitingParents', pref: 'veg' | 'nonVeg') {
    const total = formData.guests[category].veg + formData.guests[category].nonVeg;
    return total >= 99;
  }
  function isMinusDisabled(category: 'adults' | 'children6to12' | 'visitingParents', pref: 'veg' | 'nonVeg') {
    return formData.guests[category][pref] <= 0;
  }
  // Make sure total per category is sum of veg+nonveg
  function totalGuests(category: 'adults' | 'children6to12' | 'visitingParents') {
    return formData.guests[category].veg + formData.guests[category].nonVeg;
  }
  // Prices
  const prices = {
    adults: 40,
    children6to12: 20,
    visitingParents: 25,
  };
  // Total sum
  const totalSum =
    (formData.guests.adults.veg + formData.guests.adults.nonVeg) * prices.adults +
    (formData.guests.children6to12.veg + formData.guests.children6to12.nonVeg) * prices.children6to12 +
    (formData.guests.visitingParents.veg + formData.guests.visitingParents.nonVeg) * prices.visitingParents;

  return (
    <form className="mt-4 space-y-4" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <div className="mt-1 flex items-center space-x-2">
          <FaUserCircle className="text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200"
            required
          />
        </div>
        {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <div className="mt-1 flex items-center space-x-2">
          <FaRegEnvelope className="text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200"
            required
          />
        </div>
        {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <div className="mt-1 flex items-center space-x-2">
          <FaMobileAlt className="text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Guest Breakdown</label>
        <div className="grid grid-cols-4 font-semibold text-sm border-b pb-1">
          <div className="text-left">Guest Type</div>
          <div className="text-center flex items-center justify-center space-x-1">
            <FaCarrot className="text-green-600" /><span>Veg</span>
          </div>
          <div className="text-center flex items-center justify-center space-x-1">
            <FaDrumstickBite className="text-red-600" /><span>Non-Veg</span>
          </div>
          <div className="text-right">Subtotal</div>
        </div>

        {/* Adults */}
        <div className="grid grid-cols-4 items-center py-2 border-b text-sm">
          <div className="text-left flex items-center space-x-1">
            <FaUserCircle className="text-blue-600" /><span>Adults &amp; Children above 12Yr (£40)</span>
          </div>
          <div className="flex justify-center items-center space-x-1">
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, adults: { ...prev.guests.adults, veg: Math.max(0, prev.guests.adults.veg - 1) } } }))} className="px-2 py-1 bg-gray-200 rounded">-</button>
            <input type="number" value={formData.guests.adults.veg} readOnly className="w-10 text-center border rounded-md py-1" />
            <button type="button" onClick={() => { const t = formData.guests.adults.veg + formData.guests.adults.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, adults: { ...prev.guests.adults, veg: prev.guests.adults.veg + 1 } } })) }} className="px-2 py-1 bg-gray-200 rounded">+</button>
          </div>
          <div className="flex justify-center items-center space-x-1">
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, adults: { ...prev.guests.adults, nonVeg: Math.max(0, prev.guests.adults.nonVeg - 1) } } }))} className="px-2 py-1 bg-gray-200 rounded">-</button>
            <input type="number" value={formData.guests.adults.nonVeg} readOnly className="w-10 text-center border rounded-md py-1" />
            <button type="button" onClick={() => { const t = formData.guests.adults.veg + formData.guests.adults.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, adults: { ...prev.guests.adults, nonVeg: prev.guests.adults.nonVeg + 1 } } })) }} className="px-2 py-1 bg-gray-200 rounded">+</button>
          </div>
          <div className="text-right">£{(formData.guests.adults.veg + formData.guests.adults.nonVeg) * 40}</div>
        </div>

        {/* Children 6-12 */}
        <div className="grid grid-cols-4 items-center py-2 border-b text-sm">
          <div className="text-left flex items-center space-x-1">
            <FaBaby className="text-yellow-500" /><span>Child (6-12Yr) (£20)</span>
          </div>
          <div className="flex justify-center items-center space-x-1">
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, children6to12: { ...prev.guests.children6to12, veg: Math.max(0, prev.guests.children6to12.veg - 1) } } }))} className="px-2 py-1 bg-gray-200 rounded">-</button>
            <input type="number" value={formData.guests.children6to12.veg} readOnly className="w-10 text-center border rounded-md py-1" />
            <button type="button" onClick={() => { const t = formData.guests.children6to12.veg + formData.guests.children6to12.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, children6to12: { ...prev.guests.children6to12, veg: prev.guests.children6to12.veg + 1 } } })) }} className="px-2 py-1 bg-gray-200 rounded">+</button>
          </div>
          <div className="flex justify-center items-center space-x-1">
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, children6to12: { ...prev.guests.children6to12, nonVeg: Math.max(0, prev.guests.children6to12.nonVeg - 1) } } }))} className="px-2 py-1 bg-gray-200 rounded">-</button>
            <input type="number" value={formData.guests.children6to12.nonVeg} readOnly className="w-10 text-center border rounded-md py-1" />
            <button type="button" onClick={() => { const t = formData.guests.children6to12.veg + formData.guests.children6to12.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, children6to12: { ...prev.guests.children6to12, nonVeg: prev.guests.children6to12.nonVeg + 1 } } })) }} className="px-2 py-1 bg-gray-200 rounded">+</button>
          </div>
          <div className="text-right">£{(formData.guests.children6to12.veg + formData.guests.children6to12.nonVeg) * 20}</div>
        </div>

        {/* Children below 6 */}
        <div className="grid grid-cols-4 items-center py-2 border-b text-sm">
          <div className="text-left flex items-center space-x-1">
            <FaBaby className="text-yellow-500" /><span>Child (below 5Yr) (Free)</span>
          </div>
          <div className="flex justify-center items-center space-x-1">
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, childrenBelow6: Math.max(0, prev.guests.childrenBelow6 - 1) } }))} className="px-2 py-1 bg-gray-200 rounded">-</button>
            <input type="number" name="childrenBelow6" value={formData.guests.childrenBelow6} readOnly className="w-10 text-center border rounded-md py-1" />
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, childrenBelow6: prev.guests.childrenBelow6 + 1 } }))} className="px-2 py-1 bg-gray-200 rounded">+</button>
          </div>
          <div></div>
          <div className="text-right">Free</div>
        </div>

        {/* Visiting Parents */}
        <div className="grid grid-cols-4 items-center py-2 border-b text-sm">
          <div className="text-left flex items-center space-x-1">
            <FaUsers className="text-purple-600" /><span>Visiting Parents (£25)</span>
          </div>
          <div className="flex justify-center items-center space-x-1">
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, visitingParents: { ...prev.guests.visitingParents, veg: Math.max(0, prev.guests.visitingParents.veg - 1) } } }))} className="px-2 py-1 bg-gray-200 rounded">-</button>
            <input type="number" value={formData.guests.visitingParents.veg} readOnly className="w-10 text-center border rounded-md py-1" />
            <button type="button" onClick={() => { const t = formData.guests.visitingParents.veg + formData.guests.visitingParents.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, visitingParents: { ...prev.guests.visitingParents, veg: prev.guests.visitingParents.veg + 1 } } })) }} className="px-2 py-1 bg-gray-200 rounded">+</button>
          </div>
          <div className="flex justify-center items-center space-x-1">
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, visitingParents: { ...prev.guests.visitingParents, nonVeg: Math.max(0, prev.guests.visitingParents.nonVeg - 1) } } }))} className="px-2 py-1 bg-gray-200 rounded">-</button>
            <input type="number" value={formData.guests.visitingParents.nonVeg} readOnly className="w-10 text-center border rounded-md py-1" />
            <button type="button" onClick={() => { const t = formData.guests.visitingParents.veg + formData.guests.visitingParents.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, visitingParents: { ...prev.guests.visitingParents, nonVeg: prev.guests.visitingParents.nonVeg + 1 } } })) }} className="px-2 py-1 bg-gray-200 rounded">+</button>
          </div>
          <div className="text-right">£{(formData.guests.visitingParents.veg + formData.guests.visitingParents.nonVeg) * 25}</div>
        </div>

        <div className="text-right font-semibold pt-3">
          Total: £{totalSum}
        </div>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Redirecting...' : `Pay & Register (£${totalSum})`}
      </button>
    </form>
  );
}
