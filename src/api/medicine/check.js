import request from '@/utils/request'

// 查询采购列表
export function listCheck(query) {
  return request({
    url: '/medicine/check/list',
    method: 'get',
    params: query
  })
}

//订单作废
export function invalidCheck(purId) {
  return request({
    url: '/medicine/check/invalidCheck/' + purId,
    method: 'put'
  })
}

//提交入库
export function submitEntryDB(purId, purStatus) {
  const data = {
    purId,
    purStatus
  }
  return request({
    url: '/medicine/check/submitEntryDB',
    method: 'put',
    data: data
  })
}

//审核通过
export function auditAccess(purId) {
  return request({
    url: '/medicine/check/auditAccess/' + purId,
    method: 'put'
  })
}
