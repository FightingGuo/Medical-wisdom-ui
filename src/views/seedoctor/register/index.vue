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
              <el-button type="warning" plain icon="el-icon-zoom-in" @click="addPatient">加载患者信息</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!--  第二部分-->
    <el-row :gutter="20" style="padding-left: 20px;padding-right: 20px">
      <el-col :xs="24" :sm="24" :md="12" :lg="24" style="padding-top: 20px">
        <el-card class="update-log">
          <el-form ref="queryList" :inline="true" :model="regList" class="demo-form-inline" :rules="rules">
            <el-form-item label="身份证号" required prop="patientCard">
              <el-input v-model="regList.patientCard" placeholder="患者身份证号码"></el-input>
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
<!--            <el-form-item label="科室/就诊医师" prop="deptId">-->
<!--              <el-select v-model="queryParams.deptId" placeholder="选择科室/就诊医师" clearable :style="{width: '100%'}">-->
<!--                <el-option v-for="item in deptLists" :key="item.deptId" :label="item.deptName"-->
<!--                           :value="item.deptId" :disabled="item.disabled">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
            <el-form-item label="地址信息" prop="addr">
              <el-input v-model="regList.addr" placeholder="地址信息" style="width: 600px"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!--  第三部分-->
    <el-row :gutter="20" style="padding-left: 20px;padding-right: 20px">
      <el-col :xs="24" :sm="24" :md="12" :lg="24" style="padding-top: 20px">
        <el-card class="update-log" style="height: 70px">
          <el-button-group v-model="regBut">
            <el-button v-for="(name,i) in registerName" :key="i" @click.native="addPrice(name)">{{name}}</el-button>
          </el-button-group>
          <span style="padding-left: 700px">
          挂号费:¥{{registerPrice}}元
          <el-button type="danger" plain icon="el-icon-zoom-in" @click="insertRegister">挂号收费</el-button>
          </span>
        </el-card>
      </el-col>
    </el-row>

    <!--  第四部分-->
    <el-row :gutter="20" style="padding-left: 20px;padding-right: 20px">
      <el-col :xs="24" :sm="24" :md="12" :lg="24" style="padding-top: 20px">
        <el-card class="update-log">
          <el-form :inline="true" :model="registerQuery" class="demo-form-inline">
            <el-form-item label="所属科室" prop="deptId">
              <el-select v-model="queryParams.deptId" placeholder="请选择科室" clearable :style="{width: '100%'}">
                <el-option v-for="item in deptLists" :key="item.deptId" :label="item.deptName"
                           :value="item.deptId" :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
<!--            <el-form-item label="挂号类型" prop="registerName">-->
<!--              <el-select v-model="registerQuery.registerName" placeholder="挂号类型" clearable>-->
<!--                <el-option label="门诊" value="0"></el-option>-->
<!--                <el-option label="急诊" value="1"></el-option>-->
<!--                <el-option label="住院" value="2"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="挂号时段">-->
<!--              <el-select v-model="registerQuery.registerSchedule" placeholder="时段选择" clearable>-->
<!--                <el-option label="上午" value="0"></el-option>-->
<!--                <el-option label="下午" value="1"></el-option>-->
<!--                <el-option label="晚上" value="2"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="挂号时间" prop="date">-->
<!--              <el-date-picker-->
<!--                v-model="registerQuery.registerTime"-->
<!--                format="yyyy-MM-dd"-->
<!--                value-format="yyyy-MM-dd"-->
<!--                style="width: 150px"-->
<!--                placeholder="选择日期"-->
<!--                clearable></el-date-picker>-->
<!--            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="onSubmit()">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table  :data="registerList" >
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
            @pagination="onSubmit"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import {listRegister,getPatient, addreg, getPrice, listDept,addparams} from "@/api/seedoctor/register";

export default {
  name: "index",
  dicts: ['sys_register_name', 'sys_patinte_dept'],
  data() {
    return {
      addparams:{
        deptId:undefined,
        patientName: undefined,
        registerName: undefined,
        userName:undefined,
      },
      patientList:[],
      loading: true,
      regList: {},//患者信息加载表
      regBut: {},
      registerName:
        ["门诊", "急诊", "住院"]
      ,//看病类型加载表
      registerPrice: 0.0,//挂号费价格
      department: {},//科室加载列表
      typeid: '',
      dept: '',
      deptLists:[{
        deptId: undefined,
        deptName: undefined,
        mediaUserLists: undefined,
      }],
      // deptid: 0,
      registerQuery: {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
        registerSchedule: undefined,
        registerTime: undefined,
        registerName: undefined,
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
      // search: '',
      patientId: undefined,
      // 表单校验
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        patientCard: undefined,
        registerSchedule: undefined,
        registerTime: undefined,
        deptId: undefined,
        registerType: undefined,
        // userName: undefined,
      },
      // rules: {
      //   patientCard: [
      //     { required: true, message: '身份证号码不能为空', trigger: 'blur' }
      //   ],
      //   patientName: [
      //     { required: true, message: '患者姓名不能为空', trigger: 'blur' }
      //   ],
      //   phone: [
      //     { required: true, message: '患者电话号码不能为空', trigger: 'blur' }
      //   ],
      // }
    }
  },
  //加载看病门诊类型与科室信息
  created() {
    this.listDept();
    this.listRegister();
  },

  methods: {
    //提示框
    remind(msg){
      this.$message({
        message: msg,
        type: 'success'
      });
    },
    /** 查询科室下拉框 */
    listDept() {
      this.loading = true;
      listDept().then(response => {
          this.deptLists = response.data;
        }
      );
    },
    /** 医生集合 */
    // userData(row){
    //   let arr = []
    //   row.file.forEach((item, index)=>{
    //     if (index > 2) {
    //       return
    //     }
    //     arr.push(item.file_name);
    //   })
    //   return arr.join(',')
    // },
    handleQuery() {
      this.loading = false;
      getPatient(this.queryParam.card).then(res => {
        this.regList = res.data;
        if (res.code==200){
          this.open1();
        }else {
          this.open4();
        }
        this.loading = false;
      })
      this.resetForm('queryList')
      this.loading = false;
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
    //添加患者信息
    addPatient() {
      addreg(this.regList).then(res => {
        if (res.msg === '操作成功') {
          this.patientId = res.data.patientId;
          this.open1();
        }
      }).catch(() => {
        // this.reset();
      });
    },
    //表单重置
    reset() {
      this.regList = {
        deptName: undefined,
        registerSchedule: undefined,
        registerTime: undefined,
        registerName: undefined,
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
      this.addparams.registerName = name;
      getPrice(name).then(res => {
        this.registerPrice = res.data.registerPrice
      })
    },
    onSubmit() {
      this.queryParams.pageNum = 1;
      this.listRegister();
    },
    insertRegister() {
      this.pageList.patientCard = this.patientCard;
      addparams(this.addparams).then(res =>{
        if(res.code==200){
          this.remind("挂号成功")

          this.$router.push("/seedoctor/show");
        }
      })
    },

    choice_confirm(index) {
      console.log(index);
      this.addparams.deptId=index.deptId
      this.addparams.userName=index.userName
      this.patientId


      this.$confirm('是否选择挂该科室?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dept = index.name;
        this.deptid = index.id;


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
