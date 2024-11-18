import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import styles from '../styles/NotFound.module.css';

const BASE_URL = '/academic-scheduler';
const COMMON_ROUTES = [
  { path: '/schedule/schedule', name: 'Schedule' },
  { path: '/schedule/calendar', name: 'Calendar' },
  { path: '/schedule/courses', name: 'Courses' },
  { path: '/schedule/profile', name: 'Profile' },
  { path: '/auth', name: 'Login' },
];

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const suggestions = useMemo(() => {
    const currentPath = location.pathname;
    const isMissingBaseUrl = !currentPath.startsWith(BASE_URL);
    
    if (isMissingBaseUrl) {
      return COMMON_ROUTES.map(route => ({
        original: route.path,
        suggested: `${BASE_URL}${route.path}`,
        name: route.name
      }));
    }
    
    const normalizedPath = currentPath.replace(BASE_URL, '');
    return COMMON_ROUTES
      .filter(route => {
        const similarity = route.path.split('/').some(segment => 
          normalizedPath.split('/').some(currentSegment => 
            currentSegment.toLowerCase().includes(segment.toLowerCase())
          )
        );
        return similarity;
      })
      .map(route => ({
        original: route.path,
        suggested: `${BASE_URL}${route.path}`,
        name: route.name
      }));
  }, [location.pathname]);

  return (
    <div className={styles.container}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={styles.card}
        >
          <div className={styles.header}>
            <motion.h1 
              className={styles.title}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Page Not Found
            </motion.h1>
            <motion.p 
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              We couldn't find the page you're looking for
            </motion.p>
          </div>

          <motion.div 
            className={styles.baseUrlInfo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p>
              The server is configured with a public base URL of{' '}
              <code className={styles.code}>{BASE_URL}</code>
            </p>
            <p>
              Current path:{' '}
              <code className={`${styles.code} ${styles.currentPath}`}>
                {location.pathname}
              </code>
            </p>
          </motion.div>

          {suggestions.length > 0 && (
            <motion.div 
              className={styles.suggestionsContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className={styles.suggestionsTitle}>
                Did you mean to visit one of these pages?
              </h2>
              <div>
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.suggested}
                    className={styles.suggestionCard}
                    onClick={() => navigate(suggestion.original)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.6 + index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={styles.suggestionInfo}>
                      <div className={styles.suggestionName}>
                        {suggestion.name}
                      </div>
                      <div className={styles.suggestionPath}>
                        {suggestion.suggested}
                      </div>
                    </div>
                    <ExternalLink className={styles.icon} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <div className={styles.backButtonContainer}>
            <motion.button
              onClick={() => navigate('/')}
              className={styles.backButton}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className={styles.backButtonIcon} />
              Back to Home
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default NotFound;
