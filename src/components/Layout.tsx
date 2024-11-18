import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, BookOpen, Clock, User } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    const currentPath = location.pathname;
    switch (path) {
      case '/schedule':
        return currentPath === '/schedule/schedule';
      case '/calendar':
        return currentPath === '/schedule/calendar';
      case '/courses':
        return currentPath === '/schedule/courses';
      case '/profile':
        return currentPath === '/schedule/profile';
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar - Only shown in Profile */}
      {location.pathname.includes('/profile') && (
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-900">AcadFlow</span>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${!location.pathname.includes('/profile') ? 'mt-0' : ''} mb-16`}>
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
        <div className="grid grid-cols-4 gap-1">
          <Link
            to="/schedule/schedule"
            className={`flex flex-col items-center justify-center px-2 py-1 text-xs ${
              isActive('/schedule') ? 'text-blue-800' : 'text-black'
            }`}
          >
            <Clock className="w-6 h-6" />
            <span>Schedule</span>
          </Link>

          <Link
            to="/schedule/calendar"
            className={`flex flex-col items-center justify-center px-2 py-1 text-xs ${
              isActive('/calendar') ? 'text-blue-800' : 'text-black'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span>Calendar</span>
          </Link>

          <Link
            to="/schedule/courses"
            className={`flex flex-col items-center justify-center px-2 py-1 text-xs ${
              isActive('/courses') ? 'text-blue-800' : 'text-black'
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <span>Courses</span>
          </Link>

          <Link
            to="/schedule/profile"
            className={`flex flex-col items-center justify-center px-2 py-1 text-xs ${
              isActive('/profile') ? 'text-blue-800' : 'text-black'
            }`}
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
