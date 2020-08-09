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
          <el-row v-if="ticketPageType === 'list'" :gutter="20">
            <el-col :span="24">
              <el-card>
                <el-alert
                  title="请勿连续新开工单"
                  type="warning"
                  description="工单系统用于解决问题，并非通讯工具，请知悉"
                  show-icon
                  :closable="false"
                ></el-alert>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <template #header>
                  <span>已发起工单列表</span>
                  <el-button
                    class="create-ticket"
                    style="float: right;"
                    size="mini"
                    @click="handleCreate"
                    type="primary"
                  >发起新的工单</el-button>
                </template>
                <el-table :data="ticketData" stripe style="width: 100%">
                  <el-table-column prop="datetime" label="发起日期"></el-table-column>
                  <el-table-column prop="title" show-overflow-tooltip label="工单标题"></el-table-column>
                  <el-table-column prop="status" :formatter="ticketStatusFomatter" label="工单状态"></el-table-column>
                  <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button @click="handleTicketClick(scope.row)" type="text" size="small">查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  class="common-margin-top"
                  layout="prev, pager, next"
                  :page-size="pagenation.ticket.pageSize"
                  @current-change="ticketPageChange"
                  :total="pagenation.ticket.total"
                ></el-pagination>
              </el-card>
            </el-col>
          </el-row>
          <el-row v-if="ticketPageType === 'create'">
            <el-col :span="24">
              <el-card :body-style="{ padding: '0px' }">
                <template #header>
                  <el-page-header class="header-inline" @back="goBack" content="创建工单"></el-page-header>
                </template>
                <div class="card-split-top">
                  <div>
                    <el-input v-model="newTicket.title" placeholder="请输入工单标题"></el-input>
                  </div>
                  <div class="mavon common-margin-top">
                    <mavon-editor
                      v-model="newTicket.markdown"
                      @imgAdd="handleImgAdd"
                      @change="handleCreateChange"
                    />
                  </div>
                </div>
                <el-button
                  type="primary"
                  :disabled="createBtnDisabled"
                  class="card-bottom-button"
                  @click="createTicket"
                >提交工单</el-button>
              </el-card>
            </el-col>
          </el-row>
          <el-row v-if="ticketPageType === 'detail'">
            <el-col :span="24">
              <el-card :body-style="{ padding: '0px' }">
                <template #header>
                  <el-page-header class="header-inline" @back="goBack" content="工单详情"></el-page-header>
                </template>
                <div class="card-split-top">
                  <div>
                    <el-card>
                      <div>{{ticketDetail.title}}</div>
                    </el-card>
                  </div>
                  <div class="common-margin-top">
                    <mavon-editor
                      v-model="ticketDetail.markdown"
                      @imgAdd="handleImgAdd"
                      @change="handleDetailChange"
                    />
                  </div>
                  <el-row class="common-margin-top" :gutter="20">
                    <el-col class="ticket-actions" :xs="24" :sm="8">
                      <el-button
                        type="primary"
                        :disabled="detailBtnDisabled"
                        @click="updateTicket(1)"
                      >添加回复</el-button>
                    </el-col>
                    <el-col class="ticket-actions" :xs="24" :sm="8">
                      <el-button
                        type="info"
                        :disabled="detailBtnDisabled"
                        @click="updateTicket(0)"
                      >添加回复并关闭工单</el-button>
                    </el-col>
                    <el-col class="ticket-actions" :xs="24" :sm="8">
                      <el-button
                        type="info"
                        :disabled="detailBtnDisabled"
                        @click="updateTicket(0,false)"
                      >直接关闭工单</el-button>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <el-pagination
                  layout="prev, pager, next"
                  :page-size="pagenation.ticketDetail.pageSize"
                  @current-change="ticketDetailPageChange"
                  :total="pagenation.ticketDetail.total"
                ></el-pagination>
              </el-card>
            </el-col>
            <el-col :span="24">
              <el-card
                class="common-margin-top"
                v-for="item in detailData"
                :key="`${item.title}${item.datetime}`"
              >
                <div class="card-avatar">
                  <div class="card-avatar-avatar">
                    <el-avatar :size="60">
                      <i class="el-icon-user"></i>
                    </el-avatar>
                  </div>
                  <div class="card-avatar-main">
                    <div class="card-avatar-title">{{item.username}}</div>
                    <div v-html="item.content" class="card-avatar-content card-avatar-content-sm"></div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <el-pagination
                  layout="prev, pager, next"
                  :page-size="pagenation.ticketDetail.pageSize"
                  @current-change="ticketDetailPageChange"
                  :total="pagenation.ticketDetail.total"
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
  name: "Ticket",
  mixins: [Basejs, PublicFunction],
  components: {
    navmenu: Navmenu,
    headertools: Headertools
  },
  computed: {},
  watch: {},
  data() {
    return {
      pagename: "工单系统",
      defaultActiveMenuItem: "5-2",
      defaultOpenedsSubMenu: ["5"],
      ticketData: [],
      pagenation: {
        ticket: {
          currentPage: 1,
          total: 1,
          pageSize: 15
        },
        ticketDetail: {
          currentPage: 1,
          total: 1,
          pageSize: 5
        }
      },
      ticketPageType: "list",
      createValue: "",
      newTicket: {
        content: "",
        markdown: "",
        title: ""
      },
      ticketDetail: {
        content: "",
        markdown: "",
        id: "",
        title: "",
        currentStatus: 1
      },
      detailData: [],
      createBtnDisabled: false,
      detailBtnDisabled: false
    };
  },

  created() {
    this.initSite();
    this.getTickets(1);
  },
  methods: {
    getTickets(page) {
      Axios.get(`/user/ticket?page=${page}&json=1`, {
        withCredentials: true
      }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          this.ticketData = r.data.tickets.data;
          this.pagenation.ticket.total = r.data.tickets.total;
          this.pagenation.ticket.currentPage = r.data.tickets.current_page;
        }
      });
    },
    ticketPageChange(currentPage) {
      this.getTickets(currentPage);
    },
    ticketDetailPageChange(currentPage) {
      this.getTicketDetail(this.ticketDetail.id, currentPage);
    },
    ticketStatusFomatter(row, column, cellValue, index) {
      if (row.status === 1) {
        return "工单服务中";
      } else {
        return "工单已结束";
      }
    },
    handleTicketClick(row) {
      this.ticketPageType = "detail";
      this.ticketDetail.title = row.title;
      this.ticketDetail.id = row.id;
      this.ticketDetail.currentStatus = row.status;
      this.getTicketDetail(row.id, 1);
    },
    getTicketDetail(id, page) {
      Axios.get(`/user/ticket/${id}/view?page=${page}&json=1`, {
        withCredentials: true
      }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          this.detailData = r.data.tickets.data;
          this.pagenation.ticketDetail.currentPage =
            r.data.tickets.current_page;
          this.pagenation.ticketDetail.total = r.data.tickets.total;
        }
      });
    },
    goBack() {
      this.ticketPageType = "list";
    },
    handleImgAdd() {
      this.$message.warning("无法上传本地图片，请使用图片链接");
    },
    handleCreate() {
      this.ticketPageType = "create";
    },
    handleCreateChange(value, render) {
      this.newTicket.content = render;
    },
    handleDetailChange(value, render) {
      this.ticketDetail.content = render;
    },
    createTicket() {
      this.createBtnDisabled = true;
      if (this.newTicket.title === "" || this.newTicket.content === "") {
        this.$message.error("标题和内容不能为空");
        this.createBtnDisabled = false;
        return;
      }
      let body = this.newTicket;
      Axios({
        method: "post",
        url: "/user/ticket",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret === 1) {
          this.$message.success(r.data.msg);
          this.goBack();
          this.newTicket.markdown = "";
          this.newTicket.title = "";
          this.createBtnDisabled = false;
          this.getTickets(this.pagenation.ticket.currentPage);
        } else {
          this.$message.error(r.data.msg);
          this.createBtnDisabled = false;
        }
      });
    },
    updateTicket(status, hascontent) {
      this.detailBtnDisabled = true;
      if (
        (this.ticketDetail.title === "" && hascontent !== false) ||
        (this.ticketDetail.content === "" && hascontent !== false)
      ) {
        this.$message.error("标题和内容不能为空");
        this.detailBtnDisabled = false;
        return;
      }
      let body = {
        content: this.ticketDetail.content,
        markdown: this.ticketDetail.markdown,
        status
      };
      if (status === 0 && hascontent === false) {
        if (this.ticketDetail.currentStatus === 0) {
          this.$message.error("这条工单已经被关闭");
          this.detailBtnDisabled = false;
          return;
        }
        body.content = "<p>这条工单已被关闭</p>";
        body.markdown = "";
      }
      console.log(body);
      Axios({
        method: "put",
        url: `/user/ticket/${this.ticketDetail.id}`,
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          this.$message.success(r.data.msg);
          this.goBack();
          this.ticketDetail.markdown = "";
          this.ticketDetail.title = "";
          this.getTickets(this.pagenation.ticket.currentPage);
          this.detailBtnDisabled = false;
        } else {
          this.$message.error(r.data.msg);
          this.detailBtnDisabled = false;
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.create-ticket
  position: relative
  bottom: 5px
.ticket-actions button
  width: 100%
@media only screen and (max-width: 768px)
  for i in 2 3
    .ticket-actions:nth-child({i})
      margin-top: 20px
</style>

