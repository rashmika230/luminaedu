
import React, { useState, useMemo } from 'react';
import { User, Notice, Course, CourseStream } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [selectedStream, setSelectedStream] = useState<CourseStream | 'All'>('All');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'BANK'>('CARD');

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
      description: 'Comprehensive theory coverage for 2025 A/L students.'
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
      description: 'Intensive revision focused on mechanics and waves.'
    },
    {
      id: 'c3',
      name: 'Chemistry 2026 Beginners',
      instructor: 'Dr. Nilu Kumari',
      image: 'https://images.unsplash.com/photo-1603126010305-2c5a0134493a?auto=format&fit=crop&q=80&w=400',
      progress: 0,
      nextSession: 'Friday, 03:00 PM',
      price: 2000,
      category: 'Biological Science',
      isPurchased: false
    },
    {
      id: 'c4',
      name: 'Accounting Theory & Models',
      instructor: 'S.M. Marasinghe',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400',
      progress: 0,
      nextSession: 'Saturday, 10:00 AM',
      price: 1800,
      category: 'Commerce',
      isPurchased: false
    }
  ]);

  const notices: Notice[] = [
    {
      id: 'n1',
      title: 'Monthly Evaluation Results Released',
      content: 'Results for the February Physical Science paper are now available in the Evaluation section.',
      date: 'Today',
      type: 'alert',
      priority: 'high'
    },
    {
      id: 'n2',
      title: 'Zoom Credentials Update',
      content: 'New passcodes have been issued for the Wednesday Chemistry session.',
      date: 'Yesterday',
      type: 'class'
    }
  ];

  const filteredCourses = useMemo(() => {
    return selectedStream === 'All' 
      ? courses 
      : courses.filter(c => c.category === selectedStream);
  }, [courses, selectedStream]);

  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);

  const handlePurchase = (courseId: string) => {
    setCourses(courses.map(c => c.id === courseId ? { ...c, isPurchased: true } : c));
    setCheckoutCourse(null);
  };

  const isTeacher = user.role === 'TEACHER';

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Notice Ticker */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl flex items-center shadow-sm">
        <i className="fa-solid fa-bullhorn text-amber-500 mr-4 animate-bounce"></i>
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <p className="text-xs font-black text-amber-900 uppercase tracking-widest inline-block animate-marquee">
            System Alert: Scheduled maintenance on March 25th from 02:00 AM to 04:00 AM. Portal services may be intermittent.
          </p>
        </div>
      </div>

      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/10 to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="relative group">
              <img 
                src={user.avatar} 
                className="w-28 h-28 rounded-[2rem] border-4 border-white/10 object-cover shadow-2xl group-hover:scale-105 transition-transform"
                alt={user.name} 
              />
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
                Your educational journey continues. You have 3 pending tasks today.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {/* Stream Filtering */}
          <section>
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Academic Marketplace</h2>
                <p className="text-slate-400 text-sm font-medium">Explore premium streams and theory modules.</p>
              </div>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setSelectedStream('All')}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedStream === 'All' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  All Streams
                </button>
                {streams.map(stream => (
                  <button 
                    key={stream}
                    onClick={() => setSelectedStream(stream)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedStream === stream ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                  <div key={course.id} className="group relative bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                    <div className="h-56 overflow-hidden relative">
                      <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={course.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                      
                      <div className="absolute top-6 left-6 flex space-x-2">
                        <div className="bg-white/10 backdrop-blur-md rounded-lg px-3 py-1 border border-white/20">
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">{course.category}</span>
                        </div>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                         <h3 className="font-black text-white text-lg leading-tight mb-1">{course.name}</h3>
                         <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{course.instructor}</p>
                      </div>

                      {!course.isPurchased && (
                         <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-xl">
                               <i className="fa-solid fa-lock text-lg"></i>
                            </div>
                         </div>
                      )}
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Next Live</p>
                          <p className="text-sm font-black text-slate-800 tracking-tight">{course.nextSession}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Fee</p>
                          <p className="text-xl font-black text-slate-900 tracking-tighter">LKR {course.price?.toLocaleString()}</p>
                        </div>
                      </div>

                      {course.isPurchased ? (
                        <button className="w-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl hover:bg-indigo-600 transition-all">
                          Enter Lecture Hall
                        </button>
                      ) : (
                        <button 
                          onClick={() => setCheckoutCourse(course)}
                          className="w-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                          Enroll Today
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-sm">
                      <i className="fa-solid fa-layer-group text-3xl"></i>
                   </div>
                   <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">No Courses in this Stream</h3>
                   <p className="text-slate-400 text-xs mt-2">Check back soon for upcoming intakes.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Professional Sidebar */}
        <div className="space-y-8">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
             <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center relative z-10">
               <i className="fa-solid fa-bullhorn mr-3 text-indigo-600"></i> Faculty Notices
             </h3>
             <div className="space-y-6 relative z-10">
                {notices.map(notice => (
                  <div key={notice.id} className="group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${notice.type === 'alert' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'}`}>
                         {notice.type}
                       </span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase">{notice.date}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{notice.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2 line-clamp-2">{notice.content}</p>
                  </div>
                ))}
             </div>
             <button className="w-full mt-8 py-3 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors">
               Notice Archive
             </button>
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-70">Lumina AI Support</h3>
              <p className="text-sm font-bold leading-relaxed mb-6">Stuck with a complex theory? Our AI Tutor is ready to assist you 24/7.</p>
              <button className="w-full py-4 bg-white text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all">
                Start Chatting
              </button>
           </div>
        </div>
      </div>

      {/* ADVANCED MULTI-METHOD PAYMENT MODAL */}
      {checkoutCourse && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md animate-in fade-in" onClick={() => setCheckoutCourse(null)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-xl relative z-10 p-10 md:p-14 shadow-2xl animate-in zoom-in-95">
             <div className="text-center mb-10">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[1.75rem] flex items-center justify-center mx-auto mb-6 border border-indigo-100 shadow-inner">
                   <i className="fa-solid fa-file-invoice-dollar text-3xl"></i>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Enrollment Portal</h2>
                <p className="text-slate-500 font-medium text-sm mt-2">Course: <span className="text-slate-900 font-black">{checkoutCourse.name}</span></p>
             </div>

             {/* Payment Method Tabs */}
             <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200/50">
               <button 
                 onClick={() => setPaymentMethod('CARD')}
                 className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'CARD' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
               >
                 Online Payment
               </button>
               <button 
                 onClick={() => setPaymentMethod('BANK')}
                 className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'BANK' ? 'bg-white shadow-lg text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
               >
                 Bank Transfer
               </button>
             </div>

             <div className="bg-slate-50 p-8 rounded-[2rem] mb-8 border border-slate-200/50">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Fee</span>
                   <span className="text-2xl font-black text-slate-900 tracking-tighter">LKR {checkoutCourse.price?.toLocaleString()}</span>
                </div>
                
                {paymentMethod === 'CARD' ? (
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <div className="relative">
                      <i className="fa-solid fa-credit-card absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                      <input className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:border-indigo-600 outline-none transition-all" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input className="bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black focus:border-indigo-600 outline-none transition-all" placeholder="MM / YY" />
                      <input className="bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black focus:border-indigo-600 outline-none transition-all" placeholder="CVC" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-left-4">
                    <div className="bg-white p-6 rounded-2xl border border-dashed border-indigo-200">
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Bank Details</p>
                       <p className="text-xs font-black text-slate-800">Commercial Bank - Lumina Edu Pvt Ltd</p>
                       <p className="text-xs font-bold text-slate-500">Account: 8000452391 (Hambantota Branch)</p>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center group cursor-pointer hover:border-indigo-400 transition-all">
                       <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-300 group-hover:text-indigo-600 mb-2"></i>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-800">Upload Deposit Slip (PDF/JPG)</p>
                    </div>
                  </div>
                )}
             </div>

             <div className="flex gap-4">
                <button 
                  onClick={() => setCheckoutCourse(null)}
                  className="px-8 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handlePurchase(checkoutCourse.id)}
                  className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  {paymentMethod === 'CARD' ? 'Secure Payment' : 'Submit for Verification'}
                </button>
             </div>
             
             <p className="text-center mt-8 text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center">
               <i className="fa-solid fa-shield-halved mr-2 text-indigo-500"></i> Encrypted Transaction Gateway
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
