import { User } from '../types';

export const registerUser = (userData: User): void => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  users.push(userData);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(userData));
};

export const loginUser = (email: string, password: string): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: User) => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }
  return false;
};

export const logoutUser = (): void => {
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('currentUser') !== null;
};