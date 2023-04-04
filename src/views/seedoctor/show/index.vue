<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属科室" prop="deptId">
        <el-select v-model="queryParams.deptId" placeholder="请选择科室" clearable :style="{width: '100%'}">
          <el-option v-for="item in deptLists" :key="item.deptId" :label="item.deptName"
                     :value="item.deptId" :disabled="item.disabled">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="患者名称" prop="patientName">
        <el-input
          v-model="queryParams.patientName"
          placeholder="请输入患者名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="挂号类型" prop="registerType">
        <el-select v-model="queryParams.registerType" placeholder="请选择挂号类型" clearable :style="{width: '100%'}">
          <el-option label="门诊" value="0"></el-option>
          <el-option label="急诊" value="1" ></el-option>
          <el-option label="住院" value="2" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="挂号时段" prop="registerSchedule">
        <el-select v-model="queryParams.registerSchedule" placeholder="请选择挂号时段" clearable :style="{width: '100%'}">
          <el-option label="上午" value="0"></el-option>
          <el-option label="下午" value="1" ></el-option>
          <el-option label="晚上" value="2" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="挂号状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择挂号状态" clearable :style="{width: '100%'}">
          <el-option label="就诊完成" value="0"></el-option>
          <el-option label="就诊中" value="1" ></el-option>
          <el-option label="未就诊" value="2" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期选择" prop="registerTime">
        <el-date-picker
          v-model="queryParams.registerTime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          style="width: 100%"
          placeholder="请选择日期选择"
          clearable></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="registerLists" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="患者姓名" align="center" prop="patientName" />
      <el-table-column label="挂号科室" align="center" prop="deptName" />
      <el-table-column label="接诊医生" align="center" prop="userName" />
      <el-table-column label="挂号费用" align="center" prop="registerPrice" />
      <el-table-column label="流水编号" align="center" prop="id" />
      <el-table-column label="状态" align="center" prop="status" width="100">
        <template slot-scope="scope">
        <span v-if="scope.row.status== 0">就诊完成</span>
        <span v-if="scope.row.status== 1">就诊中</span>
        <span v-if="scope.row.status== 2">未就诊</span>
        </template>
      </el-table-column>
      <el-table-column label="就诊日期" align="center" prop="registerTime" :show-overflow-tooltip="true" />
      <el-table-column label="挂号类型" align="center" prop="registerType" :show-overflow-tooltip="true" >
        <template slot-scope="scope">
          <span v-if="scope.row.registerType== 0">门诊</span>
          <span v-if="scope.row.registerType== 1">急诊</span>
          <span v-if="scope.row.registerType== 2">住院</span>
        </template>
      </el-table-column>
      <el-table-column label="挂号时段" align="center" prop="registerSchedule" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.registerSchedule== 0">上午</span>
          <span v-if="scope.row.registerSchedule== 1">下午</span>
          <span v-if="scope.row.registerSchedule== 2">晚上</span>
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
import {listShow,listDept,listRegister} from "@/api/seedoctor/show/";
export default {
  name: "Operlog",
  dicts: ['vis_reg_status', 'sys_patinte_dept','sys_register_name',
    'vis_show_time','sys_reg_status'],
  data() {
    return {
      //挂号状态
      registerStatus: [],
      //挂号时段
      registerTime: [],
      //查询挂号
      registerLists: [],
      //查询科室下拉框内容
      deptLists: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      typeOptions: [],
      // 类型数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        deptId: undefined,
        registerName: undefined,
        registerType: undefined,
        registerSchedule: undefined,
        registerTime: undefined,
        status: undefined,
      }
    };
  },
  created() {
    this.listDept();
    this.listRegister();
    // listShow().then(res=>{
    //   // console.log(res);
    //   this.list=res.data;
    //   // this.total=res.total;
    //   this.loading=false;
    // })
  },
  methods: {
    //收费与颓废按钮的设置
    setStatus(registerId){
      console.log("xiugai:"+registerId)
      setStatusa(registerId).then(response => {
        if (response>0){
          this.getList();
        }
      });
    },
    /** 查询挂号类型下拉框 */
    listRegister() {
      this.loading = true
      listRegister(this.queryParams).then(response => {
          this.registerLists = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      )
    },
    /** 查询科室下拉框 */
    listDept() {
      this.loading = true;
      listDept().then(response => {
          this.deptLists = response.data;
        }
      );
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.listRegister();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.register_id)
      this.multiple = !selection.length
    },
  }
};
</script>
