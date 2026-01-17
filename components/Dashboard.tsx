
import React, { useState, useMemo } from 'react';
import { User, Notice, Course, CourseStream } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [selectedStream, setSelectedStream] = useState<CourseStream | 'All'>('All');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'BANK'>('CARD');
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);

  const streams: CourseStream[] = ['Physical Science', 'Biological Science', 'Commerce', 'Technology', 'Professional'];

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c1',
      name: 'Combined Mathematics 2025 Theory',
      instructor: 'Dr. Amila Perera',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd48a5d5f?auto=format&fit=crop&q=80&w=400',
      progress: 0,
      nextSession: 'Monday, 07:30 PM',
      price: 2500,
      category: 'Physical Science',
      isPurchased: false,
      description: 'Comprehensive theory coverage for 2025 A/L students.',
      modules: [
        { id: 'm1', title: 'Calculus I: Limits & Continuity', order: 1, lessons: [{ id: 'l1', title: 'Introduction to Limits', type: 'video' }, { id: 'l2', title: 'Limit Laws PDF', type: 'pdf' }] },
        { id: 'm2', title: 'Integration Basics', order: 2, lessons: [{ id: 'l3', title: 'The Power Rule', type: 'video' }] }
      ]
    },
    {
      id: 'c2',
      name: 'Physics 2024 Revision',
      instructor: 'Prof. J.K. Silva',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400',
      progress: 30,
      nextSession: 'Wednesday, 08:00 AM',
      price: 3000,
      category: 'Physical Science',
      isPurchased: true,
      description: 'Intensive revision focused on mechanics and waves.',
      modules: [
        { id: 'm1', title: 'Mechanics Revision', order: 1, lessons: [{ id: 'l1', title: 'Circular Motion', type: 'video' }] }
      ]
    }
  ]);

  const notices: Notice[] = [
    { id: 'n1', title: 'Monthly Evaluation Results Released', content: 'Check the portal for results.', date: 'Today', type: 'alert' },
    { id: 'n2', title: 'Zoom Credentials Update', content: 'Check your course dashboard.', date: 'Yesterday', type: 'class' }
  ];

  const filteredCourses = useMemo(() => {
    return selectedStream === 'All' 
      ? courses 
      : courses.filter(c => c.category === selectedStream);
  }, [courses, selectedStream]);

  const handlePurchase = (courseId: string) => {
    setCourses(courses.map(c => c.id === courseId ? { ...c, isPurchased: true } : c));
    setCheckoutCourse(null);
    // Alert user
    const course = courses.find(c => c.id === courseId);
    alert(`Success! You have enrolled in ${course?.name}. Access it via 'Enter Lecture Hall'.`);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* View Course Content Modal (Lecture Hall) */}
      {viewingCourse && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl animate-in fade-in" onClick={() => setViewingCourse(null)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-4xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="p-8 md:p-12 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-2">{viewingCourse.category}</span>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{viewingCourse.name}</h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Instructor: {viewingCourse.instructor}</p>
                </div>
                <button onClick={() => setViewingCourse(null)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                   <div className="md:col-span-2 space-y-8">
                      <div className="aspect-video bg-slate-900 rounded-[2rem] flex items-center justify-center text-white overflow-hidden group relative">
                         <img src={viewingCourse.image} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                         <i className="fa-solid fa-play text-5xl opacity-50 group-hover:scale-125 group-hover:opacity-100 transition-all cursor-pointer"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800 mb-4">About this Course</h3>
                        <p className="text-slate-500 leading-relaxed font-medium">{viewingCourse.description}</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-4">Course Syllabus</h3>
                      {viewingCourse.modules?.map(module => (
                        <div key={module.id} className="space-y-3">
                           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{module.title}</p>
                           {module.lessons.map(lesson => (
                             <div key={lesson.id} className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 cursor-pointer transition-colors group">
                               <i className={`fa-solid ${lesson.type === 'video' ? 'fa-circle-play text-indigo-400' : 'fa-file-pdf text-amber-400'} mr-3`}></i>
                               <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">{lesson.title}</span>
                             </div>
                           ))}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Notice Ticker */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl flex items-center shadow-sm">
        <i className="fa-solid fa-bullhorn text-amber-500 mr-4 animate-bounce"></i>
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <p className="text-xs font-black text-amber-900 uppercase tracking-widest inline-block animate-marquee">
            System Alert: Scheduled maintenance on March 25th from 02:00 AM to 04:00 AM.
          </p>
        </div>
      </div>

      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="relative group">
              <img src={user.avatar} className="w-28 h-28 rounded-[2rem] border-4 border-white/10 object-cover shadow-2xl group-hover:scale-105 transition-transform" alt={user.name} />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-check text-[10px]"></i>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-3">
                <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-400/20">
                  Verified {user.role}
                </span>
                <span className="px-4 py-1.5 bg-white/5 text-white/50 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {user.studentId}
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter leading-none mb-2">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300">{user.name.split(' ')[0]}</span>!
              </h1>
              <p className="text-slate-400 font-medium text-lg max-w-lg">
                Continue your learning modules. 2 live sessions are active today.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          <section>
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Academic Marketplace</h2>
                <p className="text-slate-400 text-sm font-medium">Browse available theory and revision intakes.</p>
              </div>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                <button onClick={() => setSelectedStream('All')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedStream === 'All' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>All</button>
                {streams.map(stream => (
                  <button key={stream} onClick={() => setSelectedStream(stream)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedStream === stream ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>{stream}</button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <div key={course.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col group">
                  <div className="h-48 overflow-hidden relative">
                    <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 border border-white/20">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">{course.category}</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-black text-slate-800 text-md leading-tight mb-4">{course.name}</h3>
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-black uppercase">Fee</p>
                        <p className="text-lg font-black text-slate-900 tracking-tighter">LKR {course.price?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-black uppercase">Schedule</p>
                        <p className="text-xs font-bold text-slate-600">{course.nextSession.split(',')[0]}</p>
                      </div>
                    </div>
                    {course.isPurchased ? (
                      <button 
                        onClick={() => setViewingCourse(course)}
                        className="w-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-indigo-600 transition-all"
                      >
                        Enter Lecture Hall
                      </button>
                    ) : (
                      <button 
                        onClick={() => setCheckoutCourse(course)}
                        className="w-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
             <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6"><i className="fa-solid fa-bullhorn mr-2 text-indigo-600"></i> Announcements</h3>
             <div className="space-y-6">
                {notices.map(notice => (
                  <div key={notice.id} className="border-b border-slate-50 pb-4 last:border-0">
                    <span className="text-[9px] font-black uppercase text-indigo-500">{notice.date}</span>
                    <h4 className="text-sm font-black text-slate-800 leading-tight mt-1">{notice.title}</h4>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{notice.content}</p>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>

      {checkoutCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setCheckoutCourse(null)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-lg relative z-10 p-10 md:p-14 shadow-2xl animate-in zoom-in-95">
             <div className="text-center mb-10">
                <h2 className="text-2xl font-black text-slate-900">Course Enrollment</h2>
                <p className="text-slate-500 font-medium text-sm mt-2">{checkoutCourse.name}</p>
             </div>
             <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
               <button onClick={() => setPaymentMethod('CARD')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase ${paymentMethod === 'CARD' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-500'}`}>Online</button>
               <button onClick={() => setPaymentMethod('BANK')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase ${paymentMethod === 'BANK' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-500'}`}>Bank</button>
             </div>
             <div className="flex gap-4">
                <button onClick={() => setCheckoutCourse(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl text-[9px] uppercase">Cancel</button>
                <button onClick={() => handlePurchase(checkoutCourse.id)} className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl text-[9px] uppercase shadow-xl hover:bg-indigo-700">Confirm Enrollment</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
