import { supabase } from '../../lib/supabase';

export interface PaymentRequest {
  courseId: string;
  amountVnd: number;
  paymentMethod: 'bank_transfer' | 'momo';
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  course_id: string;
  amount_vnd: number;
  payment_method: string;
  status: string;
  transaction_id: string;
  created_at: string;
}

export const BANK_INFO = {
  bankName: 'Vietcombank',
  accountNumber: '1234567890',
  accountName: 'CONG TY HOA NGU',
  branch: 'Chi nhánh TP.HCM',
  qrCode: '',
};

export const MOMO_INFO = {
  phoneNumber: '0123456789',
  accountName: 'CONG TY HOA NGU',
};

export async function createPayment(
  courseId: string,
  amountVnd: number,
  paymentMethod: 'bank_transfer' | 'momo'
): Promise<PaymentRecord> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Vui lòng đăng nhập để thanh toán');

  const transactionId = `HN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: user.id,
      course_id: courseId,
      amount_vnd: amountVnd,
      payment_method: paymentMethod,
      status: 'pending',
      transaction_id: transactionId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPaymentStatus(paymentId: string): Promise<PaymentRecord> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (error) throw error;
  return data;
}

export async function verifyPayment(
  transactionId: string,
  status: 'completed' | 'failed'
): Promise<void> {
  const { error } = await supabase
    .from('payments')
    .update({
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    })
    .eq('transaction_id', transactionId);

  if (error) throw error;

  if (status === 'completed') {
    const { data: payment } = await supabase
      .from('payments')
      .select('user_id, course_id')
      .eq('transaction_id', transactionId)
      .single();

    if (payment) {
      await supabase.from('enrollments').insert({
        user_id: payment.user_id,
        course_id: payment.course_id,
        status: 'active',
      });

      await supabase
        .from('courses')
        .update({ students_enrolled: supabase.raw('students_enrolled + 1') })
        .eq('id', payment.course_id);
    }
  }
}
