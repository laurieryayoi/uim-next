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
            <el-col :span="24">
              <el-tabs
                class="nodelist-tabs"
                v-loading="loading"
                v-if="componentType === 'list'"
                type="border-card"
                v-model="activeTabName"
              >
                <el-tab-pane v-for="(value,key) in nodeList" :name="key" :key="key" :label="key">
                  <el-col
                    class="card-node"
                    :xs="24"
                    :sm="12"
                    :lg="8"
                    v-for="node in value"
                    :key="node.id"
                  >
                    <el-card shadow="hover" :body-style="{ padding: '0px' }">
                      <div
                        class="card-node-main"
                        @click="enterNode(node.id,node.sort,node.isTrafficUsedUp())"
                      >
                        <div class="card-node-main-top">
                          <div class="card-node-flag">
                            <span>
                              <img
                                class="flag"
                                v-if="globalConfig.enable_flag === true"
                                :src="'/images/prefix/' + node.flag"
                                alt
                              />
                              <el-tooltip
                                :disabled="node.flagTooltipDisabled"
                                class="item"
                                effect="dark"
                                placement="top"
                              >
                                <template #content>{{node.name | flagFilter}}</template>
                                <span
                                  @mouseenter="detectOverflowTooltip($event,node,'flag')"
                                  class="card-flag-name"
                                >{{node.name | flagFilter}}</span>
                              </el-tooltip>
                            </span>
                          </div>
                          <div class="card-node-loads">
                            <el-tooltip class="item" effect="dark" placement="top">
                              <template #content>
                                节点状态：
                                <span class="text-alert">{{onlineContent(node.online)}}</span>
                              </template>
                              <div>
                                <span :class="oblineStatus(node.online)"></span>
                              </div>
                            </el-tooltip>
                            <el-tooltip
                              class="item"
                              effect="dark"
                              content="节点在线人数"
                              placement="top-end"
                            >
                              <div>
                                <span class="text-alert">{{node.online_user}}&nbsp;</span>
                                <i class="el-icon-user"></i>
                              </div>
                            </el-tooltip>
                          </div>
                        </div>
                        <el-tooltip
                          :disabled="node.nameTooltipDisabled"
                          class="item"
                          effect="dark"
                          placement="top"
                        >
                          <template #content>{{node.name | nameFilter}}</template>
                          <div
                            @mouseenter="detectOverflowTooltip($event,node,'name')"
                            class="card-node-name text-alert"
                          >{{node.name | nameFilter}}</div>
                        </el-tooltip>
                        <el-tooltip
                          :disabled="node.stateTooltipDisabled"
                          class="item"
                          effect="dark"
                          placement="top"
                        >
                          <template #content>{{node.status}}</template>
                          <div
                            @mouseenter="detectOverflowTooltip($event,node,'state')"
                            class="card-node-status"
                          >{{node.status}}</div>
                        </el-tooltip>
                      </div>
                      <div class="card-node-bottom">
                        <div class="card-node-bottom-top">
                          <el-tooltip class="item" effect="dark" content="节点流量概况" placement="top">
                            <div>
                              <i class="el-icon-s-data"></i>
                              &nbsp;
                              {{node.traffic_used}}&nbsp;/&nbsp;{{node.traffic_limit | trafficFilter}}&nbsp;GB
                            </div>
                          </el-tooltip>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="node.info"
                            placement="top-end"
                          >
                            <div class="card-node-info">
                              <i class="el-icon-info"></i>
                            </div>
                          </el-tooltip>
                        </div>
                        <div class="card-node-bottom-end">
                          <el-tooltip class="item" effect="dark" content="节点最高速率" placement="top">
                            <span>
                              <i class="el-icon-sort"></i>
                              &nbsp;
                              <span
                                class="card-node-text-sm"
                              >{{node.bandwidth}}</span>
                            </span>
                          </el-tooltip>
                          <el-tooltip class="item" effect="dark" content="节点使用倍率" placement="top">
                            <span>
                              <i class="el-icon-odometer"></i>&nbsp;
                              <span class="card-node-text-sm">{{node.traffic_rate}}</span>&nbsp;x
                            </span>
                          </el-tooltip>
                          <el-tooltip class="item" effect="dark" content="节点负载情况" placement="top">
                            <span>
                              <i class="el-icon-timer"></i>&nbsp;
                              <span
                                class="card-node-text-sm"
                              >{{node.latest_load | loadfilter}}</span>&nbsp;%
                            </span>
                          </el-tooltip>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                </el-tab-pane>
              </el-tabs>
              <el-card v-if="componentType === 'detail'">
                <template #header>
                  <el-page-header class="header-inline" @back="goBack" content="节点详情"></el-page-header>
                  <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                </template>
                <component :node-detail="nodeDetail" :node-muport="nodeMuport" :is="detailType"></component>
              </el-card>
            </el-col>
          </el-row>
          <div v-if="IsApple" style="height:46px"></div>
        </el-main>
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
import PublicFunction from "../../mixins/publicfunction";
import Basejs from "../../mixins/base";
import { getStyle } from "element-ui/src/utils/dom";
import Axios from "axios";
import ss from "../../components/nodeinfo/ssdetail.vue";
import v2ray from "../../components/nodeinfo/v2raydetail.vue";

export default {
  name: "Node",
  mixins: [Basejs, PublicFunction],
  components: {
    navmenu: Navmenu,
    headertools: Headertools,
    ss,
    v2ray
  },
  computed: {
    detailType() {
      let sort = this.nodeDetailSort;
      if (sort === 0 || sort === 10 || sort === 13) {
        return "ss";
      } else {
        return "v2ray";
      }
    }
  },
  filters: {
    flagFilter(val) {
      return val.split(" -")[0].replace(/^\s*|\s*$/g, "");
    },
    nameFilter(val) {
      let result = val.split(" -");
      if (result.length === 1) {
        console.log(result);
        return result[0].replace(/^\s*|\s*$/g, "");
      } else {
        return result[1].replace(/^\s*|\s*$/g, "");
      }
    },
    trafficFilter(val) {
      return val === 0 ? "∞" : val;
    },
    loadfilter(val) {
      if (val === -1) {
        return 0;
      } else {
        return parseFloat(val).toFixed(0);
      }
    }
  },
  data() {
    return {
      pagename: "节点列表",
      defaultOpenedsSubMenu: ["3"],
      defaultActiveMenuItem: "3-1",
      activeTabName: "",
      nodeList: "",
      nodeDetail: "",
      nodeDetailSort: "",
      nodeMuport: [],
      componentType: "list",
      activeNodeInfoType: "SSR",
      loading: true
    };
  },

  created() {
    this.initSite();
    this.activeTabName = "LEVEL.0";
    Axios.get("/getnodelist", { withCredentials: true }).then(r => {
      let arr = r.data.nodeinfo.nodes;
      let result = {};
      let result2 = [];
      for (let i = 0; i <= arr.length - 1; i++) {
        arr[i].nameTooltipDisabled = true;
        arr[i].flagTooltipDisabled = true;
        arr[i].stateTooltipDisabled = true;
        arr[i].isTrafficUsedUp = () => {
          if (arr[i].traffic_limit === 0) {
            return false;
          } else {
            return arr[i].traffic_limit <= arr[i].traffic_used;
          }
        };
        if (!(`LEVEL.${arr[i].class}` in result)) {
          result[`LEVEL.${arr[i].class}`] = [];
          result[`LEVEL.${arr[i].class}`].push(arr[i]);
        } else {
          result[`LEVEL.${arr[i].class}`].push(arr[i]);
        }
      }
      console.log(result);
      this.nodeList = result;
      this.nodeMuport = r.data.nodeinfo.nodes_muport;
      this.loading = false;
    });
  },
  methods: {
    detectOverflowTooltip(event, node, type) {
      let el = event.target;
      const range = document.createRange();
      range.setStart(el, 0);
      range.setEnd(el, el.childNodes.length);
      const rangeWidth = range.getBoundingClientRect().width;
      const padding =
        (parseInt(getStyle(el, "paddingLeft"), 10) || 0) +
        (parseInt(getStyle(el, "paddingRight"), 10) || 0);
      if (
        rangeWidth + padding > el.offsetWidth ||
        el.scrollWidth > el.offsetWidth
      ) {
        switch (type) {
          case "name":
            node.nameTooltipDisabled = false;
            break;
          case "flag":
            node.flagTooltipDisabled = false;
            break;
          case "state":
            node.stateTooltipDisabled = false;
            break;
        }
      }
    },
    oblineStatus(num) {
      switch (num) {
        case 1:
          return "online";
        case 0:
          return "pending";
        case -1:
          return "offline";
      }
    },
    onlineContent(num) {
      switch (num) {
        case 1:
          return "在线";
        case 0:
          return "准备中";
        case -1:
          return "离线";
      }
    },
    vhref() {
      if (window.location.hash === "") {
        return "/";
      } else {
        return window.location.hash;
      }
    },
    goBack() {
      this.componentType = "list";
    },
    enterNode(id, sort, isTrafficUsedUp) {
      if (isTrafficUsedUp) {
        this.$message.error("节点流量已耗尽");
        return;
      }
      this.loading = true;
      this.nodeDetailSort = sort;
      Axios.get(`/nodeinfo/${id}`, { withCredentials: true }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          if (this.userInfo.user.class < r.data.nodeInfo.node.class) {
            this.$message.warning("您的用户等级无法查看此节点的详情");
            this.loading = false;
          } else {
            this.nodeDetail = r.data;
            this.componentType = "detail";
            this.loading = false;
          }
        } else {
          this.$message.error(r.data.msg);
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.card-node
  margin-top: 20px
.card-node:nth-child(1)
  margin-top: 0
.card-node:nth-child(2)
  @media only screen and (min-width: 768px)
    margin-top: 0
.card-node:nth-child(3)
  @media only screen and (min-width: 1200px)
    margin-top: 0
.card-node-main, .card-node-bottom
  padding: 10px
.card-node-main
  border-bottom: 1px solid #EBEEF5
  font-weight: 600
  margin-top: 0.3rem
  cursor: pointer
.card-node-main-top, .card-node-bottom-top
  display: flex
  justify-content: space-between
.card-node-loads
  text-align: right
.card-node-info
  font-size: 20px
  width: 25px
.card-node-name
  font-size: 120%
  margin-top: 1.2rem
.card-node-status
  font-size: 13px
  margin-top: 0.3rem
  color: #909399
.card-node-text-sm
  font-size: 14px
.card-node-bottom
  background-color: #fafcff
  color: #606266
  font-weight: 600
.card-node-bottom-end>span
  margin-right: 1rem
.card-node-flag
  margin-left: -10px
  max-width: 70%
.card-node-flag>span
  background-color: rgba(93, 101, 105, 0.7)
  color: #FFFFFF
  padding: 7px 16px
  border-radius: 0 100px 100px 0
  display: flex
  align-items: flex-end
.card-flag-name
  font-size: 13px
.card-node-name, .card-flag-name, .card-node-status
  text-overflow: ellipsis
  overflow: hidden
  white-space: nowrap
.online
  background-color: #67C23A
  box-shadow: 0 0 5px 0 #67C23A
.offline
  background-color: #F56C6C
  box-shadow: 0 0 5px 0 #F56C6C
.pending
  background-color: #E6A23C
  box-shadow: 0 0 5px 0 #E6A23C
.online, .offline, .pending
  height: 20px
  margin-bottom: 0.5rem
  width: 60px
  border-radius: 100px
  display: inline-block
.flag
  height: 17px
  position: relative
  top: 0
  margin-right: 0.3rem
.nodelist-tabs
  min-height: 200px
</style>

