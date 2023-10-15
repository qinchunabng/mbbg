import request from '@/utils/request'

export function getPage(data){
    return request({
        url: '/doc/page',
        method: 'post',
        data
    });
}

export function addDoc(data){
    return request({
        url: '/doc/add',
        method: 'post',
        data
    });
}

export function udpateDoc(data){
    return request({
        url: '/doc/update',
        method: 'post',
        data
    });
}

export function removeDoc(data){
    return request({
        url: '/doc/remove',
        method: 'post',
        data
    });
}