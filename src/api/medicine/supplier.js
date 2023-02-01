import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/ruoyi'

// 查询供应商列表
export function listSupplier(query) {
  return request({
    url: '/medicine/supplier/list',
    method: 'get',
    params: query
  })
}

// 查询供应商详细
export function getSupplier(supplierId) {
  return request({
    url: '/medicine/supplier/' + praseStrEmpty(supplierId),
    method: 'get'
  })
}

// 新增供应商
export function addSupplier(data) {
  return request({
    url: '/medicine/supplier',
    method: 'post',
    data: data
  })
}

// 修改供应商
export function updateSupplier(data) {
  return request({
    url: '/medicine/supplier',
    method: 'put',
    data: data
  })
}

// 删除供应商
export function delSupplier(supplierId) {
  return request({
    url: '/medicine/supplier/' + supplierId,
    method: 'delete'
  })
}

// 供应商状态修改
export function changeSupplierStatus(supplierId, status) {
  const data = {
    supplierId,
    status
  }
  return request({
    url: '/medicine/supplier/changeStatus',
    method: 'put',
    data: data
  })
}
