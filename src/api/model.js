import request from '@/utils/request'

export function getPage(data){
    return request({
        url: '/model/page',
        method: 'post',
        data
    });
}

export function addModel(data){
    return request({
        url: '/model/add',
        method: 'post',
        data
    });
}

export function udpateModel(data){
    return request({
        url: '/model/update',
        method: 'post',
        data
    });
}

export function removeModel(data){
    return request({
        url: '/model/remove',
        method: 'post',
        data
    });
}