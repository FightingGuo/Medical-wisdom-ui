import request from '@/utils/request'

// 查询门诊类型
/*export function listill() {
  return request({
    url: '/vis/reg/list',
    method: 'get',
  })
}

export function listdept() {
  return request({
    url: '/his/vis/listDepts',
    method: 'get',
  })
}*/
// 查询待就诊患者列表
export function listWaite() {
  return request({
    url: '/vis/regform/waite' ,
    method: 'get'
  })
}

// 查询患者详细
export function getPatient(data) {
  return request({
    url: '/vis/regform/show' ,
    method: 'post',
    data
  })
}

// 新增病例
export function addCase(data) {
  return request({
    url: '/vis/regform/add',
    method: 'post',
    data: data
  })
}


//查询所有检查信息"/system/check"
export function listCheck() {
  return request({
    url: '/system/check/all' ,
    method: 'get'
  })
}

// 按关键字查询检查信息
export function keywordQuery(data) {
  return request({
    url: '/system/check/keyword/',
    method: 'post',
    data
  })
}
// 新增检查处方
export function addTemCheck(ids,data) {
  return request({
    url: '/vis/precheck/'+ids,
    method: 'put',
    data: data
  })
}
// 批量查询检查处方
export function getTemCheck(data) {
  return request({
    url: '/vis/precheck/temList',
    method: 'post',
    data: data
  })
}
// 确认添加检查处方
export function confirmCheck(data) {
  return request({
    url: '/vis/precheck/confirmCheck',
    method: 'post',
    data: data
  })
}
// 新增药品处方
export function addTemDrug(ids,data) {
  return request({
    url: '/vis/predrug/'+ids,
    method: 'put',
    data: data
  })
}
// 批量查询药品处方
export function getTemDrug(data) {
  return request({
    url: '/vis/predrug/temDrugList',
    method: 'post',
    data: data
  })
}
// 修改就诊状态
export function updateStatus(data) {
  return request({
    url: '/vis/show/update',
    method: 'post',
    data: data
  })
}
