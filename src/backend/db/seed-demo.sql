-- =====================================================
-- DEMO DATA SEED SQL
-- Run this on Neon PostgreSQL to create demo content
-- =====================================================

-- Create instructor user
INSERT INTO users (email, password_hash, full_name, role, level, xp, total_xp, coins, language)
VALUES (
  'teacher@hoangu.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrj9HA6YJ5qQdGi', -- password: teacher123
  'Cô Lan',
  'instructor',
  5, 5000, 5000, 1000, 'vi'
)
ON CONFLICT (email) DO UPDATE SET role = 'instructor';

-- Create student user  
INSERT INTO users (email, password_hash, full_name, role, level, xp, total_xp, coins, language)
VALUES (
  'student@hoangu.com',
  '$2a$10$YQ7cA0Jz7qXhW5Y3jK4XeOaK7j8dL9mNpQrStUvWx2Yz3Y', -- password: student123
  'Nguyễn Văn A',
  'student',
  3, 1500, 2000, 500, 'vi'
)
ON CONFLICT (email) DO UPDATE SET role = 'student';

-- Create categories
INSERT INTO categories (name, slug, description, icon) VALUES 
('HSK 1', 'hsk-1', 'Khóa học HSK cấp 1', 'book'),
('HSK 2', 'hsk-2', 'Khóa học HSK cấp 2', 'book'),
('Giao tiếp', 'giao-tiep', 'Tiếng Hoa giao tiếp', 'message-circle'),
('Ngữ pháp', 'ngu-phap', 'Ngữ pháp tiếng Hoa', 'file-text')
ON CONFLICT (slug) DO NOTHING;

-- Get teacher ID
DO $$
DECLARE teacher_id UUID;
BEGIN
  SELECT id INTO teacher_id FROM users WHERE email = 'teacher@hoangu.com';
  
  -- Create course: Tiếng Trung Cơ Bản HSK1
  INSERT INTO courses (
    title, slug, description, thumbnail_url, teacher_id, teacher_name,
    level, category, price_vnd, original_price_vnd, discount_percent,
    has_certificate, total_lessons, duration_hours, is_published, approval_status,
    course_type, is_free_for_all, students_enrolled, rating, total_ratings
  ) VALUES (
    'Tiếng Trung Cơ Bản HSK1',
    'tieng-trung-co-ban-hsk1',
    'Khóa học tiếng Trung cơ bản dành cho người mới bắt đầu. Học từ cơ bản đến đạt chuẩn HSK1 với 150 từ vựng và 45 ngữ pháp cơ bản.',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
    teacher_id,
    'Cô Lan',
    'beginner',
    'hsk-1',
    0,
    599000,
    100,
    true,
    10,
    20,
    true,
    'approved',
    'free',
    true,
    0,
    4.5,
    100
  );
END $$;

-- Create lessons for HSK1 course
DO $$
DECLARE course_id UUID;
DECLARE teacher_id UUID;
BEGIN
  SELECT id INTO teacher_id FROM users WHERE email = 'teacher@hoangu.com';
  SELECT id INTO course_id FROM courses WHERE slug = 'tieng-trung-co-ban-hsk1';
  
  IF course_id IS NOT NULL THEN
    -- Delete existing lessons
    DELETE FROM lessons WHERE course_id = course_id;
    
    -- Insert lessons
    INSERT INTO lessons (course_id, title, description, order_index, video_duration, is_free, is_published, video_url) VALUES
    (course_id, 'Giới thiệu tiếng Trung', 'Tìm hiểu về tiếng Trung và cách học hiệu quả', 1, 900, true, true, ''),
    (course_id, 'Bảng chữ cái Pinyin', 'Học 21 phụ âm và 6 nguyên âm', 2, 1500, true, true, ''),
    (course_id, 'Chào hỏi cơ bản', 'Xin chào, tạm biệt, cảm ơn', 3, 1200, true, true, ''),
    (course_id, 'Đếm số từ 1-10', 'Học cách đếm số bằng tiếng Trung', 4, 900, true, true, ''),
    (course_id, 'Giới thiệu bản thân', 'Tôi tên là..., tôi đến từ...', 5, 1200, false, true, ''),
    (course_id, 'Gia đình', 'Cha, mẹ, anh chị em trong tiếng Trung', 6, 1500, false, true, ''),
    (course_id, 'Màu sắc', 'Đỏ, xanh, vàng, trắng, đen', 7, 900, false, true, ''),
    (course_id, 'Ăn uống', 'Cơm, nước, trà, cà phê', 8, 1200, false, true, ''),
    (course_id, 'Đi lại', 'Đi bộ, đi xe buýt, đi taxi', 9, 1200, false, true, ''),
    (course_id, 'Mua sắm', 'Tiền, giá tiền, thanh toán', 10, 1500, false, true, '');
    
    -- Update course total_lessons
    UPDATE courses SET total_lessons = 10 WHERE id = course_id;
  END IF;
END $$;

-- Enroll student in HSK1 course
DO $$
DECLARE student_id UUID;
DECLARE course_id UUID;
BEGIN
  SELECT id INTO student_id FROM users WHERE email = 'student@hoangu.com';
  SELECT id INTO course_id FROM courses WHERE slug = 'tieng-trung-co-ban-hsk1';
  
  IF student_id IS NOT NULL AND course_id IS NOT NULL THEN
    INSERT INTO enrollments (user_id, course_id, progress, status)
    VALUES (student_id, course_id, 30, 'active')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Update course enrollment count
DO $$
DECLARE course_id UUID;
DECLARE enrollment_count INTEGER;
BEGIN
  SELECT id INTO course_id FROM courses WHERE slug = 'tieng-trung-co-ban-hsk1';
  
  IF course_id IS NOT NULL THEN
    SELECT COUNT(*) INTO enrollment_count FROM enrollments WHERE course_id = course_id;
    UPDATE courses SET students_enrolled = enrollment_count WHERE id = course_id;
  END IF;
END $$;

-- =====================================================
-- VERIFY DATA
-- =====================================================
SELECT 'Users:' as info;
SELECT email, role, full_name FROM users WHERE email LIKE '%@hoangu.com';

SELECT 'Courses:' as info;
SELECT title, slug, course_type, is_free_for_all, total_lessons, students_enrolled FROM courses WHERE is_published = true;

SELECT 'Lessons:' as info;
SELECT l.title, l.order_index, l.is_free, c.title as course_title 
FROM lessons l 
JOIN courses c ON l.course_id = c.id 
ORDER BY c.title, l.order_index;
