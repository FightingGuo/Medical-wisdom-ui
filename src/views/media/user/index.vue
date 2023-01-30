<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="100" :xs="25">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="所属科室" prop="deptId">
            <el-select v-model="queryParams.deptId" placeholder="请选择科室" clearable :style="{width: '100%'}">
              <el-option v-for="item in deptOptions" :key="item.deptId" :label="item.deptName"
                         :value="item.deptId" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phoneNumber">
            <el-input
              v-model="queryParams.phoneNumber"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['media:user:add']"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-update"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['media:user:update']"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['media:user:remove']"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-role"
              size="mini"
              @click="handleRole"
              v-hasPermi="['media:user:role']"
            >分配角色
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-resetPwd"
              size="mini"
              :disabled="multiple"
              @click="handleResetPwd"
              v-hasPermi="['media:user:resetPwd']"
            >重置密码
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="用户ID" align="center" prop="userId"/>
          <el-table-column label="用户姓名" align="center" key="userName" prop="userName" :show-overflow-tooltip="true"/>
          <el-table-column label="科室" align="center" key="deptName" prop="deptName" :show-overflow-tooltip="true"/>
          <el-table-column label="手机号码【登录身份】" align="center" key="phoneNumber" prop="phoneNumber" :width="160"/>
          <el-table-column label="性别" align="center" key="sex" prop="sex">
            <template slot-scope="scope">
              <!--              {{ scope.row.sex == 0 ? "男" : "女" }}-->
              <span v-if="scope.row.sex== 0">男</span>
              <span v-if="scope.row.sex== 1">女</span>
              <span v-if="scope.row.sex== 2">未知</span>
            </template>
          </el-table-column>
          <el-table-column label="年龄" align="center" key="age" prop="age"/>
          <el-table-column label="级别" align="center" key="grade" prop="grade" :show-overflow-tooltip="true"/>
          <el-table-column label="背景" align="center" key="background" prop="background" :show-overflow-tooltip="true"/>
          <el-table-column label="是否排班" align="center" key="scheduling" prop="scheduling">
            <template slot-scope="scope">
              <span v-if="scope.row.scheduling== 0">是</span>
              <span v-if="scope.row.scheduling== 1">否</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" key="status">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['media:user:update']"
              >修改
              </el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['media:user:remove']"
              >删除
              </el-button>
<!--              <el-button-->
<!--                size="mini"-->
<!--                type="text"-->
<!--                icon="el-icon-key"-->
<!--                @click="handleResetPwd(scope.row)"-->
<!--                v-hasPermi="['media:user:resetPwd']"-->
<!--              >重置-->
<!--              </el-button>-->
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" placeholder="请输入手机号 作为登录凭证"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属科室" prop="deptId">
              <el-select v-model="form.deptId" placeholder="请选择科室">
                <el-option v-for="item in deptOptions"
                           :key="item.deptId"
                           :label="item.deptName"
                           :value="item.deptId"
                           :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别" prop="grade">
              <el-input v-model="form.grade" placeholder="用户级别" :options="gradeOptions" :show-count="true"
                        maxlength="50"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="年龄" prop="age">
              <el-input v-model="form.age" placeholder="请输入年龄"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="背景" prop="background">
              <el-input v-model="form.background" placeholder="学历" type="background"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否排班">
              <el-select v-model="form.scheduling">
                <el-option label="是" value="0"></el-option>
                <el-option label="否" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate,
  getDeptList
} from '@/api/media/user'
import { getToken } from '@/utils/auth'
import { treeselect } from '@/api/media/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'User',
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 级别
      gradeOptions: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // // 科室选项
      deptOptions: [],
      // 是否排班选项
      schedulingOptions: [],
      //背景（学历）选项
      backgroundOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 列信息
      columns: [
        { key: 0, label: `用户ID`, visible: true },
        { key: 1, label: `用户姓名`, visible: true },
        { key: 2, label: `科室`, visible: true },
        { key: 3, label: `手机号码【登录信息】`, visible: true },
        { key: 4, label: `性别`, visible: true },
        { key: 5, label: `年龄`, visible: true },
        { key: 6, label: `是否排班`, visible: true },
        { key: 7, label: `级别`, visible: true },
        { key: 8, label: `背景`, visible: true },
        { key: 9, label: `状态`, visible: true },
        { key: 10, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        dept: [
          { required: true, message: '请选择科室', trigger: 'blur' }
        ],
        background: [
          { required: true, message: '请选择学历', trigger: 'blur' }
        ],
        grade: [
          {
            required: true, message: '请选择级别', trigger: 'blur'
          }
        ],
        phoneNumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList()
    // this.getTreeselect();
    this.getDeptList()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('sys_user_sex').then(response => {
      this.sexOptions = response.data
    })
    this.getConfigKey('sys.user.initPassword').then(response => {
      this.backgroundOptions = response.msg
    })
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.userId = data.id
      this.getList()
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeUserStatus(row.userId, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        userName: undefined,
        dept: undefined,
        password: undefined,
        phoneNumber: undefined,
        grade: undefined,
        background: undefined,
        sex: undefined,
        age: undefined,
        scheduling: undefined,
        status: '0',
        remark: undefined
        // postIds: [],
        // roleIds: []
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
        this.title = '新增用户'
        this.open = true
        this.form.password = this.initPassword
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const userId = row.userId || this.ids
      getUser(userId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改用户'
      })
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.reset()
      const userIds = row.userId || this.ids
      this.$prompt('请输入Id为："' + userIds + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'

      }).then(({ value }) => {
        resetUserPwd(arr, value).then(response => {
          this.msgSuccess('修改成功，新密码是：' + value)
        })
      }).catch(() => {
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addUser(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delUser(userIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有用户数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportUser(queryParams)
      }).then(response => {
        this.download(response.msg)
      })
    },
    /** 分配角色 */
    handleRole() {
      /* this.upload.title = "用户导入";
    this.upload.open = true;*/
    },
    /** 重置密码 */
    importTemplate() {
      importTemplate().then(response => {
        // this.download(response.msg);
      })
    },
    /** 科室下拉数据 */
    getDeptList() {
      getDeptList().then(response => {
        this.deptOptions = response.data
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      F
      this.$refs.upload.submit()
    }
  }
}
</script>
