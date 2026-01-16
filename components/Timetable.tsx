
import React from 'react';

const Timetable: React.FC = () => {
  const schedule = [
    { day: 'Monday', classes: [
      { time: '08:00 AM - 10:00 AM', subject: 'Advanced Math', room: 'Virtual Hall A', tutor: 'Dr. Mitchell' },
      { time: '02:00 PM - 04:00 PM', subject: 'Physics II', room: 'Lab 04', tutor: 'Prof. Grant' }
    ]},
    { day: 'Tuesday', classes: [
      { time: '10:00 AM - 12:00 PM', subject: 'AI Foundations', room: 'Virtual Hall B', tutor: 'Prof. Wilson' }
    ]},
    { day: 'Wednesday', classes: [
      { time: '09:00 AM - 11:00 AM', subject: 'Algorithm Design', room: 'Hall 12', tutor: 'Dr. Lee' }
    ]},
    { day: 'Thursday', classes: [
      { time: '11:00 AM - 01:00 PM', subject: 'Statistics', room: 'Virtual Hall A', tutor: 'Dr. Mitchell' }
    ]},
    { day: 'Friday', classes: [
      { time: '01:00 PM - 03:00 PM', subject: 'Ethics in Tech', room: 'Seminar Room', tutor: 'Prof. White' }
    ]}
  ];

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Weekly Schedule</h1>
        <p className="text-slate-500">Stay organized with your personalized learning timetable.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {schedule.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-3 bg-indigo-50 border-b border-indigo-100 text-center">
              <span className="font-bold text-indigo-700 text-xs uppercase tracking-widest">{item.day}</span>
            </div>
            <div className="p-4 flex-1 space-y-4">
              {item.classes.length > 0 ? (
                item.classes.map((c, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group">
                    <p className="text-[10px] font-bold text-indigo-500 mb-1">{c.time}</p>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600">{c.subject}</h4>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium flex items-center">
                      <i className="fa-solid fa-location-dot mr-1"></i> {c.room}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 py-8">
                  <i className="fa-solid fa-moon text-2xl mb-2"></i>
                  <span className="text-[10px] font-bold">No Classes</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
