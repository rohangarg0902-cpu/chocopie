import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_COMMUNITY_USERS = [
  {
    id: 'user-rohan-1',
    name: 'Rohan Garg',
    username: 'rohan_garg',
    email: 'rohan@chocopie.app',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    bio: 'BTech Student & Music Enthusiast @ Delhi',
    status: 'Listening to Kesariya'
  },
  {
    id: 'u1',
    name: 'Priya Sharma',
    username: 'priya_sharma',
    email: 'priya@chocopie.app',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    bio: 'Indie & Bollywood Pop Lover',
    status: 'Listening to Blinding Lights'
  },
  {
    id: 'u2',
    name: 'Aman Verma',
    username: 'aman_v',
    email: 'aman@chocopie.app',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    bio: 'Punjabi Beats & Late Night Coding',
    status: 'Listening to Lover - Diljit Dosanjh'
  },
  {
    id: 'u3',
    name: 'Neha Gupta',
    username: 'neha_g',
    email: 'neha@chocopie.app',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    bio: 'Always exploring new playlists',
    status: 'Active 3m ago'
  }
];

export function AuthProvider({ children }) {
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('chocopie_users');
    return saved ? JSON.parse(saved) : DEFAULT_COMMUNITY_USERS;
  });

  const [user, setUser] = useState(() => {
    const savedCurrent = localStorage.getItem('chocopie_current_user');
    return savedCurrent ? JSON.parse(savedCurrent) : DEFAULT_COMMUNITY_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('chocopie_auth') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('chocopie_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('chocopie_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('chocopie_current_user');
    }
  }, [user]);

  const login = (email, password) => {
    const existing = registeredUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      setUser(existing);
    } else {
      const newUser = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
        bio: 'Streaming on CHOCOPIE',
        status: 'Online'
      };
      setRegisteredUsers(prev => [...prev, newUser]);
      setUser(newUser);
    }
    setIsAuthenticated(true);
    localStorage.setItem('chocopie_auth', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.setItem('chocopie_auth', 'false');
  };

  const register = (userData) => {
    const cleanUsername = (userData.username || userData.fullName || 'user')
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    const newUser = {
      id: 'user-' + Date.now(),
      name: userData.fullName || 'CHOCOPIE User',
      username: cleanUsername || 'user_' + Math.floor(Math.random() * 1000),
      email: userData.email,
      password: userData.password,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      bio: userData.bio || 'New CHOCOPIE music lover!',
      status: 'Online'
    };

    setRegisteredUsers(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== newUser.email.toLowerCase());
      return [...filtered, newUser];
    });
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('chocopie_auth', 'true');
  };

  const updateProfile = (updatedData) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedData };
      setRegisteredUsers(users =>
        users.map(u => (u.id === updated.id ? updated : u))
      );
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      registeredUsers,
      isAuthenticated,
      login,
      logout,
      register,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
