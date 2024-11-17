import React, { useState, useMemo } from 'react';
import { timetable, findCourseBySlot } from '../data/courseData';

const Schedule: React.FC = () => {
  const days = Object.keys(timetable.schedule);
  const [selectedDay, setSelectedDay] = useState(days[0]);

  // Calculate dates for the current week
  const weekDates = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

    return days.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  }, [days]);

  const renderTimeSlot = (slot: string) => {
    const course = findCourseBySlot(slot);
    return course ? { backgroundColor: course.color } : undefined;
  };

  // Desktop view component
  const DesktopSchedule = () => (
    <div className="hidden lg:block">
      <h1 className="text-2xl font-bold mb-6">My Timetable</h1>
      <div 
        className="min-w-[800px] rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-[2px_4px_16px_rgba(17,17,26,0.08)]"
      >
        <div className="grid grid-cols-[100px_repeat(5,1fr)]" style={{ backgroundColor: '#f3f4f6' }}>
          <div className="h-10 p-2 font-semibold text-center">Time</div>
          {days.map(day => (
            <div key={day} className="h-10 p-2 font-semibold text-center">{day}</div>
          ))}
        </div>

        {timetable.timeSlots.map((time, timeIndex) => (
          <div key={time} className="grid grid-cols-[100px_repeat(5,1fr)]">
            <div className="h-12 p-1 text-xs flex items-center justify-center text-center bg-white">
              {time}
            </div>
            {days.map(day => (
              <div key={`${day}-${timeIndex}`} 
                className="h-12 p-1 text-xs overflow-hidden flex items-center justify-center"
                style={renderTimeSlot(timetable.schedule[day][timeIndex])}
              >
                <div className="font-semibold text-center">
                  {timetable.schedule[day][timeIndex] || '-'}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // Mobile view component
  const MobileSchedule = () => (
    <div className="lg:hidden">
      {/* Day selector */}
      <div className="flex justify-between bg-white shadow-sm mb-2 px-1 py-1 rounded-xl">
        {days.map((day, index) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 py-2 text-sm font-medium transition-all rounded-lg flex flex-col items-center ${
              selectedDay === day 
                ? 'bg-blue-500 text-white shadow-md scale-105' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span>{day}</span>
            <span className={`text-xs mt-0.5 ${
              selectedDay === day ? 'text-white/80' : 'text-gray-500'
            }`}>
              {weekDates[index].getDate()}
            </span>
          </button>
        ))}
      </div>

      {/* Time slots list */}
      <div className="space-y-1.5">
        {timetable.timeSlots.map((time, index) => {
          const slot = timetable.schedule[selectedDay][index];
          if (!slot) return null;
          const course = findCourseBySlot(slot);
          
          return (
            <div
              key={`${selectedDay}-${index}`}
              className="py-5 px-3 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              style={{
                backgroundColor: course?.color || 'white',
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{time}</span>
                <span className="text-sm opacity-75">{course?.code || slot}</span>
              </div>
              {course && (
                <div className="mt-1 text-sm opacity-75 text-left">
                  {course.title}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="pb-2">
      <MobileSchedule />
      <div className="-mx-0 lg:mx-4">
        <DesktopSchedule />
      </div>
    </div>
  );
};

export default Schedule;
