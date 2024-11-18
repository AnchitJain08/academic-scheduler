import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBFBFD] to-[#F5F5F7]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl z-50 border-b border-gray-100">
        <nav className="h-14 flex items-center justify-between px-6 max-w-[1024px] mx-auto">
          <span className="text-base font-semibold text-[#1d1d1f]">AcadFlow</span>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/schedule/schedule')}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-blue-800 bg-blue-50 border border-blue-800 hover:bg-blue-100 active:bg-blue-50 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-[1024px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#1d1d1f] max-w-2xl mx-auto">
              Streamline your academic journey with AcadFlow
            </h1>
            <p className="mt-6 text-lg text-[#424245] max-w-xl mx-auto">
              Manage your academic schedule, track assignments, and stay organized with our intuitive platform.
            </p>
            <motion.button
              onClick={() => navigate('/schedule/schedule')}
              className="mt-8 px-6 py-3 text-base font-medium text-white bg-[#06c] rounded-full hover:bg-blue-700 active:bg-blue-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started Now
            </motion.button>
          </motion.div>

          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-32"
          >
            <h2 className="text-3xl font-semibold text-[#1d1d1f] mb-4">
              Why choose AcadFlow?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[
                {
                  title: 'Smart Scheduling',
                  description: 'Automatically organize your classes and assignments with our intelligent scheduling system.',
                  icon: (props: any) => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      {...props}
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  ),
                },
                {
                  title: 'Course Management',
                  description: 'Keep track of all your courses, materials, and deadlines in one centralized location.',
                  icon: (props: any) => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      {...props}
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  ),
                },
                {
                  title: 'Progress Tracking',
                  description: 'Monitor your academic progress and stay on top of your educational goals.',
                  icon: (props: any) => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      {...props}
                    >
                      <line x1="12" y1="20" x2="12" y2="10" />
                      <line x1="18" y1="20" x2="18" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="16" />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="p-6 bg-white rounded-2xl shadow-[2px_4px_16px_rgba(17,17,26,0.08)] border border-gray-100"
                >
                  {feature.icon({ className: 'w-8 h-8 text-[#06c]' })}
                  <h3 className="mt-4 text-lg font-semibold text-[#1d1d1f]">{feature.title}</h3>
                  <p className="mt-2 text-[#424245]">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Landing;
