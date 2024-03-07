import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function updateInfo(data){
  return request({
    url: '/admin/update',
    method: 'post',
    data
  });
}


export function getCodeUrl(username, timestamp){
  return process.env.VUE_APP_BASE_API + `/admin/validCodePic?username=${username}&timestamp=` + timestamp;
}

export function sendEmailCode(username, email, validCode){
  return request({
    url: `/admin/sendEmailCode?username=${username}&email=${email}&validCode=${validCode}`,
    method: 'get',
  });
}

export function resetPassword(data){
  return request({
    url: '/admin/resetPassword',
    method: 'post',
    data
  });
}