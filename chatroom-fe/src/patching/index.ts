import {patchMethod} from './type'
import "./fetch"
import {ERROR_QUEUE, uploadErrorQueue} from './upload';
const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
// XMLHttpRequest.prototype.open，请求的初始化阶段
// @ts-ignore
const patchOpen = patchMethod(XMLHttpRequestPrototype, 'open', (open) => {
    // open是原函数
    return function (this: any, ...openOptions) {
        // this是本次实例化的XML实例
        const [method, url] = openOptions;
        // 注意这里的 this 指向~
        this.monitorRecords = this.monitorRecords || {};

        this.monitorRecords.url = url;
        this.monitorRecords.method = method;
        //console.log('-----------劫持open成功', this.monitorRecords);

        return open.apply(this, openOptions as any);
    };
});

// XMLHttpRequest.prototype.onReadyStateChange，请求的初始化阶段
const patchOnReadyStateChange = (target: any) => {
    return patchMethod(target, 'onreadystatechange', (origin) => {
        return function (this: any, ...event: any) {
            if (this.readyState === XMLHttpRequest.DONE) {
                console.log('生成请求报告', this);
                const {monitorRecords, status} = this
                if (status !== 200) {
                    ERROR_QUEUE.push(monitorRecords)
                    uploadErrorQueue()
                    localStorage.setItem("__ERROR_QUEUE__", JSON.stringify(ERROR_QUEUE))
                }
            }

            return origin && origin.apply(this, ...event)
        }
    })
}

// @ts-ignore
const patchSend = patchMethod(XMLHttpRequestPrototype, 'send', (send) => {
    return function (this: any, ...sendOption) {

        // 不可直接修改原型上的onReadyStateChange
        patchOnReadyStateChange(this)();

        this.monitorRecords = this.monitorRecords || {}

        this.monitorRecords.startTime = new Date().getTime();
        // @ts-ignore
        this.monitorRecords.requestData = send?.[0];

        // console.log('send事件', this.monitorRecords);

        // console.log('监听send', this);
        return send.apply(this, sendOption)
    }
})

const patchSetRequestHeader = patchMethod(XMLHttpRequestPrototype, 'setRequestHeader', (origin) => {
    return function (this: any, ...options: any) {
        const [name, value] = options

        this.monitorRecords = this.monitorRecords || {}

        this.monitorRecords.requestHeaders = this.monitorRecords.requestHeaders || {}

        this.monitorRecords.requestHeaders[name.toLowerCase()] = value;
        // console.log('监听setHeader', this);

        console.log('header事件', this.monitorRecords);

        return origin.apply(this, options)
    }
})

patchOpen()
patchSend()
patchSetRequestHeader()



export { }