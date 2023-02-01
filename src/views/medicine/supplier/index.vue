<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--供应商信息-->
      <el-col :span="100" :xs="25">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-input
              v-model="queryParams.supplierName"
              placeholder="请输入供应商名称"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="联系人" prop="contact" >
            <el-input
              v-model="queryParams.contact"
              placeholder="请输入联系人"
              clearable
              size="small"
              style="width: 220px"
              @keyup.enter.native="handleQuery"
            />
            <el-form-item label="供应商电话" prop="telephoneNum">
              <el-input
                v-model="queryParams.telephoneNum"
                placeholder="请输入供应商电话"
                clearable
                size="small"
                style="width: 220px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              size="small"
              style="width: 190px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
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
              v-hasPermi="['medicine:info:add']"
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
              v-hasPermi="['medicine:info:update']"
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
              v-hasPermi="['medicine:info:remove']"
            >删除
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" ></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="supplierList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="供应商ID" align="center" prop="supplierId"/>
          <el-table-column label="供应商名称" align="center"  prop="supplierName" :width="160" :show-overflow-tooltip="true"/>
          <el-table-column label="联系人" align="center"  prop="contact"/>
          <el-table-column label="供应商电话" align="center"  prop="telephoneNum" :width="160"/>
          <el-table-column label="银行账号" align="center"  prop="bankCount" />
          <el-table-column label="地址" align="center"  prop="address" :show-overflow-tooltip="true"/>
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime"/>
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
                v-hasPermi="['medicine:info:update']"
              >修改
              </el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['medicine:info:remove']"
              >删除
              </el-button>
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
            <el-form-item label="供应商名称" prop="supplierName">
              <el-input v-model="form.supplierName" placeholder="请输入供应商名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商电话" prop="telephoneNum">
              <el-input v-model="form.telephoneNum" placeholder="请输入供应商电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行账号" prop="bankCount">
              <el-input v-model="form.bankCount" placeholder="请输入银行账号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address" placeholder="请输入地址" />
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
      <div slot="footer" class="dialog-footer" >
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSupplier,
  getSupplier,
  addSupplier,
  updateSupplier,
  delSupplier,
  changeSupplierStatus
} from '@/api/medicine/supplier'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Supplier',
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
      // 供应商信息表格数据
      supplierList: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
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
      // 表单校验
      rules: {
        supplierName: [
          { required: true, message: '供应商名称不能为空', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        telephoneNum: [
          { required: true, message: '供应商电话不能为空', trigger: 'blur' }
        ],
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
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询供应商信息列表 */
    getList() {
      this.loading = true
      listSupplier(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.supplierList = response.rows
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
      this.queryParams.supplierId = data.id
      this.getList()
    },
    // 供应商信息状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.supplierName + '"供应商吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeSupplierStatus(row.supplierId, row.status)
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
        supplierName: undefined,
        contact: undefined,
        telephoneNum: undefined,
        bankCount: undefined,
        address: undefined,
        status: '0'
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
      this.ids = selection.map(item => item.supplierId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.title = '新增供应商'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const supplierId = row.supplierId || this.ids
      getSupplier(supplierId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改供应商'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.supplierId != undefined) {
            updateSupplier(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addSupplier(this.form).then(response => {
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
      const supplierIds = row.supplierId || this.ids
      this.$confirm('是否确认删除供应商信息编号为"' + supplierIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delSupplier(supplierIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    }
  }
}
</script>
