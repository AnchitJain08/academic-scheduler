import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, X } from 'lucide-react';
import type { Schedule } from '../types';

interface ScheduleEntryProps {
  onClose: () => void;
}

const ScheduleEntry: React.FC<ScheduleEntryProps> = ({ onClose }) => {
  const { courses, addScheduleItem } = useStore();
  const [scheduleItem, setScheduleItem] = useState<Partial<Schedule>>({
    courseId: '',
    dayOfWeek: 1,
    startTime: '',
    endTime: '',
    roomNumber: '',
  });

  const daysOfWeek = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setScheduleItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleItem.courseId || !scheduleItem.startTime || !scheduleItem.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    addScheduleItem({
      id: crypto.randomUUID(),
      ...scheduleItem as Schedule,
    });
    
    setScheduleItem({
      courseId: '',
      dayOfWeek: 1,
      startTime: '',
      endTime: '',
      roomNumber: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-medium">Add Class Schedule</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Course
            </label>
            <select
              name="courseId"
              value={scheduleItem.courseId}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Day of Week
            </label>
            <select
              name="dayOfWeek"
              value={scheduleItem.dayOfWeek}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {daysOfWeek.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={scheduleItem.startTime}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={scheduleItem.endTime}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Room Number
            </label>
            <input
              type="text"
              name="roomNumber"
              value={scheduleItem.roomNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Room 101"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleEntry;
