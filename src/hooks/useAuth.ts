import { useState, useEffect } from 'react';

export interface AuthUser {
  id: string;
  email?: string;
  username?: string;
}

const MOCK_USER_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockUser: AuthUser = {
      id: MOCK_USER_ID,
      email: 'user@example.com',
      username: 'user',
    };
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  return { user, isLoading };
}
