import React, { useEffect, useState, useRef } from 'react';
import queryString from 'query-string';
import { Card, Empty, List, Message, Comment, Button, Input, Affix } from '@arco-design/web-react';
import { IconExclamation, IconHeart, IconHeartFill, IconMessage, IconStar, IconStarFill } from '@arco-design/web-react/icon';
import { PathNewsAdminVideoLog, PathNewsAdminVideoLogLike, PathNewsAdminVideoLogSlice, PathNewsAdminVideoLogStar } from '@/api/news';
import axios from 'axios';
import { StatusOK } from '@/api/const';
const { Meta } = Card;
interface Video {
    id: number,
    name: string,
    memo: string,
    path: string,
    content: string,
}

interface VideoLog {
    id: number,
    content: string,
    created_at: string,
    updated_at: string,
    likes: number,
    stars: number,
}
function NewsReply() {
    const [id, setId] = useState(0);
    const [video, setVideo] = useState<Video>(undefined);
    const [logs, setLogs] = useState<VideoLog[]>([]);
    const [minLogId, setMinLogId] = useState(0);
    const [comment, setComment] = useState('');
    useEffect(() => {
        const parsed = queryString.parse(location.search, { parseNumbers: true });
        if (parsed?.id) {
            setId(+parsed.id);
        } else {
            Message.error('Please select a correct video! It will be jumping to video list after a second');
            setTimeout(function () { location.href = '/news/show' }, 1000)
        }
    }, []);
    useEffect(() => {
        if (id) {
            getVideos();
        }
    }, [id]);

    const refreshLogs = () => {
        axios.get(PathNewsAdminVideoLogSlice, {
            params: {
                video_id: id,
                last_log_id: minLogId,
            }
        }).then((res) => {
            if (res?.data?.Status === StatusOK) {
                if (res?.data?.Data) {
                    setLogs((logs) => logs.concat(...res?.data?.Data));
                }
            } else {
                if (res?.data?.Msg) {
                    Message.error(res?.data?.Msg);
                } else {
                    Message.error('刷新失败');
                }
            }
        });
    };

    const likeVideoReply = (id: number) => {
        axios.get(PathNewsAdminVideoLogLike, {
            params: {
                id: id
            }
        });
    }
    const starVideoReply = (id: number) => {
        axios.get(PathNewsAdminVideoLogStar, {
            params: {
                id: id
            }
        });
    }
    const getVideos = () => {
        axios.get(PathNewsAdminVideoLog, {
            params: {
                id: id
            }
        }).then((res) => {
            if (res?.data?.Status === StatusOK) {
                if (res?.data?.Data) {
                    setVideo(res?.data?.Data?.video);
                    setLogs(res?.data?.Data?.logs);
                    let maxId = minLogId;
                    (res?.data?.Data?.logs as VideoLog[]).map(v => {
                        if (v.id > maxId) {
                            maxId = v.id;
                        }
                    })
                    setMinLogId(maxId);
                } else {
                    setVideo(undefined);
                    setLogs([]);
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

    const reply = () => {
        axios.post(PathNewsAdminVideoLog, {
            id: id,
            content: comment,
        }).then((res) => {
            if (res?.data?.Status === StatusOK) {
                setComment('');
                refreshLogs();
            } else {
                if (res?.data?.Msg) {
                    Message.error(res?.data?.Msg);
                } else {
                    Message.error(' reply fail');
                }
            }
        });
    };
    return (id && video ? <div>
        <Card
            hoverable
            cover={
                <div style={{ height: 204, overflow: 'hidden' }}>
                    <video width="240" height="180" controls>
                        <source src={video?.path} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            }
        >
            <Meta
                title={video?.name}
                description={
                    <>
                        {video?.content}
                    </>
                }
            />
        </Card>
        <Card>
            <Affix offsetTop={80}>
                <Comment
                    align='right'
                    actions={[
                        <Button key='0' type='secondary' disabled={comment.length == 0} onClick={e => {
                            setComment('');
                        }}>
                            clear
                        </Button>,
                        <Button key='1' type='primary' disabled={comment.length == 0} onClick={e => { reply(); }}>
                            Reply
                        </Button>,
                    ]}
                    content={
                        <div>
                            <Input.TextArea maxLength={1000} placeholder='Here is Your comments.' value={comment} onChange={v => { setComment(v); }} />
                        </div>
                    }
                />
            </Affix>
            <List bordered={false} header={<span>{logs.length} comments</span>}>
                {logs.map((item, index) => {

                    return (
                        <List.Item key={item.id}>
                            <Comment
                                // author={item.author}
                                // avatar={item.avatar}
                                content={item.content}
                                datetime={item.created_at}
                                actions={[
                                    <button
                                        className='custom-comment-action'
                                        key='heart'
                                        onClick={() => {
                                            likeVideoReply(item.id);
                                            const newLogs: VideoLog[] = [];
                                            logs.map(v => {
                                                if (v.id == item.id) {
                                                    v.likes++;
                                                }
                                                newLogs.push(v)
                                            })
                                            setLogs(newLogs);
                                        }
                                        }
                                    >
                                        {item.likes ? (
                                            <IconHeartFill style={{ color: '#f53f3f' }} />
                                        ) : (
                                            <IconHeart />
                                        )}

                                        {item.likes}
                                    </button>,
                                    <button
                                        className='custom-comment-action'
                                        key='star'
                                        onClick={() => {
                                            starVideoReply(item.id);
                                            const newLogs: VideoLog[] = [];
                                            logs.map(v => {
                                                if (v.id == item.id) {
                                                    v.stars++;
                                                }
                                                newLogs.push(v)
                                            })
                                            setLogs(newLogs);
                                        }
                                        }
                                    >
                                        {item.stars ? (
                                            <IconStarFill style={{ color: '#ffb400' }} />
                                        ) : (
                                            <IconStar />
                                        )}
                                        {item.stars}
                                    </button>,
                                    // <button className='custom-comment-action' key='reply'>
                                    //     <IconMessage /> Reply
                                    // </button>,
                                ]}
                            />
                        </List.Item>
                    );
                })}
            </List>
        </Card>
    </div > : <Empty
        icon={
            <div
                style={{
                    background: '#f2994b',
                    display: 'inline-flex',
                    borderRadius: '50%',
                    width: 50,
                    height: 50,
                    fontSize: 30,
                    alignItems: 'center',
                    color: 'white',
                    justifyContent: 'center',
                }}
            >
                <IconExclamation />
            </div>
        }
        description='No data, please select a correct video!'
    />);
}

export default NewsReply;