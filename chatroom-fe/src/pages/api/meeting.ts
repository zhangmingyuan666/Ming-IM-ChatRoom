import {IChattingMessageReponseType} from '@/types/ws';
import axios from './request';

export function postMeetingId(personIdFirst: string, personIdSecond:string){
    return axios.post('/meeting/getMeetingId', {
        personIdFirst,
        personIdSecond
    })
}

export async function postMeetingHistory(meetingId: string){
    const historyList = await axios.post('/meeting/getMeetingHistory', {
        meetingId
    })
    const {list = []} = historyList.data;
    return list
}