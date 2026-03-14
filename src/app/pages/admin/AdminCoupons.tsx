import { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Tag } from 'lucide-react';
import { coupons } from '../../data/adminData';

export function AdminCoupons() {
  const [showModal, setShowModal] = useState(false);

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Đã copy mã: ${code}`);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mã giảm giá & Affiliate</h1>
          <p className="text-gray-600 mt-1">Quản lý các chương trình khuyến mãi</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="h-5 w-5" />
          Tạo mã mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Tổng mã giảm giá</div>
          <div className="text-2xl font-bold text-gray-900">{coupons.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Đang hoạt động</div>
          <div className="text-2xl font-bold text-green-600">
            {coupons.filter((c) => c.isActive).length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Tổng lượt sử dụng</div>
          <div className="text-2xl font-bold text-blue-600">
            {coupons.reduce((sum, c) => sum + c.usageCount, 0)}
          </div>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden ${
              !coupon.isActive ? 'opacity-60' : ''
            }`}
          >
            <div className="bg-gradient-to-r from-red-600 to-yellow-500 p-4">
              <div className="flex items-center justify-between mb-2">
                <Tag className="h-6 w-6 text-white" />
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${ coupon.isActive
                      ? 'bg-green-600 text-white border-white/30'
                      : 'bg-gray-700 text-white border-gray-500'
                  }`}
                >
                  {coupon.isActive ? 'Hoạt động' : 'Hết hạn'}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{coupon.code}</div>
              <div className="text-white text-sm">
                Giảm {coupon.discount}
                {coupon.type === 'percent' ? '%' : 'đ'}
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đã dùng:</span>
                  <span className="font-semibold text-gray-900">
                    {coupon.usageCount}/{coupon.usageLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-600 to-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${(coupon.usageCount / coupon.usageLimit) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hết hạn:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(coupon.expiryDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyCouponCode(coupon.code)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </button>
                <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Affiliate Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chương trình Affiliate</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 mb-2">15%</div>
            <div className="text-gray-600">Hoa hồng mỗi đơn</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 mb-2">24</div>
            <div className="text-gray-600">Đối tác liên kết</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 mb-2">126</div>
            <div className="text-gray-600">Đơn hàng qua affiliate</div>
          </div>
        </div>
      </div>

      {/* Create Modal (simplified) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tạo mã giảm giá mới</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Mã giảm giá (VD: SUMMER2026)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Phần trăm (%)</option>
                <option>Số tiền cố định (đ)</option>
              </select>
              <input
                type="number"
                placeholder="Giá trị giảm"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Giới hạn sử dụng"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg hover:opacity-90">
                Tạo mã
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}