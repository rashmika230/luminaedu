
import React, { useState } from 'react';
import { User, Notice, Course } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c1',
      name: 'Advanced Mathematics for Engineers',
      instructor: 'Dr. Sarah Mitchell',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd48a5d5f?auto=format&fit=crop&q=80&w=400',
      progress: 0,
      nextSession: 'Tomorrow, 10:00 AM',
      price: 15.00,
      isPurchased: false
    },
    {
      id: 'c2',
      name: 'Introduction to Artificial Intelligence',
      instructor: 'Prof. James Wilson',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400',
      progress: 30,
      nextSession: 'Wednesday, 02:00 PM',
      price: 0,
      isPurchased: true
    },
    {
      id: 'c3',
      name: 'Quantum Physics & Relativity',
      instructor: 'Dr. Robert Oppen',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400',
      progress: 12,
      nextSession: 'Friday, 09:00 AM',
      price: 25.00,
      isPurchased: false
    }
  ]);

  const [notices] = useState<Notice[]>([
    {
      id: '1',
      title: 'Quarterly Maintenance Scheduled',
      content: 'Lumina systems will be undergoing routine maintenance this Saturday.',
      date: 'March 20, 2024',
      type: 'alert'
    }
  ]);

  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);

  const handlePurchase = (courseId: string) => {
    // Simulated Purchase
    setCourses(courses.map(c => c.id === courseId ? { ...c, isPurchased: true } : c));
    setCheckoutCourse(null);
  };

  const isTeacher = user.role === 'TEACHER';
  const themeColor = isTeacher ? 'emerald' : 'indigo';

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <img 
              src={user.avatar} 
              className="w-24 h-24 rounded-3xl border-2 border-white/10 object-cover"
              alt={user.name} 
            />
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  {user.role} Portal
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse mr-1.5 inline-block"></span>
                  Active
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tight">
                Welcome back, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-slate-400 font-medium mt-1">
                {isTeacher ? "Manage your premium curriculum and students." : "Unlock new horizons by picking up a course today."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          <section>
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-800">Available Learning Paths</h2>
              <p className="text-slate-400 text-sm font-medium">Browse free and premium content available for your level.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map(course => (
                <div key={course.id} className="group relative bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={course.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60"></div>
                    
                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-full px-3 py-1">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">{course.price && course.price > 0 ? 'Premium' : 'Free'}</span>
                    </div>

                    {!course.isPurchased && (
                       <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white border border-white/20">
                             <i className="fa-solid fa-lock text-lg"></i>
                          </div>
                       </div>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-black text-slate-800 leading-tight mb-2">{course.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{course.instructor}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-lg font-black text-slate-900">
                        {course.price && course.price > 0 ? `$${course.price.toFixed(2)}` : 'FREE'}
                      </div>
                      {course.isPurchased ? (
                        <button className="bg-emerald-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-lg">Enter Class</button>
                      ) : (
                        <button 
                          onClick={() => setCheckoutCourse(course)}
                          className="bg-indigo-600 text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95"
                        >
                          Unlock Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Portal Activity</h3>
             <div className="space-y-4">
                <div className="flex items-center p-3 bg-slate-50 rounded-2xl">
                   <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3">
                      <i className="fa-solid fa-wallet text-xs"></i>
                   </div>
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-800 uppercase">Last Transaction</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">No recent payments</p>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {checkoutCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setCheckoutCourse(null)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-lg relative z-10 p-10 shadow-2xl animate-in zoom-in-95">
             <div className="text-center mb-8">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                   <i className="fa-solid fa-shield-halved text-3xl"></i>
                </div>
                <h2 className="text-2xl font-black text-slate-800">Secure Enrollment</h2>
                <p className="text-slate-400 font-medium text-sm">You are unlocking: <b>{checkoutCourse.name}</b></p>
             </div>

             <div className="bg-slate-50 p-6 rounded-2xl mb-8 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                   <span>Curriculum Access</span>
                   <span>Lifetime</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                   <span>Exam Participation</span>
                   <span>Unlimited</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                   <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Total Amount</span>
                   <span className="text-2xl font-black text-indigo-600">${checkoutCourse.price?.toFixed(2)}</span>
                </div>
             </div>

             <div className="space-y-4 mb-8">
                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" placeholder="Card Number" />
                <div className="grid grid-cols-2 gap-4">
                   <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" placeholder="MM/YY" />
                   <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" placeholder="CVC" />
                </div>
             </div>

             <button 
               onClick={() => handlePurchase(checkoutCourse.id)}
               className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
             >
               Confirm & Complete Purchase
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
