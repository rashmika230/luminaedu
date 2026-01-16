
import React, { useState } from 'react';
import { Course, Module, Lesson } from '../types';

interface CourseContentManagerProps {
  course: Course;
  onBack: () => void;
}

const CourseContentManager: React.FC<CourseContentManagerProps> = ({ course, onBack }) => {
  const [modules, setModules] = useState<Module[]>(course.modules || []);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const addModule = () => {
    const newModule: Module = {
      id: `m${Date.now()}`,
      title: 'New Module',
      order: modules.length + 1,
      lessons: []
    };
    setModules([...modules, newModule]);
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `l${Date.now()}`,
      title: 'New Lesson',
      type: 'video',
      contentUrl: ''
    };
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
    ));
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all">
          <i className="fa-solid fa-arrow-left text-slate-400"></i>
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{course.name}</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Curriculum Builder</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group">
              <div className="p-6 flex justify-between items-center bg-slate-50/50 border-b border-slate-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-[10px] font-black">
                    {module.order}
                  </div>
                  <input 
                    className="bg-transparent border-none text-slate-800 font-black focus:outline-none"
                    value={module.title}
                    onChange={(e) => {
                      setModules(modules.map(m => m.id === module.id ? {...m, title: e.target.value} : m));
                    }}
                  />
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => addLesson(module.id)} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">
                    + Add Lesson
                  </button>
                  <button className="text-rose-400 hover:text-rose-600 p-2"><i className="fa-solid fa-trash-can text-sm"></i></button>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {module.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600">
                        <i className={`fa-solid ${lesson.type === 'video' ? 'fa-play-circle' : 'fa-file-pdf'}`}></i>
                      </div>
                      <input 
                        className="bg-transparent border-none text-slate-700 font-bold text-sm focus:outline-none"
                        value={lesson.title}
                        onChange={(e) => {
                          setModules(modules.map(m => m.id === module.id ? {
                            ...m, 
                            lessons: m.lessons.map(l => l.id === lesson.id ? {...l, title: e.target.value} : l)
                          } : m));
                        }}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <select 
                        className="bg-transparent border-none text-[10px] font-black uppercase text-slate-400 focus:outline-none"
                        value={lesson.type}
                        onChange={(e) => {
                          setModules(modules.map(m => m.id === module.id ? {
                            ...m, 
                            lessons: m.lessons.map(l => l.id === lesson.id ? {...l, type: e.target.value as any} : l)
                          } : m));
                        }}
                      >
                        <option value="video">Video</option>
                        <option value="pdf">PDF</option>
                        <option value="quiz">Quiz</option>
                      </select>
                      <button className="text-slate-300 hover:text-rose-500"><i className="fa-solid fa-xmark"></i></button>
                    </div>
                  </div>
                ))}
                {module.lessons.length === 0 && (
                  <p className="text-center py-8 text-slate-300 text-[10px] font-black uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-2xl">
                    No lessons in this module. Click "+ Add Lesson" to start.
                  </p>
                )}
              </div>
            </div>
          ))}
          
          <button 
            onClick={addModule}
            className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all group"
          >
            <i className="fa-solid fa-plus-circle mr-3 text-xl group-hover:scale-125 transition-transform"></i>
            <span className="font-black uppercase tracking-[0.2em] text-xs">Add New Learning Module</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6">Course Settings</h3>
            <div className="space-y-4">
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Material Visibility</label>
                 <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold">
                    <option>Show all content</option>
                    <option>Drip feed (Weekly)</option>
                    <option>Hidden until enrollment</option>
                 </select>
               </div>
               <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all">
                 Save Curriculum
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentManager;
