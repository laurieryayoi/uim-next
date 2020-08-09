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
                <el-alert :closable="false" title="本站公告" type="info" show-icon>
                  <div>部分公告具有时效性，请根据内容自行判断是否有效</div>
                </el-alert>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <template #header>公告列表</template>
                <el-table stripe :data="announcementData" style="width: 100%">
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-form label-position="left" inline class="ann-table-expand">
                        <el-form-item label="公告ID">
                          <span>{{ props.row.id }}</span>
                        </el-form-item>
                        <el-form-item label="日期">
                          <span>{{ props.row.date }}</span>
                        </el-form-item>
                        <el-form-item label="内容">
                          <div v-html="props.row.content"></div>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="id" label="ID"></el-table-column>
                  <el-table-column prop="date" label="日期"></el-table-column>
                </el-table>
                <!-- <el-pagination
                  class="common-margin-top"
                  layout="prev, pager, next"
                  :page-size="pagenation.announcement.pageSize"
                  @current-change="announcementPageChange"
                  :total="pagenation.announcement.total"
                ></el-pagination>-->
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
  name: "Announcement",
  mixins: [Basejs, PublicFunction],
  components: {
    navmenu: Navmenu,
    headertools: Headertools
  },
  computed: {},
  data() {
    return {
      pagename: "公告栏",
      defaultOpenedsSubMenu: ["1"],
      defaultActiveMenuItem: "1-5",
      announcementData: [],
      pagenation: {
        announcement: {
          currentPage: 1,
          total: 1,
          pageSize: 15
        }
      }
    };
  },
  created() {
    this.getAnnouncementData(1);
    this.initSite();
  },
  methods: {
    getAnnouncementData(page) {
      Axios.get(`/user/announcement?json=1`, {
        withCredentials: true
      }).then(r => {
        console.log(r);
        this.announcementData = r.data.Anns;
        // this.pagenation.announcement.currentPage = r.data.Anns.current_page;
        // this.pagenation.announcement.total = r.data.Anns.total;
      });
    },
    announcementPageChange(currentPage) {
      this.getAnnouncementData(currentPage);
    }
  }
};
</script>

<style lang="stylus" scoped></style>

