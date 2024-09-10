import axios from 'axios';
import config from './config';


// 创建 axios 实例
const axiosInstance = axios.create({
    baseURL: config.BASE_URL, // 替换为你的 API 基本 URL
    headers: {
        'Content-Type': 'application/json',
    }
});

// 请求拦截器
axiosInstance.interceptors.request.use(
    (config) => {
        // 可以在这里添加认证令牌或其他配置
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // 请求错误时处理
        return Promise.reject(error);
    }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 响应错误时处理
        if (error.response) {
            // 服务器返回了状态码不在 2xx 范围内
            console.error('Error response:', error.response);
            switch (error.response.status) {
                case 401:
                    // 未授权错误处理，例如跳转到登录页
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('username');
                    window.location.href = '/login';
                    break;
                case 403:
                    // 禁止访问错误处理
                    alert('You do not have permission to access this resource.');
                    break;
                case 404:
                    // 找不到资源错误处理
                    alert('Resource not found.');
                    break;
                default:
                    break;
            }
        } else if (error.request) {
            // 请求未收到响应时处理
            console.error('Error request:', error.request);
            alert('Network error. Please try again later.');
        } else {
            // 设置请求时发生错误
            console.error('Error message:', error.message);
            alert('Error: ' + error.message);
        }
        if (error.response && error.response.data) {
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
