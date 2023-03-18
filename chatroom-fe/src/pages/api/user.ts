import axios from './request'
export function getAllUserInfo(userId: string) {
    return axios.get('/user/find-all', {
        params: {
            userId
        }
    })
}