import React, { useState } from 'react';
import { Shield, Check } from 'lucide-react';

export default function Settings() {
  const [activitySharing, setActivitySharing] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 pb-36 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold text-choco-text mb-2">Settings & Privacy</h1>
        <p className="text-choco-muted text-sm">Manage your account preferences and social privacy controls.</p>
      </div>

      {/* Privacy Controls */}
      <div className="bg-choco-surface border border-choco-hover rounded-3xl p-6 space-y-6 shadow-xl">
        <h3 className="text-lg font-bold text-choco-text flex items-center gap-2">
          <Shield size={20} className="text-choco-accent" /> Privacy & Social Activity
        </h3>

        <div className="flex items-center justify-between py-3 border-b border-choco-hover">
          <div>
            <h4 className="text-sm font-bold text-choco-text">Share Listening Activity with Friends</h4>
            <p className="text-xs text-choco-muted">Allow accepted friends to see what track you are currently playing.</p>
          </div>
          <input
            type="checkbox"
            checked={activitySharing}
            onChange={() => setActivitySharing(!activitySharing)}
            className="w-5 h-5 accent-choco-accent cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <h4 className="text-sm font-bold text-choco-text">In-App Collaborative Notifications</h4>
            <p className="text-xs text-choco-muted">Receive alerts for friend requests and shared playlist updates.</p>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="w-5 h-5 accent-choco-accent cursor-pointer"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <Check size={16} /> Settings saved successfully!
            </span>
          )}
          <button
            onClick={handleSave}
            className="ml-auto px-6 py-3 rounded-2xl bg-choco-accent hover:bg-choco-accentHover text-choco-bg font-bold text-sm shadow-lg transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
