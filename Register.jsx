import React, { useState } from 'react';
import { Disc3, Lock, Mail, User, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register({ switchToLogin }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ fullName, username, email, password });
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
          <p className="text-choco-muted text-xs mt-1">Create your social music account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-choco-muted block mb-1">Full Name</label>
            <div className="flex items-center gap-3 bg-choco-card px-4 py-2.5 rounded-2xl border border-choco-hover">
              <User size={18} className="text-choco-muted" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rohan Garg"
                className="bg-transparent border-none outline-none text-sm text-choco-text w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-choco-muted block mb-1">Unique Username</label>
            <div className="flex items-center gap-3 bg-choco-card px-4 py-2.5 rounded-2xl border border-choco-hover">
              <AtSign size={18} className="text-choco-muted" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="rohan_garg"
                className="bg-transparent border-none outline-none text-sm text-choco-text w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-choco-muted block mb-1">Email Address</label>
            <div className="flex items-center gap-3 bg-choco-card px-4 py-2.5 rounded-2xl border border-choco-hover">
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
            <div className="flex items-center gap-3 bg-choco-card px-4 py-2.5 rounded-2xl border border-choco-hover">
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
            Create Account
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-xs text-choco-muted">
            Already have an account?{' '}
            <button onClick={switchToLogin} className="text-choco-accent font-semibold hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
