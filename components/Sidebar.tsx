
import React from 'react';
import { AppRoute, UserRole } from '../types';

interface SidebarProps {
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
  onLogout: () => void;
  userRole?: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRoute, setRoute, onLogout, userRole }) => {
  const isAdmin = userRole === 'ADMIN';

  const menuItems = [
    { id: AppRoute.HOME, label: 'Dashboard', icon: 'fa-house' },
    { id: AppRoute.TIMETABLE, label: 'Schedule', icon: 'fa-calendar-days' },
    { id: AppRoute.EVALUATION, label: 'Exams & Quizzes', icon: 'fa-chart-simple' },
    { id: AppRoute.QA_BOARD, label: 'Lumina AI Tutor', icon: 'fa-brain' },
    { id: AppRoute.STORE, label: 'Course Store', icon: 'fa-bag-shopping' },
  ];

  const adminItems = [
    { id: AppRoute.ADMIN_COURSES, label: 'Manage Courses', icon: 'fa-layer-group' },
    { id: AppRoute.ADMIN_USERS, label: 'User Management', icon: 'fa-users-gear' },
    { id: AppRoute.ADMIN_REPORTS, label: 'System Reports', icon: 'fa-file-contract' },
  ];

  return (
    <div className="w-16 md:w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 transition-all z-20">
      <div className="p-4 flex items-center justify-center md:justify-start border-b border-slate-800">
        <div className={`w-10 h-10 ${isAdmin ? 'bg-amber-500' : 'bg-indigo-500'} rounded-xl flex items-center justify-center text-white shadow-lg transition-colors`}>
          <i className={`fa-solid ${isAdmin ? 'fa-shield-halved' : 'fa-lightbulb'} text-xl`}></i>
        </div>
        <span className="hidden md:block ml-3 font-bold text-white text-lg tracking-tight uppercase">
          Lumina <span className={isAdmin ? 'text-amber-400' : 'text-indigo-400'}>{isAdmin ? 'Admin' : 'Edu'}</span>
        </span>
      </div>
      
      <nav className="flex-1 mt-6 px-2 overflow-y-auto custom-scrollbar">
        <div className="mb-4">
          <p className="hidden md:block px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">General</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              className={`w-full flex items-center py-3 px-4 rounded-xl transition-all mb-1 ${
                currentRoute === item.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-lg md:text-sm w-6`}></i>
              <span className="hidden md:block ml-3 font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        {isAdmin && (
          <div className="mt-8 mb-4">
            <p className="hidden md:block px-4 text-[10px] font-black text-amber-500/70 uppercase tracking-[0.2em] mb-2">Management</p>
            {adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setRoute(item.id)}
                className={`w-full flex items-center py-3 px-4 rounded-xl transition-all mb-1 ${
                  currentRoute === item.id 
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className={`fa-solid ${item.icon} text-lg md:text-sm w-6`}></i>
                <span className="hidden md:block ml-3 font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800 mb-2 space-y-2">
        <button
          onClick={() => setRoute(AppRoute.SETTINGS)}
          className={`w-full flex items-center py-3 px-4 rounded-xl transition-all ${
            currentRoute === AppRoute.SETTINGS 
              ? 'bg-slate-700 text-white' 
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <i className="fa-solid fa-user-gear text-lg md:text-sm w-6"></i>
          <span className="hidden md:block ml-4 text-sm font-medium">Settings</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all py-3 px-4 rounded-xl"
        >
          <i className="fa-solid fa-arrow-right-from-bracket text-lg md:text-sm w-6"></i>
          <span className="hidden md:block ml-4 text-sm font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
