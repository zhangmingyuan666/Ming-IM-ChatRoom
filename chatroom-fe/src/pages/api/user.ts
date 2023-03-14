import axios from './request'
export function getAllUserInfo(userId: string) {
    console.log(userId);
    return axios.get('/user/find-all', {
        params: {
            userId
        }
    })
}