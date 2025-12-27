import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../api/userApi';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Kiểm tra authentication từ localStorage khi app khởi động
        const token = localStorage.getItem('admin_token');
        const userData = localStorage.getItem('admin_user');
        
        if (token && userData) {
            const parsedUser = JSON.parse(userData);
            // Kiểm tra role là ADMIN
            if (parsedUser.role === 'ADMIN') {
                setIsAuthenticated(true);
                setUser(parsedUser);
            } else {
                // Nếu không phải admin thì clear
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Gọi API login thực tế
            const response = await loginUser({ email, password });
            
            if (response.success) {
                // Server trả về data.user chứa thông tin user
                const userData = response.data?.user || response.data;
                const token = response.data?.accessToken || response.token || 'token_' + Date.now();
                
                console.log('Login response:', response);
                console.log('User data:', userData);
                console.log('User role:', userData?.role);
                
                // Kiểm tra role phải là ADMIN
                if (userData?.role !== 'ADMIN') {
                    return { 
                        success: false, 
                        error: 'Bạn không có quyền truy cập trang Admin. Chỉ tài khoản ADMIN mới được phép đăng nhập.' 
                    };
                }

                localStorage.setItem('admin_token', token);
                localStorage.setItem('admin_user', JSON.stringify(userData));
                setIsAuthenticated(true);
                setUser(userData);
                
                return { success: true, user: userData };
            } else {
                return { success: false, error: response.message || 'Đăng nhập thất bại' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.response?.data?.message || error.message || 'Đăng nhập thất bại' };
        }
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
