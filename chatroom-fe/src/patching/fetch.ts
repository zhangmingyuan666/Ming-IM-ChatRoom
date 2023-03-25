const originFetch = window.fetch

const newFetch = async (url: any, reqOptions: any) => {
    const res = await originFetch(url, reqOptions);

    // 此处不允许这么做，因为res.body是一个流式API，Readable Stream，res.json对
    // 读取res.body做了封装，在用户第二次调用的时候，这个流被锁定了，其他读取器就不能读取他
    const cloneResponse = res.clone()
    const body = await cloneResponse.json();
    
    // console.log('fetch劫持成功', body);

    return res
}

window.fetch = newFetch

export {}