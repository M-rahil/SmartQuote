import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import { User, Save, CheckCircle, AlertCircle } from 'lucide-react';

const COUNTRIES = [
  { code: 'US', label: 'United States' }, { code: 'CA', label: 'Canada' },
  { code: 'GB', label: 'United Kingdom' }, { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' }, { code: 'FR', label: 'France' },
  { code: 'IN', label: 'India' }, { code: 'BR', label: 'Brazil' },
  { code: 'PK', label: 'Pakistan' }, { code: 'PH', label: 'Philippines' },
  { code: 'NG', label: 'Nigeria' }, { code: 'UA', label: 'Ukraine' },
  { code: 'PL', label: 'Poland' }, { code: 'MX', label: 'Mexico' },
  { code: 'ZA', label: 'South Africa' }, { code: 'OTHER', label: 'Other' }
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    country: user?.country || 'US',
    preferredCurrency: user?.preferredCurrency || 'USD'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await userApi.updateProfile(form);
      updateUser(res.data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your account information and preferences.</p>
      </div>

      {/* Avatar card */}
      <div className="card p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <div className="font-semibold text-white text-lg">{user?.name}</div>
          <div className="text-slate-400 text-sm">{user?.email}</div>
          <div className="text-xs text-slate-600 mt-0.5">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Form */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-5 flex items-center gap-2">
          <User size={14} className="text-slate-500" /> Personal Information
        </h2>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4 text-emerald-400 text-sm">
            <CheckCircle size={14} /> Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input" value={form.name} onChange={set('name')} required />
          </div>

          <div>
            <label className="label">Email Address</label>
            <input type="email" className="input bg-slate-900/30 cursor-not-allowed" value={user?.email || ''} disabled />
            <p className="text-xs text-slate-600 mt-1">Email cannot be changed.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Country</label>
              <select className="select" value={form.country} onChange={set('country')}>
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Preferred Currency</label>
              <select className="select" value={form.preferredCurrency} onChange={set('preferredCurrency')}>
                {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'BRL'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" /> Saving...</>
              : <><Save size={15} /> Save Changes</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}
