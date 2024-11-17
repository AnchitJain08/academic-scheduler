import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Upload, Edit2, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { student, setStudent } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(student || {
    name: '',
    email: '',
    registrationNumber: '',
    semester: 1,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudent({ ...student!, ...formData });
    setIsEditing(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Here you would typically:
    // 1. Upload the file to a server
    // 2. Process the image to extract schedule data
    // 3. Update the schedule in the store
    
    // For now, we'll just show a success message
    alert('Schedule upload feature coming soon!');
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-600 px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-white">Student Profile</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Registration Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Semester
                  </label>
                  <div className="mt-1">
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </form>

            {/* Schedule Upload Section */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Schedule Management</h4>
                
                {/* Upload Schedule */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Upload your class schedule image
                      </p>
                    </div>
                    <div className="mt-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Upload Schedule
                      </button>
                    </div>
                  </div>
                </div>

                {/* Manual Schedule Entry Button */}
                <div className="text-center">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Manual Schedule Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
