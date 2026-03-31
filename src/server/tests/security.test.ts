import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  test('should return 401 without authorization header', () => {
    const { authenticate } = require('../middleware/security');
    
    authenticate(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: 'Không có token xác thực',
    });
  });

  test('should return 401 with invalid token format', () => {
    mockRequest.headers = { authorization: 'InvalidFormat token' };
    const { authenticate } = require('../middleware/security');
    
    authenticate(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });

  test('should set userId with valid token', () => {
    const token = jwt.sign({ userId: '123', role: 'student' }, JWT_SECRET, { expiresIn: '7d' });
    mockRequest.headers = { authorization: `Bearer ${token}` };
    
    const { authenticate } = require('../middleware/security');
    authenticate(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockRequest.userId).toBe('123');
    expect(nextFunction).toHaveBeenCalled();
  });

  test('should return 401 with expired token', () => {
    const token = jwt.sign({ userId: '123', role: 'student' }, JWT_SECRET, { expiresIn: '-1s' });
    mockRequest.headers = { authorization: `Bearer ${token}` };
    
    const { authenticate } = require('../middleware/security');
    authenticate(mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });
});

describe('Rate Limiter', () => {
  test('apiLimiter should be defined', () => {
    const { apiLimiter } = require('../middleware/security');
    expect(apiLimiter).toBeDefined();
    expect(apiLimiter.windowMs).toBe(60000);
    expect(apiLimiter.max).toBe(200);
  });

  test('loginLimiter should have strict limits', () => {
    const { loginLimiter } = require('../middleware/security');
    expect(loginLimiter).toBeDefined();
    expect(loginLimiter.max).toBe(5);
  });
});
