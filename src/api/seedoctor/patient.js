import request from '@/utils/request'

export function listPatient(query) {
  return request({
    url: '/seedoctor/patient/list',
    method: 'get',
    params: query
  })
}

// 新增患者
export function addPatient(data) {
  return request({
    url: '/seedoctor/patient',
    method: 'post',
    data: data
  })
}
