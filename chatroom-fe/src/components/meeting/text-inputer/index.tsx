import {sendMessage} from '@/ws';
import {Button, Input} from 'antd'
import {useState} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components'
import {WsTypes} from '@/types';

const TextInputer: React.FC = () => {
    const {userInfo, currentSelectUser, meetingInfo} = useSelector((state: any) => state.user)
    const [value, setValue] = useState("")
    const onTest = () => {
        const {meetingId} = meetingInfo;
        const {userId} = userInfo;
        sendMessage(WsTypes.ISendMessageType.send_message, {
            meetingId,
            userId,
            msg: value,
            otherUserId: currentSelectUser.userId
        })
        // const timestamp
        // sendMessage(ISendMessageType.message, '我是send的消息')
    }

    return (
        <Container>
            <Input.TextArea
                showCount
                maxLength={100}
                style={{height: 120, resize: 'none'}}
                onChange={(e) => setValue(e.target.value)}
                value={value}
            ></Input.TextArea>
            <Button onClick={onTest}>发送</Button>
        </Container>
    )
}

export default TextInputer

const Container = styled.div`
`