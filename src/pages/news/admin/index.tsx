import { StatusOK } from '@/api/const';
import { PathNewsAdminShow, PathNewsAdminTotal, PathNewsAdminVideo, PathUploadVideoSingle } from '@/api/news';
import { Button, Divider, Drawer, Form, Input, Message, Modal, Switch, Table, Tooltip, Typography, Upload } from '@arco-design/web-react';
import { IconCheck, IconClose } from '@arco-design/web-react/icon';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

interface Video {
    id: number;
    name: string;
    memo: string;
    content: string;
    path: string;
    publish: boolean;
}
function NewsAdmin() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [key, setKey] = useState('');
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [editVisible, setEditVisible] = useState(false);
    const [editVideo, setEditVideo] = useState<Video>(undefined);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({
        sizeCanChange: true,
        showTotal: true,
        total: total,
        pageSize: pageSize,
        current: 1,
        pageSizeChangeResetCurrent: true,
    });

    function onChangeTable(pagination) {
        const { current, pageSize } = pagination;
        setTimeout(() => {
            getVideos(key, current - 1, pageSize);
            setPagination((pagination) => ({ ...pagination, current, pageSize }));
            setPageSize(pageSize);
        }, 1000);
    }
    useEffect(() => {
        getVideos(key, 0, pageSize);
        totalVideos(key);
    }, []);

    useEffect(() => {
        if (editVideo) {
            form.setFieldsValue({
                name: editVideo.name,
                memo: editVideo.memo,
                content: editVideo.content,
                path: editVideo.path,
                publish: editVideo.publish,
            })
        }
    }, [JSON.stringify(editVideo)]);

    useEffect(() => {
        const { current, pageSize } = pagination;
        setPageSize(pageSize);
        getVideos(key, current - 1, pageSize)
    }, [JSON.stringify(pagination)]);

    useEffect(() => {
        setPagination((pagination) => ({ ...pagination, total }));
    }, [total]);
    const getVideos = (key: string, page: number, pageSize: number) => {
        axios.get(PathNewsAdminShow, {
            params: {
                key: key,
                page: page,
                page_size: pageSize,
            }
        }).then((res) => {
            if (res?.data?.Status === StatusOK) {
                if (res?.data?.Data) {
                    setVideos(res?.data?.Data);
                }
            } else {
                if (res?.data?.Msg) {
                    Message.error(res?.data?.Msg);
                } else {
                    Message.error('查询失败');
                }
            }
        });
    };

    const totalVideos = (key: string) => {
        axios.get(PathNewsAdminTotal, {
            params: {
                key: key,
            }
        }).then((res) => {
            if (res?.data?.Status === StatusOK) {
                if (res?.data?.Data) {
                    setTotal(res?.data?.Data);
                }
            } else {
                if (res?.data?.Msg) {
                    Message.error(res?.data?.Msg);
                } else {
                    Message.error('查询总数错误');
                }
            }
        });
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '备注',
            dataIndex: 'memo',
        },
        {
            title: '英语内容',
            dataIndex: 'content',
            render: (col) => {
                return (col.length < 60) ? (<Typography.Text>{col}</Typography.Text>) : (
                    <Tooltip content={col} color='#3491FA'>
                        <Typography.Text >
                            {col.substr(0, 60)}...
                        </Typography.Text>
                    </Tooltip>);
            }
        },
        {
            title: '位置',
            dataIndex: 'path',
        },
        {
            title: '发布状态',
            dataIndex: 'publish',
            render: (col, record, index) => (<Switch checkedText={<IconCheck />} uncheckedText={<IconClose />} checked={col} onChange={(checked: boolean) => {
                axios.put(PathNewsAdminVideo, {
                    id: record.id,
                    publish: checked,
                }).then((res) => {
                    if (res?.data?.Status === StatusOK) {
                        const { current, pageSize } = pagination;
                        getVideos(key, current - 1, pageSize);
                    } else {
                        if (res?.data?.Msg) {
                            Message.error(res?.data?.Msg);
                        } else {
                            Message.error('更新失败');
                        }
                    }
                });
            }} />)

        },
        {
            title: '操作',
            render: (_, record) => (
                <div>
                    <Button type='primary' status='warning' onClick={e => {
                        setEditVideo(record);
                        setEditVisible(true);
                    }}>
                        编辑
                    </Button>
                    <Divider type='vertical' />
                    <Button type='primary' status='danger' disabled>
                        删除
                    </Button>
                </div>
            ),
        },
    ];

    const formItemLayout = {
        wrapperCol: {
            span: 24,
        },
    };

    return <div>
        <Upload
            multiple
            action={PathUploadVideoSingle}
            beforeUpload={(file) => {
                return new Promise((resolve, reject) => {
                    Modal.confirm({
                        title: 'beforeUpload',
                        content: `确认上传 ${file.name}`,
                        onConfirm: () => resolve(true),
                        onCancel: () => reject('cancel'),
                    });
                });
            }}
        />
        <div>
            <Table
                data={videos}
                columns={columns}
                pagination={pagination}
                onChange={onChangeTable}
            />
        </div>
        {editVisible && <Drawer
            width={600}
            title={<span>编辑视频数据 </span>}
            visible={editVisible}
            onOk={() => {
                form.validate().then((input) => {
                    setTimeout(() => {
                        axios.put(PathNewsAdminVideo, {
                            id: editVideo?.id,
                            memo: input?.memo,
                            content: input?.content,
                            publish: input?.publish,
                            name: input?.name,
                        }).then((res) => {
                            if (res?.data?.Status === StatusOK) {
                                const { current, pageSize } = pagination;
                                getVideos(key, current - 1, pageSize);
                                setEditVisible(false);
                                form.clearFields();
                            } else {
                                if (res?.data?.Msg) {
                                    Message.error(res?.data?.Msg);
                                } else {
                                    Message.error('更新失败');
                                }
                            }
                        });
                    }, 1500);
                });
            }}
            onCancel={() => {
                setEditVisible(false);
            }}
        >
            <Form {...formItemLayout} form={form} initialValues={editVideo} layout='vertical'>
                <Form.Item label='名称' field='name' rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label='备注' field='memo' >
                    <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} allowClear />
                </Form.Item>
                <video width="360" height="270" controls>
                    <source src={editVideo?.path} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <Form.Item label='英文原文' field='content'  >
                    <Input.TextArea autoSize={{ minRows: 3 }} allowClear />
                </Form.Item>
                <Form.Item
                    label='发布'
                    field='publish'
                    triggerPropName='checked'
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Drawer>}
    </div>;
}

export default NewsAdmin;