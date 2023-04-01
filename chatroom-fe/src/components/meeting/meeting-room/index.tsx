import {emitListener, IEventName} from '@/event'
import useSocketMessage from '@/hooks/useSocketMessage'
import {postMeetingHistory, postMeetingId} from '@/pages/api/meeting'
import {updateMeetingInfo} from '@/store/slices/user'
import {WsTypes} from '@/types'
import {IChattingMessageReponseType, IWsResponse} from '@/types/ws'
import {onMessage, sendMessage} from '@/ws'
import {useRouter} from 'next/router'
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
    const router = useRouter()

    useEffect(() => {
        // 此时选中了的进行列表的显示
        // 1. 建立当前两个id的房间
        initalMeeting()
    }, [currentSelectUser])

    useEffect(() => {
        if (bottomOfMeetingRoomRef.current) {
            // @ts-ignore
            bottomOfMeetingRoomRef.current.scrollToBottom()
        }
    }, [])

    useSocketMessage(WsTypes.IReceiveMessageType.message_sending_finish, (res: IWsResponse<IChattingMessageReponseType>) => {
        console.log('消息发送成功', res);
    })


    useSocketMessage(WsTypes.IReceiveMessageType.get_message_out_meeting,
        (res: IWsResponse<IChattingMessageReponseType>) => {
            const data = res
            // setMessageList([...messageList, data]); 
            console.log('聊天室外的消息接收', data);
        })

    useSocketMessage(WsTypes.IReceiveMessageType.get_message_in_meeting, (res: IWsResponse<IChattingMessageReponseType>) => {
        const {data} = res
        if (data) {
            setMessageList([...messageList, data]);
        }

        console.log('聊天室内的消息接受', data);
    })

    useSocketMessage(WsTypes.IReceiveMessageType.message_sending_finish, (res: IWsResponse<IChattingMessageReponseType>) => {
        const {code, data} = res
        if (code === 200) {
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

        // 把meetingId储存到url
        router.push(`/meeting`, {
            query: {
                meetingId,
                userOppsiteId
            }
        })

        updateMeetingInfoAction({
            meetingId
        })

        // 此时获取到id了，我们需要加入当前room
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

    useEffect(() => {
        console.log('---------------------');
        async function foo() {
            const {userId} = userInfo;
            const {userId: userOppsiteId} = currentSelectUser;
            const {asPath} = router
            const query = asPath.split('?')[1]

            if (!query) return;

            const [meetingIdKey, meetingId] = query.split('=')
            console.log(meetingIdKey, meetingId);
            if (meetingIdKey === 'meetingId' && meetingId) {
                sendMessage(WsTypes.ISendMessageType.create_meeting, {
                    meetingId,
                    prevMeetingId: meetingId,
                    userId,
                    userOppsiteId,
                })
                console.log('-------------');

                const historyList = await postMeetingHistory(meetingId as string)
                setMessageList(historyList);
                console.log(historyList);
            }

        }
        foo()
    }, [])

    return (
        <Container>
            <>
                {
                    messageList.map((message: IChattingMessageReponseType) => {
                        return <MeetingMessage message={message} key={message.message_id} />
                    })
                }
                <MeetingFooter ref={bottomOfMeetingRoomRef} />
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

export async function getServerSideProps(context: any) {
    console.log(context);
    return {
        props: {
            vvv: 'siuuuu'
        }, // will be passed to the page component as props
    }
}