import request from '@/utils/request'

// 查询采购列表
export function listPurchase(query) {
  return request({
    url: '/medicine/purchase/list',
    method: 'get',
    params: query
  })
}

// 查询采购详细
export function getPurchase(purId) {
  return request({
    url: '/medicine/purchase/' + purId,
    method: 'get'
  })
}

// 新增采购
export function addPurchase(data) {
  return request({
    url: '/medicine/purchase',
    method: 'Purchase',
    data: data
  })
}
//提交审核
export function submitAudit(purId, purStatus) {
  const data = {
    purId,
    purStatus
  }
  return request({
    url: '/medicine/purchase/submitAudit',
    method: 'put',
    data: data
  })
}
//获取供应商列表
export function getSupplierList(data) {
  return request({
    url: '/medicine/supplier/getSupplierList',
    method: 'get',
    data: data
  })
}

//提交入库
export function submitEntryDB(purId, purStatus) {
  const data = {
    purId,
    purStatus
  }
  return request({
    url: '/medicine/purchase/submitEntryDB',
    method: 'put',
    data: data
  })
}

//审核通过
export function AuditAccess(purId) {
  return request({
    url: '/medicine/purchase/AuditAccess/' + purId,
    method: 'put',
  })
}

// 修改采购
export function updatePurchase(data) {
  return request({
    url: '/medicine/purchase',
    method: 'put',
    data: data
  })
}

// 删除采购
export function delPurchase(purId) {
  return request({
    url: '/medicine/purchase/' + purId,
    method: 'delete'
  })
}
