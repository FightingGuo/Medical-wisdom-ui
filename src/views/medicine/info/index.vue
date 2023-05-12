<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--药品信息-->
<!--      <el-col :span="100" :xs="25">-->
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="生产厂家" prop="factoryId">
            <el-select v-model="queryParams.factoryId" placeholder="请选择生产厂家" clearable :style="{width: '100%'}">
              <el-option v-for="item in medicineFactoryOptions" :key="item.factoryId" :label="item.factoryName"
                         :value="item.factoryId" :disabled="item.disabled"  ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="药品名称" prop="medicineName">
            <el-input
              v-model="queryParams.medicineName"
              placeholder="请输入药品名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="药品编码" prop="medicineCode">
            <el-input
              v-model="queryParams.medicineCode"
              placeholder="请输入药品编码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="药品类型" prop="medicineType">
            <el-select v-model="queryParams.medicineType" placeholder="请选择药品类型" clearable :style="{width: '100%'}">
              <el-option label="中草药" value="中草药"></el-option>
              <el-option label="西药" value="西药" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处方类型" prop="prescriptionType">
            <el-select v-model="queryParams.prescriptionType" placeholder="请选择处方类型" clearable :style="{width: '100%'}">
              <el-option label="中药处方" value="中药处方"></el-option>
              <el-option label="西药处方" value="西药处方"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
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

        <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="药品ID" align="center" prop="medicineId"/>
          <el-table-column label="药品名称" align="center"  prop="medicineName" :show-overflow-tooltip="true"/>
          <el-table-column label="药品编码" align="center"  prop="medicineCode"/>
          <el-table-column label="生产厂家" align="center"  prop="factoryName" :width="160" :show-overflow-tooltip="true"/>
          <el-table-column label="药品类型" align="center"  prop="medicineType" />
          <el-table-column label="处方类型" align="center"  prop="prescriptionType"/>
          <el-table-column label="单位(质量单位)" align="center" prop="unit"/>
          <el-table-column label="处方价格" align="center"  prop="medicinePrice" />
          <el-table-column label="库存" align="center"  prop="stock" />
          <el-table-column label="预警值" align="center" prop="warnValue"/>
          <el-table-column label="换算量" align="center" prop="convertQuantity"/>
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
<!--      </el-col>-->
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="药品名称" prop="medicineName">
              <el-input v-model="form.medicineName" placeholder="请输入药品名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品编码" prop="medicineCode">
              <el-input v-model="form.medicineCode" placeholder="请输入药品编码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" placeholder="请输入质量单位g、kg"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="换算量" prop="convertQuantity">
              <el-input v-model="form.convertQuantity" placeholder="请输入换算量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处方价格" prop="medicinePrice">
              <el-input v-model="form.medicinePrice" placeholder="请输入保留两位小数处方价格" oninput="value=value.replace(/[^0-9.]/g,'')"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品量" prop="stock">
              <el-input v-model="form.stock" placeholder="请输入药品量"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="预警值" prop="warnValue">
              <el-input v-model="form.warnValue" placeholder="请输入预警值"/>
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
            <el-form-item label="药品类型" prop="medicineType">
              <el-select v-model="form.medicineType">
                <el-option label="中草药" value="中草药"></el-option>
                <el-option label="西药" value="西药"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处方类型">
              <el-select v-model="form.prescriptionType">
                <el-option label="中药处方" value="中药处方"></el-option>
                <el-option label="西药处方" value="西药处方"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="medicineId">
              <el-select v-model="form.factoryId" placeholder="请选择生产厂家">
                <el-option v-for="item in medicineFactoryOptions"
                           :key="item.factoryId"
                           :label="item.factoryName"
                           :value="item.factoryId"
                           :disabled="item.disabled"></el-option>
              </el-select>
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
  listInfo,
  getInfo,
  addInfo,
  updateInfo,
  delInfo,
  changeInfoStatus,
  getFactoryList
} from '@/api/medicine/info'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Info',
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
      // 药品信息表格数据
      infoList: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      //生产厂家字典
      medicineFactoryOptions: [],
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
        medicineInfo: [
          { required: true, message: '药品名称不能为空', trigger: 'blur' }
        ],
        medicineCode: [
          { required: true, message: '药品编码不能为空', trigger: 'blur' }
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
    this.getFactoryList()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询药品信息列表 */
    getList() {
      this.loading = true
      listInfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.infoList = response.rows
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
      this.queryParams.medicineId = data.id
      this.getList()
    },
    // 药品信息状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$confirm('确认要"' + text +'"' + row.medicineName + '"药品吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeInfoStatus(row.medicineId, row.status)
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
        medicineName: undefined,
        medicineCode: undefined,
        unit: undefined,
        convertQuantity: undefined,
        prescriptionType: undefined,
        stock: undefined,
        warnValue: undefined,
        medicineType: undefined,
        medicinePrice: undefined,
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
      this.ids = selection.map(item => item.medicineId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.title = '新增药品'
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const medicineId = row.medicineId || this.ids
      getInfo(medicineId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改药品'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.medicineId != undefined) {
            updateInfo(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addInfo(this.form).then(response => {
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
      const medicineIds = row.medicineId || this.ids
      this.$confirm('是否确认删除药品信息编号为"' + medicineIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delInfo(medicineIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有药品信息数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportUser(queryParams)
      }).then(response => {
        this.download(response.msg)
      })
    },
    /** 生产厂家下拉数据 */
    getFactoryList() {
      getFactoryList().then(response => {
        this.medicineFactoryOptions = response.data
      })
    }
  }
}
</script>
