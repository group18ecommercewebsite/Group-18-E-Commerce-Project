import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { MdLocalOffer } from 'react-icons/md';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../api/couponApi';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        usageLimit: '',
        startDate: '',
        endDate: '',
        isActive: true
    });

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const response = await getAllCoupons();
            if (response.success) {
                setCoupons(response.data);
            }
        } catch (error) {
            showMessage('error', 'Không thể tải danh sách mã giảm giá');
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingCoupon(null);
        setFormData({
            code: '',
            description: '',
            discountType: 'percentage',
            discountValue: '',
            minOrderAmount: '',
            maxDiscountAmount: '',
            usageLimit: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            isActive: true
        });
        setShowModal(true);
    };

    const openEditModal = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description || '',
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minOrderAmount: coupon.minOrderAmount || '',
            maxDiscountAmount: coupon.maxDiscountAmount || '',
            usageLimit: coupon.usageLimit || '',
            startDate: coupon.startDate?.split('T')[0] || '',
            endDate: coupon.endDate?.split('T')[0] || '',
            isActive: coupon.isActive
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.code || !formData.discountValue || !formData.endDate) {
            showMessage('error', 'Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            setSaving(true);
            const data = {
                ...formData,
                discountValue: Number(formData.discountValue),
                minOrderAmount: Number(formData.minOrderAmount) || 0,
                maxDiscountAmount: Number(formData.maxDiscountAmount) || 0,
                usageLimit: Number(formData.usageLimit) || 0
            };

            let response;
            if (editingCoupon) {
                response = await updateCoupon(editingCoupon._id, data);
            } else {
                response = await createCoupon(data);
            }

            if (response.success) {
                showMessage('success', response.message);
                setShowModal(false);
                fetchCoupons();
            } else {
                showMessage('error', response.message);
            }
        } catch (error) {
            showMessage('error', error.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (couponId) => {
        if (!window.confirm('Bạn có chắc muốn xóa mã giảm giá này?')) return;

        try {
            const response = await deleteCoupon(couponId);
            if (response.success) {
                showMessage('success', 'Đã xóa mã giảm giá');
                fetchCoupons();
            }
        } catch (error) {
            showMessage('error', 'Không thể xóa mã giảm giá');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value) + '₫';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Message Toast */}
            {message.text && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
                    message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {message.text}
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <MdLocalOffer className="text-2xl text-purple-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý mã giảm giá</h1>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    <FaPlus /> Thêm mã mới
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mã</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mô tả</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Giảm giá</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Đơn tối thiểu</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Đã dùng</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hiệu lực</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {coupons.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-4 py-10 text-center text-gray-500">
                                    Chưa có mã giảm giá nào
                                </td>
                            </tr>
                        ) : (
                            coupons.map((coupon) => (
                                <tr key={coupon._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <span className="font-mono font-bold text-purple-600">{coupon.code}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{coupon.description || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                                            {coupon.discountType === 'percentage' 
                                                ? `${coupon.discountValue}%` 
                                                : formatCurrency(coupon.discountValue)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {coupon.minOrderAmount > 0 ? formatCurrency(coupon.minOrderAmount) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {coupon.usedCount} / {coupon.usageLimit > 0 ? coupon.usageLimit : '∞'}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            coupon.isActive && new Date(coupon.endDate) > new Date()
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {coupon.isActive && new Date(coupon.endDate) > new Date() ? 'Đang hoạt động' : 'Hết hạn/Tắt'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(coupon)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingCoupon ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá mới'}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Mã coupon *</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                                    placeholder="VD: SALE20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Mô tả</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                                    placeholder="Giảm 20% cho đơn từ 500k"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Loại giảm giá *</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="percentage">Phần trăm (%)</option>
                                        <option value="fixed">Số tiền cố định (VND)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Giá trị * {formData.discountType === 'percentage' ? '(%)' : '(VND)'}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                                        placeholder={formData.discountType === 'percentage' ? '20' : '50000'}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Đơn tối thiểu (VND)</label>
                                    <input
                                        type="number"
                                        value={formData.minOrderAmount}
                                        onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                                        placeholder="500000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Giảm tối đa (VND)</label>
                                    <input
                                        type="number"
                                        value={formData.maxDiscountAmount}
                                        onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                                        placeholder="Chỉ cho loại %"
                                        disabled={formData.discountType !== 'percentage'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Số lượt sử dụng (0 = vô hạn)</label>
                                <input
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                                    placeholder="100"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ngày bắt đầu *</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ngày kết thúc *</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="isActive" className="text-sm">Kích hoạt ngay</label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300"
                            >
                                {saving ? 'Đang lưu...' : 'Lưu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
