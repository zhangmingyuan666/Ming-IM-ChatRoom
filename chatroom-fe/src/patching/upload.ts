let timer: null | any = null
export const ERROR_QUEUE: any[] = [];
let retryCount = 0;
let UPLOAD_COUNT = 5;
let SHOULD_UPLOAD_ERROR = true

export async function uploadErrorQueue() {
    const queue: any[] = ERROR_QUEUE

    // 防止频繁触发导致的频繁轮询
    if (timer) {
        clearTimeout(timer)
        timer = null
    }

    if (!SHOULD_UPLOAD_ERROR) {
        return
    }

    if (queue.length) {
        timer = setTimeout(async () => {
            // 此时有错误
            try {
                if (queue.length) {
                    // 上传
                    const messages = queue.slice(0, UPLOAD_COUNT);
                    const ans: any = await uploadFunction()
                    // 如果ans = 200，代表这五条消息上报成功
                    if (ans.code === 200) {
                        // 清除
                        queue.splice(0, UPLOAD_COUNT);
                        localStorage.setItem("__ERROR_QUEUE__", JSON.stringify(ERROR_QUEUE))
                    }

                    if (queue.length > 0) {
                        clearTimeout(timer)
                        timer = null
                        // 如果可以了，那么继续上传
                        uploadErrorQueue()
                    }
                }
            } catch (err) {
                clearTimeout(timer)
                timer = null
                // 网络可能错误，但是需要进行重试
                uploadErrorQueue()
            }
        }, 5000)
    }

}


async function uploadFunction() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('上传成功');
            resolve({
                code: 200
            })
        }, 2000);
    })
}

async function intialPoll() {
    setTimeout(() => {
        if (ERROR_QUEUE.length > 0) {
            uploadErrorQueue()
            intialPoll()
        } else {
            intialPoll()
        }
    }, 5000);
}

window.addEventListener('online', () => {
    SHOULD_UPLOAD_ERROR = true
    intialPoll()
})

window.addEventListener('offline', () => {
    // 每次离线的时候，进行消息收集，等到恢复了再重新上传
    SHOULD_UPLOAD_ERROR = false
});

(window as any).__ERROR_QUEUE__ = ERROR_QUEUE