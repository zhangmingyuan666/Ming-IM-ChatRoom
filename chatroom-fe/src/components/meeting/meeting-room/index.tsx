import {postMeetingId} from '@/pages/api/meeting'
import {updateMeetingInfo} from '@/store/slices/user'
import {WsTypes} from '@/types'
import {onMessage, sendMessage} from '@/ws'
import {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styled from 'styled-components'

const MeetingRoom: React.FC = () => {
    const {userInfo, currentSelectUser, meetingInfo} = useSelector((state: any) => state.user)
    const dispatch = useDispatch()
    const prevMeetingId = useRef("");
    const [messageList, setMessageList] = useState([]);
    // 感觉redux真是反人类
    const updateMeetingInfoAction = (value: any) => {
        return dispatch(updateMeetingInfo(value))
    }

    useEffect(() => {
        // 此时选中了的进行列表的显示
        // 1. 建立当前两个id的房间
        initalMeeting()
    }, [currentSelectUser])

    useEffect(() => {
        onMessage(WsTypes.IReceiveMessageType.get_message_in_meeting, (args: any) => {
            console.log('聊天室内的消息接受',args);
        })

        onMessage(WsTypes.IReceiveMessageType.get_message_out_meeting, (args: any) => {
            console.log('聊天室外的消息接收',args);
        })
    },[])


    async function initalMeeting() {
        const {userId: id1} = userInfo;
        const {userId: id2} = currentSelectUser;
        // 获取当前会议号

        // 如果有一个没有id 那么都不进行处理
        if (!(id1 && id2)) return

        const ans = await postMeetingId(id1, id2);
        console.log(ans);
        const {meeting_id: meetingId} = ans.data
        updateMeetingInfoAction({
            meetingId
        })
        console.log('----');
        // 此时获取到id了，我们需要加入当前room
        // console.log('meetingId', meetingId);
        sendMessage(WsTypes.ISendMessageType.create_meeting, {
            meetingId,
            prevMeetingId: prevMeetingId.current,
        })

        prevMeetingId.current = meetingId
    }

    return (
        <Container>

        </Container>
    )
}

export default MeetingRoom

const Container = styled.div`

`