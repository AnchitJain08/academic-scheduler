import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { AuthState } from '../store/useStore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { validateRegistrationNumber } from '../utils/validationUtils';
import PasswordStrengthBar from '../components/PasswordStrengthBar';

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
      navigate('/schedule');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Back Button */}
        <motion.button
          onClick={handleBack}
          className="group flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          whileHover={{ x: -5 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Home</span>
        </motion.button>

        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        {/* Error Message */}
        {auth.error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {auth.error}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label htmlFor="name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="registrationNumber" className="sr-only">
                Registration Number
              </label>
              <input
                id="registrationNumber"
                name="registrationNumber"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Registration Number"
                value={formData.registrationNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationNumber: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={auth.isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {auth.isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : mode === 'login' ? (
                'Sign in'
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
