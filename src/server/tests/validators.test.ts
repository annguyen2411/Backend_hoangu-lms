import { Request, Response, NextFunction } from 'express';
import { validate } from '../validators';
import { registerSchema, loginSchema, forgotPasswordSchema, createCourseSchema } from '../validators/zod-schemas';

describe('Zod Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = { body: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  test('should pass validation with valid data', () => {
    mockRequest.body = { email: 'test@example.com', password: 'Password123', full_name: 'Test User' };

    const middleware = validate(registerSchema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  test('should return 400 with invalid email', () => {
    mockRequest.body = { email: 'invalid-email', password: 'Password123', full_name: 'Test User' };

    const middleware = validate(registerSchema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.stringContaining('Email'),
      })
    );
  });

  test('should return 400 with weak password', () => {
    mockRequest.body = { email: 'test@example.com', password: '123', full_name: 'Test User' };

    const middleware = validate(registerSchema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
});

describe('Zod Auth Schemas', () => {
  test('registerSchema should validate email format', () => {
    const result = registerSchema.safeParse({
      email: 'invalid-email',
      password: 'Password123',
      full_name: 'Test User',
    });
    expect(result.success).toBe(false);
  });

  test('registerSchema should require uppercase, lowercase, and number in password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password',
      full_name: 'Test User',
    });
    expect(result.success).toBe(false);
  });

  test('registerSchema should accept valid data', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'Password123',
      full_name: 'Test User',
    });
    expect(result.success).toBe(true);
  });

  test('loginSchema should validate email and password', () => {
    const valid = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(valid.success).toBe(true);

    const invalidEmail = loginSchema.safeParse({
      email: 'invalid',
      password: 'password123',
    });
    expect(invalidEmail.success).toBe(false);
  });

  test('forgotPasswordSchema should validate email', () => {
    const valid = forgotPasswordSchema.safeParse({ email: 'test@example.com' });
    expect(valid.success).toBe(true);

    const invalid = forgotPasswordSchema.safeParse({ email: 'invalid' });
    expect(invalid.success).toBe(false);
  });
});

describe('Zod Course Schemas', () => {
  test('createCourseSchema should validate required fields', () => {
    const valid = createCourseSchema.safeParse({
      title: 'Test Course',
      description: 'Description',
      level: 'beginner',
    });
    expect(valid.success).toBe(true);
  });

  test('createCourseSchema should reject short title', () => {
    const result = createCourseSchema.safeParse({
      title: 'AB',
    });
    expect(result.success).toBe(false);
  });

  test('createCourseSchema should validate level enum', () => {
    const valid = createCourseSchema.safeParse({
      title: 'Test Course',
      level: 'intermediate',
    });
    expect(valid.success).toBe(true);

    const invalid = createCourseSchema.safeParse({
      title: 'Test Course',
      level: 'invalid',
    });
    expect(invalid.success).toBe(false);
  });
});
