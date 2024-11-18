import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { BookOpen } from 'lucide-react';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { setStudent } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.registrationNumber.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setStudent({
      id: formData.registrationNumber,
      name: formData.name,
      registrationNumber: formData.registrationNumber,
      email: '',
      semester: 1
    });

    navigate('/schedule');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Academic Scheduler
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Enter your details to get started
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-full">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number
              </label>
              <input
                id="registrationNumber"
                name="registrationNumber"
                type="text"
                required
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-gray-100 focus:bg-white"
                placeholder="Enter your registration number"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 py-2 px-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Get Started
            </button>
          </form>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-sm text-gray-500">
          By registering, you agree to use this application for academic purposes
        </p>
      </div>
    </div>
  );
};

export default Registration;
