import request from '@/utils/request'

//获取用户所属部门的下拉列表
export function listDept(query) {
  return request({
    url: '/media/dept/getDeptAndUserList',
    method: 'get',
    params: query
  })
}

export function getPrice(data) {
  return request({
    url: '/seedoctor/register/price',
    method: 'post',
    data: data
  })
}

// 新增患者
export function addreg(data) {
  return request({
    url: '/seedoctor/patient',
    method: 'post',
    data: data
  })
}

//获取用户所属部门的下拉列表
export function getDeptList(data) {
  return request({
    url: '/media/dept/getDeptList',
    method: 'get',
    data: data
  })
}

// 查询患者详细
export function getPatient(patientCard) {
  return request({
    url: '/seedoctor/patient/' + patientCard,
    method: 'get'
  })
}

// 新增挂号列表
export function addregister(data) {
  return request({
    url: '/seedoctor/register',
    method: 'post',
    data: data
  })
}

//用户信息回显
export function findPatient(register_id) {
  return request({
    url: '/seedoctor/register/findPatient',
    method: 'get',
    params: {register_id}
  })
}

export function listRegister(query) {
  return request({
    url: '/seedoctor/register/list',
    method: 'get',
    params: query
  })
}

export function deptId(data) {
  return request({
    url: '/his/register/dept',
    method: 'post',
    data: data
  })
}

export function addparams(data) {
  return request({
    url: '/seedoctor/register',
    method: 'post',
    data: data
  })
}
