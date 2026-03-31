import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ').max(255),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),
  full_name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100).trim(),
});

export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token không được để trống'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirm_password'],
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Mật khẩu hiện tại không được để trống'),
  new_password: z
    .string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),
});

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự').max(500).trim(),
  description: z.string().max(5000).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  category: z.string().max(100).optional(),
  price_vnd: z.number().int().min(0).optional(),
  is_free_for_all: z.boolean().optional(),
  has_certificate: z.boolean().optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

export const createLessonSchema = z.object({
  course_id: z.string().uuid('ID khóa học không hợp lệ'),
  title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự').max(500).trim(),
  description: z.string().max(2000).optional(),
  order_index: z.number().int().positive('Thứ tự phải là số nguyên dương'),
  video_url: z.string().url('URL video không hợp lệ').optional(),
  is_free: z.boolean().optional(),
});

export const updateLessonSchema = createLessonSchema.partial();

export const enrollSchema = z.object({
  course_id: z.string().uuid('ID khóa học không hợp lệ'),
});

export const updateLessonProgressSchema = z.object({
  lesson_id: z.string().uuid('ID bài học không hợp lệ'),
  is_completed: z.boolean().optional(),
  watched_seconds: z.number().int().min(0).optional(),
});

export const createPostSchema = z.object({
  content: z.string().min(1, 'Nội dung không được để trống').max(5000),
  type: z.enum(['post', 'question', 'announcement']).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export const updatePostSchema = z.object({
  content: z.string().min(1).max(5000).optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Nội dung bình luận không được để trống').max(2000),
});

export const createStudyGroupSchema = z.object({
  name: z.string().min(3, 'Tên nhóm phải có ít nhất 3 ký tự').max(255).trim(),
  description: z.string().max(2000).optional(),
  is_public: z.boolean().optional(),
  max_members: z.number().int().min(5).max(100).optional(),
});

export const updateStudyGroupSchema = createStudyGroupSchema.partial();

export const addFriendSchema = z.object({
  friend_id: z.string().uuid('ID người dùng không hợp lệ'),
});

export const createShopItemSchema = z.object({
  name: z.string().min(2).max(255).trim(),
  description: z.string().max(2000).optional(),
  type: z.enum(['avatar', 'theme', 'powerup', 'badge', 'cosmetic']),
  price: z.number().int().min(0),
  image_url: z.string().url().optional(),
});

export const purchaseItemSchema = z.object({
  item_id: z.string().uuid('ID sản phẩm không hợp lệ'),
});

export const submitQuizSchema = z.object({
  exercise_id: z.string().uuid('ID bài tập không hợp lệ'),
  user_answer: z.string().min(1, 'Câu trả lời không được để trống'),
});

export const updateSettingsSchema = z.object({
  language: z.string().min(2).max(10).optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  notification_enabled: z.boolean().optional(),
  daily_study_time: z.number().int().min(5).max(300).optional(),
  study_days_per_week: z.number().int().min(1).max(7).optional(),
});

export const updateProfileSchema = z.object({
  full_name: z.string().min(2).max(100).trim().optional(),
  avatar_url: z.string().url().optional(),
  mshv: z.string().max(50).optional(),
});

export const createPaymentSchema = z.object({
  course_id: z.string().uuid('ID khóa học không hợp lệ'),
  payment_method: z.enum(['vnpay', 'momo', 'bank_transfer', 'credit_card']).optional(),
  coupon_code: z.string().max(50).optional(),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid('ID không hợp lệ'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
