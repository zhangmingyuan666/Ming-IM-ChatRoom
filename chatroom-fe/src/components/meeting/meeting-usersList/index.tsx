import {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {getAllUserInfo} from '@/pages/api/user'
import {useDispatch, useSelector} from 'react-redux'
import {Avatar, Badge, message, Tag, List, Skeleton} from 'antd'
import {updateCurrentSelectUser} from '@/store/slices/user'
import {WsTypes} from '@/types'
import useSocketMessage from '@/hooks/useSocketMessage'
import {useRouter} from 'next/router'
import {SOCKET_STATUS} from '@/ws/constant'

const HandleTag = function ({status}: any) {
    switch (status) {
        case 0:
            return <Tag color="orange">离线</Tag>
        case 1:
            return <Tag color="blue">在线</Tag>
        default:
            return <Tag color="red">出错了</Tag>
    }
}

const defaultArr = [
    {_id: 1},
    {_id: 2},
    {_id: 3},
    {_id: 4},
    {_id: 5},
]

const MeetingUsersList: React.FC = () => {
    const [userList, setUserList] = useState(defaultArr)
    const [loading, setLoading] = useState(true)
    const {userInfo, currentSelectUser, meetingInfo} = useSelector((state: any) => state.user)
    const {socketStatus} = useSelector((state: any) => state.socket)
    const dispatch = useDispatch()
    const firstRenderOver = useRef(true)
    const router = useRouter()
    const currentUserInfoCache = useRef(null)


    // 感觉redux真是反人类
    const updateUserInfoAction = (value: any) => {
        return dispatch(updateCurrentSelectUser(value))
    }

    const udpateUser = ({username, _id: userId}: any) => {
        updateUserInfoAction({username, userId})
    }

    const reconnectWithRouter = (list: any, meetingId: string, userId: string) => {
        const user = (list as any).find((item: any) => item._id === userId)
        udpateUser(user)
    }


    const initialContext = async () => {
        if (userInfo.userId) {
            const list = await getAllUserInfo(userInfo.userId) || []
            setUserList(list as any)
            setLoading(false)
            console.log(router);
            if (firstRenderOver.current) {
                const {query = {}} = router
                const {meetingId = '', userOppsiteId} = query
                if (meetingId && userOppsiteId) {
                    console.log('---');
                    reconnectWithRouter(list, meetingId as string, userOppsiteId as string)
                }
                firstRenderOver.current = false
            }
        }
    }


    useEffect(() => {
        // 不是第一次解析才会进行这样的处理
        if (!firstRenderOver.current) {
            console.log('statusChange', socketStatus);
            // 重连会重新进会，更新socket状态
            if (socketStatus === SOCKET_STATUS.connect) {
                if (meetingInfo.meetingId && currentSelectUser.userId) {
                    reconnectWithRouter(userList, meetingInfo.meetingId, currentSelectUser.userId)
                }
            }
        }
    }, [socketStatus])

    useEffect(() => {
        initialContext()
    }, [])


    useSocketMessage(WsTypes.IReceiveMessageType.after_connection, (res: WsTypes.IWsResponse) => {
        const {data} = res;
        const {msg} = data;
        message.success(msg)
        initialContext();
    })

    useSocketMessage(WsTypes.IReceiveMessageType.somebody_outline, (res: WsTypes.IWsResponse) => {
        const {data} = res;
        const {msg} = data;
        message.error(msg)
        initialContext();
    })

    useSocketMessage(WsTypes.IReceiveMessageType.create_meeting, (res: WsTypes.IWsResponse) => {
        const {data} = res;
        const {msg, userOppsiteId} = data;
        const newList: any = userList.map((user: any) => {
            if (user._id === userOppsiteId) {
                return {
                    ...user,
                    unReadCount: 0,
                }
            }
            return user
        })
        message.success('成功加入会议!');
        setUserList(newList)
    })

    useSocketMessage(WsTypes.IReceiveMessageType.get_message_out_meeting, (res: WsTypes.IWsResponse) => {
        const {data} = res;
        const {sender_id} = data;
        const newList: any = userList.map((user: any) => {
            if (user._id === sender_id) {
                return {
                    ...user,
                    unReadCount: user.unReadCount + 1,
                }
            }
            return user
        })
        setUserList(newList)
        // initialContext();
    })

    return (
        <Container>
            <div onClick={() => setLoading(!loading)}>啊哈哈哈</div>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={userList}
                renderItem={(user: any) => (
                    <Skeleton key={user._id} loading={loading} active>
                        <div className='user-item' onClick={() => udpateUser(user)}>
                            <Badge count={user.unReadCount} size="small">
                                <Avatar style={{backgroundColor: '#fde3cf', color: '#f56a00'}}>U</Avatar>
                            </Badge>
                            <div className='user-info'>
                                <span>{user.username}</span>
                                <div><HandleTag status={user.user_status} /></div>
                            </div>
                        </div>
                    </Skeleton>
                )}
            >
            </List>
            {/* <>
                {
                    userList.map((user: any) => {
                        return (
                            <div key={user._id} className='user-item' onClick={() => udpateUser(user)}>
                                <Badge count={user.unReadCount} size="small">
                                    <Avatar style={{backgroundColor: '#fde3cf', color: '#f56a00'}}>U</Avatar>
                                </Badge>
                                <div className='user-info'>
                                    <span>{user.username}</span>
                                    <div><HandleTag status={user.user_status} /></div>
                                </div>
                            </div>
                        )
                    })
                }</> */}
        </Container>
    )
}

export default MeetingUsersList

const Container = styled.div`
    overflow: scroll;
    min-width: 150px;
    .user-item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #ccc;
        transition: 0.3s;

        .user-info {
            display: flex;
            flex-direction: column;
            margin-left: 10px;
        }
    }
    .user-item: hover {
        background: #ccc;
    }
    
`