import {MeetingHeader, MeetingRoom, MeetingTextInputer, MeetingUsersList} from '@/components/meeting'
import {createSocket, getCurrentSocket, sendMessage} from '@/ws'
import React, {useEffect} from 'react'
import styled from 'styled-components'

const MeetingPage: React.FC = () => {
    return (
        <Container>
            <MeetingUsersList />
            <div className='meetingRoom'>
                <MeetingHeader />
                <div className='meetingChat'>
                    <MeetingRoom />
                </div>
                <MeetingTextInputer />
            </div>
        </Container>
    )
}

export default React.memo(MeetingPage)

const Container = styled.div`
    display:flex;
    flex-direction: row;
    height: 500px;
    min-width: 300px;
    box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    .meetingRoom {
        display: flex;
        flex-direction: column;
        width: 300px;
        height: 100%;
        justify-content: space-between;
        border-left: 1px solid #ccc;

        .meetingChat {
            flex: 1;
            overflow: scroll;
        }
    }
`