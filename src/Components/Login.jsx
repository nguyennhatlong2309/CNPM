// src/components/LoginScreen.jsx
import React, { useState } from 'react';
import styles from './Login.module.css'; // ⭐️ Import CSS Modules ⭐️
import { useNavigate } from 'react-router-dom'; 
import bus from './Bus.png'; // <-- thêm import ảnh


const LoginScreen = () => {
    // Logic State và Mock API giữ nguyên như cũ
     const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState('');           
    const logoSrc = bus;

    // Hàm giả lập API (giữ nguyên)
    const mockLoginApi = (user, pass) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (user === 'test' && pass === '123456') {
                    resolve({ success: true });
                } else {
                    reject({ message: 'Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại.' });
                }
            }, 2000); 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(''); 

        try {
            await mockLoginApi(username, password);
           navigate('/home'); // chuyển hướng
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra.');
        } finally {
            setIsLoading(false); 
        }
    };
    
    return (
        <div className={styles.container}> 
            {/* PHẦN ĐẦU - LOGO VÀ TIÊU ĐỀ */}
            <header className={styles.header}>
                <img 
                    src={logoSrc} 
                    alt="School Bus Logo" 
                    className={styles.logo}
                />
                <p className={styles.trackingText}>NNSLN Tracking schoolbus</p>
                <h1 className={styles.welcomeTitle}>welcome!!</h1>
            </header>

            {/* HIỂN THỊ THÔNG BÁO LỖI */}
            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}

            {/* PHẦN FORM ĐĂNG NHẬP */}
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                    className={styles.inputField}
                />
                
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className={styles.inputField}
                />
                
                {/* ⭐️ Nút Đăng nhập: Áp dụng style loading nếu cần ⭐️ */}
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className={`${styles.loginButton} ${isLoading ? styles.loading : ''}`}
                >
                    {isLoading ? 'Đang xử lý...' : 'Log In'}
                </button>
            </form>

            {/* PHẦN LIÊN KẾT PHỤ */}
            <div className={styles.linkSection}>
                <a href="#" className={styles.actionLink}>Forgot Password?</a>
                <a href="#" className={styles.actionLink}>Don't have an Account?</a>
            </div>

            {/* PHẦN FOOTER */}
            <footer className={styles.footer}>
                <p>https://www.NNSLN.com</p>
            </footer>
        </div>
    );
};

export default LoginScreen;