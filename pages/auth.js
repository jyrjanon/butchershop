// pages/auth.js
import { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  
  // State for Email
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for Phone
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  // Set up reCAPTCHA verifier
  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => { console.log("reCAPTCHA solved"); }
    });
  }, [auth]);

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (method === 'email') {
        if (mode === 'signup') {
          await createUserWithEmailAndPassword(auth, email, password);
          router.push('/complete-profile'); // Redirect to complete profile after signup
        } else {
          await signInWithEmailAndPassword(auth, email, password);
          router.push('/'); // Redirect to home after login
        }
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formattedPhoneNumber = `+91${phoneNumber}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err) {
      setError('Failed to send OTP. Please check the phone number.');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await confirmationResult.confirm(otp);
      // Firebase automatically determines if it's a new or returning user.
      // Our logic in index.js will redirect new users to complete-profile.
      router.push('/');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-red-600">
          {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
        </h1>

        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button onClick={() => setMethod('email')} className={`w-1/2 py-2 font-semibold transition-colors ${method === 'email' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>
            Email
          </button>
          <button onClick={() => setMethod('phone')} className={`w-1/2 py-2 font-semibold transition-colors ${method === 'phone' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>
            Phone
          </button>
        </div>

        {method === 'email' ? (
          <form onSubmit={handleAuthAction} className="space-y-6">
            <div>
              <label className="text-sm font-bold text-gray-600 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" required/>
            </div>
            <div>
              <label className="text-sm font-bold text-gray-600 block">Password (6+ characters)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" required/>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg disabled:bg-red-300">
              {loading ? 'Working...' : (mode === 'login' ? 'Log In' : 'Sign Up')}
            </button>
          </form>
        ) : (
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-6">
            {!otpSent ? (
              <div>
                <label className="text-sm font-bold text-gray-600 block">Phone Number</label>
                <div className="flex items-center mt-1">
                  <span className="p-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-100">+91</span>
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-2 border border-gray-300 rounded-r-md" placeholder="10-digit mobile number" required/>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-bold text-gray-600 block">Enter OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-2 border border-gray-300 rounded mt-1" required/>
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg disabled:bg-red-300">
              {loading ? 'Sending...' : (otpSent ? 'Verify OTP & Continue' : 'Send OTP')}
            </button>
          </form>
        )}

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <p className="text-center text-sm text-gray-600">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="font-semibold text-red-600 hover:underline">
            {mode === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}