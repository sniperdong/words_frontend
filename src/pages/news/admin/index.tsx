import { StatusOK } from '@/api/const';
import { PathNewsAdminShow, PathNewsAdminTotal, PathNewsAdminVideoUpPublish, PathUploadVideoSingle } from '@/api/news';
import { Button, Divider, Message, Modal, Switch, Table, Upload } from '@arco-design/web-react';
import { IconCheck, IconClose } from '@arco-design/web-react/icon';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
            title: '名字',
            dataIndex: 'name',
        },
        {
            title: '备注',
            dataIndex: 'memo',
        },
        {
            title: '英语内容',
            dataIndex: 'content',
        },
        {
            title: '位置',
            dataIndex: 'path',
        },
        {
            title: '发布状态',
            dataIndex: 'publish',
            render: (col, record, index) => (<Switch checkedText={<IconCheck />} uncheckedText={<IconClose />} checked={col} onChange={(checked: boolean) => {
                axios.put(PathNewsAdminVideoUpPublish, {
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
                    <Button type='primary' status='warning'>
                        编辑
                    </Button>
                    <Divider type='vertical' />
                    <Button type='primary' status='danger'>
                        删除
                    </Button>
                </div>
            ),
        },
    ];

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
    </div>;
}

export default NewsAdmin;