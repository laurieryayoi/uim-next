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
              <el-card>
                <el-alert :closable="false" title="系统中所有审计记录" type="warning" show-icon>
                  <div>
                    关于隐私：注意，我们仅用以下规则进行实时匹配和记录匹配到的规则，
                    您的通信方向和通信内容我们不会做任何记录，请您放心。也请您理解我们对于这些不当行为的管理，谢谢。
                  </div>
                </el-alert>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <template #header>审计记录</template>
                <el-table stripe :data="detectLogData" style="width: 100%">
                  <el-table-column prop="id" label="ID"></el-table-column>
                  <el-table-column prop="node_id" label="节点ID"></el-table-column>
                  <el-table-column prop="node_name" show-overflow-tooltip label="节点名称"></el-table-column>
                  <el-table-column prop="list_id" label="规则ID"></el-table-column>
                  <el-table-column prop="detect_rule_name" show-overflow-tooltip label="规则名称"></el-table-column>
                  <el-table-column prop="detect_rule_text" show-overflow-tooltip label="规则描述"></el-table-column>
                  <el-table-column prop="detect_rule_regex" show-overflow-tooltip label="正则表达式"></el-table-column>
                  <el-table-column prop="detect_rule_type" :formatter="logTypeFormatter" label="类型"></el-table-column>
                  <el-table-column prop="detect_rule_date" show-overflow-tooltip label="时间"></el-table-column>
                </el-table>
                <el-pagination
                  class="common-margin-top"
                  layout="prev, pager, next"
                  :page-size="pagenation.detectlog.pageSize"
                  @current-change="detectLogPageChange"
                  :total="pagenation.detectlog.total"
                ></el-pagination>
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
import Axios from "axios";

export default {
  name: "DetectLog",
  mixins: [Basejs, PublicFunction],
  components: {
    navmenu: Navmenu,
    headertools: Headertools
  },
  computed: {},
  data() {
    return {
      pagename: "审计记录查看",
      defaultOpenedsSubMenu: ["6"],
      defaultActiveMenuItem: "6-2",
      detectLogData: [],
      pagenation: {
        detectlog: {
          currentPage: 1,
          total: 1,
          pageSize: 15
        }
      }
    };
  },

  created() {
    this.getDetectLogData(1);
    this.initSite();
  },
  methods: {
    getDetectLogData(page) {
      Axios.get(`/user/detect/log?page=${page}&json=1`, {
        withCredentials: true
      }).then(r => {
        console.log(r);
        this.detectLogData = r.data.logs.data;
        this.pagenation.detectlog.currentPage = r.data.logs.current_page;
        this.pagenation.detectlog.total = r.data.logs.total;
      });
    },
    detectLogPageChange(currentPage) {
      this.getDetectLogData(currentPage);
    },
    logTypeFormatter(row, column, cellValue, index) {
      if (cellValue === 1) {
        return "数据包明文匹配";
      } else if (cellValue === 2) {
        return "数据包 hex 匹配";
      }
    }
  }
};
</script>

<style lang="stylus" scoped></style>

