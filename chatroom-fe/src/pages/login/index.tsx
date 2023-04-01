import {Form, Button, Checkbox, Input} from 'antd'
import styled from 'styled-components'
import {login, register} from '../api/login';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {updateUserInfo} from '@/store/slices/user';
import {createSocket, sendMessage, onMessage, getCurrentSocket} from '@/ws';
import {WsTypes} from '@/types';

const Container = styled.div`
    min-width: 400px;
    box-sizing: border-box;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    box-shadow: 2px 2px 5px;
`


const Login: React.FC = () => {
    const router = useRouter()
    const userInfo = useSelector((state: any) => state.user)
    const dispatch = useDispatch()

    // 感觉redux真是反人类
    const updateUserInfoAction = (value: any) => {
        return dispatch(updateUserInfo(value))
    }

    const onFinish = async (values: any) => {
        const {username, password} = values
        let loginRes: any = await login(username, password)
        // 进行注册
        if (loginRes.code === 600) {
            const registerRes: any = await register(username, password)
            if (registerRes.code !== 200) {
                return
            }
            loginRes = await login(username, password)
        }

        if (loginRes.code === 200) {
            const {userId, username, token} = loginRes.data
            localStorage.setItem('token', token)
            updateUserInfoAction({
                userId, username
            })
            localStorage.setItem('userId', userId)
            localStorage.setItem('username', username)

            // 登陆成功 创建socket
            // createSocket();
            // const socket = getCurrentSocket()
            router.push('/meeting')
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <Container>
            <h1>Ming Im Chat</h1>
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 600}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                    initialValue={'zhang03'}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    initialValue={'123456'}
                    rules={[{required: true, message: 'Please input your password!'}]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{offset: 8, span: 16}}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Container>
    )
}
export default Login

