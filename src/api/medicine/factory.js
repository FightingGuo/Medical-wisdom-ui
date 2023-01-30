import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询厂家列表
export function listFactory(query) {
  return request({
    url: '/medicine/factory/list',
    method: 'get',
    params: query
  })
}

// 查询厂家详细
export function getFactory(factoryId) {
  return request({
    url: '/medicine/factory/' + praseStrEmpty(factoryId),
    method: 'get'
  })
}

// 新增厂家
export function addFactory(data) {
  return request({
    url: '/medicine/factory',
    method: 'post',
    data: data
  })
}

// 修改厂家
export function updateFactory(data) {
  return request({
    url: '/medicine/factory',
    method: 'put',
    data: data
  })
}

// 删除厂家
export function delFactory(factoryId) {
  return request({
    url: '/medicine/factory/' + factoryId,
    method: 'delete'
  })
}

// 厂家状态修改
export function changeFactoryStatus(factoryId, status) {
  const data = {
    factoryId,
    status
  }
  return request({
    url: '/medicine/factory/changeStatus',
    method: 'put',
    data: data
  })
}
