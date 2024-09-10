import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../config';
import axiosInstance from '../axiosInstance';
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';


const Header = () => {
    const [user, setUser] = useState({
        username: '',
        nickname: '',
        avatar_url: 'static/images/avatar-default.jpg'
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        navigate('/login');
    };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/user`);
                setUser(response.data.data);
                setLoading(false);
            } catch (error) {
                toast.error('An error occurred.', error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div className="logo bg-body shadow-sm d-flex">
                <a href="/" className="nav-link m-auto">
                    <i className="bi bi-piggy-bank fs-2 align-middle"></i>
                    <span className="fs-4 align-middle">管理后台</span>
                </a>
            </div>
            <header className="bg-body shadow-sm d-flex">
                <div className="navbar">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-justify fs-3"></i>
                        <i className="bi bi-dash"></i>
                        <span>{location.pathname}</span>
                    </div>
                </div>

                {!loading && <div className="navbar ms-md-auto" style={{ "paddingRight": "6rem" }}>
                    <Dropdown>
                        <Dropdown.Toggle as="a" href="#" id="dropdown-userinfo">
                            <img src={`${config.BASE_URL}/${user.avatar_url}`} alt="" width="32" height="32"
                                className="rounded-circle mx-1" />
                            <span>{user.nickname}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="/user">个人信息</Dropdown.Item>
                            <Dropdown.Item href="/update-password">修改密码</Dropdown.Item>
                            <Dropdown.Divider></Dropdown.Divider>
                            <Dropdown.Item href="#!" onClick={handleLogout}>退出登录</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>}

            </header >
        </>
    );
};

export default Header;
