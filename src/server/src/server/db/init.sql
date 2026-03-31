-- Complete Database Setup for HoaNgữ LMS
-- Run this in Neon Query Editor - WARNING: Drops existing tables!

-- Drop existing tables (optional - only if you want to start fresh)
-- DROP TABLE IF EXISTS enrollments CASCADE;
-- DROP TABLE IF EXISTS lessons CASCADE;
-- DROP TABLE IF EXISTS courses CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin', 'instructor')),
  mshv VARCHAR(50),
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  coins INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  completed_quests INTEGER DEFAULT 0,
  language VARCHAR(10) DEFAULT 'vi',
  theme VARCHAR(20) DEFAULT 'light',
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  teacher_name VARCHAR(255),
  level VARCHAR(20) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  category VARCHAR(100),
  price_vnd INTEGER DEFAULT 0,
  original_price_vnd INTEGER,
  discount_percent INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  students_enrolled INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  duration_hours INTEGER,
  has_certificate BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  course_type VARCHAR(20) DEFAULT 'paid' CHECK (course_type IN ('free', 'paid')),
  is_free_for_all BOOLEAN DEFAULT false,
  free_for_users JSONB DEFAULT '[]',
  teacher_id UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  video_url TEXT,
  video_id TEXT,
  video_duration INTEGER,
  is_free BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, course_id)
);

-- Insert demo course
INSERT INTO courses (title, slug, description, price_vnd, level, category, is_published, total_lessons)
VALUES (
  'Tiếng Trung Cơ Bản - HSK 1',
  'tieng-trung-co-ban-hsk1', 
  'Khóa học Tiếng Trung cơ bản dành cho người mới bắt đầu.',
  0, 'beginner', 'Tiếng Trung', true, 10
)
ON CONFLICT (slug) DO NOTHING;

-- Insert test user (password: 123456)
INSERT INTO users (email, password_hash, full_name, role) 
VALUES ('admin@hoangu.tech', '$2a$10$rVqKxhqVaJHEqP7qNqPqEeG5r.qHqPqEeG5r.qHqPqEeG5r.qH', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Verify
SELECT 'users' as table_name, count(*) as count FROM users
UNION ALL SELECT 'courses', count(*) FROM courses
UNION ALL SELECT 'lessons', count(*) FROM lessons
UNION ALL SELECT 'enrollments', count(*) FROM enrollments;
