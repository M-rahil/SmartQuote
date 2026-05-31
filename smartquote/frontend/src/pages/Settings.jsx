import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import { Lock, Sliders, CheckCircle, AlertCircle, Eye, EyeOff, Save } from 'lucide-react';

export default function Settings() {
  const { user, updateUser } = useAuth();

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  // Defaults form
  const [defaults, setDefaults] = useState({
    overhead: user?.overhead ?? 0.20,
    profitMargin: user?.profitMargin ?? 0.25
  });
  const [defLoading, setDefLoading] = useState(false);
  const [defSuccess, setDefSuccess] = useState('');
  const [defError, setDefError] = useState('');

  const setPw = (field) => (e) => setPwForm(p => ({ ...p, [field]: e.target.value }));

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }

    setPwLoading(true);
    try {
      await userApi.updatePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword
      });
      setPwSuccess('Password updated successfully.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSuccess(''), 4000);
    } catch (err) {
      setPwError(err.response?.data?.error || 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleDefaultsUpdate = async (e) => {
    e.preventDefault();
    setDefError('');
    setDefSuccess('');
    setDefLoading(true);
    try {
      const res = await userApi.updateProfile({
        overhead: defaults.overhead,
        profitMargin: defaults.profitMargin
      });
      updateUser(res.data.user);
      setDefSuccess('Default margins saved.');
      setTimeout(() => setDefSuccess(''), 4000);
    } catch (err) {
      setDefError(err.response?.data?.error || 'Failed to save defaults.');
    } finally {
      setDefLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">Manage your security and default pricing preferences.</p>
      </div>

      {/* Default Margins */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-2">
          <Sliders size={14} className="text-slate-500" />
          Default Pricing Margins
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          These values pre-fill the calculator for every new quote.
        </p>

        {defError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm">
            <AlertCircle size={14} /> {defError}
          </div>
        )}
        {defSuccess && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4 text-emerald-400 text-sm">
            <CheckCircle size={14} /> {defSuccess}
          </div>
        )}

        <form onSubmit={handleDefaultsUpdate} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Default Overhead</label>
              <span className="text-sm font-medium text-slate-200 num-display bg-slate-700 px-2.5 py-0.5 rounded-lg">
                {(defaults.overhead * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range" min="0" max="0.5" step="0.01"
              value={defaults.overhead}
              onChange={e => setDefaults(p => ({ ...p, overhead: parseFloat(e.target.value) }))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>0%</span><span>25%</span><span>50%</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Covers tools, software subscriptions, workspace, and operating costs.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">Default Profit Margin</label>
              <span className="text-sm font-medium text-slate-200 num-display bg-slate-700 px-2.5 py-0.5 rounded-lg">
                {(defaults.profitMargin * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range" min="0" max="0.6" step="0.01"
              value={defaults.profitMargin}
              onChange={e => setDefaults(p => ({ ...p, profitMargin: parseFloat(e.target.value) }))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>0%</span><span>30%</span><span>60%</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Your business profit on top of direct costs and overhead.
            </p>
          </div>

          {/* Preview */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Margin Preview</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-slate-500 mb-1">Overhead</div>
                <div className="text-lg font-bold text-blue-400 num-display">{(defaults.overhead * 100).toFixed(0)}%</div>
              </div>
              <div className="border-x border-slate-700">
                <div className="text-xs text-slate-500 mb-1">Profit</div>
                <div className="text-lg font-bold text-emerald-400 num-display">{(defaults.profitMargin * 100).toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Total Markup</div>
                <div className="text-lg font-bold text-amber-400 num-display">
                  {((1 + defaults.overhead) * (1 + defaults.profitMargin) * 100 - 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={defLoading} className="btn-primary flex items-center gap-2">
            {defLoading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" /> Saving...</>
              : <><Save size={15} /> Save Defaults</>
            }
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-2">
          <Lock size={14} className="text-slate-500" />
          Change Password
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Use a strong password of at least 8 characters.
        </p>

        {pwError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm">
            <AlertCircle size={14} /> {pwError}
          </div>
        )}
        {pwSuccess && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4 text-emerald-400 text-sm">
            <CheckCircle size={14} /> {pwSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Enter current password"
                value={pwForm.currentPassword}
                onChange={setPw('currentPassword')}
                required
                autoComplete="current-password"
              />
              <button type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                onClick={() => setShowCurrent(p => !p)}
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Min. 8 characters"
                value={pwForm.newPassword}
                onChange={setPw('newPassword')}
                required
                autoComplete="new-password"
              />
              <button type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                onClick={() => setShowNew(p => !p)}
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {/* Password strength indicator */}
            {pwForm.newPassword && (
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map(i => {
                  const len = pwForm.newPassword.length;
                  const hasUpper = /[A-Z]/.test(pwForm.newPassword);
                  const hasNum = /[0-9]/.test(pwForm.newPassword);
                  const hasSpecial = /[^a-zA-Z0-9]/.test(pwForm.newPassword);
                  const score = [len >= 8, hasUpper, hasNum, hasSpecial].filter(Boolean).length;
                  const active = i <= score;
                  const color = score <= 1 ? 'bg-red-500' : score === 2 ? 'bg-amber-500' : score === 3 ? 'bg-blue-500' : 'bg-emerald-500';
                  return <div key={i} className={`h-1 flex-1 rounded-full ${active ? color : 'bg-slate-700'}`} />;
                })}
              </div>
            )}
          </div>

          <div>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              className={`input ${pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword ? 'border-red-500/50 focus:ring-red-500/30' : ''}`}
              placeholder="Re-enter new password"
              value={pwForm.confirmPassword}
              onChange={setPw('confirmPassword')}
              required
              autoComplete="new-password"
            />
            {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">Passwords don't match.</p>
            )}
          </div>

          <button type="submit" disabled={pwLoading} className="btn-primary flex items-center gap-2">
            {pwLoading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" /> Updating...</>
              : <><Lock size={15} /> Update Password</>
            }
          </button>
        </form>
      </div>

      {/* Account info */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Account Info</h2>
        <div className="space-y-2 text-sm">
          {[
            ['Account Email', user?.email],
            ['Preferred Currency', user?.preferredCurrency],
            ['Country', user?.country],
            ['Account ID', user?.id?.slice(-8).toUpperCase()]
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-slate-700/30 last:border-0">
              <span className="text-slate-500">{label}</span>
              <span className="text-slate-300 font-medium num-display">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
