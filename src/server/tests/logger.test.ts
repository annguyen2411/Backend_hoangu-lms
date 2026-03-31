import logger, { logError, logInfo } from '../utils/logger';

describe('Logger Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('logger should be defined', () => {
    expect(logger).toBeDefined();
  });

  test('logInfo should log info messages', () => {
    const infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => logger);
    
    logInfo('Test message', { key: 'value' });
    
    expect(infoSpy).toHaveBeenCalled();
  });

  test('logError should log error messages', () => {
    const errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => logger);
    
    logError('Test error', { key: 'value' });
    
    expect(errorSpy).toHaveBeenCalled();
  });
});

describe('Logger Formats', () => {
  test('should handle different log levels', () => {
    expect(() => logger.info('info')).not.toThrow();
    expect(() => logger.warn('warn')).not.toThrow();
    expect(() => logger.error('error')).not.toThrow();
  });
});
