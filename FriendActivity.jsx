import React from 'react';
import { Radio, Music2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function FriendActivity() {
  const { registeredUsers, user } = useAuth();
  const otherUsers = registeredUsers.filter(u => u.id !== user?.id);

  return (
    <div className="bg-choco-surface border border-choco-hover rounded-3xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio size={20} className="text-choco-accent animate-pulse" />
          <h3 className="font-bold text-choco-text text-base">Friend Activity</h3>
        </div>
        <span className="text-[10px] bg-choco-card text-choco-muted px-2.5 py-1 rounded-full font-medium border border-choco-hover">
          Live Feed
        </span>
      </div>

      <div className="space-y-3.5">
        {otherUsers.map(friend => (
          <div key={friend.id} className="flex items-center gap-3 p-3 rounded-2xl bg-choco-card hover:bg-choco-hover transition border border-choco-hover">
            <div className="relative flex-shrink-0">
              <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover border border-choco-accent" />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-choco-card"></span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-choco-text truncate">{friend.name}</h4>
              <p className="text-[11px] text-choco-muted truncate flex items-center gap-1 mt-0.5">
                <Music2 size={12} className="text-choco-accent flex-shrink-0" />
                {friend.status || 'Listening on CHOCOPIE'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
