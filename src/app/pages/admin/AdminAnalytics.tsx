import { useState } from 'react';
import { Calendar, TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsData } from '../../data/adminData';

export function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('7days');

  const courseData = [
    { id: 'hsk1', name: 'HSK 1', students: 3456, revenue: 68784000 },
    { id: 'hsk2', name: 'HSK 2', students: 2234, revenue: 55626600 },
    { id: 'business', name: 'Thương mại', students: 1567, revenue: 70385300 },
    { id: 'travel', name: 'Du lịch', students: 4321, revenue: 29814900 },
    { id: 'pronunciation', name: 'Phát âm', students: 2890, revenue: 43079000 }
  ];

  const paymentMethods = [
    { id: 'vnpay', name: 'VNPay', value: 45, color: '#3b82f6' },
    { id: 'momo', name: 'Momo', value: 30, color: '#ec4899' },
    { id: 'zalopay', name: 'ZaloPay', value: 15, color: '#0ea5e9' },
    { id: 'visa', name: 'Visa/Mastercard', value: 10, color: '#6366f1' }
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo Analytics</h1>
          <p className="text-gray-600 mt-1">Phân tích chi tiết dữ liệu kinh doanh</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="90days">90 ngày qua</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-8 w-8" />
            <span className="text-sm font-semibold">+12.5%</span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {analyticsData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}đ
          </div>
          <div className="text-green-100">Tổng doanh thu</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-8 w-8" />
            <span className="text-sm font-semibold">+23.4%</span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {analyticsData.reduce((sum, d) => sum + d.students, 0)}
          </div>
          <div className="text-blue-100">Học viên mới</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="h-8 w-8" />
            <span className="text-sm font-semibold">+18.2%</span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {analyticsData.reduce((sum, d) => sum + d.orders, 0)}
          </div>
          <div className="text-yellow-100">Đơn hàng</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-8 w-8" />
            <span className="text-sm font-semibold">+8.7%</span>
          </div>
          <div className="text-3xl font-bold mb-1">
            {Math.round(
              analyticsData.reduce((sum, d) => sum + d.revenue, 0) /
                analyticsData.reduce((sum, d) => sum + d.orders, 0)
            ).toLocaleString()}
            đ
          </div>
          <div className="text-red-100">Giá trị TB/đơn</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Xu hướng doanh thu</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid key="grid-analytics-line" strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                key="xaxis-analytics-line"
                dataKey="day"
                stroke="#9ca3af"
              />
              <YAxis
                key="yaxis-analytics-line"
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                stroke="#9ca3af"
              />
              <Tooltip
                key="tooltip-analytics-line"
                formatter={(value: number) => [`${value.toLocaleString()}đ`, 'Doanh thu']}
                labelFormatter={(label) => `Ngày ${label}/3`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                key="line-analytics"
                type="monotone"
                dataKey="revenue"
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ fill: '#dc2626', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Phương thức thanh toán
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethods.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Hiệu suất theo khóa học
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData}>
              <CartesianGrid key="grid-course-bar" strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                key="xaxis-course-bar"
                dataKey="id"
                tickFormatter={(value) => {
                  const item = courseData.find(d => d.id === value);
                  return item ? item.name : value;
                }}
                stroke="#9ca3af"
              />
              <YAxis key="yaxis-left-course" yAxisId="left" stroke="#9ca3af" />
              <YAxis
                key="yaxis-right-course"
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                stroke="#9ca3af"
              />
              <Tooltip
                key="tooltip-course-bar"
                labelFormatter={(label) => {
                  const item = courseData.find(d => d.id === label);
                  return item ? item.name : label;
                }}
                formatter={(value: number, name: string) => [
                  name === 'Học viên' ? value : `${value.toLocaleString()}đ`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend key="legend-course-bar" />
              <Bar key="bar-students-course" yAxisId="left" dataKey="students" fill="#3b82f6" name="Học viên" />
              <Bar
                key="bar-revenue-course"
                yAxisId="right"
                dataKey="revenue"
                fill="#f59e0b"
                name="Doanh thu"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Courses Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Top khóa học bán chạy</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Doanh thu
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Tăng trưởng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courseData.map((course, index) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="text-2xl font-bold text-gray-300">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{course.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{course.students.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {course.revenue.toLocaleString()}đ
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-semibold">
                      +{Math.floor(Math.random() * 30 + 10)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}