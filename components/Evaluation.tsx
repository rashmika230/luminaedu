
import React from 'react';
import { Exam } from '../types';

const Evaluation: React.FC = () => {
  const exams: Exam[] = [
    { id: '1', title: 'Mid-term Assessment', subject: 'Mathematics', dueDate: '2024-04-15', status: 'pending' },
    { id: '2', title: 'Unit 4 Quiz', subject: 'Artificial Intelligence', dueDate: '2024-03-28', status: 'missed' },
    { id: '3', title: 'Practical Lab Exam', subject: 'Physics II', dueDate: '2024-03-10', status: 'completed' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'missed': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
       <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Evaluations</h1>
          <p className="text-slate-500">Track your progress and upcoming assessments.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
          Attempt Sample Quiz
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Assessment Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date / Due</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {exams.map(exam => (
              <tr key={exam.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 font-bold text-slate-800">{exam.title}</td>
                <td className="px-6 py-5 text-sm text-slate-600">{exam.subject}</td>
                <td className="px-6 py-5 text-sm text-slate-500 font-medium">{exam.dueDate}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(exam.status)}`}>
                    {exam.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  {exam.status === 'pending' ? (
                    <button className="text-indigo-600 font-bold text-xs hover:underline">Launch Assessment</button>
                  ) : (
                    <button className="text-slate-400 font-bold text-xs hover:underline">View Details</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-3xl border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">Performance Analytics</h3>
          <p className="text-slate-500 text-sm mb-6">Detailed insight into your academic growth this semester.</p>
          <div className="h-48 flex items-center justify-center">
            <div className="text-center opacity-30">
               <i className="fa-solid fa-chart-line text-5xl mb-3 text-indigo-300"></i>
               <p className="text-xs font-bold uppercase tracking-widest">Data processing...</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Certificates</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 border border-slate-50 rounded-2xl bg-slate-50/50">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mr-4">
                <i className="fa-solid fa-award text-xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Python Mastery</h4>
                <p className="text-xs text-slate-400">Issued March 12, 2024</p>
              </div>
              <button className="ml-auto text-indigo-600">
                <i className="fa-solid fa-download"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
