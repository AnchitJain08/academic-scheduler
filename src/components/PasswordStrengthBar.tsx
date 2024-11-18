import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface PasswordStrengthBarProps {
  password: string;
}

export const calculatePasswordStrength = (password: string): {
  score: number;
  requirements: {
    met: boolean;
    text: string;
  }[];
} => {
  let score = 0;
  const requirements = [
    {
      met: password.length >= 8,
      text: 'At least 8 characters'
    },
    {
      met: /[A-Z]/.test(password),
      text: 'At least one uppercase letter'
    },
    {
      met: /[a-z]/.test(password),
      text: 'At least one lowercase letter'
    },
    {
      met: /[0-9]/.test(password),
      text: 'At least one number'
    },
    {
      met: /[^A-Za-z0-9]/.test(password),
      text: 'At least one special character'
    }
  ];

  // Calculate score based on met requirements
  score = (requirements.filter(req => req.met).length / requirements.length) * 100;

  // Bonus points for length beyond minimum
  if (password.length > 12) score = Math.min(100, score + 10);
  if (password.length > 16) score = Math.min(100, score + 10);

  return { score, requirements };
};

const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password }) => {
  const { score, requirements } = useMemo(() => calculatePasswordStrength(password), [password]);

  const getStrengthText = (score: number) => {
    if (score === 0) return '';
    if (score < 40) return 'Weak';
    if (score < 75) return 'Moderate';
    return 'Strong';
  };

  const getStrengthColor = (score: number) => {
    // Return a gradient of colors based on score
    if (score < 40) return `rgb(239, 68, 68)`;
    if (score < 75) return `rgb(234, 179, 8)`;
    return `rgb(34, 197, 94)`;
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ 
            width: `${score}%`,
            backgroundColor: getStrengthColor(score)
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {password && (
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: getStrengthColor(score) }}>
            {getStrengthText(score)}
          </p>
          <div className="space-y-1">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center text-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    color: req.met ? 'rgb(34, 197, 94)' : 'rgb(156, 163, 175)'
                  }}
                  className={`mr-2 text-xs ${req.met ? 'text-green-500' : 'text-gray-400'}`}
                >
                  {req.met ? '✓' : '○'}
                </motion.div>
                <span className={`text-xs ${req.met ? 'text-gray-700' : 'text-gray-500'}`}>
                  {req.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthBar;
