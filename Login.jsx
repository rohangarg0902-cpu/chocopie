import React, { useState } from 'react';
import { Disc3, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login({ switchToRegister }) {
  const [email, setEmail] = useState('rohan@chocopie.app');
  const [password, setPassword] = useState('password123');
  const { login, registeredUsers } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="min-h-screen bg-choco-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-choco-surface border border-choco-hover rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-choco-accent to-choco-gold text-choco-bg mb-4 shadow-lg">
            <Disc3 size={30} className="animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h1 className="text-3xl font-black tracking-wider bg-gradient-to-r from-choco-text via-choco-gold to-choco-accent bg-clip-text text-transparent">
            CHOCOPIE
          </h1>
          <p className="text-choco-muted text-xs mt-1">Sign in to your social music account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-choco-muted block mb-1">Email Address</label>
            <div className="flex items-center gap-3 bg-choco-card px-4 py-3 rounded-2xl border border-choco-hover">
              <Mail size={18} className="text-choco-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="bg-transparent border-none outline-none text-sm text-choco-text w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-choco-muted block mb-1">Password</label>
            <div className="flex items-center gap-3 bg-choco-card px-4 py-3 rounded-2xl border border-choco-hover">
              <Lock size={18} className="text-choco-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-none outline-none text-sm text-choco-text w-full"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-choco-accent hover:bg-choco-accentHover text-choco-bg font-bold text-sm shadow-lg transition mt-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-choco-hover">
          <p className="text-[11px] text-choco-muted text-center mb-3">Quick Login as Existing Account:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {registeredUsers.slice(0, 3).map(acc => (
              <button
                key={acc.id}
                onClick={() => login(acc.email, acc.password)}
                className="px-3 py-1.5 rounded-xl bg-choco-card hover:bg-choco-hover border border-choco-hover text-xs text-choco-text flex items-center gap-2 transition"
              >
                <img src={acc.avatar} alt={acc.name} className="w-5 h-5 rounded-full object-cover" />
                {acc.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mt-5">
          <p className="text-xs text-choco-muted">
            Don't have an account?{' '}
            <button onClick={switchToRegister} className="text-choco-accent font-semibold hover:underline">
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
