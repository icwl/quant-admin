import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';
import { Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';


function UpdatePasswordPage() {
    const username = localStorage.getItem('username');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [totp, setTOTP] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username) {
            toast.error('请输入用户名!');
            return;
        }

        // 密码验证正则表达式
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{16,32}$/;
        if (!passwordRegex.test(password)) {
            toast.error('原密码格式不正确!');
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            toast.error('新密码格式不正确!');
            return;
        }

        // 谷歌验证正则表达式
        const totpRegex = /^[\d]{6}$/;
        if (!totpRegex.test(totp)) {
            toast.error('谷歌验证不合法!');
            return;
        }

        try {
            await axiosInstance.put('/update-password', {
                username: username,
                password: password,
                new_password: newPassword,
                otp: parseInt(totp, 10),
            });
            toast.info('修改密码成功');
        } catch (error) {
            toast.error('An error occurred.', error);
        }
    };


    return (
        <>
            <h2>修改密码</h2>
            <Form>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}><span className="text-danger">*</span>账号:</Form.Label>
                    <Col sm={4}>
                        <input type="text" readOnly className="form-control-plaintext" value={username} name="username" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}><span className="text-danger">*</span>原密码:</Form.Label>
                    <Col sm={4} className="position-relative">
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="请输入原密码"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <i
                            className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute top-50 end-0 translate-middle-y px-4`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}><span className="text-danger">*</span>新密码:</Form.Label>
                    <Col sm={4} className="position-relative">
                        <Form.Control
                            type={showNewPassword ? 'text' : 'password'}
                            name="new_password"
                            placeholder="请输入新密码"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <i
                            className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute top-50 end-0 translate-middle-y px-4`}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        ></i>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}><span className="text-danger">*</span>谷歌验证码:</Form.Label>
                    <Col sm={4}>
                        <Form.Control
                            type="text"
                            name="totp"
                            placeholder="谷歌验证"
                            value={totp}
                            onChange={(e) => setTOTP(e.target.value)}
                            required
                        />
                    </Col>
                </Form.Group>
                <div className="mt-3">
                    <a href="#!" onClick={handleSubmit} className="btn btn-primary" style={{ width: '120px' }}>
                        修改
                    </a>
                    <a href="/" className="btn btn-secondary ms-3" style={{ width: '120px' }}>
                        取消
                    </a>
                </div>
            </Form >
        </>
    );
}

export default UpdatePasswordPage;
