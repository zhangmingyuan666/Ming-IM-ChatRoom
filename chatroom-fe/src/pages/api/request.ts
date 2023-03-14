import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:3050';

axios.interceptors.request.use(function(config){
    return config
})

axios.defaults.baseURL = BASE_URL

axios.interceptors.response.use(function(response){
    if(response.data){
        return response.data
    }
    return response
})


export default axios