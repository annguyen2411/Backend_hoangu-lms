-- Demo Data for Testing Learn Page
-- Run this to populate sample course, lessons, vocabulary, exercises

-- =====================================================
-- 1. DEMO COURSE (Tiếng Trung Cơ Bản)
-- =====================================================

-- Insert demo course
INSERT INTO courses (
  id, title, slug, description, thumbnail_url, price_vnd, 
  course_type, is_free_for_all, category, level, 
  total_lessons, duration_hours, is_published, created_at
) VALUES (
  'course-demo-001', 
  'Tiếng Trung Cơ Bản - HSK 1',
  'tieng-trung-co-ban-hsk1',
  'Khóa học Tiếng Trung cơ bản dành cho người mới bắt đầu. Học từ vựng, ngữ pháp và giao tiếp cơ bản theo chuẩn HSK 1. Sau khóa học, bạn có thể giao tiếp đơn giản về các chủ đề thường ngày.',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
  0,
  'free',
  true,
  'Tiếng Trung',
  'Cơ bản',
  10,
  5,
  true,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. DEMO LESSONS
-- =====================================================

INSERT INTO lessons (id, course_id, title, description, order_index, video_id, video_duration, is_free, is_published) VALUES
('lesson-001', 'course-demo-001', 'Chào hỏi và giới thiệu', 'Học cách chào hỏi, giới thiệu bản thân và hỏi tên người khác. Cách sử dụng các câu chào phổ biến trong tiếng Trung.', 1, '8jD6mJXkfes', 900, true, true),
('lesson-002', 'course-demo-001', 'Số đếm từ 1-10', 'Học cách đếm số từ 1 đến 10 và cách hỏi giá tiền cơ bản.', 2, '8jD6mJXkfes', 720, true, true),
('lesson-003', 'course-demo-001', 'Gia đình', 'Tên gọi các thành viên trong gia đình: bố, mẹ, anh chị em...', 3, '8jD6mJXkfes', 840, false, true),
('lesson-004', 'course-demo-001', 'Màu sắc', 'Tên các màu sắc cơ bản trong tiếng Trung.', 4, '8jD6mJXkfes', 660, false, true),
('lesson-005', 'course-demo-001', 'Thời gian và ngày tháng', 'Cách hỏi và trả lời về thời gian, ngày, tháng, năm.', 5, '8jD6mJXkfes', 960, false, true),
('lesson-006', 'course-demo-001', 'Địa điểm và phương hướng', 'Học về các địa điểm như nhà cửa, thành phố và cách hỏi đường.', 6, '8jD6mJXkfes', 780, false, true),
('lesson-007', 'course-demo-001', 'Mua sắm và giao dịch', 'Cách hỏi giá, trả giá và mua bán cơ bản.', 7, '8jD6mJXkfes', 900, false, true),
('lesson-008', 'course-demo-001', 'Thức ăn và đồ uống', 'Tên các món ăn, đồ uống phổ biến và cách gọi món.', 8, '8jD6mJXkfes', 840, false, true),
('lesson-009', 'course-demo-001', 'Di chuyển và giao thông', 'Cách hỏi đường, sử dụng phương tiện giao thông.', 9, '8jD6mJXkfes', 720, false, true),
('lesson-010', 'course-demo-001', 'Ôn tập và thực hành', 'Ôn tập tổng hợp các kiến thức đã học và thực hành giao tiếp.', 10, '8jD6mJXkfes', 1200, false, true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. DEMO VOCABULARY (Lesson 1 - Greetings)
-- =====================================================

INSERT INTO vocabulary (id, lesson_id, word, pinyin, meaning, example, example_translation, audio_url) VALUES
('vocab-001-01', 'lesson-001', '你好', 'nǐ hǎo', 'Xin chào', '你好，我叫小明。', 'Xin chào, tôi tên là Tiểu Minh.', NULL),
('vocab-001-02', 'lesson-001', '早上好', 'zǎo shang hǎo', 'Chào buổi sáng', '早上好！', 'Chào buổi sáng!', NULL),
('vocab-001-03', 'lesson-001', '晚上好', 'wǎn shang hǎo', 'Chào buổi tối', '晚上好，你好吗？', 'Chào buổi tối, bạn khỏe không?', NULL),
('vocab-001-04', 'lesson-001', '再见', 'zài jiàn', 'Tạm biệt', '再见，明天见！', 'Tạm biệt, ngày mai gặp!', NULL),
('vocab-001-05', 'lesson-001', '谢谢', 'xiè xie', 'Cảm ơn', '谢谢你！', 'Cảm ơn bạn!', NULL),
('vocab-001-06', 'lesson-001', '不客气', 'bù kè qi', 'Không có gì', '不客气！', 'Không có gì!', NULL),
('vocab-001-07', 'lesson-001', '对不起', 'duì bu qǐ', 'Xin lỗi', '对不起，我来晚了。', 'Xin lỗi, tôi đến muộn.', NULL),
('vocab-001-08', 'lesson-001', '没关系', 'méi guān xi', 'Không sao', '没关系。', 'Không sao.', NULL),
('vocab-001-09', 'lesson-001', '请问', 'qǐng wèn', 'Xin hỏi', '请问，这个多少钱？', 'Xin hỏi, cái này bao nhiêu tiền?', NULL),
('vocab-001-10', 'lesson-001', '我', 'wǒ', 'Tôi', '我是学生。', 'Tôi là sinh viên.', NULL);

-- =====================================================
-- 4. DEMO VOCABULARY (Lesson 2 - Numbers)
-- =====================================================

INSERT INTO vocabulary (id, lesson_id, word, pinyin, meaning, example, example_translation, audio_url) VALUES
('vocab-002-01', 'lesson-002', '一', 'yī', 'Một', '一个', 'Một cái', NULL),
('vocab-002-02', 'lesson-002', '二', 'èr', 'Hai', '二个', 'Hai cái', NULL),
('vocab-002-03', 'lesson-002', '三', 'sān', 'Ba', '三个', 'Ba cái', NULL),
('vocab-002-04', 'lesson-002', '四', 'sì', 'Bốn', '四个', 'Bốn cái', NULL),
('vocab-002-05', 'lesson-002', '五', 'wǔ', 'Năm', '五个', 'Năm cái', NULL),
('vocab-002-06', 'lesson-002', '六', 'liù', 'Sáu', '六个', 'Sáu cái', NULL),
('vocab-002-07', 'lesson-002', '七', 'qī', 'Bảy', '七个', 'Bảy cái', NULL),
('vocab-002-08', 'lesson-002', '八', 'bā', 'Tám', '八个', 'Tám cái', NULL),
('vocab-002-09', 'lesson-002', '九', 'jiǔ', 'Chín', '九个', 'Chín cái', NULL),
('vocab-002-10', 'lesson-002', '十', 'shí', 'Mười', '十个', 'Mười cái', NULL);

-- =====================================================
-- 5. DEMO VOCABULARY (Lesson 3 - Family)
-- =====================================================

INSERT INTO vocabulary (id, lesson_id, word, pinyin, meaning, example, example_translation, audio_url) VALUES
('vocab-003-01', 'lesson-003', '爸爸', 'bà ba', 'Bố', '我爸爸是医生。', 'Bố tôi là bác sĩ.', NULL),
('vocab-003-02', 'lesson-003', '妈妈', 'mā ma', 'Mẹ', '我妈妈是老师。', 'Mẹ tôi là giáo viên.', NULL),
('vocab-003-03', 'lesson-003', '哥哥', 'gē ge', 'Anh trai', '我哥哥在北京工作。', 'Anh trai tôi làm việc ở Bắc Kinh.', NULL),
('vocab-003-04', 'lesson-003', '姐姐', 'jiě jie', 'Chị gái', '我姐姐是大学生。', 'Chị gái tôi là sinh viên đại học.', NULL),
('vocab-003-05', 'lesson-003', '弟弟', 'dì di', 'Em trai', '我弟弟上高中。', 'Em trai tôi học trung học.', NULL),
('vocab-003-06', 'lesson-003', '妹妹', 'mèi mei', 'Em gái', '我妹妹上小学。', 'Em gái tôi học tiểu học.', NULL),
('vocab-003-07', 'lesson-003', '爷爷', 'yé ye', 'Ông nội/bố', '我爷爷七十五岁。', 'Ông tôi 75 tuổi.', NULL),
('vocab-003-08', 'lesson-003', '奶奶', 'nǎi nai', 'Bà nội/mẹ', '我奶奶做饭很好吃。', 'Bà tôi nấu ăn rất ngon.', NULL);

-- =====================================================
-- 6. DEMO GRAMMAR EXERCISES (Lesson 1)
-- =====================================================

INSERT INTO grammar_exercises (id, lesson_id, type, question, question_pinyin, options, correct_answer, explanation, order_index) VALUES
('ex-001-01', 'lesson-001', 'multiple_choice', '"Xin chào" trong tiếng Trung là gì?', 'nǐ hǎo de yì si', '["你好", "再见", "谢谢", "不客气"]', '你好', '"你好" (nǐ hǎo) là cách chào phổ biến nhất trong tiếng Trung, có thể dùng vào bất kỳ thời điểm nào trong ngày.', 1),
('ex-001-02', 'lesson-001', 'multiple_choice', '"Tạm biệt" trong tiếng Trung là gì?', 'zài jiàn de yì si', '["你好", "再见", "谢谢", "对不起"]', '再见', '"再见" (zài jiàn) có nghĩa là "Tạm biệt", dùng khi chia tay ai đó.', 2),
('ex-001-03', 'lesson-001', 'multiple_choice', '"Cảm ơn" trong tiếng Trung là gì?', 'xiè xie de yì si', '["不客气", "对不起", "谢谢", "没关系"]', '谢谢', '"谢谢" (xiè xie) có nghĩa là "Cảm ơn", là từ rất quan trọng trong giao tiếp.', 3),
('ex-001-04', 'lesson-001', 'multiple_choice', '"Xin lỗi" trong tiếng Trung là gì?', 'duì bu qǐ de yì si', '["对不起", "没关系", "谢谢", "请"]', '对不起', '"对不起" (duì bu qǐ) có nghĩa là "Xin lỗi", dùng khi muốn xin lỗi ai đó.', 4),
('ex-001-05', 'lesson-001', 'fill_blank', 'Điền từ còn thiếu: ___ (nǐ hǎo), wǒ jiào Maria.', 'nǐ hǎo', '["你好", "再见", "谢谢"]', '你好', 'Câu đầy đủ: "你好，我叫 Maria" = "Xin chào, tôi tên là Maria"', 5),
('ex-001-06', 'lesson-001', 'multiple_choice', 'Khi ai đó cảm ơn bạn, bạn trả lời là gì?', 'biǎo dá de yì si', '["不客气", "对不起", "谢谢", "请"]', '不客气', '"不客气" (bù kè qi) có nghĩa là "Không có gì" hoặc "Không sao", dùng để trả lời khi ai đó cảm ơn.', 6);

-- =====================================================
-- 7. DEMO GRAMMAR EXERCISES (Lesson 2)
-- =====================================================

INSERT INTO grammar_exercises (id, lesson_id, type, question, question_pinyin, options, correct_answer, explanation, order_index) VALUES
('ex-002-01', 'lesson-002', 'multiple_choice', 'Số "5" trong tiếng Trung là gì?', 'wǔ de yì si', '["三", "四", "五", "六"]', '五', '"五" (wǔ) có nghĩa là 5.', 1),
('ex-002-02', 'lesson-002', 'multiple_choice', 'Số "10" trong tiếng Trung là gì?', 'shí de yì si', '["八", "九", "十", "七"]', '十', '"十" (shí) có nghĩa là 10.', 2),
('ex-002-03', 'lesson-002', 'fill_blank', 'Điền số: ___ (yī) + ___ (sān) = 4', 'yī jiā sān', '["一", "二", "三", "四"]', '一', 'Một + Ba = Bốn: 一 + 三 = 四 (yī + sān = sì)', 3);

-- =====================================================
-- 8. DEMO LESSON RESOURCES
-- =====================================================

INSERT INTO lesson_resources (id, lesson_id, type, title, url, file_size) VALUES
('res-001-01', 'lesson-001', 'pdf', 'Bài giảng - Chào hỏi và giới thiệu', '#', '2.5 MB'),
('res-001-02', 'lesson-001', 'pdf', 'Từ vựng bài 1', '#', '500 KB'),
('res-001-03', 'lesson-002', 'pdf', 'Bài giảng - Số đếm', '#', '1.8 MB'),
('res-001-04', 'lesson-002', 'pdf', 'Bảng số đếm', '#', '300 KB'),
('res-001-05', 'lesson-003', 'pdf', 'Bài giảng - Gia đình', '#', '2.1 MB');

-- =====================================================
-- 9. DEMO USER ENROLLMENT (for testing)
-- =====================================================

-- Note: This will be created when user enrolls in the course
-- INSERT INTO enrollments (id, user_id, course_id, progress, status, enrolled_at)
-- VALUES ('enroll-demo-001', 'USER_ID', 'course-demo-001', 0, 'active', NOW());

-- =====================================================
-- 10. UPDATE COURSE LESSON COUNT
-- =====================================================

UPDATE courses SET total_lessons = 10 WHERE id = 'course-demo-001';

-- =====================================================
-- 11. DEMO COMMENTS/QA
-- =====================================================

-- INSERT INTO post_comments (id, user_id, lesson_id, content, created_at)
-- VALUES ('comment-001', 'USER_ID', 'lesson-001', 'Bài học rất hay! Cảm ơn thầy cô!', NOW());

SELECT 'Demo data created successfully!' as status;
