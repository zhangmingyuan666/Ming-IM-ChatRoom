import {IChattingMessageReponseType} from '@/types/ws'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
interface IProps {
    message: IChattingMessageReponseType
}

const MeetingMessage = (props: IProps) => {
    const {userInfo, currentSelectUser, meetingInfo} = useSelector((state: any) => state.user)
    const {message} = props
    const {sender_id, msg} = message
    const isMyself = message.sender_id === userInfo.userId
    
    return <MessageContainer isMyself={isMyself}>
        <div className='message'>
            {msg}
        </div>
    </MessageContainer>
}

export default MeetingMessage

const MessageContainer: any = styled.div`
    display: flex;
    align-self: ${(props: any) => {
        return props.isMyself ? 'flex-end' : 'flex-start'
    }};

    .message {
        padding: 10px;  
        box-sizing: border-box;
        max-width: 140px;
        background: ${(props: any) => {
            return props.isMyself ? '#91caff' : '#95de64'
        }};
        word-break: break-all;
        border-radius: 10px;
    }
`