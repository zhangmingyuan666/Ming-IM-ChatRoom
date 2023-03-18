import EventEmitter from 'events';

export enum IEventName {
    scrollToBottom = 'scrollToBottom'
}

export const eventEmiter = new EventEmitter();

// 注册事件监听
export function addListener(name: IEventName,handler:any) {
    eventEmiter.on(name, handler);
}

// 触发事件
export function emitListener(name: IEventName,args: any) {
    eventEmiter.emit(name, args);
}

// 移除事件监听
export function offListener(name: IEventName,handler:any) {
    eventEmiter.off(name, handler);
}
