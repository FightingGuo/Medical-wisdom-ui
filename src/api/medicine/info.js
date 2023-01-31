import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ruoyi'

// 查询药品信息列表
export function listInfo(query) {
  return request({
    url: '/medicine/info/list',
    method: 'get',
    params: query
  })
}

// 查询药品信息详细
export function getInfo(infoId) {
  return request({
    url: '/medicine/info/' + praseStrEmpty(infoId),
    method: 'get'
  })
}

// 新增药品信息
export function addInfo(data) {
  return request({
    url: '/medicine/info',
    method: 'post',
    data: data
  })
}

// 修改药品信息
export function updateInfo(data) {
  return request({
    url: '/medicine/info',
    method: 'put',
    data: data
  })
}

// 删除药品信息
export function delInfo(infoId) {
  return request({
    url: '/medicine/info/' + infoId,
    method: 'delete'
  })
}

//获取生产厂家的下拉列表
export function getFactoryList(data) {
  return request({
    url: '/medicine/factory/getFactoryList',
    method: 'get',
    data: data
  })
}

// 药品信息状态修改
export function changeInfoStatus(medicineId, status) {
  const data = {
    medicineId,
    status
  }
  return request({
    url: '/medicine/info/changeStatus',
    method: 'put',
    data: data
  })
}
