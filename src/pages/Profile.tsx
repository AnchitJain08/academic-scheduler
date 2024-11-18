import React from 'react';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
    >
      <Construction className="w-12 h-12 text-blue-600 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
        Coming Soon
      </h1>
      <p className="text-gray-600 text-center max-w-sm">
        We're working on something awesome for you. Stay tuned!
      </p>
    </motion.div>
  );
};

export default Profile;