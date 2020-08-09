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
                <el-alert :closable="false" title="敬告各位用户" type="warning" show-icon>
                  <div>为了爱与和平，也同时为了系统的正常运行，特制定了如下过滤规则，当您使用节点执行这些动作时，您的通信就会被截断</div>
                  <div>
                    关于隐私：注意，我们仅用以下规则进行实时匹配和记录匹配到的规则，
                    您的通信方向和通信内容我们不会做任何记录，请您放心。也请您理解我们对于这些不当行为的管理，谢谢。
                  </div>
                </el-alert>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <template #header>规则</template>
                <el-table stripe :data="detectData" style="width: 100%">
                  <el-table-column prop="id" label="ID"></el-table-column>
                  <el-table-column prop="name" label="名称"></el-table-column>
                  <el-table-column prop="text" label="描述"></el-table-column>
                  <el-table-column prop="regex" show-overflow-tooltip label="正则表达式"></el-table-column>
                </el-table>
                <el-pagination
                  class="common-margin-top"
                  layout="prev, pager, next"
                  :page-size="pagenation.detect.pageSize"
                  @current-change="detectPageChange"
                  :total="pagenation.detect.total"
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
  name: "Detect",
  mixins: [Basejs, PublicFunction],
  components: {
    navmenu: Navmenu,

    headertools: Headertools
  },
  computed: {},
  data() {
    return {
      pagename: "审计规则公示",
      defaultOpenedsSubMenu: ["6"],
      defaultActiveMenuItem: "6-1",
      detectData: [],
      pagenation: {
        detect: {
          currentPage: 1,
          total: 1,
          pageSize: 15
        }
      }
    };
  },
  created() {
    this.getDetectData(1);
    this.initSite();
  },
  methods: {
    getDetectData(page) {
      Axios.get(`/user/detect?page=${page}&json=1`, {
        withCredentials: true
      }).then(r => {
        this.detectData = r.data.logs.data;
        this.pagenation.detect.currentPage = r.data.logs.current_page;
        this.pagenation.detect.total = r.data.logs.total;
      });
    },
    detectPageChange(currentPage) {
      this.getDetectData(currentPage);
    }
  }
};
</script>

<style lang="stylus" scoped></style>

