
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('STUDENT');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Payment (for Teachers)
  
  const [loginIdentifier, setLoginIdentifier] = useState('');
  
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

    // Teacher Payment Check
    if (isRegistering && userRole === 'TEACHER' && step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match.");
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
              is_annual_paid: userRole === 'TEACHER' // Assume payment success for demo
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
            .eq('student_id', loginIdentifier.trim())
            .single();

          if (lookupError || !profile) {
            throw new Error("Invalid Student ID. Please check and try again.");
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
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const roleColors = {
    STUDENT: { primary: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50', accent: 'text-indigo-200', icon: 'fa-graduation-cap' },
    TEACHER: { primary: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50', accent: 'text-emerald-200', icon: 'fa-chalkboard-user' },
    ADMIN: { primary: 'bg-slate-900', text: 'text-slate-900', light: 'bg-slate-50', accent: 'text-amber-400', icon: 'fa-shield-halved' }
  }[userRole];

  const isAdminRegistrationDisabled = userRole === 'ADMIN' && isRegistering;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex overflow-hidden flex-col md:flex-row min-h-[700px] border border-white">
        
        {/* Left Branding Side */}
        <div className={`md:w-[40%] ${roleColors.primary} p-12 text-white flex flex-col justify-between relative overflow-hidden transition-all duration-700`}>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-12">
              <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center ${roleColors.text} shadow-xl`}>
                <i className={`fa-solid ${roleColors.icon} text-xl`}></i>
              </div>
              <span className="text-xl font-black tracking-tight uppercase">Lumina Portal</span>
            </div>
            <h2 className="text-4xl font-black leading-tight mb-6">
              {userRole === 'STUDENT' && <>Igniting the <span className={roleColors.accent}>spark</span> of knowledge.</>}
              {userRole === 'TEACHER' && <>Empowering the <span className={roleColors.accent}>architects</span> of future.</>}
              {userRole === 'ADMIN' && <>Secure <span className={roleColors.accent}>Control</span> of the system.</>}
            </h2>
            <p className="text-white/70 text-lg opacity-80 leading-relaxed font-medium">
              {userRole === 'STUDENT' && 'Access premium courses and track your academic journey.'}
              {userRole === 'TEACHER' && 'Join our elite teaching faculty. Annual platform fee applies.'}
              {userRole === 'ADMIN' && 'Restricted access for system administrators only.'}
            </p>
          </div>
          <div className="relative z-10 pt-12 border-t border-white/20 flex items-center space-x-4">
             <i className="fa-solid fa-shield-check text-white/40"></i>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Enterprise SSL Protected</p>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-white relative">
          
          {/* Role Switcher */}
          <div className="flex p-1.5 bg-slate-100 rounded-[1.25rem] mb-12 w-fit self-center md:self-start">
            {(['STUDENT', 'TEACHER', 'ADMIN'] as UserRole[]).map(role => (
              <button 
                key={role}
                onClick={() => { setUserRole(role); setError(null); setLoginIdentifier(''); setStep(1); setIsRegistering(false); }}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${userRole === role ? 'bg-white shadow-sm text-slate-900 scale-105' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {role}
              </button>
            ))}
          </div>

          {isAdminRegistrationDisabled ? (
            <div className="text-center py-10 animate-in fade-in">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                <i className="fa-solid fa-lock text-3xl"></i>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Registration Disabled</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">Administrators cannot self-register. Please contact the Head Office for credential provisioning.</p>
              <button onClick={() => setIsRegistering(false)} className="text-indigo-600 font-black uppercase tracking-widest text-xs hover:underline">Return to Login</button>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h3 className="text-3xl font-black text-slate-800 mb-2">
                  {isRegistering ? (step === 2 ? 'Final Step: Payment' : `${userRole} Sign Up`) : 'System Access'}
                </h3>
                <p className="text-slate-400 font-medium">
                  {isRegistering 
                    ? (step === 2 ? 'Teachers pay an annual fee of $99.00' : 'Fill in the credentials to create your account.') 
                    : `Enter your ${userRole === 'STUDENT' ? 'Student ID' : 'Work Email'} and Password.`}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase p-4 rounded-xl flex items-center animate-in slide-in-from-top-2">
                    <i className="fa-solid fa-circle-exclamation mr-3 text-lg"></i>
                    {error}
                  </div>
                )}

                {isRegistering && step === 2 ? (
                  /* Teacher Payment Step */
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex justify-between items-center mb-6">
                      <span className="font-black text-emerald-800 text-xs uppercase tracking-widest">Annual Registration Fee</span>
                      <span className="text-2xl font-black text-emerald-700">$99.00</span>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Card Number</label>
                      <input name="cardNumber" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" placeholder="0000 0000 0000 0000" onChange={handleInputChange}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Expiry</label>
                        <input name="expiry" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" placeholder="MM/YY" onChange={handleInputChange}/>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase">CVV</label>
                        <input name="cvv" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" placeholder="000" onChange={handleInputChange}/>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {!isRegistering ? (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          {userRole === 'STUDENT' ? 'Student ID' : 'Work Email Address'}
                        </label>
                        <input
                          type={userRole === 'STUDENT' ? 'text' : 'email'}
                          placeholder={userRole === 'STUDENT' ? 'LUM/2024/00000' : 'user@lumina.edu'}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all font-bold"
                          value={loginIdentifier}
                          onChange={(e) => setLoginIdentifier(e.target.value)}
                          required
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input name="name" placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" onChange={handleInputChange} required />
                          <select name={userRole === 'STUDENT' ? 'grade' : 'department'} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" onChange={handleInputChange}>
                            <option>{userRole === 'STUDENT' ? 'Undergraduate' : 'Science'}</option>
                            <option>{userRole === 'STUDENT' ? 'Grade 12' : 'Engineering'}</option>
                          </select>
                        </div>
                        <input name="email" type="email" placeholder="Email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" onChange={handleInputChange} required />
                        <input name="phone" type="tel" placeholder="Mobile Number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" onChange={handleInputChange} required />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                      <input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all font-bold"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {isRegistering && (
                      <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold" onChange={handleInputChange} required />
                    )}
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${roleColors.primary} text-white font-black py-5 rounded-[1.5rem] shadow-xl transition-all active:scale-[0.98] transform mt-6 uppercase tracking-[0.2em] text-[10px]`}
                >
                  {loading ? (
                    <i className="fa-solid fa-circle-notch animate-spin text-xl"></i>
                  ) : (
                    isRegistering 
                      ? (userRole === 'TEACHER' && step === 1 ? 'Next: Payment' : 'Complete Registration') 
                      : `Login to ${userRole} Console`
                  )}
                </button>
              </form>

              {!isRegistering && (
                <div className="mt-8 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    New to the platform? 
                    <button 
                      onClick={() => { setIsRegistering(true); setStep(1); setError(null); }}
                      className={`ml-2 ${roleColors.text} hover:underline`}
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              )}
              {isRegistering && (
                <div className="mt-8 text-center">
                   <button onClick={() => { setIsRegistering(false); setStep(1); }} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">
                     Back to Login
                   </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
