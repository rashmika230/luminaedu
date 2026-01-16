
import React, { useState } from 'react';
import { supabase } from '../services/supabase.ts';
import { UserRole } from '../types.ts';

interface LoginProps {
  onLogin: (userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    grade: 'Undergraduate',
    department: 'Science',
    managementArea: 'System Admin',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const generateId = (phone: string, role: UserRole) => {
    const year = new Date().getFullYear();
    const lastFiveDigits = phone.replace(/\D/g, '').slice(-5);
    let prefix = 'LUM';
    if (role === 'TEACHER') prefix = 'TEA';
    if (role === 'ADMIN') prefix = 'ADM';
    return `${prefix}/${year}/${lastFiveDigits.padStart(5, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegistering && userRole === 'ADMIN') {
      setError("Institutional Policy: Administrator accounts are provisioned via the Central IT Department.");
      return;
    }

    if (isRegistering && userRole === 'TEACHER' && step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Validation Error: Passwords do not match.");
        }
        
        const generatedId = generateId(formData.phone, userRole);
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              grade: userRole === 'STUDENT' ? formData.grade : undefined,
              department: userRole === 'TEACHER' ? formData.department : undefined,
              management_area: userRole === 'ADMIN' ? formData.managementArea : undefined,
              phone: formData.phone,
              student_id: generatedId,
              role: userRole,
              is_annual_paid: userRole === 'TEACHER'
            }
          }
        });

        if (signUpError) throw signUpError;
        if (data.user) {
          onLogin({
            id: data.user.id,
            name: formData.name,
            studentId: generatedId,
            role: userRole,
            email: data.user.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generatedId}`
          });
        }
      } else {
        let authEmail = '';
        if (userRole === 'STUDENT') {
          const { data: profile, error: lookupError } = await supabase
            .from('profiles')
            .select('email, role')
            .eq('student_id', loginIdentifier.trim().toUpperCase())
            .single();

          if (lookupError || !profile) {
            throw new Error("Security Alert: Invalid Student ID or account does not exist.");
          }
          authEmail = profile.email;
        } else {
          authEmail = loginIdentifier.trim();
        }

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: formData.password,
        });

        if (signInError) throw signInError;
        if (data.user) {
          const metadata = data.user.user_metadata;
          onLogin({
            id: data.user.id,
            name: metadata.full_name || 'Lumina User',
            studentId: metadata.student_id || 'LUM/2024/00000',
            role: metadata.role || userRole,
            email: data.user.email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${metadata.student_id || data.user.id}`
          });
        }
      }
    } catch (err: any) {
      setError(err.message || "Communication Error: Failed to reach auth servers.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const roleConfigs = {
    STUDENT: { 
      primary: 'from-indigo-700 to-blue-600', 
      text: 'text-indigo-600', 
      accent: 'text-blue-200', 
      icon: 'fa-graduation-cap',
      label: 'Academic Portal',
      tagline: 'Unlock your potential with premium learning tracks.'
    },
    TEACHER: { 
      primary: 'from-emerald-700 to-teal-600', 
      text: 'text-emerald-600', 
      accent: 'text-teal-200', 
      icon: 'fa-chalkboard-user',
      label: 'Faculty Console',
      tagline: 'Manage curriculum and inspire the next generation.'
    },
    ADMIN: { 
      primary: 'from-slate-900 to-slate-800', 
      text: 'text-slate-900', 
      accent: 'text-amber-400', 
      icon: 'fa-shield-halved',
      label: 'Administrative Suite',
      tagline: 'Secure oversight and management of institutional data.'
    }
  }[userRole];

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-6 selection:bg-indigo-100">
      <div className="bg-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-6xl flex overflow-hidden flex-col lg:flex-row min-h-[750px] border border-white relative">
        
        {/* Left Branding Side */}
        <div className={`lg:w-[42%] bg-gradient-to-br ${roleConfigs.primary} p-12 lg:p-16 text-white flex flex-col justify-between relative overflow-hidden transition-all duration-1000 ease-in-out`}>
          {/* Animated Background Blobs */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-white/5 rounded-full blur-[80px]"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-16">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
                <i className={`fa-solid ${roleConfigs.icon} text-2xl text-white`}></i>
              </div>
              <div>
                <span className="text-xl font-black tracking-tighter uppercase block leading-none">Lumina</span>
                <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em]">Education</span>
              </div>
            </div>
            
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-700">
              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest mb-2">
                {roleConfigs.label}
              </div>
              <h2 className="text-5xl font-black leading-[1.1] tracking-tight">
                {userRole === 'STUDENT' && <>The future of <span className={roleConfigs.accent}>learning</span> is digital.</>}
                {userRole === 'TEACHER' && <>Lead with <span className={roleConfigs.accent}>insight</span> and passion.</>}
                {userRole === 'ADMIN' && <>Governance through <span className={roleConfigs.accent}>precision</span>.</>}
              </h2>
              <p className="text-white/70 text-lg font-medium leading-relaxed max-w-sm">
                {roleConfigs.tagline}
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10 mt-12 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Support Hotline</p>
              <p className="text-lg font-black tracking-tight">+94 47 312 6383</p>
            </div>
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold">
                  <i className="fa-solid fa-user text-[10px] opacity-40"></i>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center bg-white relative">
          
          {/* Role Switcher Tab */}
          <div className="mb-14 flex flex-col items-center lg:items-start">
             <div className="flex p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-[1.5rem] relative w-full max-w-md border border-slate-200/50">
               {(['STUDENT', 'TEACHER', 'ADMIN'] as UserRole[]).map(role => (
                 <button 
                   key={role}
                   onClick={() => { setUserRole(role); setError(null); setLoginIdentifier(''); setStep(1); setIsRegistering(false); }}
                   className={`flex-1 relative z-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${userRole === role ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
                 >
                   {role}
                 </button>
               ))}
               {/* Active Tab Background Slide */}
               <div className={`absolute top-1.5 bottom-1.5 w-[calc(33.333%-3px)] bg-white shadow-xl rounded-xl transition-all duration-500 ease-out border border-slate-100 ${
                 userRole === 'STUDENT' ? 'left-1.5' : userRole === 'TEACHER' ? 'left-[33.333%]' : 'left-[66.666%]'
               }`}></div>
             </div>
          </div>

          {/* Registration Block for Admin */}
          {isRegistering && userRole === 'ADMIN' ? (
             <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-900 border border-slate-100 shadow-inner">
                  <i className="fa-solid fa-building-shield text-4xl"></i>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">Institutional Access Only</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto mb-10">
                  Administrative accounts are governed by institutional policy. Please submit an official request to the <b>Head of Information Systems</b>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => setIsRegistering(false)} className="px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl hover:bg-indigo-600 transition-all active:scale-95">
                    Return to Credentials
                  </button>
                  <button className="px-8 py-4 bg-slate-50 text-slate-500 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all">
                    Institutional Inquiries
                  </button>
                </div>
             </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="mb-10 text-center lg:text-left">
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                  {isRegistering ? 'Create Official Profile' : 'Member Sign-In'}
                </h3>
                <p className="text-slate-400 font-medium text-sm">
                  {isRegistering ? 'Join our academic community today.' : 'Welcome back! Enter your institutional details.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase p-4 rounded-2xl flex items-center shadow-sm">
                    <i className="fa-solid fa-triangle-exclamation mr-3 text-sm"></i>
                    {error}
                  </div>
                )}

                {isRegistering && step === 2 ? (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 flex justify-between items-center mb-4">
                      <div>
                        <span className="font-black text-emerald-800 text-[10px] uppercase tracking-widest block mb-1">Annual Premium Access</span>
                        <span className="text-slate-500 text-xs font-medium">Valid for 365 days of full features</span>
                      </div>
                      <span className="text-3xl font-black text-emerald-700">$99.00</span>
                    </div>
                    
                    <div className="relative group">
                       <i className="fa-solid fa-credit-card absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"></i>
                       <input name="cardNumber" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none" placeholder="0000 0000 0000 0000" onChange={handleInputChange}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input name="expiry" className="bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none" placeholder="MM / YY" onChange={handleInputChange}/>
                      <input name="cvv" className="bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none" placeholder="CVC" onChange={handleInputChange}/>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-5">
                      {!isRegistering ? (
                        <div className="relative group">
                           <i className={`fa-solid ${userRole === 'STUDENT' ? 'fa-id-badge' : 'fa-envelope'} absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors`}></i>
                           <input 
                             type={userRole === 'STUDENT' ? 'text' : 'email'} 
                             placeholder={userRole === 'STUDENT' ? 'LUM/2024/00000' : 'Email Address'} 
                             className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-6 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none" 
                             value={loginIdentifier} 
                             onChange={(e) => setLoginIdentifier(e.target.value)} 
                             required 
                           />
                        </div>
                      ) : (
                        <div className="space-y-4 animate-in slide-in-from-left-4">
                          <div className="relative group">
                            <i className="fa-solid fa-user absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600"></i>
                            <input name="name" placeholder="Full Professional Name" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" onChange={handleInputChange} required />
                          </div>
                          <div className="relative group">
                            <i className="fa-solid fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600"></i>
                            <input name="email" type="email" placeholder="Institutional Email" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" onChange={handleInputChange} required />
                          </div>
                          <div className="relative group">
                            <i className="fa-solid fa-phone absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600"></i>
                            <input name="phone" type="tel" placeholder="Mobile Number" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" onChange={handleInputChange} required />
                          </div>
                        </div>
                      )}

                      <div className="relative group">
                        <i className="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"></i>
                        <input 
                          name="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Secure Password" 
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-14 py-5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none" 
                          value={formData.password} 
                          onChange={handleInputChange} 
                          required 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors p-1"
                        >
                          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>

                      {isRegistering && (
                        <div className="relative group animate-in slide-in-from-bottom-2">
                           <i className="fa-solid fa-shield-check absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600"></i>
                           <input name="confirmPassword" type="password" placeholder="Verify Password" className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" onChange={handleInputChange} required />
                        </div>
                      )}
                    </div>
                    
                    {!isRegistering && (
                      <div className="flex justify-end">
                        <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                          Forgot Credentials?
                        </button>
                      </div>
                    )}
                  </>
                )}

                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`w-full group bg-slate-900 text-white font-black py-5 rounded-[1.75rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] uppercase tracking-[0.25em] text-[10px] hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3 overflow-hidden`}
                >
                  {loading ? (
                    <i className="fa-solid fa-circle-notch animate-spin text-lg"></i>
                  ) : (
                    <>
                      <span>
                        {isRegistering 
                          ? (userRole === 'TEACHER' && step === 1 ? 'Next: Finalize Membership' : 'Secure Account Initialization') 
                          : `Authenticate as ${userRole}`}
                      </span>
                      <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-12 text-center lg:text-left border-t border-slate-100 pt-8">
                {userRole === 'ADMIN' ? (
                  <div className="flex items-center justify-center lg:justify-start text-slate-400 space-x-2">
                    <i className="fa-solid fa-circle-info text-xs"></i>
                    <p className="text-[10px] font-black uppercase tracking-widest">Portal Maintenance is Scheduled</p>
                  </div>
                ) : (
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    {isRegistering ? 'Already registered?' : 'Need institutional access?'}
                    <button 
                      onClick={() => { setIsRegistering(!isRegistering); setStep(1); setError(null); }} 
                      className="ml-2 text-indigo-600 font-black hover:underline"
                    >
                      {isRegistering ? 'Sign In Instead' : 'Create New Profile'}
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Branding for the whole page */}
      <div className="fixed bottom-8 text-center w-full hidden md:block">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-50">
          Encryption AES-256 • Authorized Institutional Access
        </p>
      </div>
    </div>
  );
};

export default Login;
