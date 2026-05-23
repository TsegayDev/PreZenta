'use client';
import { useState, useEffect } from 'react';
import type { AppUser } from '@/lib/types';

export const PLAN_TOKENS = {
    Free: 10000,
    Pro: 100000,
    Unlimited: Infinity,
};

const mockUser: AppUser = {
    displayName: 'Demo User',
    email: 'demo@example.com',
    photoURL: 'https://placehold.co/100x100.png',
    plan: 'Pro',
    tokens: 45000,
};

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    // In a real app, you would fetch user data from an auth provider
    setUser(mockUser);
  }, []);

  const signOut = () => {
    // In a real app, you would call the auth provider's sign-out method
    setUser(null);
  };

  return { user, signOut };
}
