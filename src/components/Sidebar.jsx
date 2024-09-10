import React from 'react';
import { Link } from 'react-router-dom';


const Sidebar = () => (
    <aside className="sidebar bg-body float-start shadow-sm">
        <nav className="d-flex flex-column flex-shrink-0 py-3">
            <ul className="nav nav-pills flex-column m-auto">
                <li><Link className="nav-link" to="/swaps">搬砖配置</Link></li>
                <li><Link className="nav-link" to="/deposit-withdrawal-settings">自动充提</Link></li>
                <li><Link className="nav-link" to="/error-management">异常报警</Link></li>
                <li className="border-top my-4 border-opacity-10"></li>
                <li><Link className="nav-link" to="/user">个人信息</Link></li>
                <li><Link className="nav-link" to="/update-password">修改密码</Link></li>
                <li><Link className="nav-link" to="/update-totp">谷歌验证</Link></li>
            </ul>
        </nav>
    </aside>
);

export default Sidebar;
