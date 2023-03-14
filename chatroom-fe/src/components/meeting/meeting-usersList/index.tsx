import {useEffect, useState} from 'react'
import styled from 'styled-components'
import {getAllUserInfo} from '@/pages/api/user'
import {useDispatch, useSelector} from 'react-redux'
import {Avatar, message, Tag} from 'antd'
import {onMessage} from '@/ws'
import {updateCurrentSelectUser} from '@/store/slices/user'
import {WsTypes} from '@/types'

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


const MeetingUsersList: React.FC = () => {
    const [userList, setUserList] = useState([])
    const {userInfo, currentSelectUser} = useSelector((state: any) => state.user)
    const dispatch = useDispatch()

    // 感觉redux真是反人类
    const updateUserInfoAction = (value: any) => {
        return dispatch(updateCurrentSelectUser(value))
    }

    const udpateUser = ({username, _id: userId}: any) => {
        updateUserInfoAction({username, userId})
    }

    const initialContext = async () => {
        if (userInfo.userId) {
            const list = await getAllUserInfo(userInfo.userId) || []
            setUserList(list as any)
        }
    }

    useEffect(() => {
        initialContext()
        onMessage(WsTypes.IReceiveMessageType.after_connection, (res: WsTypes.IWsResponse) => {
            const {data} = res;
            const {msg} = data;
            message.success(msg)
            initialContext();
        })

        onMessage(WsTypes.IReceiveMessageType.somebody_outline, (res: WsTypes.IWsResponse) => {
            const {data} = res;
            const {msg} = data;
            message.error(msg)
            initialContext();
        })
    }, [])

    return (
        <Container>
            <>
                {
                    userList.map((user: any) => {
                        return (
                            <div key={user._id} className='user-item' onClick={() => udpateUser(user)}>
                                <Avatar style={{backgroundColor: '#fde3cf', color: '#f56a00'}}>U</Avatar>
                                <div className='user-info'>
                                    <span>{user.username}</span>
                                    <div><HandleTag status={user.user_status} /></div>
                                </div>
                            </div>
                        )
                    })
                }</>
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
        padding-left: 10px;
        border-bottom: 1px solid #ccc;
        transition: 0.3s;

        .user-info {
            display: flex;
            flex-direction: column;
            margin-left: 3px;
        }
    }
    .user-item: hover {
        background: #ccc;
    }
    
`