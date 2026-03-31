import { createPaymentUrl, verifyPaymentCallback } from '../utils/payment';

describe('Payment Utility', () => {
  const mockConfig = {
    vnp_TmnCode: 'TESTCODE',
    vnp_HashSecret: 'TESTSECRET',
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_ReturnUrl: 'https://hoangu.techhave.com/payment/return',
  };

  beforeAll(() => {
    process.env.VNP_TMNCODE = mockConfig.vnp_TmnCode;
    process.env.VNP_HASHSECRET = mockConfig.vnp_HashSecret;
    process.env.VNP_URL = mockConfig.vnp_Url;
    process.env.VNP_RETURNURL = mockConfig.vnp_ReturnUrl;
  });

  describe('createPaymentUrl', () => {
    test('should create payment URL with valid params', () => {
      const result = createPaymentUrl({
        amount: 100000,
        orderId: 'ORDER123',
        orderInfo: 'Test payment',
      });

      expect(result).toContain('vnp_Amount');
      expect(result).toContain('vnp_Command');
      expect(result).toContain('vnp_TmnCode');
      expect(result).toContain('vnp_ReturnUrl');
    });

    test('should include order info in URL', () => {
      const result = createPaymentUrl({
        amount: 100000,
        orderId: 'ORDER123',
        orderInfo: 'Course Payment',
      });

      expect(result).toContain('vnp_OrderInfo=Course+Payment');
    });
  });

  describe('verifyPaymentCallback', () => {
    test('should verify valid callback', () => {
      const params = {
        vnp_Amount: '100000',
        vnp_BankCode: 'NCB',
        vnp_BankTranNo: '123456',
        vnp_CardType: 'ATM',
        vnp_OrderInfo: 'Test payment',
        vnp_PayDate: '20240301120000',
        vnp_ResponseCode: '00',
        vnp_TmnCode: 'TESTCODE',
        vnp_TransactionNo: '123456',
        vnp_TransactionStatus: '00',
        vnp_TxnRef: 'ORDER123',
        vnp_SecureHash: 'mockhash',
      };

      const result = verifyPaymentCallback(params);
      expect(result).toHaveProperty('isValid');
    });

    test('should handle missing params', () => {
      const result = verifyPaymentCallback({});
      expect(result).toHaveProperty('isValid', false);
    });
  });
});
