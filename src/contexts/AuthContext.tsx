"use client";

import type { User } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Mock user data
const mockStudent: User = {
  id: 'student123',
  email: 'etudiant@ensa.dev',
  name: 'Alice Étudiante',
  role: 'student',
  program: 'Génie Informatique',
  level: '3ème année',
  difficultSubjects: ['Algorithmique avancée', 'Compilation'],
  avatarUrl: 'https://placehold.co/100x100.png',
};

const mockTutor: User = {
  id: 'tutor456',
  email: 'tuteur@ensa.dev',
  name: 'Bob Tuteur',
  role: 'tutor',
  teachableSubjects: ['Algorithmique', 'Bases de données', 'Développement Web'],
  experience: "Ancien élève ENSA, 2 ans d'expérience en tutorat.",
  availability: 'Lundi, Mercredi 18h-20h',
  bio: "Passionné par l'enseignement et l'informatique, je suis là pour vous aider à réussir !",
  avatarUrl: 'https://placehold.co/100x100.png',
};

interface AuthContextType {
  user: User | null;
  login: (role: 'student' | 'tutor') => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUserRole = localStorage.getItem('ensa-connect-user-role');
    if (storedUserRole === 'student') {
      setUser(mockStudent);
    } else if (storedUserRole === 'tutor') {
      setUser(mockTutor);
    }
    setLoading(false);
  }, []);

  const login = (role: 'student' | 'tutor') => {
    setLoading(true);
    if (role === 'student') {
      setUser(mockStudent);
      localStorage.setItem('ensa-connect-user-role', 'student');
    } else {
      setUser(mockTutor);
      localStorage.setItem('ensa-connect-user-role', 'tutor');
    }
    setLoading(false);
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem('ensa-connect-user-role');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
