import axios from './request';

export function login(username: string, password: string) {
    return axios.post('/user/login', {
        username,
        password,
    })
}

export function register(username: string, password: string) {
    return axios.post('/user/register', {
        username,
        password,
    })
}
