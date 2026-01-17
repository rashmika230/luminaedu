
import React, { useState } from 'react';
import { User, Course } from '../types';

interface TeacherDashboardProps {
  user: User;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'tasks'>('overview');
  
  // Mock data for teacher's specific view
  const teacherCourses: Course[] = [
    {
      id: 'c1',
      name: 'Advanced Mathematics for Engineers',
      instructor: user.name,
      image: 'https://images.unsplash.com/photo-1509228468518-180dd48a5d5f?auto=format&fit=crop&q=80&w=400',
      progress: 100, // For teacher, this could mean syllabus coverage
      nextSession: 'Today, 04:00 PM',
      // Fixed: 'Mathematics' is not assignable to CourseStream
      category: 'Physical Science'
    },
    {
      id: 'c2',
      name: 'Introduction to Artificial Intelligence',
      instructor: user.name,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400',
      progress: 45,
      nextSession: 'Wednesday, 10:00 AM',
      // Fixed: 'Computer Science' is not assignable to CourseStream
      category: 'Technology'
    }
  ];

  const students = [
    { id: 'LUM/2024/01221', name: 'Alice Thompson', grade: 'Undergraduate', progress: 88, status: 'Online' },
    { id: 'LUM/2024/05432', name: 'Bob Roberts', grade: 'Undergraduate', progress: 42, status: 'Offline' },
    { id: 'LUM/2024/09812', name: 'Charlie Dean', grade: 'Grade 12', progress: 95, status: 'Online' },
    { id: 'LUM/2024/03341', name: 'Diana Prince', grade: 'Undergraduate', progress: 78, status: 'Online' },
    { id: 'LUM/2024/07765', name: 'Edward Norton', grade: 'Grade 12', progress: 12, status: 'Offline' },
  ];

  const pendingTasks = [
    { id: 1, title: 'Grade Mid-term: AI Foundations', students: 24, due: 'Today' },
    { id: 2, title: 'Review Lab Reports: Physics II', students: 18, due: 'Tomorrow' },
    { id: 3, title: 'Update Syllabus: Mathematics', students: null, due: 'Friday' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Teacher Hero */}
      <div className="relative overflow-hidden bg-emerald-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border border-emerald-800/50">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-3xl blur opacity-30"></div>
              <img 
                src={user.avatar} 
                className="relative w-32 h-32 rounded-3xl border-4 border-emerald-700 shadow-2xl object-cover transform hover:scale-105 transition-all"
                alt={user.name} 
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-emerald-900 flex items-center justify-center">
                <i className="fa-solid fa-check text-[10px]"></i>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-400/20">
                  Senior Faculty
                </span>
                <span className="px-4 py-1.5 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  ID: {user.studentId}
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tight leading-tight">
                Professor <span className="text-emerald-400">{user.name.split(' ')[0]}</span>
              </h1>
              <p className="text-emerald-100/70 font-medium text-lg mt-2 max-w-xl">
                Ready to inspire today? You have <span className="text-white font-bold">2 live sessions</span> scheduled and <span className="text-white font-bold">42 assignments</span> awaiting your review.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 text-center">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Total Students</p>
              <h3 className="text-4xl font-black">154</h3>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 text-center">
              <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1">Active Classes</p>
              <h3 className="text-4xl font-black">04</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Class Overview', icon: 'fa-chalkboard' },
          { id: 'students', label: 'Student Management', icon: 'fa-users' },
          { id: 'tasks', label: 'Administrative Tasks', icon: 'fa-list-check' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className={`fa-solid ${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teacherCourses.map(course => (
                <div key={course.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="h-40 overflow-hidden relative">
                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <span className="px-2 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-lg mb-2 inline-block">
                        {course.category}
                      </span>
                      <h3 className="text-white font-black text-lg leading-tight">{course.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-tighter">
                        <i className="fa-solid fa-users-viewfinder mr-2 text-emerald-500"></i>
                        48 Enrolled
                      </div>
                      <div className="flex items-center text-slate-400 font-bold text-xs uppercase tracking-tighter">
                        <i className="fa-solid fa-clock mr-2 text-emerald-500"></i>
                        {course.nextSession.split(',')[0]}
                      </div>
                    </div>
                    <button className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center">
                      <i className="fa-solid fa-video mr-2"></i> Launch Session
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-10 group hover:border-emerald-300 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-400 transition-all">
                  <i className="fa-solid fa-plus text-2xl"></i>
                </div>
                <p className="font-black text-slate-400 text-sm uppercase tracking-widest group-hover:text-emerald-600 transition-all">Create New Course</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-6 flex items-center">
                <i className="fa-solid fa-clipboard-list mr-3 text-emerald-500"></i> Action Items
              </h3>
              <div className="space-y-4">
                {pendingTasks.map(task => (
                  <div key={task.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-emerald-600 transition-colors">{task.title}</h4>
                      <span className="text-[9px] font-black text-rose-500 uppercase px-2 py-0.5 bg-rose-50 rounded-full">{task.due}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {task.students ? `${task.students} submissions to grade` : 'Administrative task'}
                    </p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-4 bg-emerald-50 text-emerald-600 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                View All Tasks
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden animate-in slide-in-from-bottom-2">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-black text-slate-800 text-xl">Enrolled Students</h3>
            <div className="flex w-full md:w-auto gap-2">
               <div className="relative flex-1 md:w-64">
                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                 <input type="text" placeholder="Search by ID or Name..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/10" />
               </div>
               <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">
                  Export List
               </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Progress</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`} className="w-9 h-9 rounded-xl bg-slate-100" alt="" />
                        <span className="font-bold text-slate-800 text-sm">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs font-black text-slate-400">{student.id}</td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-slate-600">{student.grade}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${student.progress}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-500">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${student.status === 'Online' ? 'text-emerald-500' : 'text-slate-300'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">View Profile</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50/50 text-center border-t border-slate-50">
             <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-colors">Load More Students</button>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2">
           {[
             { title: 'Evaluate Quizzes', icon: 'fa-file-signature', count: 12, color: 'bg-amber-500', desc: 'Grade pending multiple choice assessments' },
             { title: 'Update Materials', icon: 'fa-file-arrow-up', count: 4, color: 'bg-indigo-500', desc: 'New handouts or lecture notes required' },
             { title: 'Student Inquiries', icon: 'fa-comments', count: 7, color: 'bg-emerald-500', desc: 'Response needed for academic queries' },
             { title: 'Attendance Log', icon: 'fa-clipboard-check', count: 2, color: 'bg-teal-500', desc: 'Verify weekly student presence' },
           ].map((card, i) => (
             <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden">
               <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-[0.03] rounded-bl-full translate-x-8 -translate-y-8`}></div>
               <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${card.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform`}>
                 <i className={`fa-solid ${card.icon} text-xl`}></i>
               </div>
               <div className="flex justify-between items-end mb-2">
                 <h3 className="font-black text-slate-800 text-lg">{card.title}</h3>
                 <span className="text-2xl font-black text-slate-900">{card.count}</span>
               </div>
               <p className="text-xs text-slate-400 font-medium leading-relaxed">{card.desc}</p>
               <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                 <span className={`text-[10px] font-black text-${card.color.split('-')[1]}-600 uppercase`}>View Details</span>
                 <i className="fa-solid fa-arrow-right text-slate-200 group-hover:translate-x-1 transition-transform"></i>
               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
