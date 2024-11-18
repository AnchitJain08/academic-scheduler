import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, BookOpen, Clock, User } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">AcadFlow</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 mb-16">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
        <div className="grid grid-cols-4 gap-1">
          <Link
            to="/schedule"
            className={`flex flex-col items-center justify-center px-2 py-1 text-xs ${
              isActive('/schedule') ? 'text-blue-600' : 'text-gray-600'
            } hover:text-blue-600 transition-colors`}
          >
            <Clock className="w-6 h-6" />
            <span>Schedule</span>
          </Link>

          <Link
            to="/calendar"
            className={`flex flex-col items-center justify-center px-2 py-1 text-xs ${
              isActive('/calendar') ? 'text-blue-600' : 'text-gray-600'
            } hover:text-blue-600 transition-colors`}
          >
            <Calendar className="w-6 h-6" />
            <span>Calendar</span>
          </Link>

          <Link
            to="/courses"
            className={`flex flex-col items-center justify-center px-2 py-1 text-xs ${
              isActive('/courses') ? 'text-blue-600' : 'text-gray-600'
            } hover:text-blue-600 transition-colors`}
          >
            <BookOpen className="w-6 h-6" />
            <span>Courses</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center px-2 py-1 text-xs ${
              isActive('/profile') ? 'text-blue-600' : 'text-gray-600'
            } hover:text-blue-600 transition-colors`}
          >
            <User className="w-6 h-6" />
            <span>Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
