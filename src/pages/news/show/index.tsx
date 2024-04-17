import { StatusOK } from '@/api/const';
import { PathNewsAdminVideoLike, PathNewsAdminVideoStar, PathNewsShow } from '@/api/news';
import { Button, Link, List, Message, TableColumnProps } from '@arco-design/web-react';
import { IconHeart, IconHeartFill, IconMessage, IconStar, IconStarFill } from '@arco-design/web-react/icon';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Player, ControlBar, ReplayControl, ForwardControl, VolumeMenuButton, BigPlayButton, PlaybackRateMenuButton } from 'video-react';

interface Video {
    id: number,
    name: string,
    memo: string,
    url: string,
    likes: number,
    stars: number,
}

function NewsShow() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // useEffect(() => {
    //     getVideos('', page, pageSize);
    // }, []);

    useEffect(() => {
        getVideos('', page - 1, pageSize);
    }, [page]);
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
    const likeVideo = (id: number) => {
        axios.get(PathNewsAdminVideoLike, {
            params: {
                id: id
            }
        });
    }
    const starVideo = (id: number) => {
        axios.get(PathNewsAdminVideoStar, {
            params: {
                id: id
            }
        });
    }
    return (
        <div>
            <List
                // className='list-demo-action-layout'
                wrapperStyle={{ maxWidth: 830 }}
                bordered={false}
                onReachBottom={(currentPage) => setPage(currentPage)}
                pagination={{ pageSize: pageSize }}
                dataSource={videos}
                render={(item, index) => (
                    <List.Item
                        key={index}
                        style={{ width: '183', height: '360' }}
                        actionLayout='vertical'
                        actions={[
                            <span key={1}>
                                <Button
                                    key='heart'
                                    onClick={() => {
                                        likeVideo(item.id);
                                        const newVideos: Video[] = [];
                                        videos.map(v => {
                                            if (v.id == item.id) {
                                                v.likes++;
                                            }
                                            newVideos.push(v)
                                        })
                                        setVideos(newVideos);
                                    }
                                    }
                                >
                                    {item.likes ? (
                                        <IconHeartFill style={{ color: '#f53f3f' }} />
                                    ) : (
                                        <IconHeart />
                                    )}

                                    {item.likes}
                                </Button>
                            </span>,
                            <span key={2}>
                                <Button
                                    key='heart'
                                    onClick={() => {
                                        starVideo(item.id);
                                        const newVideos: Video[] = [];
                                        videos.map(v => {
                                            if (v.id == item.id) {
                                                v.stars++;
                                            }
                                            newVideos.push(v)
                                        })
                                        setVideos(newVideos);
                                    }
                                    }
                                >
                                    {item.stars ? (
                                        <IconStarFill style={{ color: '#ffb400' }} />
                                    ) : (
                                        <IconStar />
                                    )}

                                    {item.stars}
                                </Button>
                            </span>,
                            <span key={3}>
                                <IconMessage />
                                <Link href={`/news/reply?id=${item.id}`}>Reply</Link>
                            </span>,
                        ]}
                        extra={
                            <div style={{ width: 240, height: 180 }}>
                                <video width="240" height="180" controls>
                                    <source src={item.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                {/* <link
                                    rel="stylesheet"
                                    href="https://video-react.github.io/assets/video-react.css"
                                />
                                <Player src={item.url} >
                                    <ControlBar>
                                        <ReplayControl seconds={10} order={2.1} />
                                        <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} />
                                        <ForwardControl seconds={10} order={3.1} />
                                        <VolumeMenuButton vertical order={4} />
                                    </ControlBar>
                                    <BigPlayButton position="center" />
                                    <track
                                        kind="captions"
                                        src="/assets/elephantsdream/captions.en.vtt"
                                        srcLang="en"
                                        label="English"
                                        default
                                    />
                                </Player> */}
                            </div>
                        }
                    >
                        <List.Item.Meta
                            // avatar={
                            //     <Avatar shape='square'>
                            //         <img alt='avatar' src={`${item.avatar}`} />
                            //     </Avatar>
                            // }
                            title={item.name}
                            description={item.memo}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
}

export default NewsShow;