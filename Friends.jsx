import React, { useState } from 'react';
import { UserPlus, Radio, Check, X, Search, UserMinus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Friends() {
  const { registeredUsers, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const communityUsers = registeredUsers.filter(u => u.id !== user?.id);

  const [friendIds, setFriendIds] = useState(['u1']);
  const [requestIds, setRequestIds] = useState(['u2']);
  const [sentIds, setSentIds] = useState([]);

  const friends = communityUsers.filter(u => friendIds.includes(u.id));
  const requests = communityUsers.filter(u => requestIds.includes(u.id));

  const sendFriendRequest = (targetId) => {
    if (!sentIds.includes(targetId) && !friendIds.includes(targetId)) {
      setSentIds(prev => [...prev, targetId]);
    }
  };

  const acceptRequest = (targetId) => {
    setRequestIds(prev => prev.filter(id => id !== targetId));
    setFriendIds(prev => [...prev, targetId]);
  };

  const rejectRequest = (targetId) => {
    setRequestIds(prev => prev.filter(id => id !== targetId));
  };

  const removeFriend = (targetId) => {
    setFriendIds(prev => prev.filter(id => id !== targetId));
  };

  const searchResults = communityUsers.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-8 pb-36">
      <div>
        <h1 className="text-3xl font-extrabold text-choco-text mb-2">Friends & Social Network</h1>
        <p className="text-choco-muted text-sm">
          Every registered account on CHOCOPIE can search usernames, send friend requests, and view live listening status.
        </p>
      </div>

      <div className="bg-choco-surface border border-choco-hover rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-choco-text mb-3">Find Users on CHOCOPIE</h3>
        <div className="flex items-center gap-3 bg-choco-card px-4 py-3 rounded-2xl border border-choco-hover mb-4">
          <Search size={18} className="text-choco-accent" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or name (e.g. neha_g, priya_sharma, aman_v)..."
            className="bg-transparent border-none outline-none text-sm text-choco-text w-full placeholder-choco-muted"
          />
        </div>

        <div className="space-y-3">
          {searchResults.map(person => {
            const isFriend = friendIds.includes(person.id);
            const isSent = sentIds.includes(person.id);
            const isIncoming = requestIds.includes(person.id);

            return (
              <div key={person.id} className="bg-choco-card p-4 rounded-2xl flex items-center justify-between border border-choco-hover">
                <div className="flex items-center gap-3">
                  <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full object-cover border border-choco-accent" />
                  <div>
                    <h4 className="font-bold text-choco-text text-sm">{person.name}</h4>
                    <p className="text-xs text-choco-muted">@{person.username}</p>
                  </div>
                </div>
                <div>
                  {isFriend ? (
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl font-medium border border-emerald-500/30">
                      Friends
                    </span>
                  ) : isIncoming ? (
                    <button
                      onClick={() => acceptRequest(person.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-choco-bg font-bold text-xs"
                    >
                      Accept Request
                    </button>
                  ) : isSent ? (
                    <span className="text-xs bg-choco-hover text-choco-muted px-3 py-1.5 rounded-xl font-medium">
                      Request Sent
                    </span>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(person.id)}
                      className="px-4 py-2 rounded-xl bg-choco-accent hover:bg-choco-accentHover text-choco-bg font-bold text-xs flex items-center gap-1.5 shadow-md transition"
                    >
                      <UserPlus size={16} /> Send Friend Request
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {requests.length > 0 && (
        <div className="bg-choco-surface border border-choco-hover rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-choco-text mb-4">Received Friend Requests ({requests.length})</h3>
          <div className="space-y-3">
            {requests.map(req => (
              <div key={req.id} className="bg-choco-card p-4 rounded-2xl flex items-center justify-between border border-choco-hover">
                <div className="flex items-center gap-3">
                  <img src={req.avatar} alt={req.name} className="w-12 h-12 rounded-full object-cover border border-choco-accent" />
                  <div>
                    <h4 className="font-bold text-choco-text text-sm">{req.name}</h4>
                    <p className="text-xs text-choco-muted">@{req.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => acceptRequest(req.id)}
                    className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition border border-emerald-500/30"
                    title="Accept"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => rejectRequest(req.id)}
                    className="p-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition border border-red-500/30"
                    title="Reject"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-choco-surface border border-choco-hover rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-choco-text mb-4">My Friends ({friends.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {friends.map(friend => (
            <div key={friend.id} className="bg-choco-card p-4 rounded-2xl flex items-center justify-between gap-3 border border-choco-hover">
              <div className="flex items-center gap-3 min-w-0">
                <img src={friend.avatar} alt={friend.name} className="w-12 h-12 rounded-full object-cover border border-choco-accent flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-bold text-choco-text text-sm truncate">{friend.name}</h4>
                  <p className="text-xs text-choco-muted truncate">@{friend.username}</p>
                  <p className="text-[11px] text-choco-accent truncate mt-1 flex items-center gap-1">
                    <Radio size={12} className="animate-pulse flex-shrink-0" /> {friend.status || 'Online'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFriend(friend.id)}
                className="p-2 rounded-xl text-choco-muted hover:text-red-400 hover:bg-choco-hover transition"
                title="Remove Friend"
              >
                <UserMinus size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
