-- =====================================================
-- SIMPLE DEMO COURSES SEED SQL
-- Copy and run this directly in Neon SQL Editor
-- =====================================================

-- Create instructor if not exists
INSERT INTO users (email, password_hash, full_name, role, level, xp, total_xp, coins, language)
SELECT 
  'teacher@hoangu.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrj9HA6YJ5qQdGi',
  'Cô Lan',
  'instructor',
  5, 5000, 5000, 1000, 'vi'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'teacher@hoangu.com');

-- Get teacher ID
-- Course 1: Tiếng Trung Cơ Bản HSK1 (Free)
INSERT INTO courses (
  title, slug, description, thumbnail_url, teacher_id, teacher_name,
  level, category, price_vnd, original_price_vnd, discount_percent,
  has_certificate, total_lessons, duration_hours, is_published, approval_status,
  course_type, is_free_for_all, students_enrolled, rating, total_ratings
)
SELECT 
  'Tiếng Trung Cơ Bản HSK1',
  'tieng-trung-co-ban-hsk1',
  'Khóa học tiếng Trung cơ bản dành cho người mới bắt đầu. Học từ cơ bản đến đạt chuẩn HSK1 với 150 từ vựng và 45 ngữ pháp cơ bản.',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
  (SELECT id FROM users WHERE email = 'teacher@hoangu.com LIMIT 1),
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
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'tieng-trung-co-ban-hsk1');

-- Course 2: Giao Tiếp Tiếng Trung Hàng Ngày (Paid)
INSERT INTO courses (
  title, slug, description, thumbnail_url, teacher_id, teacher_name,
  level, category, price_vnd, original_price_vnd, discount_percent,
  has_certificate, total_lessons, duration_hours, is_published, approval_status,
  course_type, is_free_for_all, students_enrolled, rating, total_ratings
)
SELECT 
  'Giao Tiếp Tiếng Trung Hàng Ngày',
  'giao-tiep-tieng-trung-hang-ngay',
  'Khóa học giao tiếp tiếng Trung thực tế cho cuộc sống hàng ngày.',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  (SELECT id FROM users WHERE email = 'teacher@hoangu.com LIMIT 1),
  'Cô Lan',
  'intermediate',
  'giao-tiep',
  299000,
  499000,
  40,
  true,
  20,
  10,
  true,
  'approved',
  'paid',
  false,
  50,
  4.8,
  50
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE slug = 'giao-tiep-tieng-trung-hang-ngay');

-- Add lessons for HSK1 course
INSERT INTO lessons (course_id, title, description, order_index, video_duration, is_free, is_published, video_url)
SELECT 
  (SELECT id FROM courses WHERE slug = 'tieng-trung-co-ban-hsk1'),
  title, description, order_index, video_duration, is_free, is_published, video_url
FROM (VALUES
  ('Giới thiệu tiếng Trung', 'Tìm hiểu về tiếng Trung và cách học hiệu quả', 1, 900, true, true, ''),
  ('Bảng chữ cái Pinyin', 'Học 21 phụ âm và 6 nguyên âm', 2, 1500, true, true, ''),
  ('Chào hỏi cơ bản', 'Xin chào, tạm biệt, cảm ơn', 3, 1200, true, true, ''),
  ('Đếm số từ 1-10', 'Học cách đếm số bằng tiếng Trung', 4, 900, true, true, ''),
  ('Giới thiệu bản thân', 'Tôi tên là..., tôi đến từ...', 5, 1200, false, true, ''),
  ('Gia đình', 'Cha, mẹ, anh chị em trong tiếng Trung', 6, 1500, false, true, ''),
  ('Màu sắc', 'Đỏ, xanh, vàng, trắng, đen', 7, 900, false, true, ''),
  ('Ăn uống', 'Cơm, nước, trà, cà phê', 8, 1200, false, true, ''),
  ('Đi lại', 'Đi bộ, đi xe buýt, đi taxi', 9, 1200, false, true, ''),
  ('Mua sắm', 'Tiền, giá tiền, thanh toán', 10, 1500, false, true, '')
) AS v(title, description, order_index, video_duration, is_free, is_published, video_url)
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = (SELECT id FROM courses WHERE slug = 'tieng-trung-co-ban-hsk1'));

-- Add lessons for Giao Tiếp course
INSERT INTO lessons (course_id, title, description, order_index, video_duration, is_free, is_published, video_url)
SELECT 
  (SELECT id FROM courses WHERE slug = 'giao-tiep-tieng-trung-hang-ngay'),
  title, description, order_index, video_duration, is_free, is_published, video_url
FROM (VALUES
  ('Chào hỏi thân mật', 'Cách chào hỏi tự nhiên nhất', 1, 1200, true, true, ''),
  ('Hỏi thông tin', 'Hỏi đường, hỏi giờ', 2, 1500, true, true, ''),
  ('Mua sắm cơ bản', 'Hỏi giá, trả giá', 3, 1200, false, true, ''),
  ('Đặt đồ ăn', 'Gọi món tự nhiên', 4, 1200, false, true, ''),
  ('Di chuyển trong thành phố', 'Xe buýt, metro, taxi', 5, 1500, false, true, ''),
  ('Giao tiếp với hàng xóm', 'Chào hỏi hàng xóm', 6, 1200, false, true, ''),
  ('Điện thoại hẹn gặp', 'Hẹn bạn bè', 7, 1200, false, true, ''),
  ('Trong siêu thị', 'Mua sắm thực phẩm', 8, 1500, false, true, ''),
  ('Ở bệnh viện', 'Mô tả triệu chứng', 9, 1200, false, true, ''),
  ('Tại ngân hàng', 'Rút tiền, chuyển khoản', 10, 1200, false, true, '')
) AS v(title, description, order_index, video_duration, is_free, is_published, video_url)
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = (SELECT id FROM courses WHERE slug = 'giao-tiep-tieng-trung-hang-ngay'));

-- Update course lesson counts
UPDATE courses SET total_lessons = (SELECT COUNT(*) FROM lessons WHERE course_id = courses.id);

-- Verify
SELECT title, slug, course_type, is_free_for_all, total_lessons FROM courses WHERE is_published = true;
