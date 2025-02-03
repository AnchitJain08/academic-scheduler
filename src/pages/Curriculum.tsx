import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { curriculumData } from '../data/Curriculumdata';
import type { CourseDetails } from '../types/curriculum';

interface CompletedCourse extends CourseDetails {
  categoryId: number;
  courseCode: string;
  courseTitle: string;
  credits: number;
  grade?: string;
}

const gradePoints: { [key: string]: number } = {
  'S': 10,
  'A': 9,
  'B': 8,
  'C': 7,
  'D': 6,
  'E': 5,
  'F': 0
};

const calculateCGPA = (courses: CompletedCourse[]): number => {
  // Filter courses to only include those with valid grades
  const gradedCourses = courses.filter(course => course.grade && gradePoints[course.grade]);
  
  const totalCredits = gradedCourses.reduce((sum, course) => sum + course.credits, 0);
  const totalGradePoints = gradedCourses.reduce((sum, course) => {
    return sum + (course.credits * gradePoints[course.grade!]);
  }, 0);
  
  return totalCredits ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0;
};

const Curriculum: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll event to show/hide scroll button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Load completed courses from localStorage on mount
  useEffect(() => {
    const savedCourses = localStorage.getItem('completedCourses');
    if (savedCourses) {
      setCompletedCourses(JSON.parse(savedCourses));
    }
  }, []);

  // Save completed courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('completedCourses', JSON.stringify(completedCourses));
  }, [completedCourses]);

  // Memoized calculations
  const totalCredits = useMemo(() => 
    curriculumData.reduce((sum, item) => sum + item.credits, 0),
    []
  );
  
  const completedCredits = useMemo(() => 
    completedCourses.reduce((sum, course) => sum + course.credits, 0),
    [completedCourses]
  );

  const progressPercentage = useMemo(() => 
    (completedCredits / totalCredits) * 100,
    [completedCredits, totalCredits]
  );

  const getCategoryCompletedCredits = useCallback((categoryId: number) => {
    return completedCourses
      .filter(course => course.categoryId === categoryId)
      .reduce((sum, course) => sum + course.credits, 0);
  }, [completedCourses]);

  const handleCourseToggle = useCallback((course: CourseDetails, categoryId: number) => {
    setError(null);
    const isCourseCompleted = completedCourses.some(
      completed => completed.courseCode === course.courseCode
    );

    if (isCourseCompleted) {
      setCompletedCourses(prev => 
        prev.filter(completed => completed.courseCode !== course.courseCode)
      );
    } else {
      const category = curriculumData.find(cat => cat.slNo === categoryId);
      const categoryCompletedCredits = getCategoryCompletedCredits(categoryId);
      
      if (category && (categoryCompletedCredits + course.credits) <= category.credits) {
        setCompletedCourses(prev => [...prev, { ...course, categoryId }]);
      } else {
        setError(`Cannot add more courses. Credit limit (${category?.credits}) reached for this category.`);
      }
    }
  }, [completedCourses, getCategoryCompletedCredits]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:px-36 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Sticky Header with Progress Bar */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 lg:-mx-36 lg:px-36 border-b border-gray-200">
          <div className="flex flex-col gap-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Curriculum Structure</h1>
              <div className="flex items-center gap-4 text-lg font-semibold text-gray-700">
                <div><span className="font-bold">Completed:</span> {completedCredits} / {totalCredits} <span className="font-bold">Credits</span></div>
                {completedCourses.some(course => course.grade) && (
                  <>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div>
                      <span className="font-bold">CGPA:</span> {calculateCGPA(completedCourses)}
                      <span className="ml-2 text-gray-500">
                        ({(calculateCGPA(completedCourses) * 10).toFixed(1)}%)
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </div>
        </div>

        {/* Credit Distribution Table */}
        <div className="mb-12 overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl.No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {curriculumData.map((item) => (
                <tr key={item.slNo} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.slNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => {
                    setExpandedCategory(item.slNo);
                    document.getElementById(`category-${item.slNo}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}>{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.credits}</td>
                </tr>
              ))}
              {/* Total Credits Row */}
              <tr className="bg-gray-50 font-medium">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan={2}>Total Credits</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{totalCredits}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Category Details Section */}
        <div className="space-y-8">
          {curriculumData.map((category) => (
            <motion.div
              id={`category-${category.slNo}`}
              key={category.slNo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: category.slNo * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div 
                className="px-6 py-4 bg-gray-50 border-b border-gray-200 cursor-pointer"
                onClick={() => setExpandedCategory(expandedCategory === category.slNo ? null : category.slNo)}
              >
                <div className="flex justify-between items-center">
                  <h2 className={`text-lg font-semibold ${getCategoryCompletedCredits(category.slNo) === category.credits ? 'text-green-600' : 'text-gray-900'}`}>
                    {category.category} ({getCategoryCompletedCredits(category.slNo)} / {category.credits} credits)
                  </h2>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${expandedCategory === category.slNo ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedCategory === category.slNo && (
                <div className="p-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sl.No.</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Code</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">L</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">T</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">P</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">J</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {category.courses.map((course: CourseDetails) => (
                        <tr 
                          key={course.slNo} 
                          className={`hover:bg-gray-50 cursor-pointer ${completedCourses.some(completed => completed.courseCode === course.courseCode) ? 'bg-green-50' : ''}`}
                          onClick={() => handleCourseToggle(course, category.slNo)}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{course.slNo}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{course.courseCode}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{course.courseTitle}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{course.courseType}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{course.version}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{course.L}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{course.T}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{course.P}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{course.J}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{course.credits}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Completed Courses Section */}
        {completedCourses.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Completed Courses</h2>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sl.No.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {completedCourses.map((course, index) => {
                    const category = curriculumData.find(cat => cat.slNo === course.categoryId);
                   return (
                      <tr 
                        key={course.courseCode} 
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleCourseToggle(course, course.categoryId)}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{course.courseCode}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{course.courseTitle}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{course.credits}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{category?.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <select
                            className="border-0 bg-transparent focus:ring-2 focus:ring-blue-500 rounded"
                            value={course.grade || ''}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const newGrade = e.target.value;
                              setCompletedCourses(prev =>
                                prev.map(c =>
                                  c.courseCode === course.courseCode
                                    ? { ...c, grade: newGrade }
                                    : c
                                )
                              );
                            }}
                          >
                            <option value="">Select Grade</option>
                            {Object.keys(gradePoints).map(grade => (
                              <option key={grade} value={grade}>{grade}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {completedCourses.some(course => course.grade) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">
                    CGPA: {calculateCGPA(completedCourses)}
                    <span className="ml-2 text-gray-500">
                      ({(calculateCGPA(completedCourses) * 10).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 p-3 bg-white/80 hover:bg-white shadow-lg rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 group z-50"
          aria-label="Scroll to top"
        >
          <svg
            className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </motion.div>
  );
};

export default Curriculum;