import React, { useState, useMemo } from 'react';
import { timetable, findCourseBySlot } from '../data/courseData';
import { academicEvents } from '../data/academicData';
import GradualSpacing from '../components/magicui/gradual-spacing';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Schedule: React.FC = () => {
  const days = Object.keys(timetable.schedule);
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date();
    const dayIndex = today.getDay();
    if (dayIndex === 0) return 'SUN';
    if (dayIndex === 6) return 'SAT';
    return days[dayIndex - 1];
  });
  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate dates for the current week
  const weekDates = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay);
    
    // Apply week offset
    sunday.setDate(sunday.getDate() + (weekOffset * 7));

    return ['SUN', ...days, 'SAT'].map((_, index) => {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + index);
      return date;
    });
  }, [days, weekOffset]);

  // Check if current date is selected
  const isCurrentDateSelected = useMemo(() => {
    const today = new Date();
    const dayIndex = ['SUN', ...days, 'SAT'].indexOf(selectedDay);
    const selectedDate = weekDates[dayIndex];
    return format(today, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  }, [selectedDay, weekDates, days]);

  // Check for academic events on a specific date
  const getAcademicEvent = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return academicEvents.find(event => {
      const startDate = new Date(event.startDate).toISOString().split('T')[0];
      const endDate = new Date(event.endDate).toISOString().split('T')[0];
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  // Check if classes should be cancelled for an event
  const shouldCancelClasses = (event: any) => {
    if (!event) return false;
    if (event.type === 'exam') return true;
    if (event.type === 'holiday') {
      return !event.description?.toLowerCase().includes('sectional');
    }
    return false;
  };

  // Get event background color
  const getEventBackgroundColor = (event: any | undefined) => {
    if (!event) return '#F3F4F6';
    
    if (event.type === 'holiday') {
      if (event.title.toLowerCase().includes('semester break')) {
        return '#E6FFFA'; // light teal
      }
      if (event.title.toLowerCase().includes('break')) {
        return '#EEF2FF'; // light indigo
      }
      return '#FEE2E2'; // light red
    }
    if (event.type === 'exam') {
      return '#F5F3FF'; // light purple
    }
    if (event.type === 'deadline') {
      return '#FEF9C3'; // light yellow
    }
    return '#EFF6FF'; // light blue (default)
  };

  // Get event text color
  const getEventTextColor = (event: any | undefined) => {
    if (!event) return '#111827';
    
    if (event.type === 'holiday') {
      if (event.title.toLowerCase().includes('semester break')) {
        return '#0D9488'; // darker teal
      }
      if (event.title.toLowerCase().includes('break')) {
        return '#4F46E5'; // darker indigo
      }
      return '#DC2626'; // darker red
    }
    if (event.type === 'exam') {
      return '#7E22CE'; // darker purple
    }
    if (event.type === 'deadline') {
      return '#CA8A04'; // darker yellow
    }
    return '#2563EB'; // darker blue (default)
  };

  const renderTimeSlot = (slot: string, event?: any) => {
    if (slot.startsWith('EVENT:')) {
      return {
        backgroundColor: getEventBackgroundColor(event),
        color: getEventTextColor(event),
        fontWeight: 'bold'
      };
    }
    const course = findCourseBySlot(slot);
    return course ? { backgroundColor: course.color } : undefined;
  };

  // Get slots for a specific day
  const getSlotsForDay = (day: string) => {
    const dayIndex = ['SUN', ...days, 'SAT'].indexOf(day);
    const date = weekDates[dayIndex];
    const event = getAcademicEvent(date);
    
    if (shouldCancelClasses(event)) {
      return Array(timetable.timeSlots.length).fill(`EVENT:${event?.title || 'No Classes'}`);
    }
    
    if (day === 'SUN' || day === 'SAT') {
      return Array(timetable.timeSlots.length).fill('WEEKEND');
    }
    
    return timetable.schedule[day] || [];
  };

  const handlePreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };

  const handleToday = () => {
    setWeekOffset(0);
    const today = new Date();
    const dayIndex = today.getDay();
    const dayName = days[dayIndex - 1] || days[0]; // Adjust for Sunday
    setSelectedDay(dayName);
  };

  // Desktop view component
  const DesktopSchedule = () => (
    <div className="hidden lg:block">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">My Schedule</h1>
        </div>
        <div 
          className="min-w-[800px] rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-[2px_4px_16px_rgba(17,17,26,0.08)]"
        >
          <div className="grid grid-cols-[100px_repeat(5,1fr)]" style={{ backgroundColor: '#f3f4f6' }}>
            <div className="h-10 p-2 font-semibold text-center text-sm">Time</div>
            {days.map(day => (
              <div key={day} className="h-10 p-2 font-semibold text-center text-sm">{day}</div>
            ))}
          </div>

          {timetable.timeSlots.map((time, timeIndex) => (
            <div key={time} className="grid grid-cols-[100px_repeat(5,1fr)]">
              <div className="h-16 p-1 text-xs font-bold flex items-center justify-center text-center bg-white">
                {time}
              </div>
              {days.map(day => {
                const slotNumber = timetable.schedule[day][timeIndex];
                const course = findCourseBySlot(slotNumber);
                
                return (
                  <div
                    key={`${day}-${timeIndex}`} 
                    className="h-16 p-2 text-sm overflow-hidden flex items-center justify-center transition-all duration-200 hover:shadow-inner"
                    style={{
                      backgroundColor: course?.color || 'white'
                    }}
                  >
                    {slotNumber ? (
                      <div className="flex items-center space-x-1 font-medium">
                        <span>{slotNumber}</span>
                        {course && (
                          <>
                            <span className="text-gray-400">-</span>
                            <span className="text-gray-600">{course.code}</span>
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Mobile view component
  const navigate = useNavigate();
  const MobileSchedule = () => {
    const currentDaySlots = getSlotsForDay(selectedDay);
    const dayIndex = ['SUN', ...days, 'SAT'].indexOf(selectedDay);
    const currentDate = weekDates[dayIndex];
    const event = getAcademicEvent(currentDate);
    const isEventDay = shouldCancelClasses(event);
    const isWeekend = currentDaySlots[0] === 'WEEKEND';
    
    return (
      <div className="lg:hidden px-3 pt-3">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-2 px-1 py-1 bg-white rounded-xl shadow-sm">
          <button
            onClick={handlePreviousWeek}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              {format(currentDate, 'MMMM d')}
            </span>
            {!isCurrentDateSelected && (
              <button
                onClick={handleToday}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Today
              </button>
            )}
          </div>
          <button
            onClick={handleNextWeek}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Day selector */}
        <div className="flex justify-between bg-white shadow-sm mb-1.5 px-0.5 py-1 rounded-xl">
          <button
            onClick={() => setSelectedDay('SUN')}
            className={`flex-1 py-1.5 text-sm font-medium transition-all rounded-lg flex flex-col items-center min-w-[40px] mx-0.5 ${
              selectedDay === 'SUN'
                ? 'bg-blue-500 text-white shadow-md scale-105' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className="text-xs">Sun</span>
            <span className={`text-xs mt-0.5 ${
              selectedDay === 'SUN' ? 'text-white/80' : 'text-gray-500'
            }`}>
              {weekDates[0].getDate()}
            </span>
          </button>
          {days.map((day, index) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 py-1.5 text-sm font-medium transition-all rounded-lg flex flex-col items-center min-w-[40px] mx-0.5 ${
                selectedDay === day 
                  ? 'bg-blue-500 text-white shadow-md scale-105' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className="text-xs">{day}</span>
              <span className={`text-xs mt-0.5 ${
                selectedDay === day ? 'text-white/80' : 'text-gray-500'
              }`}>
                {weekDates[index + 1].getDate()}
              </span>
            </button>
          ))}
          <button
            onClick={() => setSelectedDay('SAT')}
            className={`flex-1 py-1.5 text-sm font-medium transition-all rounded-lg flex flex-col items-center min-w-[40px] mx-0.5 ${
              selectedDay === 'SAT'
                ? 'bg-blue-500 text-white shadow-md scale-105' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className="text-xs">Sat</span>
            <span className={`text-xs mt-0.5 ${
              selectedDay === 'SAT' ? 'text-white/80' : 'text-gray-500'
            }`}>
              {weekDates[6].getDate()}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          {isEventDay ? (
            <div 
              className="py-8 px-4 rounded-xl shadow-sm bg-white text-center"
              style={{
                backgroundColor: getEventBackgroundColor(event)
              }}
            >
              <p 
                className="text-lg font-bold mb-2"
                style={{
                  color: getEventTextColor(event)
                }}
              >
                {event?.title}
              </p>
              <p 
                className="text-sm"
                style={{
                  color: getEventTextColor(event)
                }}
              >
                No classes today due to {event?.type}
              </p>
            </div>
          ) : isWeekend ? (
            <div className="py-8 px-4 rounded-xl shadow-sm bg-gray-50 text-center">
              <p className="text-lg font-bold text-gray-800 mb-2">Weekend</p>
              <p className="text-sm text-gray-600">No classes scheduled for {selectedDay === 'SUN' ? 'Sunday' : 'Saturday'}</p>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleToday}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm"
                >
                  View Today's Schedule
                </button>
              </div>
            </div>
          ) : (
            timetable.timeSlots.map((time, index) => {
              const slotNumber = currentDaySlots[index];
              const course = findCourseBySlot(slotNumber);
              
              return (
                <GradualSpacing
                  key={`${selectedDay}-${index}`}
                  delay={index * 0.05}
                  duration={0.3}
                >
                  <div
                    onClick={() => course && navigate('/courses', { state: { scrollTo: course.code } })}
                    className="py-4 px-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                    style={{
                      backgroundColor: course?.color || 'white',
                      border: '1px solid rgba(0,0,0,0.1)',
                      cursor: course ? 'pointer' : 'default'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{time}</span>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm opacity-75">{slotNumber || '-'}</span>
                        {course && (
                          <span className="text-sm font-medium">({course.code})</span>
                        )}
                      </div>
                    </div>
                    {course && (
                      <div className="mt-0.5 text-sm opacity-75 text-left">
                        {course.title}
                      </div>
                    )}
                  </div>
                </GradualSpacing>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 lg:px-36">
      <MobileSchedule />
      <DesktopSchedule />
    </div>
  );
};

export default Schedule;
