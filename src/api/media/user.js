import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/media/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/media/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/media/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/media/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/media/user/' + userId,
    method: 'delete'
  })
}

// 导出用户
// export function exportUser(query) {
//   return request({
//     url: '/media/user/export',
//     method: 'get',
//     params: query
//   })
// }

// 用户密码重置
export function resetUserPwd(userIds,password) {
  const data = {
    userIds,
    password
  }
  return request({
    url: '/media/user/resetUserPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/media/user/changeStatus',
    method: 'put',
    data: data
  })
}

// // 查询用户个人信息
// export function getUserProfile() {
//   return request({
//     url: '/media/user/profile',
//     method: 'get'
//   })
// }

// 修改用户个人信息
// export function updateUserProfile(data) {
//   return request({
//     url: '/media/user/profile',
//     method: 'put',
//     data: data
//   })
// }

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/media/user/profile/updatePwd',
    method: 'put',
    params: data
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

// 下载用户导入模板
// export function importTemplate() {
//   return request({
//     url: '/media/user/importTemplate',
//     method: 'get'
//   })
// }
