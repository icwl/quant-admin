import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { ToastContainer, toast } from 'react-toastify';


function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [totp, setTOTP] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username) {
            toast.error('请输入用户名!');
            return;
        }

        // 密码验证正则表达式
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,32}$/;
        if (!passwordRegex.test(password)) {
            toast.error('密码格式不正确!');
            return;
        }

        // 谷歌验证正则表达式
        const totpRegex = /^[\d]{6}$/;
        if (!totpRegex.test(totp)) {
            toast.error('谷歌验证不合法!');
            return;
        }

        try {
            const response = await axios.post(`${config.BASE_URL}/login`, {
                username: username,
                password: password,
                otp: parseInt(totp, 10),
            });

            if (response.status === 200) {
                const token = response.data.data.token;
                localStorage.setItem('authToken', token);
                localStorage.setItem('username', username);
                const from = location.state?.from?.pathname || '/';
                navigate(from);
            } else {
                toast.error('登录失败 ' + response.status);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error('登录失败: ' + error.response.data.msg);
            } else {
                toast.error('An error occurred while trying to login.');
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="bg-body p-5" style={{ "minWidth": "500px" }}>
                <h3 className="mb-3 text-center">量化交易管理系统</h3>
                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control ps-5 z-2"
                            id="username"
                            placeholder="请输入账号"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <i className="bi bi-person-fill position-absolute top-50 translate-middle-y px-3 z-3"></i>
                    </div>

                    <div className="input-group mb-3">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-control ps-5 z-2"
                            id="password"
                            placeholder="请输入密码"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <i className="bi bi-lock-fill position-absolute top-50 translate-middle-y px-3 z-3"></i>
                        <i
                            className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute top-50 end-0 translate-middle-y px-3 z-3`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>

                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control ps-5 z-2"
                            id="totp"
                            placeholder="谷歌验证"
                            value={totp}
                            onChange={(e) => setTOTP(e.target.value)}
                            required
                        />
                        <i className="bi bi-google position-absolute top-50 translate-middle-y px-3 z-3"></i>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2">立即登录</button>
                </form>
            </div>
            <ToastContainer position="top-center" />
        </div >
    );
}

export default LoginPage;
