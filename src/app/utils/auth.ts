// Mock authentication utility using localStorage

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: string[];
  progress: Record<string, number>; // courseId -> percentage
}

const STORAGE_KEY = 'hoanguy_user';

export const authUtils = {
  // Check if user is logged in
  isAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  // Get current user
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEY);
    if (!userData) return null;
    return JSON.parse(userData);
  },

  // Login (mock)
  login(email: string, password: string): User {
    // Mock user data
    const user: User = {
      id: '1',
      name: 'Nguyễn Văn A',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      enrolledCourses: ['1', '2'],
      progress: {
        '1': 35,
        '2': 12
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  // Register (mock)
  register(name: string, email: string, password: string): User {
    const user: User = {
      id: Date.now().toString(),
      name: name,
      email: email,
      avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=200`,
      enrolledCourses: [],
      progress: {}
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  // Logout
  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Update user progress
  updateProgress(courseId: string, percentage: number): void {
    const user = this.getCurrentUser();
    if (!user) return;
    
    user.progress[courseId] = percentage;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  // Enroll in course
  enrollCourse(courseId: string): void {
    const user = this.getCurrentUser();
    if (!user) return;
    
    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      user.progress[courseId] = 0;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  }
};
