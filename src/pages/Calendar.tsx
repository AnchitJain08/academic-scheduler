import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO,
  isToday,
  getDay,
  startOfWeek,
  isWithinInterval,
  addDays,
  addMonths,
  subMonths,
} from 'date-fns';
import { academicEvents } from '../data/academicData';
import type { AcademicEvent } from '../types';
import GradualSpacing from '../components/magicui/gradual-spacing';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10)); // November 2024
  const monthStart = startOfMonth(currentDate);
  // Always show exactly 6 weeks (42 days) from the start of the calendar
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = addDays(calendarStart, 41);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventDuration = (start: Date, end: Date): number => {
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const getEventsForDay = (date: Date): Array<{ 
    event: AcademicEvent; 
    isStart: boolean; 
    isEnd: boolean; 
    duration: number;
    position: number;
  }> => {
    const dayEvents = academicEvents.map(event => {
      const start = parseISO(event.startDate);
      const end = parseISO(event.endDate);
      const isStart = isSameDay(date, start);
      const isEnd = isSameDay(date, end);
      const isWithinEvent = !isStart && !isEnd && isWithinInterval(date, { start, end });
      const duration = getEventDuration(start, end);

      if (isStart || isEnd || isWithinEvent) {
        return { 
          event, 
          isStart, 
          isEnd, 
          duration,
          position: 0 // Will be set after sorting
        };
      }
      return null;
    }).filter(Boolean) as Array<{ 
      event: AcademicEvent; 
      isStart: boolean; 
      isEnd: boolean; 
      duration: number;
      position: number;
    }>;

    // Sort events by duration (longest first) and assign positions
    return dayEvents
      .sort((a, b) => b.duration - a.duration)
      .map((eventData, index) => ({
        ...eventData,
        position: index
      }));
  };

  const getEventColor = (type: AcademicEvent['type'], title: string): string => {
    // Special handling for different types of breaks
    if (type === 'holiday') {
      if (title.toLowerCase().includes('semester break')) {
        return 'group-hover:bg-teal-50 bg-teal-100 text-teal-800 border-teal-200';
      }
      if (title.toLowerCase().includes('break')) {
        return 'group-hover:bg-indigo-50 bg-indigo-100 text-indigo-800 border-indigo-200';
      }
      return 'group-hover:bg-red-50 bg-red-100 text-red-800 border-red-200';
    }
    switch (type) {
      case 'exam':
        return 'group-hover:bg-purple-50 bg-purple-100 text-purple-800 border-purple-200';
      case 'deadline':
        return 'group-hover:bg-yellow-50 bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'group-hover:bg-blue-50 bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatEventTitle = (title: string): string => {
    return title.replace(/(begin|end)/gi, '').trim();
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Filter events for the current month
  const currentMonthEvents = academicEvents.filter(event => {
    const startDate = parseISO(event.startDate);
    return isSameMonth(startDate, currentDate);
  });

  // Mobile view component
  const MobileView = () => (
    <div className="lg:hidden">
      {/* Month selector */}
      <div className="flex justify-between items-center bg-white shadow-sm mb-2 px-3 py-2 rounded-xl">
        <button 
          onClick={prevMonth}
          className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="black" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          {format(currentDate, 'MMMM yyyy') !== format(new Date(), 'MMMM yyyy') && (
            <button 
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Today
            </button>
          )}
        </div>
        <button 
          onClick={nextMonth}
          className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="black" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Events list */}
      <div className="space-y-2">
        {currentMonthEvents.map((event, index) => {
          const isPastEvent = event.endDate 
            ? parseISO(event.endDate) < new Date() 
            : parseISO(event.startDate) < new Date();
            
          return (
            <div
              key={event.id}
              className={`flex bg-white overflow-hidden rounded-xl border transition-all duration-200 group animate-fade-in
                ${isPastEvent ? 'border-gray-100 opacity-60' : 'border-gray-200'}`}
              style={{
                boxShadow: isPastEvent ? 'none' : '2px 4px 16px rgba(17, 17, 26, 0.08)',
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              {/* Colored strip */}
              <div 
                className="w-3 rounded-l-xl flex-shrink-0"
                style={{ 
                  backgroundColor: 
                    event.type === 'holiday' 
                      ? event.title.toLowerCase().includes('semester break')
                        ? '#0D9488' // darker teal
                        : event.title.toLowerCase().includes('break')
                          ? '#4F46E5' // darker indigo
                          : '#DC2626' // darker red
                      : event.type === 'exam'
                        ? '#7E22CE' // darker purple
                        : event.type === 'deadline'
                          ? '#CA8A04' // darker yellow
                          : '#2563EB', // darker blue (default)
                  opacity: isPastEvent ? 0.5 : 1
                }}
              />
              
              {/* Event content */}
              <div className="flex-1 p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className={`font-medium text-sm text-left ${isPastEvent ? 'text-gray-500' : ''}`}>
                      {formatEventTitle(event.title)}
                    </h3>
                    {event.description && (
                      <p className={`text-sm mt-1 text-left line-clamp-2 ${isPastEvent ? 'text-gray-400' : 'text-gray-600'}`}>
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end text-xs whitespace-nowrap">
                    {event.endDate && event.endDate !== event.startDate ? (
                      <div className="text-black">
                        {format(parseISO(event.startDate), 'd')}-{format(parseISO(event.endDate), 'd')}
                      </div>
                    ) : (
                      <div className="text-black">
                        {format(parseISO(event.startDate), 'd')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Desktop view component
  const DesktopView = () => (
    <div className="hidden lg:block">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
              className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
              aria-label="Previous month"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="black">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm font-medium shadow-[2px_4px_16px_rgba(59,130,246,0.2)]"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
              className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200"
              aria-label="Next month"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="black">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden bg-white border border-gray-200"
             style={{
               boxShadow: '2px 4px 16px rgba(17, 17, 26, 0.08)',
             }}>
          <div className="grid grid-cols-7">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div 
                key={day} 
                className={`text-center font-semibold py-3 border-b border-gray-200 ${
                  index === 0 ? 'bg-gray-50' : ''
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const events = getEventsForDay(day);
              const isSunday = getDay(day) === 0;
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isLastRow = index >= days.length - 7;
              
              return (
                <div
                  key={day.toString()}
                  className={`min-h-[100px] p-2 ${
                    !isLastRow ? 'border-b' : ''
                  } ${
                    (index + 1) % 7 !== 0 ? 'border-r' : ''
                  } border-gray-200 ${
                    isSunday ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex justify-end mb-1">
                    <div className={`font-medium ${
                      !isCurrentMonth ? 'text-gray-400' : ''
                    } ${
                      isToday(day) 
                        ? 'bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center'
                        : ''
                    }`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                  <div className="space-y-0">
                    {events.map(({ event, isStart, isEnd, position }) => (
                      <div
                        key={event.id}
                        data-event-id={event.id}
                        className={`text-xs h-5 flex items-center group/event-${event.id} peer-hover/event-${event.id}:bg-opacity-50 ${getEventColor(event.type, event.title)} 
                          ${isStart && isEnd ? 'rounded-full px-3 hover:px-4' : 
                            isStart ? 'rounded-l-full pl-3 hover:pl-4 pr-1' : 
                            isEnd ? 'rounded-r-full pr-3 hover:pr-4 pl-1' : 
                            getDay(day) === 0 ? 'pl-3 hover:pl-4 pr-1' :
                            getDay(day) === 6 ? 'pr-3 hover:pr-4 pl-1' : 'px-1'
                          }
                          ${!isStart && !isEnd ? 
                            (getDay(day) === 0 ? '-mr-2' : 
                             getDay(day) === 6 ? '-ml-2' : '-mx-2') : 
                            isStart && !isEnd ? '-mr-2' : 
                            !isStart && isEnd ? '-ml-2' : ''
                          }
                          ${(isStart || getDay(day) === 0) ? 'rounded-l-full' : ''}
                          ${(isEnd || getDay(day) === 6) ? 'rounded-r-full' : ''}
                          border-t border-b 
                          ${isStart || getDay(day) === 0 ? 'border-l' : ''} 
                          ${isEnd || getDay(day) === 6 ? 'border-r' : ''} 
                          truncate relative cursor-pointer
                          transition-all duration-200 ease-in-out
                          hover:shadow-md hover:transform hover:scale-[1.02] hover:z-50
                          group-hover/event-${event.id}:border-gray-300
                          peer/event-${event.id}`}
                        onMouseEnter={() => {
                          document.querySelectorAll(`[data-event-id="${event.id}"]`).forEach(el => {
                            el.classList.add('scale-[1.02]', 'shadow-md', 'z-50');
                          });
                        }}
                        onMouseLeave={() => {
                          document.querySelectorAll(`[data-event-id="${event.id}"]`).forEach(el => {
                            el.classList.remove('scale-[1.02]', 'shadow-md', 'z-50');
                          });
                        }}
                        style={{
                          zIndex: 20 - position,
                          marginTop: `${position * 1.25}rem`
                        }}
                        title={`${event.title} (${format(parseISO(event.startDate), 'MMM d')} - ${format(parseISO(event.endDate), 'MMM d, yyyy')})`}
                      >
                        {(isStart || getDay(day) === 0) && formatEventTitle(event.title)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:px-36">
      <MobileView />
      <DesktopView />
    </div>
  );
};

export default Calendar;
