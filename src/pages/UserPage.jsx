import React, { useEffect, useState, useRef } from 'react';
import config from '../config';
import axiosInstance from '../axiosInstance';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Container, Row, Col, Image, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';


const UserPage = () => {
    const [data, setData] = useState({
        username: '',
        nickname: '',
        avatar_url: 'static/images/avatar-default.jpg'
    });
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState(null);  // 打开的原始图片
    const [croppedImage, setCroppedImage] = useState(null);  // 裁剪后的图片
    const [croppedImageURL, setCroppedImageURL] = useState(null);
    const cropperRef = useRef(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/user`);
                setData(response.data.data);
                setLoading(false);
            } catch (error) {
                toast.error('An error occurred.', error);
            }
        };
        fetchData();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setShowModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            // 获取裁剪后的图像数据
            cropper.getCroppedCanvas({
                width: 300, // 设置裁剪后的宽度
                height: 300, // 设置裁剪后的高度
            }).toBlob((blob) => {
                // 创建文件对象
                const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
                setCroppedImage(file);
            }, 'image/jpeg');
            setCroppedImageURL(cropper.getCroppedCanvas().toDataURL('image/png'));
            setShowModal(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpdateNick = async (e) => {
        e.preventDefault();

        // 密码验证正则表达式
        const nickRegex = /^[a-zA-Z0-9\p{Script=Han}]{2,18}$/u;
        if (!nickRegex.test(data.nickname)) {
            toast.error('昵称格式不正确');
            return;
        }

        try {
            await axiosInstance.put(`/update-nickname`, { nickname: data.nickname });
            toast.info('昵称已保存');
        } catch (error) {
            toast.error(error.msg);
        }
    };

    const handleUploadAvatar = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('avatar', croppedImage);
        try {
            await axiosInstance.put(`/update-avatar`, formData, {
                headers: {
                    'Content-Type': 'image/jpeg'
                }
            });
            setCroppedImage(null);
            toast.info('头像上传成功.');
        } catch (error) {
            toast.error(error.msg);
        }
    };

    if (loading) { return <LoadingSpinner /> }

    return (
        <Container className="mt-4">
            <Row>
                <Col sm={2} className="text-center">
                    <div onClick={() => fileInputRef.current.click()}>
                        <Image
                            src={croppedImageURL || `${config.BASE_URL}/${data.avatar_url}?t=${new Date().getTime()}`}
                            roundedCircle
                            fluid
                            style={{
                                cursor: 'pointer',
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                    {croppedImage &&
                        <Button variant="outline-secondary" onClick={handleUploadAvatar} className="mt-2">
                            保存头像
                        </Button>
                    }
                </Col>

                <Col sm={4}>
                    <Form.Group as={Row} className="mb-3">
                        <h1>个人信息</h1>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>账号:</Form.Label>
                        <Col sm={4}>
                            <input
                                type="text"
                                readOnly
                                className="form-control-plaintext"
                                value={data.username}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>昵称:</Form.Label>
                        <Col sm={6}>
                            <input
                                type="text"
                                className="form-control"
                                value={data.nickname}
                                onChange={e => setData({ ...data, nickname: e.target.value })}
                            />
                        </Col>
                        <Col sm={4}>
                            <Button variant="outline-secondary" onClick={handleUpdateNick}>保存昵称</Button>
                        </Col>
                    </Form.Group>
                </Col>
            </Row>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="d-none"
                onChange={handleFileChange}
            />
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Crop Avatar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {image && (
                        <Cropper
                            src={image}
                            style={{ height: 250, width: '100%' }}
                            initialAspectRatio={1}
                            aspectRatio={1}
                            guides={false}
                            ref={cropperRef}
                            cropBoxResizable={false} // 禁用裁剪框缩放
                            zoomable={true} // 启用缩放
                            dragMode='none'
                            viewMode={1}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCrop}>
                        Crop and Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container >
    );
};

export default UserPage;
