
import React, { useState } from 'react';
import { Course, LiveSession } from '../types';

interface LiveSessionManagerProps {
  course: Course;
  onBack: () => void;
}

const LiveSessionManager: React.FC<LiveSessionManagerProps> = ({ course, onBack }) => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<LiveSession>>({
    title: `Live Session: ${course.name}`,
    startTime: '',
    endTime: '',
    meetingLink: '',
    zoomId: '',
    zoomPasscode: ''
  });

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: LiveSession = {
      id: `ls${Date.now()}`,
      courseId: course.id,
      instructor: course.instructor,
      title: formData.title || '',
      startTime: formData.startTime || '',
      endTime: formData.endTime || '',
      meetingLink: formData.meetingLink || '',
      zoomId: formData.zoomId,
      zoomPasscode: formData.zoomPasscode
    };
    setSessions([...sessions, newSession]);
    setIsModalOpen(false);
  };

  const generateZoomLink = () => {
    const id = Math.floor(Math.random() * 900000000) + 100000000;
    const pwd = Math.random().toString(36).slice(-8);
    setFormData({
      ...formData,
      zoomId: id.toString(),
      zoomPasscode: pwd,
      meetingLink: `https://zoom.us/j/${id}?pwd=${pwd}`
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-50">
            <i className="fa-solid fa-arrow-left text-slate-400"></i>
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Zoom Session Orchestrator</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{course.name}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
        >
          Book Live Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map(session => (
          <div key={session.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                <i className="fa-solid fa-video text-xl"></i>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase rounded-lg mb-1">Zoom Class</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">ID: {session.zoomId}</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-slate-800 leading-tight mb-4">{session.title}</h3>
            <div className="space-y-2 mb-8">
              <div className="flex items-center text-xs font-bold text-slate-500">
                <i className="fa-solid fa-clock w-6 text-blue-400"></i>
                {session.startTime.replace('T', ' ')}
              </div>
              <div className="flex items-center text-xs font-bold text-slate-500">
                <i className="fa-solid fa-key w-6 text-blue-400"></i>
                Pass: {session.zoomPasscode}
              </div>
            </div>
            <div className="flex gap-2">
              <a 
                href={session.meetingLink} target="_blank" rel="noopener noreferrer"
                className="flex-1 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest text-center rounded-xl shadow-lg hover:bg-blue-700 transition-all"
              >
                Join Zoom Meeting
              </a>
              <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500">
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="col-span-full py-24 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 opacity-40">
                <i className="fa-solid fa-video-slash text-3xl"></i>
             </div>
             <p className="font-black uppercase tracking-widest text-xs">No live sessions scheduled for this course.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-xl relative z-10 p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-800 mb-8">Schedule Zoom Session</h2>
            <form onSubmit={handleAddSession} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Meeting Topic</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="datetime-local" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold"
                  value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})}
                />
                <input 
                  type="datetime-local" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold"
                  value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})}
                />
              </div>
              
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Zoom Credentials</span>
                    <button type="button" onClick={generateZoomLink} className="text-[10px] font-black text-blue-800 underline">Auto-Generate</button>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Meeting ID" className="bg-white border-none rounded-xl px-4 py-2 text-xs font-bold" value={formData.zoomId} onChange={e => setFormData({...formData, zoomId: e.target.value})} />
                    <input placeholder="Passcode" className="bg-white border-none rounded-xl px-4 py-2 text-xs font-bold" value={formData.zoomPasscode} onChange={e => setFormData({...formData, zoomPasscode: e.target.value})} />
                 </div>
                 <input placeholder="Direct URL" className="w-full bg-white border-none rounded-xl px-4 py-2 text-xs font-bold" value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} />
              </div>

              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all uppercase tracking-widest text-xs">
                Deploy to Student Timetable
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSessionManager;
