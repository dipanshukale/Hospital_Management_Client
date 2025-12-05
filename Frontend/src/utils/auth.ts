// utils/auth.ts

export interface User {
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any; 
}

// Token handling
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

// User handling
export const setUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? (JSON.parse(user) as User) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};

// Logout utility
export const logout = (): void => {
  removeAuthToken();
  removeUser();
};
