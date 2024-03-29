import {ConnectionHandler, MeetingHeader, MeetingRoom, MeetingTextInputer, MeetingUsersList} from '@/components/meeting'
import {createSocket, destroySocket} from '@/ws'
import {SOCKET_STATUS} from '@/ws/constant'
import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import styled from 'styled-components'
import {updateSocketStatus} from '@/store/slices/socket'
import {parseCookies} from '@/utils/cookie'
import {getIsJwtAcess} from '../api/server-request'

const MeetingPage: React.FC = () => {
    const {userInfo} = useSelector((state: any) => state.user)
    const dispatch = useDispatch()
    const updateSocketStatusAction = (value: SOCKET_STATUS) => {
        dispatch(updateSocketStatus(value))
    }
    useEffect(() => {
        createSocket();
        return () => {
            destroySocket()
        }
    }, [])

    // useSocketMessage(WsTypes.IReceiveMessageType.connect, (args : any) => {
    //     const socket = getCurrentSocket();
    //     console.log('已经连接上了', socket?.id);
    //     updateSocketStatusAction(SOCKET_STATUS.connect)
    //     if(socket?.id){
    //         // 处理connect行为: after-connection
    //         const {userId, username} = userInfo
    //         sendMessage(WsTypes.ISendMessageType.after_connection, {
    //             userId,
    //             username,
    //             socketId: socket.id
    //         })
    //     }      
    // })

    // useSocketMessage(WsTypes.IReceiveMessageType.disconnect, () => {
    //     updateSocketStatusAction(SOCKET_STATUS.disconnect)
    //     console.log('已经断开了');
    // })


    return (
        <Container>
            <ConnectionHandler />
            <div className='meetingContent'>
                <MeetingUsersList />
                <div className='meetingRoom'>
                    <MeetingHeader />
                    <div className='meetingChat'>
                        <MeetingRoom />
                    </div>
                    <MeetingTextInputer />
                </div>
            </div>
        </Container>
    )
}

export default React.memo(MeetingPage)

const Container = styled.div`
    box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;

    .meetingContent {
        display:flex;
        flex-direction: row;
        height: 500px;
        min-width: 300px;
        .meetingRoom {
            display: flex;
            flex-direction: column;
            width: 300px;
            height: 100%;
            justify-content: space-between;
            border-left: 1px solid #ccc;
    
            .meetingChat {
                margin: 10px;
                display: flex;
                flex: 1;
                overflow-y: scroll;
                overflow-x: hidden;
            }
        }
    }
    
`

export async function getServerSideProps(context: any) {
    // const cookies = context.req.headers.cookie;
    const {req, res} = context
    const cookieData = parseCookies(req)

    if (!Object.keys(cookieData).length) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        }
    }

    console.log('cookieData', cookieData);
    try {
        // 此时没有cookie了，那么过期
        if (cookieData.token) {
            console.log('toekn', cookieData.token);
            const ans = await getIsJwtAcess(cookieData.token, cookieData)
            console.log(ans);
            if (ans.data.code !== 200) {
                console.log('---token gg');
                return {
                    redirect: {
                        permanent: false,
                        destination: '/login',
                    },
                }
            }
            // console.log(ans);
        }

    } catch (err) {
        console.log('---token gg');
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        }
    }

    return {
        props: {
            vvv: 'siuuuu'
        }, // will be passed to the page component as props
    }
}