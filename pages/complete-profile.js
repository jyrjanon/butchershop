// pages/complete-profile.js
import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { useDebounce } from 'use-debounce';
import FormField from '../components/FormField';

// --- Map Configuration ---
const containerStyle = {
  width: '100%',
  height: '200px',
  borderRadius: '8px',
};
const initialCenter = {
  lat: 23.0853,
  lng: 70.133,
};

// --- Animation Variants ---
const formVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

export default function CompleteProfile() {
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [markerPosition, setMarkerPosition] = useState(null);

  // Pre-fill form with existing data if user is editing
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setPhone(userProfile.phone || '');
      setHouseNo(userProfile.houseNo || '');
      setStreet(userProfile.street || '');
      setLandmark(userProfile.landmark || '');
      setPincode(userProfile.pincode || '');
    }
  }, [userProfile]);

  const fullAddress = `${houseNo} ${street} ${landmark} Gandhidham ${pincode}`.trim();
  const [debouncedAddress] = useDebounce(fullAddress, 1000);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // Automatically update map as user types
  useEffect(() => {
    if (isLoaded && debouncedAddress.length > 10) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: debouncedAddress }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          const newPos = { lat: location.lat(), lng: location.lng() };
          setMapCenter(newPos);
          setMarkerPosition(newPos);
        } else {
          console.error(`Geocode failed with status: ${status}`);
        }
      });
    }
  }, [debouncedAddress, isLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to complete your profile.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        fullName,
        phone,
        houseNo,
        street,
        landmark,
        pincode,
        address: `${houseNo}, ${street}, ${landmark || ''}, Gandhidham, Gujarat - ${pincode}`.replace(/ ,/g, ','),
        email: currentUser.email,
      }, { merge: true });
      router.push('/checkout');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    }
    setLoading(false);
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <motion.div 
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg p-8 space-y-6 bg-white rounded-2xl shadow-xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {userProfile ? 'Edit Your Profile' : 'Complete Your Profile'}
          </h1>
          <p className="mt-2 text-gray-600">Your address will update on the map as you type.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <FormField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <FormField label="Phone Number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField label="Flat/House No., Building" value={houseNo} onChange={(e) => setHouseNo(e.target.value)} />
              <FormField label="Pincode" type="number" value={pincode} onChange={(e) => setPincode(e.target.value)} />
            </div>
            <FormField label="Street, Area, Colony" type="textarea" value={street} onChange={(e) => setStreet(e.target.value)} />
            <FormField label="Landmark (Optional)" value={landmark} onChange={(e) => setLandmark(e.target.value)} required={false} />
          </div>
          
          <div className="space-y-4 pt-6">
            <div style={containerStyle} className="overflow-hidden">
              {isLoaded ? (
                <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={15}>
                  {markerPosition && <Marker position={markerPosition} />}
                </GoogleMap>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg"><p>Loading Map...</p></div>
              )}
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm pt-4 text-center">{error}</p>}

          <div className="pt-6">
            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-transform hover:scale-105 disabled:bg-red-300 flex items-center justify-center">
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Save and Continue'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}