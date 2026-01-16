
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TeacherDashboard from './components/TeacherDashboard';
import GeminiQA from './components/GeminiQA';
import Login from './components/Login';
import Timetable from './components/Timetable';
import Evaluation from './components/Evaluation';
import AdminManageCourses from './components/AdminManageCourses';
import AdminManageUsers from './components/AdminManageUsers';
import CourseContentManager from './components/CourseContentManager';
import LiveSessionManager from './components/LiveSessionManager';
import { User, AppRoute, UserRole, Course } from './types';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const metadata = session.user.user_metadata;
        handleLogin({
          id: session.user.id,
          name: metadata.full_name || 'Lumina User',
          studentId: metadata.student_id || 'LUM/0000/00000',
          role: (metadata.role as UserRole) || 'STUDENT',
          email: session.user.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${metadata.student_id || session.user.id}`
        });
      }
      setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const metadata = session.user.user_metadata;
        handleLogin({
          id: session.user.id,
          name: metadata.full_name || 'Lumina User',
          studentId: metadata.student_id || 'LUM/0000/00000',
          role: (metadata.role as UserRole) || 'STUDENT',
          email: session.user.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${metadata.student_id || session.user.id}`
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentRoute(AppRoute.HOME);
  };

  const navigateToContent = (course: Course) => {
    setSelectedCourse(course);
    setCurrentRoute(AppRoute.CONTENT_MANAGER);
  };

  const navigateToLive = (course: Course) => {
    setSelectedCourse(course);
    setCurrentRoute(AppRoute.LIVE_SCHEDULER);
  };

  const renderContent = () => {
    if (!user) return null;

    // Permissions Gate
    const adminRoutes = [AppRoute.ADMIN_COURSES, AppRoute.ADMIN_USERS, AppRoute.ADMIN_REPORTS];
    if (adminRoutes.includes(currentRoute) && user.role !== 'ADMIN') {
        setCurrentRoute(AppRoute.HOME);
        return <Dashboard user={user} />;
    }

    switch (currentRoute) {
      case AppRoute.HOME:
        if (user.role === 'TEACHER') return <TeacherDashboard user={user} />;
        return <Dashboard user={user} />;
      case AppRoute.TIMETABLE:
        return <Timetable />;
      case AppRoute.EVALUATION:
        return <Evaluation />;
      case AppRoute.QA_BOARD:
        return <GeminiQA />;
      case AppRoute.ADMIN_COURSES:
        return <AdminManageCourses onManageContent={navigateToContent} onManageLive={navigateToLive} />;
      case AppRoute.ADMIN_USERS:
        return <AdminManageUsers />;
      case AppRoute.CONTENT_MANAGER:
        return selectedCourse ? <CourseContentManager course={selectedCourse} onBack={() => setCurrentRoute(AppRoute.ADMIN_COURSES)} /> : null;
      case AppRoute.LIVE_SCHEDULER:
        return selectedCourse ? <LiveSessionManager course={selectedCourse} onBack={() => setCurrentRoute(AppRoute.ADMIN_COURSES)} /> : null;
      case AppRoute.STORE:
        return (
          <div className="p-8 flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-shop text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Lumina Course Store</h2>
              <p className="text-slate-500 mb-6">Explore professional certifications and premium academic materials.</p>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                Access Catalog
              </button>
            </div>
          </div>
        );
      case AppRoute.SETTINGS:
        return (
          <div className="p-8 md:p-12 animate-in fade-in">
             <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10">
                <div className="flex items-center space-x-6 mb-12">
                   <div className="relative group">
                      <img src={user.avatar} className="w-24 h-24 rounded-3xl border-4 border-slate-50 shadow-lg object-cover" alt="" />
                      <button className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-8 h-8 rounded-full border-4 border-white flex items-center justify-center hover:bg-indigo-700">
                        <i className="fa-solid fa-camera text-xs"></i>
                      </button>
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{user.studentId} • {user.role}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Personal Details</h3>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Full Name</p>
                         <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Email Address</p>
                         <p className="text-sm font-bold text-slate-800">{user.email}</p>
                      </div>
                   </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                   <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg active:scale-95">
                      Save Changes
                   </button>
                </div>
             </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-slate-400">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-code text-3xl text-slate-300"></i>
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">Module Under Review</h2>
              <button 
                onClick={() => setCurrentRoute(AppRoute.HOME)}
                className="mt-8 text-amber-600 font-black uppercase tracking-widest text-xs hover:underline"
              >
                Return to Command Center
              </button>
          </div>
        );
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold animate-pulse">Initializing Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentRoute={currentRoute} 
        setRoute={setCurrentRoute} 
        onLogout={handleLogout} 
        userRole={user?.role}
      />
      
      <main className="flex-1 ml-16 md:ml-64 transition-all pb-24">
        <header className="bg-white/80 backdrop-blur-md h-16 flex items-center px-4 md:px-8 sticky top-0 z-30 border-b border-slate-100">
          <div className="flex-1 flex items-center text-sm font-bold truncate">
            <span className={`${user.role === 'TEACHER' ? 'text-emerald-600' : user.role === 'ADMIN' ? 'text-amber-600' : 'text-indigo-600'} uppercase tracking-tighter mr-2`}>
              {user.role} Portal
            </span>
            <span className="text-slate-200 mx-2">/</span>
            <span className="text-slate-500 uppercase tracking-widest text-[10px]">{currentRoute.replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right mr-2">
              <span className="text-xs font-bold text-slate-800 leading-none">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase mt-1">{user?.studentId}</span>
            </div>
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shadow-sm relative group cursor-pointer" onClick={() => setCurrentRoute(AppRoute.SETTINGS)}>
              <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center border border-slate-100 relative">
              <i className="fa-solid fa-bell"></i>
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>

        <footer className="fixed bottom-0 right-0 left-16 md:left-64 bg-white/50 backdrop-blur-sm px-8 py-3 border-t border-slate-100 flex justify-between items-center z-10">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            &copy; {currentYear} Developed by K.A.V.Rashmika.
          </p>
          <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center">
              <i className="fa-solid fa-headset mr-2 text-indigo-500"></i> Support: 047 312 6383
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
