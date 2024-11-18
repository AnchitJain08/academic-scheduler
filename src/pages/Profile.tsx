import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { User, Edit2, Save, LogOut, Camera, Calendar, Mail, Hash, GraduationCap, Building2 } from 'lucide-react';
import { parseRegistrationNumber } from '../utils/studentUtils';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { student, setStudent } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(student || {
    name: '',
    email: '',
    registrationNumber: '',
    semester: 1,
    department: '',
    joinedDate: new Date().toISOString().split('T')[0],
  });

  // Parse registration number when it changes
  useEffect(() => {
    if (formData.registrationNumber) {
      const parsedInfo = parseRegistrationNumber(formData.registrationNumber);
      if (parsedInfo) {
        setFormData(prev => ({
          ...prev,
          department: parsedInfo.branch,
          joinedDate: `${parsedInfo.joiningYear}-01-01`,
          semester: parsedInfo.currentYear * 2 // Approximate semester based on year
        }));
      }
    }
  }, [formData.registrationNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStudent({ ...student!, ...formData });
    setIsEditing(false);
  };

  const handleSignOut = () => {
    setStudent(null);
    navigate('/');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
        if (!isEditing) {
          setStudent({
            ...student!,
            profilePicture: reader.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getStudentInfo = () => {
    if (!formData.registrationNumber) return null;
    return parseRegistrationNumber(formData.registrationNumber);
  };

  const studentInfo = getStudentInfo();

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white pt-8 pb-24 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-20">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Picture Section */}
          <div className="relative">
            <div className="h-24 bg-gradient-to-r from-blue-100 to-blue-50"></div>
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-gray-100">
                  {formData.profilePicture ? (
                    <img
                      src={formData.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors duration-200">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      {student.name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Registration Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter registration number (e.g., 22BCE11376)"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Hash className="w-4 h-4 mr-2 text-gray-400" />
                      {student.registrationNumber}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {student.email || 'Not set'}
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Info Section */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Program & Branch
                  </label>
                  <div className="flex items-center text-gray-900">
                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                    {studentInfo?.branch || 'Not available'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Academic Year
                  </label>
                  <div className="flex items-center text-gray-900">
                    <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                    {studentInfo ? `${studentInfo.currentYear}${getYearSuffix(studentInfo.currentYear)} Year` : 'Not available'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Batch
                  </label>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {studentInfo ? `${studentInfo.joiningYear} - ${studentInfo.joiningYear + 4}` : 'Not available'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6">
                {isEditing && (
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Save Changes
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-gray-700 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-gray-200 hover:border-blue-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const getYearSuffix = (year: number): string => {
  switch (year) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export default Profile;
