<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--厂家数据-->
      <el-col :span="100" :xs="25">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="厂家名称" prop="factoryName">
            <el-input
              v-model="queryParams.factoryName"
              placeholder="请输入厂家名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="关键字" prop="key">
            <el-input
              v-model="queryParams.key"
              placeholder="请输入关键字"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="厂家号码" prop="telephoneNum">
            <el-input
              v-model="queryParams.telephoneNum"
              placeholder="请输入厂家电话"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="厂家状态"
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
              v-hasPermi="['medicine:factory:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['medicine:factory:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['medicine:factory:remove']"
            >删除</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="factoryList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="厂家ID" align="center" prop="factoryId"/>
          <el-table-column label="厂家名称" align="center"  prop="factoryName" :show-overflow-tooltip="true"/>
          <el-table-column label="厂家编码" align="center"  prop="factoryCode" />
          <el-table-column label="联系人" align="center"  prop="contact" />
          <el-table-column label="电话" align="center"  prop="telephoneNum" />
          <el-table-column label="关键字" align="center"  prop="key" />
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
          <el-table-column label="创建时间" align="center" prop="createTime"  width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['medicine:factory:update']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['medicine:factory:remove']"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                aria-multiline="true"
                icon="el-icon-view"
                @click="handleInspect(scope.row,scope.index)"
                v-hasPermi="['media:notice:inspect']"
              >详细地址</el-button>
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
    <el-dialog :title="title" :visible.sync="openEdit" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="厂家名称" prop="factoryName">
              <el-input v-model="form.factoryName" placeholder="请输入厂家名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂家编码" prop="factoryCode">
              <el-input v-model="form.factoryCode" placeholder="请输入厂家编码"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人"/>
            </el-form-item>
          </el-col>
        <el-col :span="12">
          <el-form-item label="厂家电话" prop="telephoneNum">
            <el-input v-model="form.telephoneNum" placeholder="请输入厂家电话"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关键字" prop="key">
            <el-input v-model="form.key" placeholder="请输入关键字"/>
          </el-form-item>
        </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址"/>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 详细内容弹出框 -->
    <el-dialog :title="title" :visible.sync="openView" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px" >
        <el-row>
          <el-col :span="24">
            <el-form-item label="" >
              <el-input v-model="form.address" readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFactory,
  getFactory,
  addFactory,
  updateFactory,
  delFactory,
  changeFactoryStatus
} from '@/api/medicine/factory'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Factory',
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
      // 厂家表格数据
      factoryList: null,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: '',
      // 是否显示查看 弹出层
      openView: false,
      //是否显示编辑、添加 弹出层
      openEdit: false,
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        factoryName:undefined,
        key: undefined,
        telephoneNum:undefined,
        status: undefined,
      },
      // 表单校验
      rules: {
        factoryName: [
          { required: true, message: '厂家名称不能为空', trigger: 'blur' }
        ],
        telephoneNum: [
          { required: true, message: '厂家号码不能为空', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入关键字', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        // phoneNumber: [
        //   {
        //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //     message: '请输入正确的手机号码',
        //     trigger: 'blur'
        //   }
        // ]
      }
    }
  },
  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
    // this.getDicts('sys_user_sex').then(response => {
    //   this.sexOptions = response.data
    // })
    // this.getConfigKey('sys.user.initPassword').then(response => {
    //   this.backgroundOptions = response.msg
    // })
  },
  methods: {
    /** 查询厂家列表 */
    getList() {
      this.loading = true
      listFactory(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.factoryList = response.rows
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.factoryId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 厂家状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.factoryName + '"厂家吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeFactoryStatus(row.factoryId, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    // 取消按钮
    cancel() {
      this.openEdit = false;
      this.openView = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        factoryId: undefined,
        factoryName: undefined,
        factoryCode: undefined,
        contact: undefined,
        telephoneNum: undefined,
        key: undefined,
        status: '0',
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
        this.title = '新增厂家'
        this.openEdit = true
    },
    /** 修改按钮操作 回表查询 */
    handleUpdate(row) {
      this.reset()
      const factoryIds = row.factoryId || this.ids
      getFactory(factoryIds).then(response => {
        this.form = response.data
        this.openEdit = true
        this.title = '修改厂家'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.factoryId != undefined) {
            updateFactory(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.openEdit = false
              this.getList()
            })
          } else {
            addFactory(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.openEdit = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const factoryIds = row.factoryId || this.ids
      this.$confirm('是否确认删除厂家编号为"' + factoryIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delFactory(factoryIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 详细按钮操作 */
    handleInspect(row) {
      this.openView = true;
      this.title = row.factoryName + "详细地址";
      this.form = row;
    },
  }
}
</script>
