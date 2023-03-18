import {emitListener, IEventName} from '@/event'
import useSocketMessage from '@/hooks/useSocketMessage'
import {postMeetingHistory, postMeetingId} from '@/pages/api/meeting'
import {updateMeetingInfo} from '@/store/slices/user'
import {WsTypes} from '@/types'
import {IChattingMessageReponseType, IWsResponse} from '@/types/ws'
import {onMessage, sendMessage} from '@/ws'
import {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styled from 'styled-components'
import MeetingFooter from './meeting-footer'
import MeetingMessage from './meeting-message'

const MeetingRoom: React.FC = () => {
    const {userInfo, currentSelectUser, meetingInfo} = useSelector((state: any) => state.user)
    const dispatch = useDispatch()
    const bottomOfMeetingRoomRef = useRef<HTMLDivElement | null>(null)
    const prevMeetingId = useRef("");
    const [messageList, setMessageList] = useState<IChattingMessageReponseType[]>([]);
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
        if(bottomOfMeetingRoomRef.current){
            // @ts-ignore
            bottomOfMeetingRoomRef.current.scrollToBottom()
        }
    },[])

    useSocketMessage(WsTypes.IReceiveMessageType.message_sending_finish, (res: IWsResponse<IChattingMessageReponseType>) => {
        console.log('消息发送成功', res);
    })


    useSocketMessage(WsTypes.IReceiveMessageType.get_message_out_meeting, 
        (res: IWsResponse<IChattingMessageReponseType>) => {
        const data = res  
        // setMessageList([...messageList, data]); 
        console.log('聊天室外的消息接收',data);
    })

    useSocketMessage(WsTypes.IReceiveMessageType.get_message_in_meeting, (res: IWsResponse<IChattingMessageReponseType>) => {
        const {data} = res  
        if(data){
            setMessageList([...messageList, data]);
        }

        console.log('聊天室内的消息接受', data);
    })

    useSocketMessage(WsTypes.IReceiveMessageType.message_sending_finish, (res: IWsResponse<IChattingMessageReponseType>) => {
        const {code, data} = res
        if(code === 200){
            setMessageList([...messageList, data]);
        }
    })

    async function initalMeeting() {
        const {userId} = userInfo;
        const {userId: userOppsiteId} = currentSelectUser;
        // 获取当前会议号

        // 如果有一个没有id 那么都不进行处理
        if (!(userId && userOppsiteId)) return

        const ans = await postMeetingId(userId, userOppsiteId);
        const {meeting_id: meetingId} = ans.data
        updateMeetingInfoAction({
            meetingId
        })
        // 此时获取到id了，我们需要加入当前room
        // console.log('meetingId', meetingId);
        sendMessage(WsTypes.ISendMessageType.create_meeting, {
            meetingId,
            prevMeetingId: prevMeetingId.current,
            userId,
            userOppsiteId,
        })

        const historyList = await postMeetingHistory(meetingId)
        setMessageList(historyList);

        prevMeetingId.current = meetingId
    }

    useEffect(() => {
        emitListener(IEventName.scrollToBottom, "smooth")
    }, [messageList])

    return (
        <Container>
            <>
            {
                messageList.map((message:IChattingMessageReponseType) => {
                    return <MeetingMessage message={message} key={message.message_id}/>              
                })
            }
            <MeetingFooter ref={bottomOfMeetingRoomRef}/>
            </>
        </Container>
    )
}

export default MeetingRoom

const Container = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    row-gap: 3px;
`