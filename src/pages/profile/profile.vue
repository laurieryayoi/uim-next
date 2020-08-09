<template>
  <el-col v-loading="globalLoading" id="app">
    <el-container class="container-body">
      <el-aside width="200px">
        <el-drawer
          title="我是标题"
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
          <el-row>
            <el-col :span="24">
              <el-card>
                <template #header>
                  <i class="el-icon-user"></i>
                  Hi! {{userInfo.user.email}}
                  <el-dropdown
                    @command="accountCommand"
                    trigger="click"
                    style="float: right; padding: 3px 0"
                  >
                    <span class="el-dropdown-link">
                      帐号编辑
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="theme" icon="el-icon-ice-drink">主题修改</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <el-card shadow="hover">
                  帐号有效期截至：
                  <span class="text-alert">{{userInfo.user.expire_in}}</span>
                </el-card>
                <el-alert
                  class="common-margin-top"
                  title="下面是你的账号设置"
                  type="info"
                  description="包含一些设置项和记录，如发现任何异常请联系管理员"
                  show-icon
                  :closable="false"
                ></el-alert>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <template #header>
                  <i class="el-icon-setting"></i> 安全设置
                </template>
                <el-row :gutter="20">
                  <el-col
                    :xs="24"
                    :sm="12"
                    class="security-item"
                    v-for="card in securityButton"
                    :key="card.name"
                    v-loading="card.isloading"
                  >
                    <el-card @click.native="handleCardClick(card)" shadow="hover">
                      <div class="card-avatar">
                        <div class="card-avatar-avatar">
                          <el-avatar :size="60">
                            <i :class="card.icon"></i>
                          </el-avatar>
                        </div>
                        <div class="card-avatar-main">
                          <div class="card-avatar-title">{{card.title}}</div>
                          <div class="card-avatar-content">
                            <span>{{card.content}}</span>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <template #header>
                  <i class="el-icon-location-outline"></i> 最近五分钟使用IP
                </template>
                <el-table stripe :data="userIpData" style="width: 100%">
                  <el-table-column prop="ip" label="IP"></el-table-column>
                  <el-table-column prop="location" label="地点"></el-table-column>
                </el-table>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <template #header>
                  <i class="el-icon-location-outline"></i> 最近十次登录IP
                </template>
                <el-table stripe :data="userLoginIpData" style="width: 100%">
                  <el-table-column prop="ip" label="IP"></el-table-column>
                  <el-table-column prop="location" label="地点"></el-table-column>
                </el-table>
              </el-card>
            </el-col>
            <el-col
              v-if="globalConfig.subscribeLog_show && globalConfig.subscribeLog"
              class="common-margin-top"
              :span="24"
            >
              <el-card>
                <template #header>
                  <i class="el-icon-notebook-1"></i> 订阅记录
                </template>
                <el-table stripe :data="subscribeLogData" style="width: 100%">
                  <el-table-column width="80px" prop="id" label="ID"></el-table-column>
                  <el-table-column width="120px" prop="subscribe_type" label="订阅类型"></el-table-column>
                  <el-table-column prop="request_ip" label="IP"></el-table-column>
                  <el-table-column prop="location" :formatter="locationFormatter" label="归属地"></el-table-column>
                  <el-table-column prop="request_time" label="时间"></el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    prop="request_user_agent"
                    label="User-Agent"
                  ></el-table-column>
                </el-table>
                <el-pagination
                  class="common-margin-top"
                  layout="prev, pager, next"
                  :page-size="pagenation.subscribeLog.pageSize"
                  @current-change="subscribeLogPageChange"
                  :total="pagenation.subscribeLog.total"
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

    <el-dialog
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      @open="handleSecurityOpen"
      @closed="handleSecurityClose"
    >
      <template #title>{{dialogTitle}}</template>
      <component
        :is="profileModuleComponent"
        :global-config="globalConfig"
        :user-info="userInfo"
        @update-success="onUpdateSUccess"
        @update-denied="onUpdateDenied"
        :dialog-confirm="dialogConfirm"
        :dialog-cancel="dialogCancel"
      ></component>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          v-if="showConfirm"
          :disabled="dialogConfirmDisabled"
          @click="handleDialogConfirm"
        >{{dialogConfirmContent}}</el-button>
      </span>
    </el-dialog>
  </el-col>
</template>

<script>
import Navmenu from "../../components/Navmenu.vue";
import Headertools from "../../components/Header.vue";
import profileModule from "../../mixins/profile";
import PublicFunction from "../../mixins/publicfunction";
import Basejs from "../../mixins/base";
import Axios from "axios";

export default {
  name: "Profile",
  mixins: [Basejs, PublicFunction, profileModule],
  components: {
    navmenu: Navmenu,
    headertools: Headertools
  },
  computed: {
    showConfirm() {
      if (
        this.userInfo.user.ga_enable &&
        this.dialogType === "two-step-authenticator"
      ) {
        return false;
      } else {
        return true;
      }
    },
    isTelegramLoading() {
      return this.tgStatuSend;
    },
    securityButton() {
      let arr = [
        {
          icon: "el-icon-key",
          title: "异常情况请及时修改登陆密码",
          content: "修改登录密码",
          name: "password",
          show: true,
          isloading: false
        },
        {
          icon: "el-icon-lock",
          title: "为账号添加一层安全保障",
          content: "二步验证",
          name: "two-step-authenticator",
          show: true,
          isloading: false
        },
        {
          icon: "el-icon-s-promotion",
          title: "绑定后可使用更多便捷功能",
          content: "绑定Telegram帐号",
          name: "telegram",
          show: true,
          isloading: this.isTelegramLoading
        },
        {
          icon: "el-icon-s-promotion",
          title: "日常邮件通知设置",
          content: "每日邮件",
          name: "dailymail",
          show: true,
          isloading: false
        }
      ];
      if (this.enableKill) {
        let kill = {
          icon: "el-icon-no-smoking",
          title: "戒除网瘾，快活似神仙",
          content: "注销帐号",
          name: "delete-account",
          show: this.enableKill,
          isloading: false
        };
        arr.push(kill);
      }

      return arr;
    },
    enableKill() {
      return this.globalConfig.enable_kill;
    }
  },
  filters: {},
  data() {
    return {
      pagename: "账户设置",
      defaultOpenedsSubMenu: ["1"],
      defaultActiveMenuItem: "1-2",
      userIpData: [],
      userLoginIpData: [],
      subscribeLogData: [],
      pagenation: {
        subscribeLog: {
          currentPage: 1,
          total: 1,
          pageSize: 15
        }
      },
      dialogVisible: false,
      dialogWidth: "30%",
      dialogType: "",
      dialogTitle: "",
      dialogCancel: false,
      dialogConfirm: false,
      dialogConfirmDisabled: false,
      dialogConfirmContent: "确 定",
      statuReqId: 0,
      tgStatuSend: false
    };
  },

  created() {
    this.initSite();
    Axios.get("/user/profile?json=1", { withCredentials: true }).then(r => {
      console.log(r);
      for (let key in r.data.userloginip) {
        let obj = {
          ip: key,
          location: r.data.userloginip[key]
        };
        this.userLoginIpData.push(obj);
      }
      for (let key in r.data.userip) {
        let obj = {
          ip: key,
          location: r.data.userip[key]
        };
        this.userIpData.push(obj);
      }
    });
    this.getSubscribeLog(1);
  },
  watch: {
    "userInfo.user.telegram_id": {
      handler(val) {
        if (this.dialogType === "telegram") {
          if (val !== 0) {
            this.dialogConfirmContent = "解绑";
          } else {
            this.dialogConfirmContent = "我已绑定";
          }
        }
      },
      deep: true
    }
  },
  methods: {
    getSubscribeLog(page) {
      Axios.get(`/user/subscribe_log?page=${page}&json=1`, {
        withCredentials: true
      }).then(r => {
        console.log(r);
        this.subscribeLogData = r.data.logs.data;
        this.pagenation.subscribeLog.currentPage = r.data.logs.current_page;
        this.pagenation.subscribeLog.total = r.data.logs.total;
      });
    },
    locationFormatter(row, column, cellValue, index) {
      return `${row.country}-${row.area}`;
    },
    subscribeLogPageChange(currentPage) {
      this.getSubscribeLog(currentPage);
    },
    accountCommand(command) {
      if (command === "theme") {
        this.dialogVisible = true;
        this.dialogType = command;
        this.dialogTitle = "主题修改";
      }
    },
    handleSecurityOpen() {
      if (window.innerWidth <= 1200 && window.innerWidth > 768) {
        this.dialogWidth = "50%";
      } else if (window.innerWidth <= 768 && window.innerWidth > 500) {
        this.dialogWidth = "70%";
      } else if (window.innerWidth <= 500) {
        this.dialogWidth = "90%";
      } else {
        this.dialogWidth = "35%";
      }
      this.getButtonContent();
    },
    getButtonContent() {
      if (this.dialogType === "two-step-authenticator") {
        this.dialogConfirmContent = "下一步";
      } else if (this.dialogType === "telegram") {
        if (this.userInfo.user.telegram_id !== 0) {
          this.dialogConfirmContent = "解绑";
        } else {
          this.dialogConfirmContent = "我已绑定";
        }
      } else {
        this.dialogConfirmContent = "确 认";
      }
    },
    handleSecurityClose() {
      this.dialogCancel = !this.dialogCancel;
    },
    handleCardClick(item) {
      this.dialogVisible = true;
      this.dialogType = item.name;
      this.dialogTitle = item.content;
    },
    handleDialogCancel() {},
    handleDialogConfirm() {
      this.dialogConfirm = !this.dialogConfirm;
      this.dialogConfirmDisabled = true;
    },
    onUpdateSUccess(config) {
      if (!config || config.close || !("close" in config)) {
        this.dialogVisible = false;
      }

      if (config && "ga" in config && config.ga === 0) {
        this.userInfo.user.ga_enable = 0;
      } else if ("ga" in config && config.ga === 1) {
        this.userInfo.user.ga_enable = 1;
      }

      if (config && "confirm" in config) {
        this.dialogConfirmContent = "确 认";
      }

      if (config && "tg" in config && config.tg === 0) {
        this.userInfo.user.telegram_id = 0;
      } else if ("tg" in config && config.tg === 1) {
        this.$notify({
          title: "已发送请求",
          message: "如长时间未通知成功请重试",
          type: "success"
        });
        this.getTgstatus();
      }

      if (config && "mail" in config && config.mail) {
        this.userInfo.user.sendDailyMail = 1;
      } else if (config && "mail" in config && !config.mail) {
        this.userInfo.user.sendDailyMail = 0;
      }

      this.dialogConfirmDisabled = false;
    },
    onUpdateDenied(config) {
      if (config && "qr" in config && config.qr === "refresh") {
        this.getUserInfo();
        this.$notify({
          title: "验证信息更新中",
          message: "请稍等片刻后再次尝试绑定",
          type: "success"
        });
      }
      this.dialogConfirmDisabled = false;
    },
    getTgstatus() {
      this.tgStatuSend = true;
      this.getUserInfo(false, () => {
        if (this.statuReqId === 10 && this.userInfo.user.telegram_id === 0) {
          this.$message.error("Telegram绑定失败，请刷新验证信息重试");
          this.tgStatuSend = false;
          return;
        }
        if (this.userInfo.user.telegram_id === 0) {
          this.getTgstatus();
          this.statuReqId++;
        } else {
          this.$message({
            message: "Telegram绑定成功！",
            type: "success"
          });
          this.tgStatuSend = false;
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.security-item
  margin-top: 1rem
for i in 1 2
  .security-item:nth-child({i})
    margin-top: 0
.security-item:nth-child(2)
  @media only screen and (max-width: 768px)
    margin-top: 1rem
</style>

