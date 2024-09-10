import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import axiosInstance from '../axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';


function SwapListPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/swaps');
            setData(response.data.data);
            setLoading(false);
        } catch (error) {
            toast.error('An error occurred.', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(`确定删除搬砖配置 : ${id}?`);
        if (confirmed) {
            try {
                await axiosInstance.delete(`/swap/${id}`);
                toast.info('已删除配置');
                fetchData();
            } catch (error) {
                toast.error("An error occurred.", error);
            }
        }
    };

    if (loading) { return <LoadingSpinner /> }

    return (
        <>
            <div className="px-3 pt-3">
                <a href="/swap/add" className="btn btn-primary rounded-0 float-start" style={{ width: '120px' }}>
                    <i className="bi bi-plus-lg"></i>
                    <span>新增</span>
                </a>
                <a href="#!" onClick={fetchData} className="btn btn-success rounded-0 float-end" style={{ width: '120px' }}>
                    <i className="bi bi-arrow-clockwise"></i>
                    <span>刷新</span>
                </a>
            </div>

            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th width="3%">ID(唯一)</th>
                                <th width="5%">coinex.com</th>
                                <th width="5%">gateio.ws</th>
                                <th width="3%">阈值</th>
                                <th width="3%">服务</th>
                                <th width="10%">创建时间</th>
                                <th width="10%">更改时间</th>
                                <th width="3%">状态</th>
                                <th width="5%">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.list.map(i => (
                                <tr key={i.id}>
                                    <td>{i.id}</td>
                                    <td>{i.market.CE}</td>
                                    <td>{i.market.GT}</td>
                                    <td>{i.threshold}</td>
                                    <td>{i.program}</td>
                                    <td>{moment.unix(i.create_time).format("YYYY-MM-DD HH:mm:ss")}</td>
                                    <td>{moment.unix(i.update_time).format("YYYY-MM-DD HH:mm:ss")}</td>
                                    <td className="td-status">
                                        <span className={i.enable ? 'text-success' : 'text-secondary'}>{i.enable ? "已启用" : "已停用"}</span>
                                    </td>

                                    <td>
                                        <div className="btn-group d-flex justify-content-evenly">
                                            <a href={`/swap/edit/${i.id}`} title="编辑">
                                                <i className="bi bi-pencil-square"></i>
                                            </a>
                                            <a href="#!" onClick={() => handleDelete(i.id)} title="删除">
                                                <i className="bi bi-trash"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default SwapListPage;
