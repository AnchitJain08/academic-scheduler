import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Student } from '../store/useStore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { validateRegistrationNumber } from '../utils/validationUtils';
import PasswordStrengthBar, { calculatePasswordStrength } from '../components/PasswordStrengthBar';

type AuthMode = 'login' | 'signup';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, auth, setAuth } = useStore();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    registrationNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [formErrors, setFormErrors] = useState<{
    registrationNumber?: string;
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    // Clear form when switching modes
    setFormData({
      name: '',
      email: '',
      registrationNumber: '',
      password: '',
      confirmPassword: '',
    });
    setPasswordError('');
    setFormErrors({});
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      await login(formData.registrationNumber, formData.password);
    } else {
      if (!formData.name || !formData.email || !formData.registrationNumber || !formData.password || !formData.confirmPassword) {
        setAuth({ error: 'All fields are required' });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setAuth({ error: 'Passwords do not match' });
        return;
      }

      const validation = validateRegistrationNumber(formData.registrationNumber);
      if (!validation.isValid) {
        setAuth({ error: validation.error });
        return;
      }

      await signup({
        name: formData.name,
        email: formData.email,
        registrationNumber: formData.registrationNumber,
        password: formData.password,
      });
    }

    if (auth.isAuthenticated) {
      navigate('/schedule/schedule');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBFBFD] to-[#F5F5F7] flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl z-50 border-b border-gray-100">
        <nav className="h-14 flex items-center px-6 max-w-[1024px] mx-auto relative">
          <motion.button
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-900 active:bg-blue-800 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center pt-14">
        <div className="w-full max-w-md px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
          >
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-[#1d1d1f] mb-2">
                Welcome to AcadFlow
              </h1>
              <p className="text-[#424245]">
                {mode === 'login'
                  ? 'Sign in to continue to your dashboard'
                  : 'Create an account to get started'}
              </p>
            </div>

            {auth.error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                {auth.error}
              </div>
            )}

            {passwordError && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#06c] focus:ring-2 focus:ring-[#06c]/20 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#06c] focus:ring-2 focus:ring-[#06c]/20 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your registration number"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formErrors.registrationNumber ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                {formErrors.registrationNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.registrationNumber}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formErrors.password ? 'border-red-500' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your password"
                  required
                />
                {mode === 'signup' && (
                  <PasswordStrengthBar password={formData.password} />
                )}
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {mode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1d1d1f] mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#06c] focus:ring-2 focus:ring-[#06c]/20 transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <motion.button
                type="submit"
                className="w-full px-4 py-2.5 rounded-full bg-blue-800 text-blue-50 font-medium hover:bg-blue-900 active:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
                disabled={auth.isLoading}
              >
                {auth.isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : mode === 'login' ? (
                  'Sign in'
                ) : (
                  'Create account'
                )}
              </motion.button>

              <motion.button
                type="button"
                className="w-full px-4 py-2.5 rounded-full text-blue-800 bg-blue-50 border border-blue-800 font-medium hover:bg-blue-100 active:bg-blue-50 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ scale: 1 }}
                animate={{ scale: 1 }}
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              >
                {mode === 'login' ? 'Create a new account' : 'Already have an account?'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#424245]">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
