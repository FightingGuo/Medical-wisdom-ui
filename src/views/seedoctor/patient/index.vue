<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="患者姓名" prop="patientName">
        <el-input
          v-model="queryParams.patientName"
          placeholder="请输入患者姓名"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证" prop="patientCard">
        <el-input
          v-model="queryParams.patientCard"
          placeholder="请输入身份证"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['media:role:add']"
        >查看档案</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['media:role:edit']"
        >查看就诊病历</el-button>
      </el-col>
    </el-row>


    <el-table v-loading="loading" :data="PatientList" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="60" align="center"/>
    <el-table-column label="姓名" align="center" prop="patientName" />
    <el-table-column label="电话" align="center" prop="phone" :show-overflow-tooltip="true" />
    <el-table-column label="身份证号" align="center" prop="patientCard" :show-overflow-tooltip="true"/>
    <el-table-column label="出生年月" align="center" prop="birthday"  />
    <el-table-column label="年龄" align="center" prop="age" />
    <el-table-column label="性别" align="center" prop="sex"/>
    <el-table-column label="创建时间" align="center" prop="createTime" >
<!--      <template slot-scope="scope">-->
<!--        <span>{{ parseTime(scope.row.createTime) }}</span>-->
<!--      </template>-->
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
import { listPatient} from "@/api/seedoctor/patient";

export default {
  name: "Patient",
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
      // 患者表格数据
      PatientList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        patientName: undefined,
        phone: undefined,
        patientCard: undefined,
        roleAuth: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "患者名称不能为空", trigger: "blur" }
        ],
        roleAuth: [
          { required: true, message: "权限编码不能为空", trigger: "blur" }
        ],
        // roleSort: [
        //   { required: true, message: "患者顺序不能为空", trigger: "blur" }
        // ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listPatient(this.queryParams).then(response => {
          this.PatientList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    // reset() {
    //   if (this.$refs.menu != undefined) {
    //     this.$refs.menu.setCheckedKeys([]);
    //   }
    //   this.menuExpand = false,
    //   this.menuNodeAll = false,
    //   this.deptExpand = true,
    //   this.deptNodeAll = false,
    //   this.form = {
    //     roleId: undefined,
    //     roleName: undefined,
    //     roleAuth: undefined,
    //     roleSort: 0,
    //     status: "0",
    //     menuIds: [],
    //     deptIds: [],
    //     menuCheckStrictly: true,
    //     deptCheckStrictly: true,
    //     remark: undefined
    //   };
    //   this.resetForm("form");
    // },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
  }
};
</script>
