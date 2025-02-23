import React, { useEffect, useRef } from 'react';
import { courses } from '../data/courseData';
import { useLocation } from 'react-router-dom';
import GradualSpacing from '../components/magicui/gradual-spacing';

const CourseCard = ({ course, index }: { course: any; index: number }) => (
  <GradualSpacing
    key={course.code}
    delay={index * 0.05}
    duration={0.3}
  >
    <div 
      className="rounded-2xl overflow-hidden bg-white flex flex-col"
      style={{
        boxShadow: '2px 4px 16px rgba(17, 17, 26, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Header */}
      <div 
        className="p-3 lg:p-3"
        style={{ backgroundColor: course.color }}
      >
        <h2 className="font-bold text-lg leading-tight">{course.code}</h2>
        <h3 className="text-gray-700 text-sm leading-tight mt-1">{course.title}</h3>
      </div>

      {/* Content */}
      <div className="p-3 lg:p-3 flex-1 flex flex-col">
        <div className="space-y-2">
          <div className="flex">
            <div className="w-[100px] text-left">
              <span className="text-sm text-gray-500 font-medium">Slot:</span>
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm">{course.slot}</span>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-[100px] text-left">
              <span className="text-sm text-gray-500 font-medium">Credits:</span>
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm">{course.credit}</span>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-[100px] text-left">
              <span className="text-sm text-gray-500 font-medium">Room No:</span>
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm">{course.roomNo}</span>
            </div>
          </div>
          

          <div className="flex">
            <div className="w-[100px] text-left">
              <span className="text-sm text-gray-500 font-medium">Class No:</span>
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm">{course.classNo}</span>
            </div>
          </div>
          
          <div className="flex">
            <div className="w-[100px] text-left">
              <span className="text-sm text-gray-500 font-medium">Faculty:</span>
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm">{course.faculty}</span>
            </div>
          </div>

          {course.totalClasses && (
            <div className="flex">
              <div className="w-[100px] text-left">
                <span className="text-sm text-gray-500 font-medium">Classes:</span>
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm">{course.totalClasses} total</span>
                {course.maxAbsent && (
                  <span className="text-sm text-red-500 ml-1">
                    (can miss {course.maxAbsent})
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Button Container */}
        <div className="flex justify-end mt-auto pt-3">
          {course.meetLink && (
            <a
              href={course.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              style={{
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              Join Meeting
            </a>
          )}
        </div>
      </div>
    </div>
  </GradualSpacing>
);

const Courses: React.FC = () => {
  const location = useLocation();
  const courseRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const element = courseRefs.current[state.scrollTo];
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="p-4 lg:px-36">
      {/* Desktop view */}
      <div className="hidden lg:block">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold">My Courses</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {courses.map((course, index) => (
              <div
                key={course.code}
                ref={(el: HTMLDivElement | null) => {
                  if (course.code) {
                    courseRefs.current[course.code] = el;
                  }
                }}
              >
                <CourseCard course={course} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile view */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, index) => (
            <div
              key={course.code}
              ref={(el: HTMLDivElement | null) => {
                if (course.code) {
                  courseRefs.current[course.code] = el;
                }
              }}
            >
              <CourseCard course={course} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
