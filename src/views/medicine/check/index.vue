<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAccess"
          v-hasPermi="['medicine:purchase:add']"
        >审核通过
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleInvalid"
          v-hasPermi="['medicine:purchase:remove']"
        >作废
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="CheckList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据ID" align="center" prop="purId" :show-overflow-tooltip="true"/>
      <el-table-column label="采购名称" align="center" prop="supplierName"/>
      <el-table-column label="采购批发总额" align="center" prop="purTotal">
        <template slot-scope="scope">
          {{ fun(scope.row.purTotal) }}
        </template>
      </el-table-column>
      <el-table-column label="采购状态" align="center" prop="purStatus" >
        <template slot-scope="scope">
          <span v-if="scope.row.purStatus == 1">未提交</span>
          <span v-if="scope.row.purStatus == 2">待审核</span>
          <span v-if="scope.row.purStatus == 3">审核成功</span>
          <span v-if="scope.row.purStatus == 4">审核失败</span>
          <span v-if="scope.row.purStatus == 5">作废</span>
          <span v-if="scope.row.purStatus == 6">入库成功</span>
        </template>
      </el-table-column>
      <el-table-column label="采购者" align="center" prop="purName"/>
      <el-table-column label="供应商地址" align="center" prop="address" width="180"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
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
            v-if="scope.row.purStatus == '3'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleSubmit(scope.row)"
            v-hasPermi="['medicine:info:update']"
          >提交入库
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
  </div>
</template>

<script>
import {
  listCheck,
  invalidCheck,
  auditAccess,
  submitEntryDB
} from '@/api/medicine/check'

export default {
  name: 'Purchase',
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
      // 采购表格数据
      CheckList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      //采购数据字典
      supplierNameOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        purName: [
          { required: true, message: '采购名称不能为空', trigger: 'blur' }
        ],
        supContact: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询采购列表 */
    getList() {
      this.loading = true
      listCheck(this.queryParams).then(response => {
        this.CheckList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    //数值数据保留两位小数
    fun(val){
      return Number(val).toFixed(2);
    },
    // 表单重置
    reset() {
      this.form = {
        factName: undefined,
        factCode: undefined,
        factContact: undefined,
        factPhone: undefined,
        factKey: undefined,
        status: '0'
      }
      this.resetForm('form')
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.purId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // /** 审核通过按钮操作 */
    handleAccess(row) {
      const purIds = row.purId || this.ids
      this.$confirm('是否确认审核通过采购编号为"' + purIds + '"的数据项?', '通知', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return auditAccess(purIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('修改成功')
      })
    },
    /** 订单作废按钮操作 */
    handleInvalid(row) {
      const purIds = row.purId || this.ids
      this.$confirm('是否确认作废采购编号为"' + purIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return invalidCheck(purIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('修改成功')
      })
    },
    //提交入库
    handleSubmit(row) {
      this.$confirm('确认要提交"' + row.purId + '"单号入库吗?', '通知', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return submitEntryDB(row.purId,row.purStatus)
      }).then((response) => {
        if (response.code != 200){
          this.msgError(response.msg)
        }
        this.msgSuccess(response.msg)
        this.getList()
      })
    }
  }
}
</script>
