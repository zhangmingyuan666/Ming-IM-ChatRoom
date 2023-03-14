import axios from './request';

export function postMeetingId(personIdFirst: string, personIdSecond:string){
    return axios.post('/meeting/getMeetingId', {
        personIdFirst,
        personIdSecond
    })
}