<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="采购商" prop="supplierId">
        <el-select v-model="queryParams.supplierId" placeholder="请选择采购商" clearable size="small">
          <el-option
            v-for="dict in supplierNameOptions"
            :key="dict.supplierId"
            :label="dict.supplierName"
            :value="dict.supplierId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="采购者" prop="purName">
        <el-input
          v-model="queryParams.purName"
          placeholder="请输入采购者"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采购状态" prop="purStatus">
        <el-select v-model="queryParams.purStatus" placeholder="采购状态" clearable size="small">
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
          v-hasPermi="['medicine:purchase:add']"
        >新增采购
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
          v-hasPermi="['medicine:purchase:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="PurchaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据ID" align="center" prop="purId" :show-overflow-tooltip="true"/>
      <el-table-column label="采购名称" align="center" prop="supplierName"/>
      <el-table-column label="采购批发总额" align="center" prop="purTotal" />
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
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAudit(scope.row)"
            v-hasPermi="['medicine:info:update']"
          >提交审核
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
    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="供应商名称" prop="supName" label-width="100px">
          <el-input v-model="form.purId" placeholder="请输入供应商名称"/>
        </el-form-item>
        <el-form-item label="采购商" prop="contact">
          <el-select v-model="queryParams.supplierId" placeholder="请选择采购商" clearable size="small">
            <el-option
              v-for="dict in supplierNameOptions"
              :key="dict.supplierId"
              :label="dict.supplierName"
              :value="dict.supplierId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采购总额" prop="purTotal">
          <el-input v-model="form.telephoneNum" placeholder="请输入采购总额"/>
        </el-form-item>
        <el-form-item label="采购者" prop="purName">
          <el-input v-model="form.telephoneNum" placeholder="请输入采购者"/>
        </el-form-item>
        <el-form-item label="银行账号" prop="supAccount">
          <el-input v-model="form.bankCount" placeholder="请输入银行账号"/>
        </el-form-item>
<!--        <el-form-item label="地址" prop="address">-->
<!--          <el-input v-model="form.address" placeholder="请输入地址"/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="状态" prop="purStatus">-->
<!--          <el-select v-model="queryParams.purStatus" placeholder="采购状态" clearable size="small">-->
<!--            <el-option-->
<!--              v-for="dict in statusOptions"-->
<!--              :key="dict.dictValue"-->
<!--              :label="dict.dictLabel"-->
<!--              :value="dict.dictValue"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
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
  listPurchase,
  getPurchase,
  delPurchase,
  addPurchase,
  updatePurchase,
  submitAudit,
  submitEntryDB,
  getSupplierList,
  AuditAccess
} from '@/api/medicine/purchase'

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
      PurchaseList: [],
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
        supplierId:undefined,
        purName: undefined,
        purStatus: undefined
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
    this.getSupplierList()
    this.getDicts('sys_purchase_status').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询采购列表 */
    getList() {
      this.loading = true
      listPurchase(this.queryParams).then(response => {
        this.PurchaseList = response.rows
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加采购'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const purId = row.purId || this.ids
      getPurchase(purId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改采购'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.purId != undefined) {
            updatePurchase(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addPurchase(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    //提交审核
    handleAudit(row) {
      this.$confirm('确认提交"' + row.purId + '"单号审核吗?', '通知', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return submitAudit(row.purId,row.purStatus)
      }).then((response) => {
        if (response.code != 200){
          this.msgError(response.msg)
        }
        this.msgSuccess(response.msg)
        this.getList()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const purIds = row.purId || this.ids
      this.$confirm('是否确认删除采购编号为"' + purIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delPurchase(purIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 采购下拉数据 */
    getSupplierList() {
      getSupplierList().then(response => {
        this.supplierNameOptions = response.data
      })
    }
  }
}
</script>
