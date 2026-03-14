// Admin authentication utility

import { AdminUser, adminUsers } from '../data/adminData';

const ADMIN_STORAGE_KEY = 'hoanguy_admin';

export const adminAuthUtils = {
  // Check if admin is logged in
  isAdminAuthenticated(): boolean {
    return localStorage.getItem(ADMIN_STORAGE_KEY) !== null;
  },

  // Get current admin
  getCurrentAdmin(): AdminUser | null {
    const adminData = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!adminData) return null;
    return JSON.parse(adminData);
  },

  // Admin login
  adminLogin(email: string, password: string): AdminUser | null {
    // Mock admin login - only accept admin@hoanguy.edu.vn
    if (email === 'admin@hoanguy.edu.vn' && password.length > 0) {
      const admin = adminUsers[0];
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admin));
      return admin;
    }
    return null;
  },

  // Admin logout
  adminLogout(): void {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
};
