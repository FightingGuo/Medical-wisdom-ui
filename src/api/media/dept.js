import request from '@/utils/request'

// 查询科室列表
export function listMedia(query) {
  return request({
    url: '/media/dept/list',
    method: 'get',
    params: query
  })
}

// 查询科室详细
export function getMedia(postId) {
  return request({
    url: '/media/dept/' + postId,
    method: 'get'
  })
}

// 新增科室
export function addMedia(data) {
  return request({
    url: '/media/dept',
    method: 'post',
    data: data
  })
}

// 修改科室
export function updateMedia(data) {
  return request({
    url: '/media/dept',
    method: 'put',
    data: data
  })
}

// 删除
export function delMedia(postId) {
  return request({
    url: '/media/dept/' + postId,
    method: 'delete'
  })
}

// 导出岗位
export function exportMedia(query) {
  return request({
    url: '/media/dept/export',
    method: 'get',
    params: query
  })
}
