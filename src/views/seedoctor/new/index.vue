<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-card>
          <!-- 患者档案及历史病例选项卡  -->
          <div>
            <el-tabs type="border-card" tab-position="bottom" stretch="true">
              <el-tab-pane label="患者档案">
                <el-row :gutter="15">
                  <el-form border="1" ref="elForm" :model="formpatient"  size="medium" label-width="100px" >
                    <el-col :span="24">
                      <el-form-item label="患者姓名" prop="patientName">
                        <el-input v-model="formpatient.patientName" placeholder="请输入患者姓名" show-word-limit readonly clearable
                                  :style="{width: '100%'}">
                          <el-button style="padding-right:10px" slot="suffix" type="text" icon='el-icon-user-solid' @click="open"></el-button>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="身份证号" prop="patientCard">
                        <el-input v-model="formpatient.patientCard" placeholder="请输入身份证号" readonly clearable
                                  :style="{width: '100%'}"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="患者电话" prop="patientPhone">
                        <el-input v-model="formpatient.patientPhone" placeholder="请输入患者电话" :maxlength="11" readonly clearable
                                  prefix-icon='el-icon-phone' :style="{width: '100%'}"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="性别" prop="patientSex">
                        <el-radio-group v-model="formpatient.patientSex" size="medium">
                          <el-radio v-for="(item, index) in field104Options" :key="index" :label="item.value"
                                    :disabled="item.disabled">{{item.label}}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="日期选择" prop="patientBirthday">
                        <el-date-picker v-model="formpatient.patientBirthday" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        :style="{width: '100%'}" placeholder="请选择日期选择" clearable readonly></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="患者年龄" prop="patientAge">
                        <el-input v-model="formpatient.patientAge" placeholder="请输入患者年龄" readonly clearable
                                  :style="{width: '100%'}"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="地址信息" prop="patientAddr">
                        <el-input v-model="formpatient.patientAddr" type="textarea" placeholder="请输入地址信息" :maxlength="30"
                                  readonly :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="过敏史" prop="field108">
                        <el-input v-model="formpatient.field108" type="textarea" placeholder="请输入过敏史" :maxlength="100"
                                  :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="历史病例">配置管理</el-tab-pane>
            </el-tabs>
          </div>
        </el-card>

      </el-col>
      <el-col :span="16">
        <el-card>
          <el-row>
            <el-col :span="16">
              <span>挂号单id:</span><span style="color: #ff1732">{{regId===''?"选择患者后显示" : regId }}</span>
              <br>
              <span>患者编号:</span><span style="color: #ff1732">{{caseId===''?"保存病例后显示" : caseId }}</span>
            </el-col>

            <el-col :span="4">
              <el-button type="primary" icon="el-icon-check" size="medium" @click="saveCase">保存病例</el-button>
            </el-col>
            <el-col :span="4" >
              <el-button type="danger" icon="el-icon-check" size="medium" @click="update">就诊完成</el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-col :span="24">
          <el-tabs type="border-card">
            <el-tab-pane label="病例"> <div>
              <el-row :gutter="15">
                <!--当前病例表单 -->
                <el-form ref="elForm" :model="formcase" :rules="rules" size="medium" label-width="100px">
                  <el-col :span="7">
                    <el-form-item label="发病日期" prop="caseDate">
                      <el-date-picker v-model="formcase.caseDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                      :style="{width: '100%'}" placeholder="请选择发病日期" clearable></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="接诊类型" prop="caseType">
                      <el-select v-model="formcase.caseType" placeholder="请选择接诊类型" clearable :style="{width: '100%'}">
                        <el-option v-for="(item, index) in caseTypes" :key="index" :label="item.label"
                                   :value="item.value" :disabled="item.disabled"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item label="是否传染" prop="caseInf">
                      <el-select v-model="formcase.caseInf" placeholder="请选择是否传染" clearable :style="{width: '100%'}">
                        <el-option v-for="(item, index) in isContagion" :key="index" :label="item.label"
                                   :value="item.value" :disabled="item.disabled"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="主诉" prop="caseMain">
                      <el-input v-model="formcase.caseMain" type="textarea" placeholder="请输入主诉"
                                :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="诊断信息" prop="caseMsg">
                      <el-input v-model="formcase.caseMsg" type="textarea" placeholder="请输入诊断信息"
                                :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="医生建议" prop="caseSuggest">
                      <el-input v-model="formcase.caseSuggest" type="textarea" placeholder="请输入医生建议"
                                :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="备注" prop="caseRemark">
                      <el-input v-model="formcase.caseRemark" type="textarea" placeholder="请输入备注"
                                :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="0">
                    <el-form-item  prop="patientName" >
                      <el-input v-model="formcase.patientName" type="hidden"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="0">
                    <el-form-item  prop="doctorName">
                      <el-input v-model="formcase.doctorName" type="hidden"></el-input>
                    </el-form-item>
                  </el-col>
                </el-form>
              </el-row>
            </div>
            </el-tab-pane>
            <el-tab-pane label="处方">
              <el-row>
                <el-col :span="5">
                  <el-button @click="drugpre = true" type="success" icon="el-icon-plus" size="medium">添加药用处方</el-button>
                </el-col>
                <el-col :span="5">
                  <el-button @click="checkPre = true" type="success" icon="el-icon-plus" size="medium">添加检查处方</el-button>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>

        </el-col>

      </el-col>
    </el-row>
    <!--  添加药用处方-->
    <el-dialog  title="病例展示" :visible.sync="drugpre">
      <div slot="title">
        <h1 align="center" style="color: darkblue">添加【药用】处方</h1>
      </div>
      <span style="float: left"><el-button type="success" icon="el-icon-plus">确认添加</el-button></span>
      <span style="float: right">药用处方金额¥</span>
      <el-table :data="temDrugList">
        <el-table-column label="序号" align="center" prop="physicId" />
        <el-table-column label="药品名称" align="center" prop="physicName"/>
        <el-table-column label="数量" align="center" prop="history_contagion" value="5"/>
        <el-table-column label="单价(元)" align="center" prop="physicRecipePrice" />
        <el-table-column label="金额(元)" align="center" prop="history_diagnosis" />
        <el-table-column label="服用备注" align="center" prop="history_proposal" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="success" @click="addDept(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div align="center"><el-button type="primary" icon="el-icon-plus" @click="opendrug">添加药用处方项</el-button></div>
    </el-dialog>
    <!--  添加检查处方-->
    <el-dialog  title="病例展示" :visible.sync="checkPre">
      <div slot="title">
        <h1 align="center" style="color: darkblue">添加【检查】处方</h1>
      </div>
      <span style="float: left"><el-button type="success" icon="el-icon-plus" @click="confirm">确认添加</el-button></span>
      <span style="float: right">检查处方金额¥</span>
      <el-table :data="temList">
        <el-table-column label="序号" align="center" prop="checkId" />
        <el-table-column label="项目名称" align="center" prop="checkName"/>
        <el-table-column label="单位" align="center" prop="checkUnit"/>
        <el-table-column label="单价(元)" align="center" prop="checkPrice" />
        <el-table-column label="金额(元)" align="center" prop="checkPrice" />
        <el-table-column label="检查备注" align="center" prop="remark" >
          <el-input  ></el-input>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="success" @click="addDept(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div align="center"><el-button type="primary" icon="el-icon-plus" @click="opendrawer">添加检查项</el-button></div>
    </el-dialog>
    <!--  药用抽屉-->
    <el-drawer
      title="我是标题"
      :visible.sync="drugdrawer"
      :direction="direction"
      :size="600"
    >
      <div slot="title"><h1 align="center" style="font-family: 黑体">药品列表</h1></div>
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="200px">
        <el-form-item label="关键字" prop="postCode">
          <el-input
            v-model="queryParams.physicKeyword"
            placeholder="请输入关键字"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="drugQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryCheck">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="drugList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleDrugSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="physicId"
          label="药品ID"
          width="120">
          <!--        <template slot-scope="scope">{{ scope.row.date }}</template>-->
        </el-table-column>
        <el-table-column
          prop="physicName"
          label="药品名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="physicStorage"
          label="库存量"
        >
        </el-table-column>

        <el-table-column
          prop="physicUnit"
          label="单位"
        >
        </el-table-column>
      </el-table>
      <div align="center"><el-button type="primary" icon="el-icon-plus" @click="addDrugTem">添加并关闭</el-button></div>
    </el-drawer>
    <!--  检查抽屉-->
    <el-drawer
      title="我是标题"
      :visible.sync="checkDrawer"
      :direction="direction"
      :size="600"
    >
      <div slot="title"><h1 align="center" style="font-family: 黑体">检查列表</h1></div>
      <el-form :model="CheckqueryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="200px">
        <el-form-item label="关键字" prop="postCode">
          <el-input
            v-model="CheckqueryParams.checkKeyword"
            placeholder="请输入关键字"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryCheck">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="checkList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="checkId"
          label="项目费用ID"
          width="120">
          <!--        <template slot-scope="scope">{{ scope.row.date }}</template>-->
        </el-table-column>
        <el-table-column
          prop="checkName"
          label="项目名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="checkKeyword"
          label="关键字"
        >
        </el-table-column>
        <el-table-column
          prop="checkPrice"
          label="项目单价"
        >
        </el-table-column>
        <el-table-column
          prop="checkUnit"
          label="单位"
        >
        </el-table-column>
      </el-table>
      <div align="center"><el-button type="primary" icon="el-icon-plus" @click="addTem">添加并关闭</el-button></div>
    </el-drawer>
    <!--待就诊用户列表  默认隐藏-->
    <el-dialog :visible.sync="dialogVisible" title="请选择接诊患者" >
      <el-tabs type="border-card" stretch="true">
        <el-tab-pane label="待就诊列表">
          <el-table
            :data="waite"
            border
            style="width: 100%"
          >
            <el-table-column width="160px"
                             prop="patientName"
                             label="患者姓名"
            >
            </el-table-column>
            <el-table-column width="160px"
                             prop="regId"
                             label="流水编号"
            >
            </el-table-column>
            <el-table-column width="160px"
                             prop="regName"
                             label="挂号类型">
            </el-table-column>
            <el-table-column width="214px"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" @click="putPatient(scope.row.patientName,scope.row.regId)">接诊</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="就诊中列表">就诊中列表</el-tab-pane>
        <el-tab-pane label="就诊完成列表">就诊完成列表</el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>

</template>

<script>
import { listWaite ,getPatient,addCase,listCheck,keywordQuery,addTemCheck,getTemCheck,confirmCheck,addTemDrug,getTemDrug,updateStatus} from "@/api/seedoctor/new";
export default {
  components: {},
  props: [],
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        physicKeyword: undefined

      },
      patientName:'',
      patientId:'',
      checkIds:[],
      drugIds:[],
      //暂时添加药品项目列表
      temDrugList:{},
      //暂时添加检查项目列表
      temList:{},
      //药品信息列表
      drugList :{},
      //检查项目信息列表
      checkList:{},
      //显示搜索条件
      showSearch: true,
      CheckqueryParams: {},//检查条件搜索
      //添加检查处方弹出框
      checkPre:false,
      drugpre:false,
      //挂号单id
      regId: '',
      //病历单id
      caseId:'',
      //当前病例表单数据
      formcase:{
        patientName: '',
        doctorName: ''
      },

      scope:undefined,
      //待就诊患者信息
      waite: {},
      //点击患者图标后显示患者信息
      dialogVisible: false,
      formData: {
        field101: undefined,
      },
      //检查抽屉
      checkDrawer: false,
      drugdrawer: false,

      direction: 'rtl',
      //
      formpatient: {
      },

      rules: {
        field101: [{
          required: true,
          message: '请输入关键字',
          trigger: 'blur'
        }],

        field102: [],
        field103: [],
        field104: [],
        field105: [],
        field106: [],
        field107: [],
        field108: [],
      },
      field104Options: [{
        "label": "男",
        "value": "1"
      }, {
        "label": "女",
        "value": "2"
      }],
      caseTypes: [{
        "label": "初诊",
        "value": "1"
      }, {
        "label": "复诊",
        "value": "2"
      }],
      isContagion: [{
        "label": "是",
        "value": "1"
      }, {
        "label": "否",
        "value": "2"
      }],
    }
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {},
  methods: {
    //修改就诊状态
    update(){
      updateStatus(this.patientName).then(res=>{
        this.remind("就诊完成")

      })
    },
    //添加临时药品处方
    addDrugTem(){
      if(this.patientId!=''){
        addTemDrug(this.drugIds,this.patientId).then(res=>{
          this.remind("检查处方添加成功")
          getTemDrug(this.patientId).then(res=>{
            console.log(res.rows);
            this.temDrugList=res.rows
            this.checkDrawer=false
          })
        })
      }else {
        this.remind("请先选择患者")
      }


    },
    //确认添加处方
    confirm(){
      confirmCheck(this.patientId).then(res=>{
        this.checkPre=false
        this.remind("处方添加成功")
      })
    },
    //添加临时检查处方
    addTem(){
      addTemCheck(this.checkIds,this.patientId).then(res=>{
        this.remind("检查处方添加成功")
        getTemCheck(this.patientId).then(res=>{
          this.temList=res.rows
          this.checkDrawer=false
        })
      })

    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.checkIds = selection.map(item => item.checkId)
    },
    handleDrugSelectionChange(selection) {
      console.log(selection);
      this.drugIds = selection.map(item => item.physicId)
    },
    //按关键字查询检查信息
    handleQuery() {
      keywordQuery(this.CheckqueryParams.checkKeyword).then(res=>{
        this.checkList=res.rows

      })
    },
    //打开检查抽屉
    opendrawer(){
      this.checkDrawer=true
      listCheck().then(res=>{
        this.checkList=res.rows;
        console.log(this.checkList)
      })


    },

    //提示框
    remind(msg){

      this.$message({
        message: msg,
        type: 'success'
      });

    },
    //点击待就诊患者显示患者信息
    putPatient(name,rid){
      this.regId=rid
      getPatient(name).then(
        res=>{
          this.formpatient=res.data
          console.log(res.data);
          this.patientName=res.data.patientName;
          this.formcase.patientName=res.data.patientName;
          this.patientId=res.data.patientId;
          this.dialogVisible=false;
          this.remind("患者数据加载成功")
        }
      )
    },
    //打开待就诊列表
    open(){
      this.dialogVisible=true;
      listWaite().then(res=>{
        this.waite=res.data;

      })
    },
    // submitForm() {
    //   this.$refs['elForm'].validate(valid => {
    //     if (!valid) return
    //     // TODO 提交表单
    //   })
    // },
    // resetForm() {
    //   this.$refs['elForm'].resetFields()
    // },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },//添加病例
    saveCase(){
      addCase(this.formcase).then(
        this.remind("病例保存成功.")
      )
    }
  }
}

</script>
<style>
</style>
