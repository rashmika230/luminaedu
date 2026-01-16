
import React, { useState, useMemo } from 'react';
import { Course, AppRoute } from '../types';

interface AdminManageCoursesProps {
  onManageContent: (course: Course) => void;
  onManageLive: (course: Course) => void;
}

const AdminManageCourses: React.FC<AdminManageCoursesProps> = ({ onManageContent, onManageLive }) => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c1',
      name: 'Advanced Mathematics for Engineers',
      instructor: 'Dr. Sarah Mitchell',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd48a5d5f?auto=format&fit=crop&q=80&w=400',
      progress: 0,
      nextSession: 'Monday, 10:00 AM',
      category: 'Mathematics',
      status: 'published',
      enrolledCount: 124,
      price: 15.00,
      description: 'A deep dive into multivariable calculus and linear algebra.'
    },
    {
      id: 'c2',
      name: 'Introduction to Artificial Intelligence',
      instructor: 'Prof. James Wilson',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400',
      progress: 0,
      nextSession: 'Wednesday, 02:00 PM',
      category: 'Computer Science',
      status: 'published',
      enrolledCount: 89,
      price: 0,
      description: 'Understanding neural networks and machine learning foundations.'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    name: '',
    instructor: '',
    category: 'Mathematics',
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
      setFormData({ name: '', instructor: '', category: 'Mathematics', image: '', nextSession: '', status: 'draft', price: 0, description: '' });
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
        image: formData.image || '',
        category: formData.category || 'Mathematics',
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Curriculum Control</h1>
          <p className="text-slate-500 font-medium text-lg mt-1">Manage courses, set pricing models, and oversee materials.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-amber-600 transition-all flex items-center group"
        >
          <i className="fa-solid fa-plus-circle mr-2 group-hover:rotate-90 transition-transform"></i>
          Register New Course
        </button>
      </div>

      <div className="flex bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Filter courses..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20"
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
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Model</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Manage</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCourses.map(course => (
                <tr key={course.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <img src={course.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="font-black text-slate-800 text-sm leading-tight">{course.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{course.instructor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${course.price && course.price > 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {course.price && course.price > 0 ? `$${course.price.toFixed(2)}` : 'FREE'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => onManageContent(course)}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        Curriculum
                      </button>
                      <button 
                        onClick={() => onManageLive(course)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        Live Setup
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleOpenModal(course)} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-amber-100 hover:text-amber-700 transition-all">
                      <i className="fa-solid fa-pen-to-square"></i>
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
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-xl relative z-10 p-10 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-slate-800 mb-6">{editingCourse ? 'Update Course' : 'Create Course'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input 
                type="text" placeholder="Course Name" required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                 <input 
                  type="text" placeholder="Instructor" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none"
                  value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})}
                />
                <input 
                  type="number" step="0.01" placeholder="Price ($0 for Free)" required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none"
                  value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                />
              </div>
              <textarea 
                placeholder="Description" rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none resize-none"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              />
              <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-amber-600 transition-all uppercase tracking-widest text-xs">
                {editingCourse ? 'Save Changes' : 'Initialize Course'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageCourses;
