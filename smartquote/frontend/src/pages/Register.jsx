import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';

const countries = [
  { code: 'US', label: 'United States' }, { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'United Kingdom' }, { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' }, { code: 'FR', label: 'France' },
  { code: 'IN', label: 'India' }, { code: 'BR', label: 'Brazil' },
  { code: 'PK', label: 'Pakistan' }, { code: 'PH', label: 'Philippines' },
  { code: 'NG', label: 'Nigeria' }, { code: 'UA', label: 'Ukraine' },
  { code: 'PL', label: 'Poland' }, { code: 'MX', label: 'Mexico' },
  { code: 'ZA', label: 'South Africa' }, { code: 'OTHER', label: 'Other' }
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', country: 'US', preferredCurrency: 'USD' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white">SmartQuote</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-400 text-sm">Start generating accurate freelance quotes today.</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" className="input" placeholder="Jane Smith" value={form.name} onChange={set('name')} required />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" placeholder="jane@example.com" value={form.email} onChange={set('email')} required autoComplete="email" />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set('password')}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  onClick={() => setShowPass(p => !p)}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Country</label>
                <select className="select" value={form.country} onChange={set('country')}>
                  {countries.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Currency</label>
                <select className="select" value={form.preferredCurrency} onChange={set('preferredCurrency')}>
                  {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'BRL'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-base mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
