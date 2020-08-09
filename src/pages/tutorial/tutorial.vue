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
          <el-row v-if="type === 'index'" :gutter="20">
            <el-col
              class="tutorial"
              v-for="(item,index) in tutorials"
              :key="item.id"
              :xs="24"
              :sm="12"
            >
              <el-card>
                <el-row type="flex" justify="space-between">
                  <span>{{item.title}}</span>
                  <el-button class="tutorial-check" @click="handleCheck(item,index)" type="text">查看</el-button>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
          <el-row v-if="type === 'detail'">
            <el-card>
              <template #header>
                <el-page-header
                  class="header-inline"
                  @back="goBack"
                  :content="tutorials[currentTutorialIndex].title"
                ></el-page-header>
              </template>
              <el-card
                class="tutorial-card"
                v-for="card in tutorials[currentTutorialIndex].children"
                :key="card.date"
                shadow="hover"
              >
                <div v-html="card.html"></div>
              </el-card>
            </el-card>
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
  name: "Announcement",
  mixins: [Basejs, PublicFunction],
  components: {
    navmenu: Navmenu,
    headertools: Headertools
  },
  computed: {
    tutorials() {
      let result = this.globalConfig.next_config.tutorials.value;
      return result === "" ? [] : JSON.parse(result);
    }
  },
  data() {
    return {
      pagename: "使用教程",
      defaultOpenedsSubMenu: ["5"],
      defaultActiveMenuItem: "5-1",
      type: "index",
      currentTutorialIndex: 0
    };
  },
  created() {
    this.initSite();
  },
  methods: {
    goBack() {
      this.type = "index";
    },
    handleCheck(item, index) {
      this.type = "detail";
      this.currentTutorialIndex = index;
    }
  }
};
</script>

<style lang="stylus" scoped>
.tutorial
  margin-top: 20px
.tutorial:nth-child(1)
  margin-top: 0
@media (min-width: 768px)
  .tutorial:nth-child(2)
    margin-top: 0
.tutorial-check
  padding: 0
.tutorial-card
  margin-top: 20px
.tutorial-card:nth-child(1)
  margin-top: 0
</style>

