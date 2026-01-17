
import React, { useState, useMemo } from 'react';
import { Course, CourseStream } from '../types';

interface AdminManageCoursesProps {
  onManageContent: (course: Course) => void;
  onManageLive: (course: Course) => void;
}

const AdminManageCourses: React.FC<AdminManageCoursesProps> = ({ onManageContent, onManageLive }) => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c1',
      name: 'Combined Mathematics 2025 Theory',
      instructor: 'Dr. Amila Perera',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd48a5d5f?auto=format&fit=crop&q=80&w=400',
      progress: 0,
      nextSession: 'Monday, 10:00 AM',
      category: 'Physical Science',
      status: 'published',
      enrolledCount: 124,
      price: 2500,
      description: 'Comprehensive A/L theory syllabus coverage.'
    },
    {
      id: 'c2',
      name: 'Accounting Theory & Models',
      instructor: 'S.M. Marasinghe',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400',
      progress: 0,
      nextSession: 'Wednesday, 02:00 PM',
      category: 'Commerce',
      status: 'published',
      enrolledCount: 89,
      price: 1800,
      description: 'Foundations of financial accounting and business models.'
    }
  ]);

  const streams: CourseStream[] = ['Physical Science', 'Biological Science', 'Commerce', 'Arts', 'Technology', 'Professional'];

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    name: '',
    instructor: '',
    category: 'Physical Science',
    image: '',
    nextSession: '',
    status: 'draft',
    price: 0,
    description: ''
  });

  const filteredCourses = useMemo(() => {
    return courses.filter(course => 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({ ...course });
    } else {
      setEditingCourse(null);
      setFormData({ name: '', instructor: '', category: 'Physical Science', image: '', nextSession: '', status: 'draft', price: 0, description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } as Course : c));
    } else {
      const newCourse: Course = {
        id: `c${Date.now()}`,
        name: formData.name || '',
        instructor: formData.instructor || '',
        image: formData.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
        category: formData.category as CourseStream || 'Physical Science',
        nextSession: formData.nextSession || 'TBD',
        status: (formData.status as any) || 'draft',
        enrolledCount: 0,
        progress: 0,
        price: formData.price || 0,
        description: formData.description || ''
      };
      setCourses([...courses, newCourse]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Curriculum Registry</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Manage institutional streams and theory modules.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-indigo-600 transition-all flex items-center group"
        >
          <i className="fa-solid fa-plus-circle mr-2 group-hover:rotate-90 transition-transform text-lg"></i>
          Register New Course
        </button>
      </div>

      <div className="flex bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search Registry..." 
            className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Stream</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Pricing</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCourses.map(course => (
                <tr key={course.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <img src={course.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                      <div>
                        <p className="font-black text-slate-800 text-sm leading-tight">{course.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{course.instructor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center font-black text-slate-900 text-sm">
                    LKR {course.price?.toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button 
                      onClick={() => onManageContent(course)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10"
                    >
                      Syllabus
                    </button>
                    <button onClick={() => handleOpenModal(course)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 inline-flex items-center justify-center hover:bg-indigo-100 hover:text-indigo-700 transition-all">
                      <i className="fa-solid fa-gear"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-xl relative z-10 p-12 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">{editingCourse ? 'Course Configuration' : 'Initialize Registry'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Display Title</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-600 outline-none transition-all"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Academic Stream</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-600 outline-none transition-all"
                      value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as CourseStream})}
                    >
                      {streams.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Monthly Fee (LKR)</label>
                    <input 
                      type="number" required
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-600 outline-none transition-all"
                      value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                    />
                 </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Primary Instructor</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-600 outline-none transition-all"
                  value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-600 transition-all uppercase tracking-[0.2em] text-[10px]">
                {editingCourse ? 'Commit Changes' : 'Publish to Marketplace'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageCourses;
