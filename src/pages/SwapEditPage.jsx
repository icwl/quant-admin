import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import axiosInstance from '../axiosInstance';
import { Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';


const SwapEditPage = () => {
    const { id } = useParams();
    const [data, setData] = useState({
        id: 0,
        market: { 'CE': 'BTCUSDT', 'GT': 'BTC_USDT' },
        threshold: '0.02',
        program: '',
        enable: 0,
        create_time: 0,
        update_time: 0,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        if (!id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.get(`/swap/${id}`);
            setData(response.data.data);
            setLoading(false);
        } catch (error) {
            toast.error('An error occurred.', error);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        if (name.startsWith('market_')) {
            setData({
                ...data, market: {
                    ...data.market,
                    [name.replace('market_', '')]: value
                }
            });
        } else {
            setData({
                ...data,
                [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axiosInstance.put(`/swap`, data);
                toast.info('修改成功');
            } else {
                await axiosInstance.post('/swap', data);
                toast.info('已添加');
            }
            setTimeout(() => {
                navigate('/swaps');
            }, 1000);
        } catch (error) {
            toast.error(error.msg);
        }
    };

    if (loading) { return <LoadingSpinner /> }

    return (
        <>
            <h2>{id ? '修改配置' : '添加配置'}</h2>
            <Form>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}><span className="text-danger">*</span>ID(唯一)</Form.Label>
                    <Col sm={4}>
                        <input type="text" readOnly className="form-control-plaintext" value={data.id || 'auto'} name="id" />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}><span className="text-danger">*</span>coinex</Form.Label>
                    <Col sm={4}>
                        <Form.Control
                            type="text"
                            name="market_CE"
                            value={data.market.CE}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}><span className="text-danger">*</span>gateio</Form.Label>
                    <Col sm={4}>
                        <Form.Control
                            type="text"
                            name="market_GT"
                            value={data.market.GT}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}><span className="text-danger">*</span>搬砖阈值</Form.Label>
                    <Col sm={4}>
                        <Form.Control
                            type="text"
                            name="threshold"
                            value={data.threshold}
                            onChange={handleChange}
                            required
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>搬砖程序</Form.Label>
                    <Col sm={4}>
                        <Form.Control
                            type="text"
                            name="program"
                            value={data.program}
                            onChange={handleChange}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}><span className="text-danger">*</span>启用</Form.Label>
                    <Col sm={4}>
                        <Form.Check
                            type="checkbox"
                            name="enable"
                            checked={data.enable === 1}
                            onChange={handleChange}
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>创建时间</Form.Label>
                    <Col sm={4}>
                        <input type="text" readOnly className="form-control-plaintext"
                            value={moment.unix(data.create_time).format("YYYY-MM-DD HH:mm:ss")} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>更新时间</Form.Label>
                    <Col sm={4}>
                        <input type="text" readOnly className="form-control-plaintext"
                            value={moment.unix(data.update_time).format("YYYY-MM-DD HH:mm:ss")} />
                    </Col>
                </Form.Group>
                <div className="mt-3">
                    <a href="#!" onClick={handleSubmit} className="btn btn-primary" style={{ width: '120px' }}>
                        {id ? '修改' : '添加'}
                    </a>
                    <a href="/swaps" className="btn btn-secondary ms-3" style={{ width: '120px' }}>
                        取消
                    </a>
                </div>
            </Form>
        </>
    );
};

export default SwapEditPage;
