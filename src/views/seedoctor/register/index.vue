<template>
  <div>
    <!--  第一部分-->
    <el-row :gutter="20" style="padding-left: 20px;padding-right: 20px">
      <el-col :xs="24" :sm="24" :md="12" :lg="24" style="padding-top: 20px">
        <el-card class="update-log" style="height: 70px">
          <el-form :inline="true" v-model="queryParam" :rules="rules" class="demo-form-inline">
            <el-form-item label="身份证号" prop="card">
              <el-input v-model="queryParam.card" placeholder="请输入患者身份证号码" style="width: 500px"
                        clearable></el-input>
            </el-form-item>
            <el-form-item style="padding-left: 40px">
              <el-button type="primary" plain icon="el-icon-search" @click="handleQuery">加载身份证号</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!--  第二部分-->
    <el-row :gutter="20" style="padding-left: 20px;padding-right: 20px">
      <el-col :xs="24" :sm="24" :md="12" :lg="24" style="padding-top: 20px">
        <el-card class="update-log">
          <el-form ref="queryList" :inline="true" :model="regList" class="demo-form-inline" >
            <el-form-item label="身份证号" required prop="patientCard">
              <el-input v-model="regList.patientCard" placeholder="患者身份证号码"
              onkeyup="this.value = this.value.replace(/[^\X0-9]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="患者姓名" required prop="patientName">
              <el-input v-model="regList.patientName" placeholder="患者姓名"></el-input>
            </el-form-item>
            <el-form-item label="患者电话" required prop="phone">
              <el-input v-model="regList.phone" placeholder="患者电话" value="regList.phone"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="regList.sex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="regList.birthday"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                style="width: 150px">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="患者年龄" prop="age">
              <el-input v-model="regList.age" placeholder="患者年龄"></el-input>
            </el-form-item>
            <el-form-item label="地址信息" prop="addr">
              <el-input v-model="regList.addr" placeholder="地址信息" style="width: 600px"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!--  第四部分-->
    <el-row :gutter="20" style="padding-left: 20px;padding-right: 20px">
      <el-col :xs="24" :sm="24" :md="12" :lg="24" style="padding-top: 20px">
        <el-card class="update-log">
          <el-form :inline="true" ref="queryForm" :model="registerQuery" class="demo-form-inline">
            <el-form-item label="所属科室" prop="deptId">
              <el-select v-model="registerQuery.deptId" placeholder="请选择科室" clearable :style="{width: '100%'}">
                <el-option v-for="item in deptOptions" :key="item.deptId" :label="item.deptName"
                           :value="item.deptId" :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSelect()">查询</el-button>
              <el-button type="primary" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table  :data="userLists" >
            <el-table-column label="科室ID" align="center" prop="deptId"/>
            <el-table-column label="科室名称" align="center" prop="deptName"/>
            <el-table-column label="就诊医生" align="center" prop="userName" />
            <el-table-column label="当前号数" align="center" prop="count"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="success" @click="choice_confirm(scope.row)" plain>选择</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="registerQuery.pageNum"
            :limit.sync="registerQuery.pageSize"
            @pagination="handleSelect"
          />
        </el-card>
      </el-col>
    </el-row>

    <!--  第三部分-->
    <el-row :gutter="20" style="padding-left: 20px;padding-right: 20px">
      <el-col :xs="24" :sm="24" :md="12" :lg="24" style="padding-top: 20px">
        <el-card class="update-log" style="height: 70px">
          <el-button-group v-model="regBut">
            <el-button v-for="(name,i) in registerType" :key="i" @click.native="addPrice(name)">{{name}}</el-button>
          </el-button-group>
          <span style="padding-left: 680px">
          挂号费:¥{{registerPrice}}元
          <el-button type="danger" plain icon="el-icon-zoom-in" @click="insertRegister">新增挂号</el-button>
          </span>
        </el-card>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import {listRegister,getDeptList, getPrice, listDept,addparams} from "@/api/seedoctor/register";
import {isIdentityId} from "@/api/seedoctor/checkIdCard";

export default {
  name: "index",
  dicts: ['sys_register_name', 'sys_patinte_dept'],
  data() {
    var checkIdentitytionId  = (rule, value, callback) => {
      var errorMsg = isIdentityId(value);
      if (errorMsg != "") {
        callback(new Error(errorMsg));
      }
    };
    return {
      //校验规则
      rules: {
        identitytionId: [
          { required: true, message: "请输入身份证号！", trigger: "blur" },
          { checkIdCard: checkIdentitytionId , trigger: "blur" }
        ]
      },
      addparams:{
        patientInfo:undefined,
        registerPrice:undefined,
        registerType:undefined,
      },
      loading: true,
      regList: {},//患者信息加载表
      regBut: {},
      registerType:
        ["门诊", "急诊", "住院"]
      ,//看病类型加载表
      registerPrice: 0.0,//挂号费价格
      //医生
      userLists:[{
        deptId: undefined,
        deptName: undefined,
        count:undefined,
        userId: undefined,
        userName: undefined,
      }],
      registerQuery: {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
      },//挂号单查询参数
      registerList: {
        deptId: undefined,
        userId: undefined,
        registerSchedule: undefined,
        registerTime: undefined,
        patientId: undefined,
      },//挂号单数据查询
      pageList: {},//页面数据集合
      total: 0,//显示总条数
      queryParam: {
        card: undefined,
      },
      // 科室选项
      deptOptions: [],
      patientId: undefined,
      // 表单校验
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    }
  },

    //加载看病门诊类型与科室信息
  created() {
    this.getDeptList();
    this.listUserAndDept();
  },

  methods: {
    //提示框
    remind(msg){
      this.$message({
        message: msg,
        type: 'success'
      });
    },
    /** 科室下拉数据 */
    getDeptList() {
      getDeptList().then(response => {
        this.deptOptions = response.data
      })
    },
    //医生数据
    listUserAndDept() {
      // this.loading = true;
      listDept(this.registerQuery).then(response => {
          this.userLists = response.data;
        }
      );
    },
    /** 搜索按钮操作 */
    handleSelect() {
      this.listUserAndDept();
    },
    resetQuery() {
      this.resetForm('queryForm');
      this.handleSelect();
    },
    handleQuery() {
      this.loading = false;
      getPatient(this.queryParam.card).then(res => {
        this.regList = res.data;
        if (res.code==200){
          this.open1();
        }
        else {
          this.open4();
        }
      })
      this.resetForm('queryList')
    },
    open1() {
      this.$message({
        message: '信息加载成功，请选择挂号类型',
        type: 'success'
      });
    },
    open4() {
      this.$message({
        message: '信息未找到，请输入患者信息',
        type: 'error'
      });
    },
    open3() {
      this.$message({
        message: '挂号成功',
        type: 'success'
      });
    },
    //查询挂号列表信息
    listRegister() {
      this.loading = true
      listRegister(this.queryParams).then(response => {
          this.registerList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      )
    },
    //表单重置
    reset() {
      this.regList = {
        deptName: undefined,
        registerSchedule: undefined,
        registerTime: undefined,
        registerType: undefined,
        patientCard: undefined,
        phone: undefined,
        sex: undefined,
        birthday: undefined,
        age: undefined,
        addr: undefined,
      }
      this.resetForm("regList");
    },
    //获取挂号费价格
    addPrice(name) {
      this.addparams.registerType = name;
      getPrice(name).then(res => {
        this.registerPrice = res.data.registerPrice
      })
    },
    insertRegister() {
      this.addparams.registerPrice=this.registerPrice;
      addparams(this.addparams).then(res =>{
        if(res.code==200){
          this.remind("挂号成功")

          this.$router.push("/seedoctor/show");
        }
      })
    },

    choice_confirm(index) {
      this.$confirm('是否选择挂该科室?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addparams.deptName = index.deptName;
        this.addparams.deptId = index.deptId;
        this.addparams.userId = index.userId;
        this.addparams.userName = index.userName;
        this.addparams.count = index.count;

        this.addparams.patientInfo =  this.regList;
        this.$message({
          type: 'success',
          message: '选择成功!请挂号'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
