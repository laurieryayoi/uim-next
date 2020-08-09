<template>
  <div v-loading="globalLoading" id="app">
    <el-container class="container-body">
      <el-aside width="200px">
        <el-drawer
          :visible.sync="navmenuDrawer"
          :with-header="false"
          append-to-body
          :size="navmenuDrawerWidth"
        >
          <navmenu
            :default-active-menu-item="defaultActiveMenuItem"
            :default-openeds-sub-menu="defaultOpenedsSubMenu"
            :global-config="globalConfig"
            :user-info="userInfo"
          ></navmenu>
        </el-drawer>
        <navmenu
          :default-active-menu-item="defaultActiveMenuItem"
          :default-openeds-sub-menu="defaultOpenedsSubMenu"
          class="hidden-sm-and-down"
          :global-config="globalConfig"
          :user-info="userInfo"
        ></navmenu>
      </el-aside>
      <el-container class="container-main">
        <el-header height="unset" class="gutter-top">
          <headertools
            :user-info="userInfo"
            @nav-drawer-trigger="navDrawerTrigger"
            :pagename="pagename"
          ></headertools>
        </el-header>
        <el-main>
          <el-row :gutter="20">
            <el-col :xs="24" :lg="12">
              <el-card>
                <template #header>
                  账户余额
                  <el-dropdown
                    trigger="click"
                    style="float: right; padding: 3px 0"
                    @command="handleChargeCommand"
                    plain
                  >
                    <span class="el-dropdown-link">
                      钱包充值
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="code">充值码</el-dropdown-item>
                      <el-dropdown-item command="payments">云支付</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <div>
                  <div class="card-avatar">
                    <div class="card-avatar">
                      <div class="card-avatar-avatar">
                        <el-avatar :size="60">
                          <i class="el-icon-bank-card"></i>
                        </el-avatar>
                      </div>
                      <div class="card-avatar-main">
                        <div class="wallet">
                          <div class="card-avatar-title">我的钱包</div>
                          <div class="card-avatar-content">
                            <span>{{userInfo.user.money | creditFilter}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col class="statu" :xs="24" :lg="12">
              <el-card>
                <template #header>会员状态</template>
                <div>
                  <div class="card-avatar">
                    <div class="card-avatar-avatar">
                      <el-avatar :size="60">
                        <i class="el-icon-star-off"></i>
                      </el-avatar>
                    </div>
                    <div class="card-avatar-main">
                      <div>
                        <div class="card-avatar-title">会员剩余时间</div>
                        <div class="card-avatar-content">
                          <span>{{calcExpireDays.levelExpireDays}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <template #header>充值记录</template>
                <el-table stripe :data="chargeData" style="width: 100%">
                  <el-table-column prop="code" label="类型"></el-table-column>
                  <el-table-column prop="number" label="金额"></el-table-column>
                  <el-table-column prop="usedatetime" label="日期"></el-table-column>
                </el-table>
                <el-pagination
                  class="common-margin-top"
                  layout="prev, pager, next"
                  :page-size="pagenation.chargelog.pageSize"
                  @current-change="chargePageChange"
                  :total="pagenation.chargelog.total"
                ></el-pagination>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <template #header>订单记录</template>
                <el-table stripe :data="orderData" style="width: 100%">
                  <el-table-column prop="name" label="商品"></el-table-column>
                  <el-table-column prop="price" label="价格"></el-table-column>
                  <el-table-column prop="datetime" label="购买时间"></el-table-column>
                  <el-table-column prop="content" show-overflow-tooltip label="内容"></el-table-column>
                  <el-table-column prop="renew_date" label="续费时间"></el-table-column>
                  <el-table-column prop="auto_reset" label="续费时重置流量"></el-table-column>
                  <el-table-column prop="date" fixed="right" label="操作">
                    <template slot-scope="scope">
                      <el-button
                        :disabled="scope.row.renew===0?true:false"
                        @click="handleOrderTableClick(scope.row)"
                        type="text"
                        size="medium"
                      >关闭自动续费</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  class="common-margin-top"
                  layout="prev, pager, next"
                  :page-size="pagenation.orderlog.pageSize"
                  @current-change="orderPageChange"
                  :total="pagenation.orderlog.total"
                ></el-pagination>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :xs="24" :md="8">
              <el-card>
                <template #header>流量视窗</template>
                <ve-ring
                  class="common-margin-top"
                  :data="ringChartData"
                  :settings="ringChartSettings"
                ></ve-ring>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :xs="24" :md="16">
              <el-card v-loading="trafficLogLoading">
                <template #header>72小时内流量使用记录</template>
                <ve-scatter
                  :tooltip="scaTooltip"
                  :after-set-option="afterConfig"
                  :data="lineChartDataCom"
                  :settings="lineChartSettings"
                ></ve-scatter>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :xs="24" :md="16"></el-col>
          </el-row>
          <div v-if="IsApple" style="height:46px"></div>
        </el-main>
        <charger
          :tool-tip-type="toolTipType"
          @close="handleChargerClose"
          @success="handleChargeSuccess"
          :visible="chargeDialogVisible"
          :global-config="globalConfig"
        ></charger>
        <el-footer height="46px">
          <div>
            ©{{globalConfig.dateY}} {{ globalConfig.appName }} | Powered by
            <el-button @click="staff = true" type="text">SSPANEL</el-button>
            <el-dialog append-to-body fullscreen :visible.sync="staff">
              <staff :global-config="globalConfig" @close="staff = false"></staff>
            </el-dialog>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Navmenu from "../../components/Navmenu.vue";
import Headertools from "../../components/Header.vue";
import Charger from "../../components/Charger.vue";
import PublicFunction from "../../mixins/publicfunction";
import Basejs from "../../mixins/base";
import Axios from "axios";
import ChargeModule from "../../mixins/charge";

export default {
  name: "Code",
  mixins: [Basejs, PublicFunction, ChargeModule],
  components: {
    navmenu: Navmenu,
    headertools: Headertools,
    charger: Charger
  },
  created() {
    this.initSite();
    this.getChargeLogData(1);
    this.getOrderLogData(1);
    Axios.get("/gettransfer", { withCredentials: true }).then(r => {
      let arr = r.data.arr;
      this.trafficResultData = [
        "unUsedTraffic" in arr && arr.unUsedTraffic ? arr.unUsedTraffic : 0,
        "lastUsedTraffic" in arr && arr.lastUsedTraffic
          ? arr.lastUsedTraffic
          : 0,
        "todayUsedTraffic" in arr && arr.todayUsedTraffic
          ? arr.todayUsedTraffic
          : 0
      ];
    });
    Axios.get("/user/trafficlog?json=1", { withCredentials: true }).then(r => {
      if (r.data.ret === 1) {
        let arr = r.data.traffic;
        let newArr = [];
        for (let i = 0; i <= arr.length - 1; i++) {
          newArr.push({
            产生时间: new Date(arr[i].log_time * 1000),
            "流量(KB)": arr[i].total_used
          });
          this.trafficResultData.push(arr[i].name);
        }
        this.lineChartData.rows = newArr;
        this.trafficLogLoading = false;
        console.log(this.lineChartData);
      }
    });
  },
  computed: {
    trafficRemain() {
      return (
        (this.userInfo.user.transfer_enable -
          this.userInfo.user.u -
          this.userInfo.user.d) /
        this.userInfo.user.transfer_enable
      );
    },
    trafficUsed() {
      return this.userInfo.user.last_day_t / this.userInfo.user.transfer_enable;
    },
    fraffictoday() {
      return (
        (this.userInfo.user.u +
          this.userInfo.user.d -
          this.userInfo.user.last_day_t) /
        this.userInfo.user.transfer_enable
      );
    },
    ringChartData() {
      return {
        columns: ["名称", "数据"],
        rows: [
          { 名称: "剩余流量", 数据: this.trafficRemain },
          { 名称: "过去已用", 数据: this.trafficUsed },
          { 名称: "今日已用", 数据: this.fraffictoday }
        ]
      };
    },
    lineChartDataCom() {
      return this.lineChartData;
    }
  },
  data() {
    return {
      pagename: "我的钱包",
      defaultOpenedsSubMenu: ["1"],
      defaultActiveMenuItem: "1-4",
      trafficLogLoading: true,
      pagenation: {
        chargelog: {
          currentPage: 1,
          total: 1,
          pageSize: 15
        },
        orderlog: {
          currentPage: 1,
          total: 1,
          pageSize: 15
        }
      },
      chargeData: [],
      orderData: [],
      ringChartSettings: {
        dataType: "percent",
        label: {
          formatter: params => {
            return `${params.data.name}: ${
              this.trafficResultData[params.dataIndex]
            }`;
          }
        }
      },
      lineChartSettings: {
        xAxisType: "time",
        yAxisName: ["流量(单位：KB)"]
      },
      lineChartData: {
        columns: ["产生时间", "流量(KB)"],
        rows: []
      },
      trafficResultData: [],
      scaTooltipNodeNamedata: [],
      scaTooltip: {
        formatter: data => {
          return `时间: ${data.data[0]}<br />节点：${
            this.trafficResultData[data.dataIndex]
          }<br />${data.marker} ${data.seriesName}: ${data.data[1]}`;
        }
      },
      toolTipType: "default",
      chargeDialogVisible: false
    };
  },
  methods: {
    handleOrderTableClick(row) {
      console.log(row);
      Axios({
        method: "delete",
        url: "/user/bought",
        data: JSON.stringify({
          current: row.id
        }),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        console.log(r);
        if (r.data.ret === 0) {
          this.$message.error(r.data.msg);
        } else {
          this.$message({
            message: r.data.msg,
            type: "success"
          });
          this.getOrderLogData();
        }
      });
    },
    getChargeLogData(page) {
      Axios({
        method: "post",
        url: "/getChargeLog",
        data: JSON.stringify({
          current: page
        }),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          this.chargeData = r.data.codes.data;
          this.pagenation.chargelog.total = r.data.codes.total;
        }
      });
    },
    getOrderLogData(page) {
      Axios.get(`/user/bought?page=${page}&json=1`, {
        withCredentials: true
      }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          this.orderData = r.data.shops.data;
          this.pagenation.orderlog.total = r.data.shops.total;
        }
      });
    },
    chargePageChange(currentPage) {
      console.log(currentPage);
      this.getChargeLogData(currentPage);
    },
    orderPageChange(currentPage) {
      console.log(currentPage);
      this.getOrderLogData(currentPage);
    },
    afterConfig(op) {
      op.setOption({
        xAxis: {
          boundaryGap: ["50%", "50%"],
          name: "时间"
        }
      });
    },
    handleChargeCommand(command) {
      this.toolTipType = command;
      this.chargeDialogVisible = true;
    },
    handleChargerClose() {
      this.chargeDialogVisible = false;
    },
    handleChargeSuccess() {
      this.getUserInfo();
      this.getChargeLogData(this.pagenation.chargelog.currentPage);
    }
  }
};
</script>

<style lang="stylus" scoped>
.chartlabel
  color: #606266
.statu
  @media only screen and (max-width: 1200px)
    margin-top: 1rem
.wallet
  width: 100%
.charge
  display: flex
  align-items: center
.pay-com
  @media only screen and (max-width: 1200px)
    margin-top: 1rem
</style>

