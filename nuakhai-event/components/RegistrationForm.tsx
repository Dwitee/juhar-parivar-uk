import { useState, useEffect } from 'react';
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
    countryCode: '+44',
    phoneNumber: '',
    guests: {
      adults: { veg: 0, nonVeg: 1 },
      children6to12: { veg: 0, nonVeg: 0 },
      childrenBelow6: { veg: 0, nonVeg: 0 },
      visitingParents: { veg: 0, nonVeg: 0 },
    },
  });
  const [donation, setDonation] = useState(0);
  const [showDonationTip, setShowDonationTip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    setLoading(true);
    const fullPhone = `${formData.countryCode}${formData.phoneNumber}`;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setEmailError('Please enter a valid email address.');
      setLoading(false);
      return;
    } else {
      setEmailError('');
    }
    const phoneRegex = /^\+44\s?\d{10}$/;
    if (!phoneRegex.test(fullPhone.trim())) {
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
        body: JSON.stringify({ ...formData, phone: fullPhone }),
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
    (formData.guests.visitingParents.veg + formData.guests.visitingParents.nonVeg) * prices.visitingParents +
    donation;

  // Minimum total validation
  const isTotalValid = totalSum >= 20;

  // Close donation tip on document click
  useEffect(() => {
    const handleClickOutside = () => {
      if (showDonationTip) setShowDonationTip(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDonationTip]);

  // Automatically dismiss donation tip after 5 seconds when shown
  useEffect(() => {
    if (showDonationTip) {
      const timer = setTimeout(() => setShowDonationTip(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showDonationTip]);

  return (
    <div onClick={() => showDonationTip && setShowDonationTip(false)}>
      <form className="mt-4 space-y-4 px-2 sm:px-4 md:px-8" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
      <div>
        <label className="block text-sm md:text-base font-medium text-gray-700">Name</label>
        <div className="mt-1 flex items-center space-x-2">
          <FaUserCircle className="text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 text-sm md:text-base px-2 py-1"
            required
          />
        </div>
        {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
      </div>

      <div>
        <label className="block text-sm md:text-base font-medium text-gray-700">Email</label>
        <div className="mt-1 flex items-center space-x-2">
          <FaRegEnvelope className="text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 text-sm md:text-base px-2 py-1"
            required
          />
        </div>
        {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
      </div>

      <div>
        <label className="block text-sm md:text-base font-medium text-gray-700">Phone Number</label>
        <div className="mt-1 flex items-center space-x-2">
          <FaMobileAlt className="text-gray-400" />
          <div className="flex space-x-2 items-center w-full">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, countryCode: e.target.value }))
              }
              className="border rounded-md py-2 px-2 text-sm md:text-base"
            >
              <option value="+44">🇬🇧 +44</option>
              <option value="+91">🇮🇳 +91</option>
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))
              }
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-200 text-sm md:text-base"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm md:text-base font-bold text-gray-700 mb-2">Guest Breakdown</label>

        {/* Adults */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-1.5 border-b text-sm">
          <div className="text-left flex items-center space-x-1 px-3">
            <FaUserCircle className="text-blue-600" /><span>Adults &amp; Children above 12Yr (£40)</span>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center gap-2 w-full">
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, adults: { ...prev.guests.adults, veg: Math.max(0, prev.guests.adults.veg - 1) } } }))} className="px-3 py-1.5 bg-gray-200 rounded">-</button>
              <input type="number" value={formData.guests.adults.veg} readOnly className="w-12 text-center border rounded-md text-sm md:text-base px-2 py-1.5" />
              <button type="button" onClick={() => { const t = formData.guests.adults.veg + formData.guests.adults.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, adults: { ...prev.guests.adults, veg: prev.guests.adults.veg + 1 } } })) }} className="px-3 py-1.5 bg-gray-200 rounded">+</button>
            </div>
            <div className="text-xs text-center mt-1 text-green-700 font-medium">(Veg)</div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center gap-2 w-full">
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, adults: { ...prev.guests.adults, nonVeg: Math.max(0, prev.guests.adults.nonVeg - 1) } } }))} className="px-3 py-1.5 bg-gray-200 rounded">-</button>
              <input type="number" value={formData.guests.adults.nonVeg} readOnly className="w-12 text-center border rounded-md text-sm md:text-base px-2 py-1.5" />
              <button type="button" onClick={() => { const t = formData.guests.adults.veg + formData.guests.adults.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, adults: { ...prev.guests.adults, nonVeg: prev.guests.adults.nonVeg + 1 } } })) }} className="px-3 py-1.5 bg-gray-200 rounded">+</button>
            </div>
            <div className="text-xs text-center mt-1 text-red-700 font-medium">(Non-Veg)</div>
          </div>
          <div className="text-right px-3">£{(formData.guests.adults.veg + formData.guests.adults.nonVeg) * 40}</div>
        </div>

        {/* Children 6-12 */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-1.5 border-b text-sm">
          <div className="text-left flex items-center space-x-1 px-3">
            <FaBaby className="text-yellow-500" /><span>Child (6-12Yr) (£20)</span>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center gap-2 w-full">
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, children6to12: { ...prev.guests.children6to12, veg: Math.max(0, prev.guests.children6to12.veg - 1) } } }))} className="px-3 py-1.5 bg-gray-200 rounded">-</button>
              <input type="number" value={formData.guests.children6to12.veg} readOnly className="w-12 text-center border rounded-md text-sm md:text-base px-2 py-1.5" />
              <button type="button" onClick={() => { const t = formData.guests.children6to12.veg + formData.guests.children6to12.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, children6to12: { ...prev.guests.children6to12, veg: prev.guests.children6to12.veg + 1 } } })) }} className="px-3 py-1.5 bg-gray-200 rounded">+</button>
            </div>
            <div className="text-xs text-center mt-1 text-green-700 font-medium">(Veg)</div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center gap-2 w-full">
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, children6to12: { ...prev.guests.children6to12, nonVeg: Math.max(0, prev.guests.children6to12.nonVeg - 1) } } }))} className="px-3 py-1.5 bg-gray-200 rounded">-</button>
              <input type="number" value={formData.guests.children6to12.nonVeg} readOnly className="w-12 text-center border rounded-md text-sm md:text-base px-2 py-1.5" />
              <button type="button" onClick={() => { const t = formData.guests.children6to12.veg + formData.guests.children6to12.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, children6to12: { ...prev.guests.children6to12, nonVeg: prev.guests.children6to12.nonVeg + 1 } } })) }} className="px-3 py-1.5 bg-gray-200 rounded">+</button>
            </div>
            <div className="text-xs text-center mt-1 text-red-700 font-medium">(Non-Veg)</div>
          </div>
          <div className="text-right px-3">£{(formData.guests.children6to12.veg + formData.guests.children6to12.nonVeg) * 20}</div>
        </div>

        {/* Children below 6 */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-1.5 border-b text-sm">
          <div className="text-left flex items-center space-x-1 px-3">
            <FaBaby className="text-yellow-500" /><span>Child (below 5Yr) (Free)</span>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center gap-2 w-full">
              <button
                type="button"
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    guests: {
                      ...prev.guests,
                      childrenBelow6: {
                        ...prev.guests.childrenBelow6,
                        veg: Math.max(0, prev.guests.childrenBelow6.veg - 1),
                      },
                    },
                  }))
                }
                className="px-3 py-1.5 bg-gray-200 rounded"
              >-</button>
              <input
                type="number"
                value={formData.guests.childrenBelow6?.veg ?? 0}
                readOnly
                className="w-12 text-center border rounded-md text-sm md:text-base px-2 py-1.5"
              />
              <button
                type="button"
                onClick={() => {
                  const t = (formData.guests.childrenBelow6?.veg ?? 0) + (formData.guests.childrenBelow6?.nonVeg ?? 0);
                  if (t >= 99) return;
                  setFormData(prev => ({
                    ...prev,
                    guests: {
                      ...prev.guests,
                      childrenBelow6: {
                        ...prev.guests.childrenBelow6,
                        veg: (prev.guests.childrenBelow6?.veg ?? 0) + 1,
                      },
                    },
                  }));
                }}
                className="px-3 py-1.5 bg-gray-200 rounded"
              >+</button>
            </div>
            <div className="text-xs text-center mt-1 text-green-700 font-medium">(Veg)</div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center gap-2 w-full">
              <button
                type="button"
                onClick={() =>
                  setFormData(prev => ({
                    ...prev,
                    guests: {
                      ...prev.guests,
                      childrenBelow6: {
                        ...prev.guests.childrenBelow6,
                        nonVeg: Math.max(0, prev.guests.childrenBelow6.nonVeg - 1),
                      },
                    },
                  }))
                }
                className="px-3 py-1.5 bg-gray-200 rounded"
              >-</button>
              <input
                type="number"
                value={formData.guests.childrenBelow6?.nonVeg ?? 0}
                readOnly
                className="w-12 text-center border rounded-md text-sm md:text-base px-2 py-1.5"
              />
              <button
                type="button"
                onClick={() => {
                  const t = (formData.guests.childrenBelow6?.veg ?? 0) + (formData.guests.childrenBelow6?.nonVeg ?? 0);
                  if (t >= 99) return;
                  setFormData(prev => ({
                    ...prev,
                    guests: {
                      ...prev.guests,
                      childrenBelow6: {
                        ...prev.guests.childrenBelow6,
                        nonVeg: (prev.guests.childrenBelow6?.nonVeg ?? 0) + 1,
                      },
                    },
                  }));
                }}
                className="px-3 py-1.5 bg-gray-200 rounded"
              >+</button>
            </div>
            <div className="text-xs text-center mt-1 text-red-700 font-medium">(Non-Veg)</div>
          </div>
          <div className="text-right px-3">Free</div>
        </div>

        {/* Visiting Parents */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-1.5 border-b text-sm">
          <div className="text-left flex items-center space-x-1 px-3">
            <FaUsers className="text-purple-600" /><span>Visiting Parents (£25)</span>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center gap-2 w-full">
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, visitingParents: { ...prev.guests.visitingParents, veg: Math.max(0, prev.guests.visitingParents.veg - 1) } } }))} className="px-3 py-1.5 bg-gray-200 rounded">-</button>
              <input type="number" value={formData.guests.visitingParents.veg} readOnly className="w-12 text-center border rounded-md text-sm md:text-base px-2 py-1.5" />
              <button type="button" onClick={() => { const t = formData.guests.visitingParents.veg + formData.guests.visitingParents.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, visitingParents: { ...prev.guests.visitingParents, veg: prev.guests.visitingParents.veg + 1 } } })) }} className="px-3 py-1.5 bg-gray-200 rounded">+</button>
            </div>
            <div className="text-xs text-center mt-1 text-green-700 font-medium">(Veg)</div>
          </div>
          <div>
            <div className="flex flex-row items-center justify-center gap-2 w-full">
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, guests: { ...prev.guests, visitingParents: { ...prev.guests.visitingParents, nonVeg: Math.max(0, prev.guests.visitingParents.nonVeg - 1) } } }))} className="px-3 py-1.5 bg-gray-200 rounded">-</button>
              <input type="number" value={formData.guests.visitingParents.nonVeg} readOnly className="w-12 text-center border rounded-md text-sm md:text-base px-2 py-1.5" />
              <button type="button" onClick={() => { const t = formData.guests.visitingParents.veg + formData.guests.visitingParents.nonVeg; if (t >= 99) return; setFormData(prev => ({ ...prev, guests: { ...prev.guests, visitingParents: { ...prev.guests.visitingParents, nonVeg: prev.guests.visitingParents.nonVeg + 1 } } })) }} className="px-3 py-1.5 bg-gray-200 rounded">+</button>
            </div>
            <div className="text-xs text-center mt-1 text-red-700 font-medium">(Non-Veg)</div>
          </div>
          <div className="text-right px-3">£{(formData.guests.visitingParents.veg + formData.guests.visitingParents.nonVeg) * 25}</div>
        </div>

        {/* Donation */}
        <div className="grid grid-cols-1 md:grid-cols-4 items-center py-1.5 border-b text-sm">
          <div className="text-left flex items-center space-x-1 px-3 font-semibold text-gray-700 relative">
            {/* Tooltip above text */}
            {showDonationTip && (
              <div className="absolute bottom-full mb-2 w-72 bg-yellow-100 text-gray-800 text-sm border border-gray-300 rounded shadow-lg p-2 z-20">
                “Your kind donation brings hope to those in medical crisis and supports the poor and needy — a small act of giving can become someone’s lifeline.”
              </div>
            )}
            <span
              onClick={(e) => {
                e.stopPropagation();
                setShowDonationTip(!showDonationTip);
              }}
              className="cursor-pointer"
            >
              Voluntary Donation (Charity)
            </span>
            <span
              className="ml-2 cursor-pointer text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                setShowDonationTip(!showDonationTip);
              }}
            >
              ?
            </span>
          </div>
          <div className="col-span-3 px-3">
            <select
              value={donation}
              onChange={(e) => setDonation(Number(e.target.value))}
              className="w-full md:w-1/3 border rounded-md py-2 px-3 text-sm md:text-base"
            >
              <option value={0}>£0</option>
              <option value={10}>£10</option>
              <option value={20}>£20</option>
              <option value={30}>£30</option>
              <option value={40}>£40</option>
              <option value={50}>£50</option>
              <option value={60}>£60</option>
              <option value={70}>£70</option>
              <option value={80}>£80</option>
              <option value={90}>£90</option>
              <option value={100}>£100</option>
              <option value={120}>£120</option>
              <option value={200}>£200</option>
              <option value={300}>£300</option>
              <option value={400}>£400</option>
              <option value={500}>£500</option>
            </select>
          </div>
        </div>

        <div className="text-right font-semibold pt-3 mt-4 text-lg">
          Total: £{totalSum}
        </div>
        {!isTotalValid && (
          <div className="text-red-600 text-right text-sm mt-2">
            Minimum payable amount is £20 to proceed.
          </div>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded mt-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || !isTotalValid}
        title={!isTotalValid ? 'Minimum amount must be £20' : ''}
      >
        {loading ? 'Redirecting...' : `Pay & Register (£${totalSum})`}
      </button>
    </form>
    </div>
  );
}
