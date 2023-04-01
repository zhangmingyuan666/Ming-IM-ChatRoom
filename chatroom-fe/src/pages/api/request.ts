import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:3050';

const axiosInstance = axios.create({
})

axiosInstance.interceptors.request.use((request: any) => {
    const token = localStorage.getItem('token')
    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`
    }

    return request
})

axiosInstance.defaults.baseURL = BASE_URL

axiosInstance.defaults.withCredentials = true

axiosInstance.defaults.headers.post = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
axiosInstance.defaults.headers.get = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

axiosInstance.interceptors.response.use(function (response) {
    if (response.data) {
        return response.data
    }
    return response
})


export default axiosInstance