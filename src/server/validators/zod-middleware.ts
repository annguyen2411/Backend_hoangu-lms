import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        return res.status(400).json({
          success: false,
          error: firstError.message,
          field: firstError.path.join('.'),
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Validation error',
      });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        return res.status(400).json({
          success: false,
          error: firstError.message,
          field: firstError.path.join('.'),
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Validation error',
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        return res.status(400).json({
          success: false,
          error: firstError.message,
          field: firstError.path.join('.'),
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Validation error',
      });
    }
  };
};
