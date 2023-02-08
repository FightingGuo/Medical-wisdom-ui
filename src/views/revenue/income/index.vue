<template>
  <div class="app-container">
    <div style="color: red;height: 30px;text-align: center">*注意默认只查询当天的统计数据,如果要查询其它的,请选择范围查询</div>
    <div style="padding: 30px 0px 30px 4px;margin:1px;box-shadow:  #e5e5e5 0px -2px 2px 2px" class="z-depth-1">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px" style="margin: auto;">
<!--      <el-form-item label="系统模块" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入系统模块"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input
          v-model="queryParams.operName"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="操作类型"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="操作状态"
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
      </el-form-item>-->

      <el-form-item label="选择时间">
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
      <el-form-item style="margin: auto;">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" style="">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>

    </el-form>
    </div>
<!--    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['monitor:operlog:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
          v-hasPermi="['monitor:operlog:remove']"
        >清空</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['monitor:operlog:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>-->
    <div style="height: 5px"></div>

  <div style="padding: 15px 0px 15px 4px;box-shadow:  #e5e5e5 0px -2px 2px 2px">
    <el-row>
      <el-col :span="4" >合计收入:￥211102</el-col>
    </el-row>
  </div>
    <div style="height: 5px"></div>
    <div style="padding: 15px 0px 15px 4px;box-shadow:  #e5e5e5 0px 0px 2px 2px">
      <el-row>
        <el-col :span="4" >收支情况</el-col>
        <el-col :span="4" >总收入:￥211102</el-col>
        <el-col :span="3" style="color: red" prop="totalBack">总退费:￥1102</el-col>
      </el-row>
    </div>
    <div style="height: 5px"></div>
    <div style="padding: 15px 0px 15px 4px;box-shadow:  #e5e5e5 0px -2px 2px 2px" >
      <el-row>
        <el-col :span="4" >收支渠道</el-col>
        <el-col :span="4" form.apply>现金支付:￥10000</el-col>
        <el-col :span="5" >支付宝支付:￥140000</el-col>
        <el-col :span="4" style="color: red">现金退费:￥0</el-col>
        <el-col :span="4" style="color: red">支付宝退费:￥50000</el-col>
      </el-row>
    </div>
   <!-- <el-table v-loading="loading"  @selection-change="handleSelectionChange"> &lt;!&ndash;:data="list"&ndash;&gt;
      &lt;!&ndash;<el-table-column type="selection" width="55" align="center" />&ndash;&gt;
      <el-table-column label="合计收入:￥111" align="center"  />
&lt;!&ndash;      <el-table-column label="系统模块" align="center" prop="title" />
      <el-table-column label="操作类型" align="center" prop="businessType" :formatter="typeFormat" />
      <el-table-column label="请求方式" align="center" prop="requestMethod" />
      <el-table-column label="操作人员" align="center" prop="operName" />
      <el-table-column label="主机" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="操作地点" align="center" prop="operLocation" :show-overflow-tooltip="true" />
      <el-table-column label="操作状态" align="center" prop="status" :formatter="statusFormat" />&ndash;&gt;
   &lt;!&ndash;   <el-table-column label="操作日期" align="center" prop="operTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operTime) }}</span>
        </template>
      </el-table-column>&ndash;&gt;
      &lt;!&ndash;<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
       &lt;!&ndash; <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row,scope.index)"
            v-hasPermi="['monitor:operlog:query']"
          >详细</el-button>
        </template>&ndash;&gt;
      </el-table-column>&ndash;&gt;
    </el-table>-->

 <!--   <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
            <el-form-item
              label="登录信息："
            >{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
<div style="height: 5px"></div>
    <div id="pie" class="pie" style="padding: 15px 0px 15px 0px;box-shadow:  #e5e5e5 0px -2px 2px 2px;height: 300px">
      <!-- 收支概括DOM -->
      <div id="paymentsAndReceipts" style="float:left;height: 250px;width: 33.35%;padding: 0px 0px 0px 40px" />
      <div id="paymentsAndReceiptsWay" style="float:left;height: 250px;width: 33.33%;padding: 0px 0px 0px 40px" />
      <div id="refund" style="float:left;height: 250px;width: 33.32%;padding: 0px 0px 0px 40px"  />
    </div>

  </div>
</template>


<script>
import { list, delOperlog, cleanOperlog, exportOperlog } from "@/api/monitor/operlog";
//引入eacharts
const echarts = require('echarts/lib/echarts')
// 引入饼状图组件
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')

export default {
  name: "Operlog",
  data() {
    return {
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
      //
      revenueList:null,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined
      },

    };
  },
  created() {
    this.getList();
    this.getDicts("sys_oper_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("sys_common_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  mounted(){
    this.initPaymentsAndReceiptsChart();
    this.initPaymentsAndReceiptsWayChart();
    this.refundChart();
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange)).then( response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 操作日志状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 操作日志类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.businessType);
    },
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
      this.ids = selection.map(item => item.operId)
      this.multiple = !selection.length
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = row.operId || this.ids;
      this.$confirm('是否确认删除日志编号为"' + operIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOperlog(operIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 清空按钮操作 */
    handleClean() {
        this.$confirm('是否确认清空所有操作日志数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return cleanOperlog();
        }).then(() => {
          this.getList();
          this.msgSuccess("清空成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有操作日志数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOperlog(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },

    /** 收支概况饼图*/
    initPaymentsAndReceiptsChart() {
      // 基于准备好的dom，初始化echarts实例
      let paymentsAndReceiptsChart = echarts.init(document.getElementById('paymentsAndReceipts'))
      paymentsAndReceiptsChart.setOption({
        title: {
          show:true,
          text: '收支概况',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['收费金额', '退费金额', ]
        },
        series: [
          {
            type: 'pie',
            radius: ['10%','60%'],
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
              {value: 110, name: '收费金额',itemStyle: { color: '#23c6c8' }},
              {value: 0, name: '退费金额',itemStyle: { color: 'rgba(172,120,232,0.89)' }},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      window.onresize = paymentsAndReceiptsChart.resize  //自适应浏览器窗口的大小
    },
    /** 收支渠道饼图*/
    initPaymentsAndReceiptsWayChart() {
      // 基于准备好的dom，初始化echarts实例
      let PaymentsAndReceiptsWayChart = echarts.init(document.getElementById('paymentsAndReceiptsWay'))
      PaymentsAndReceiptsWayChart.setOption({
        title: {
          show:true,
          text: '收入渠道',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['现金收入', '支付宝收入', ]
        },
        series: [
          {
            type: 'pie',
            radius: ['10%','60%'],
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
              {value: 0, name: '现金收入',itemStyle: { color: '#23c6c8' }},
              {value: 110, name: '支付宝收入',itemStyle: { color: 'rgba(172,120,232,0.89)' }},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      window.onresize = PaymentsAndReceiptsWayChart.resize  //自适应浏览器窗口的大小
    },
    /** 退款饼图*/
    refundChart() {
      // 基于准备好的dom，初始化echarts实例
      let refundChart = echarts.init(document.getElementById('refund'))
      refundChart.setOption({
        title: {
          show:true,
          text: '退款',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
          data: ['现金退费', '支付宝退费', ]
        },
        series: [
          {
            type: 'pie',
            radius: ['10%','60%'],
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: [
              {value: 0, name: '现金退费',itemStyle: { color: '#23c6c8' }},
              {value: 0, name: '支付宝退费',itemStyle: { color: 'rgba(172,120,232,0.89)' }},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
      window.onresize = refundChart.resize  //自适应浏览器窗口的大小
    },
  }
};
</script>
