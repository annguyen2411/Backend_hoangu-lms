-- =====================================================
-- DEMO COURSES SEED SQL
-- Run this on Neon PostgreSQL to create demo courses
-- =====================================================

-- Get or create instructor (use existing or create minimal)
DO $$
DECLARE teacher_id UUID;
BEGIN
  -- Try to find existing instructor
  SELECT id INTO teacher_id FROM users WHERE role = 'instructor' LIMIT 1;
  
  -- If no instructor, create one
  IF teacher_id IS NULL THEN
    INSERT INTO users (email, password_hash, full_name, role, level, xp, total_xp, coins, language)
    VALUES (
      'teacher@hoangu.com',
      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.CpIVrj9HA6YJ5qQdGi',
      'Cô Lan',
      'instructor',
      5, 5000, 5000, 1000, 'vi'
    )
    ON CONFLICT (email) DO UPDATE SET role = 'instructor'
    RETURNING id INTO teacher_id;
  END IF;
END $$;

-- Create courses
DO $$
DECLARE teacher_id UUID;
BEGIN
  SELECT id INTO teacher_id FROM users WHERE role = 'instructor' ORDER BY created_at DESC LIMIT 1;
  
  IF teacher_id IS NOT NULL THEN
    -- Course 1: Tiếng Trung Cơ Bản HSK1 (Free)
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
    ) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;
    
    -- Course 2: Giao Tiếp Tiếng Trung Hàng Ngày (Paid)
    INSERT INTO courses (
      title, slug, description, thumbnail_url, teacher_id, teacher_name,
      level, category, price_vnd, original_price_vnd, discount_percent,
      has_certificate, total_lessons, duration_hours, is_published, approval_status,
      course_type, is_free_for_all, students_enrolled, rating, total_ratings
    ) VALUES (
      'Giao Tiếp Tiếng Trung Hàng Ngày',
      'giao-tiep-tieng-trung-hang-ngay',
      'Khóa học giao tiếp tiếng Trung thực tế cho cuộc sống hàng ngày. Giao tiếp mạnh mẽ trong các tình huống mua sắm, đi lại, ăn uống.',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      teacher_id,
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
    ) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;
  END IF;
END $$;

-- Create lessons for HSK1 course
DO $$
DECLARE course_id UUID;
BEGIN
  SELECT id INTO course_id FROM courses WHERE slug = 'tieng-trung-co-ban-hsk1';
  
  IF course_id IS NOT NULL THEN
    -- Delete existing lessons and recreate
    DELETE FROM lessons WHERE course_id = course_id;
    
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
    
    UPDATE courses SET total_lessons = 10 WHERE id = course_id;
  END IF;
END $$;

-- Create lessons for Giao Tiếp course
DO $$
DECLARE course_id UUID;
BEGIN
  SELECT id INTO course_id FROM courses WHERE slug = 'giao-tiep-tieng-trung-hang-ngay';
  
  IF course_id IS NOT NULL THEN
    DELETE FROM lessons WHERE course_id = course_id;
    
    INSERT INTO lessons (course_id, title, description, order_index, video_duration, is_free, is_published, video_url) VALUES
    (course_id, 'Chào hỏi thân mật', 'Cách chào hỏi tự nhiên nhất', 1, 1200, true, true, ''),
    (course_id, 'Hỏi thông tin', 'Hỏi đường, hỏi giờ', 2, 1500, true, true, ''),
    (course_id, 'Mua sắm cơ bản', 'Hỏi giá, trả giá', 3, 1200, false, true, ''),
    (course_id, 'Đặt đồ ăn', 'Gọi món tự nhiên', 4, 1200, false, true, ''),
    (course_id, 'Di chuyển trong thành phố', 'Xe buýt, metro, taxi', 5, 1500, false, true, ''),
    (course_id, 'Giao tiếp với hàng xóm', 'Chào hỏi hàng xóm', 6, 1200, false, true, ''),
    (course_id, 'Điện thoại hẹn gặp', 'Hẹn bạn bè', 7, 1200, false, true, ''),
    (course_id, 'Trong siêu thị', 'Mua sắm thực phẩm', 8, 1500, false, true, ''),
    (course_id, 'Ở bệnh viện', 'Mô tả triệu chứng', 9, 1200, false, true, ''),
    (course_id, 'Tại ngân hàng', 'Rút tiền, chuyển khoản', 10, 1200, false, true, ''),
    (course_id, 'Khen ngợi và khiếu nại', 'Biểu đạt cảm xúc', 11, 1500, false, true, ''),
    (course_id, 'Bày tỏ ý kiến', 'Đồng ý, phản đối', 12, 1200, false, true, ''),
    (course_id, 'Nói về công việc', 'Mô tả công việc', 13, 1500, false, true, ''),
    (course_id, 'Kế hoạch cuối tuần', 'Đề xuất hoạt động', 14, 1200, false, true, ''),
    (course_id, 'Mời đến nhà', 'Tiếp khách tại nhà', 15, 1200, false, true, ''),
    (course_id, 'Nói về thời tiết', 'Chủ đề thời tiết', 16, 900, false, true, ''),
    (course_id, 'Sở thích và đam mê', 'Chia sẻ sở thích', 17, 1200, false, true, ''),
    (course_id, 'Kể về kỳ nghỉ', 'Kinh nghiệm du lịch', 18, 1500, false, true, ''),
    (course_id, 'Giao tiếp trong công việc', 'Họp, thuyết trình', 19, 1200, false, true, ''),
    (course_id, 'Tổng kết khóa học', 'Ôn tập và kết luận', 20, 1500, false, true, '');
    
    UPDATE courses SET total_lessons = 20 WHERE id = course_id;
  END IF;
END $$;

-- =====================================================
-- VERIFY
-- =====================================================
SELECT '=== COURSES ===' as info;
SELECT title, slug, course_type, is_free_for_all, total_lessons, students_enrolled, rating 
FROM courses 
WHERE is_published = true
ORDER BY created_at;

SELECT '=== LESSONS ===' as info;
SELECT c.title as course, l.title, l.order_index, l.is_free, l.video_duration
FROM lessons l
JOIN courses c ON l.course_id = c.id
ORDER BY c.title, l.order_index;
