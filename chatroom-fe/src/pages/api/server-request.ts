import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:3050';

const axiosInstance = axios.create()

axiosInstance.defaults.baseURL = BASE_URL

axiosInstance.defaults.withCredentials = true

axiosInstance.defaults.headers.post = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
axiosInstance.defaults.headers.get = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

export function getIsJwtAcess(token: string, cookie: any) {
    return axiosInstance.get('/user', {
        headers: {
            Authorization: `Bearer ${token}`,
            Cookie: cookie
        }
    })
}