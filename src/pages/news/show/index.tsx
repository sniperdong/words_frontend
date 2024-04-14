import { StatusOK } from '@/api/const';
import { PathNewsShow } from '@/api/news';
import { List, Message, TableColumnProps } from '@arco-design/web-react';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Player } from 'video-react';

interface Video {
    ID: number,
    Name: string,
    Memo: string,
    Path: string,
}

function NewsShow() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        getVideos('', 0, pageSize);
    }, []);

    const getVideos = (key: string, page: number, pageSize: number) => {
        axios.get(PathNewsShow, {
            params: {
                key: '',
                page: page,
                page_size: pageSize,
            }
        }).then((res) => {
            if (res?.data?.Status === StatusOK) {
                if (res?.data?.Data) {
                    setVideos((videos) => videos.concat(...res?.data?.Data));
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
    return (
        <List
            // className='list-demo-action-layout'
            wrapperStyle={{ maxWidth: 830 }}
            bordered={false}
            onReachBottom={(currentPage) => getVideos('', currentPage, pageSize)}
            pagination={{ pageSize: pageSize }}
            dataSource={videos}
            render={(item, index) => (
                <List.Item
                    key={index}
                    // style={{ padding: '20px 0', borderBottom: '1px solid var(--color-fill-3)' }}
                    actionLayout='vertical'
                    // actions={[
                    //     <span key={1}>
                    //         <IconHeart />
                    //         {83}
                    //     </span>,
                    //     <span key={2}>
                    //         <IconStar />
                    //         {item.index}
                    //     </span>,
                    //     <span key={3}>
                    //         <IconMessage />
                    //         Reply
                    //     </span>,
                    // ]}
                    extra={
                        <video width="240" height="180" controls>
                            <source src={item.Path} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        // <Player>
                        //     <source src={item.Path} />
                        // </Player>
                    }
                >
                    <List.Item.Meta
                        // avatar={
                        //     <Avatar shape='square'>
                        //         <img alt='avatar' src={`${item.avatar}`} />
                        //     </Avatar>
                        // }
                        title={item.Name}
                        description={item.Memo}
                    />
                </List.Item>
            )}
        />
    );
}

export default NewsShow;