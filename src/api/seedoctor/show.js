import request from '@/utils/request'

// 查询公告列表
// export function listShow() {
//   return request({
//     url: '/seedoctor/show/list',
//     method: 'get',
//   })
// }

//获取用户所属部门的下拉列表
export function listDept(data) {
  return request({
    url: '/media/dept/getDeptList',
    method: 'get',
    data: data
  })
}

export function listRegister(query) {
  return request({
    url: '/seedoctor/register/list',
    method: 'get',
    params: query
  })
}
