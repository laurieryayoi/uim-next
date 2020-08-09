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
          <el-row>
            <el-col :span="24">
              <el-row :gutter="20">
                <el-col
                  class="pandect-container"
                  :xs="24"
                  :sm="12"
                  :lg="6"
                  v-for="(item, index) in pandectCom"
                  :key="item.title"
                >
                  <el-card class="pandect">
                    <el-row>
                      <el-col :span="14">
                        <span class="pandect-title">
                          {{ item.title }}
                          <el-dropdown
                            v-if="index === 1"
                            trigger="click"
                            @command="handleChargeCommand"
                          >
                            <el-tag
                              v-if="index === 1"
                              class="tag-function"
                              size="mini"
                              type="success"
                            >充值</el-tag>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item command="code">充值码</el-dropdown-item>
                              <el-dropdown-item command="payments">云支付</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </span>
                        <el-tooltip class="item" effect="dark" placement="top">
                          <template #content>
                            <div>
                              等级到期时间：
                              <span class="text-alert">{{userInfo.user.class_expire}}</span>
                            </div>
                            <div>
                              账户到期时间：
                              <span class="text-alert">{{userInfo.user.expire_in}}</span>
                            </div>
                          </template>
                          <i v-if="index === 0" class="el-icon-warning-outline class-alert"></i>
                        </el-tooltip>
                        <div class="pandect-content">
                          <span v-if="index === 1">{{ `${item.content} ` | creditFilter }}&nbsp;</span>
                          <span v-else>{{ item.content }}&nbsp;</span>
                        </div>
                      </el-col>
                      <el-col class="pandect-right" :span="10">
                        <el-avatar :size="44" :icon="item.icon"></el-avatar>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
              </el-row>
            </el-col>
            <el-col class="profile gutter-top" :span="24">
              <el-row :gutter="20">
                <el-col :xs="24" :lg="12">
                  <el-card class="trafficbars">
                    <div slot="header" class="clearfix">
                      <span>
                        流量使用情况
                        <el-popover
                          title="签到"
                          width="280"
                          trigger="manual"
                          v-model="signerVisible"
                          @show="initCaptcha('captcha-container','enable_checkin_captcha',()=>{captchaLoading=false})"
                        >
                          <div v-loading="captchaLoading">
                            <p v-if="userInfo.user.isAbleToCheckin">点击签到按钮或摇一摇手机签到</p>
                            <p v-else>今天已经签到过啦</p>
                            <div
                              v-if="globalConfig.enable_checkin_captcha"
                              id="captcha-container"
                              data-size="compact"
                              :data-sitekey="globalConfig.recaptcha_sitekey"
                            ></div>
                            <div style="text-align: right; margin: 0">
                              <el-button size="mini" type="text" @click="signerVisible = false">取消</el-button>
                              <el-button
                                type="primary"
                                :disabled="!userInfo.user.isAbleToCheckin"
                                size="mini"
                                @click="handleSignConfirm"
                              >签到</el-button>
                            </div>
                          </div>

                          <el-tag
                            slot="reference"
                            class="tag-function"
                            @click="signerVisible=!signerVisible"
                            size="mini"
                          >签到</el-tag>
                        </el-popover>
                      </span>
                      <el-button
                        style="float: right; padding: 3px 0"
                        type="text"
                        @click="routeChange('/user/shop')"
                      >购买套餐</el-button>
                    </div>
                    <div v-for="(value, key,index) in trafficObj" :key="key">
                      <span class="traffic-label">{{ value.content }}</span>
                      <el-popover
                        placement="top"
                        width="150"
                        trigger="hover"
                        @show="getTrafficBarData"
                      >
                        <div class="traffic-highlight">
                          {{`${value.content}：`}}
                          <span>{{trafficBarData[index]}}</span>
                        </div>
                        <el-progress :color="value.color" slot="reference" :percentage="value.data"></el-progress>
                      </el-popover>
                    </div>
                  </el-card>
                  <el-card class="common-margin-top" v-if="userInfo.show_ios_account">
                    <template #header>
                      <span>IOS共享账号</span>
                    </template>
                    <el-card shadow="hover">
                      IOS账号：
                      <span class="text-alert">{{userInfo.iosAccount}}</span>
                    </el-card>
                    <el-card class="common-margin-top" shadow="hover">
                      账号密码：
                      <span class="text-alert">{{userInfo.iosPassword}}</span>
                    </el-card>
                  </el-card>
                  <el-card class="common-margin-top">
                    <div slot="header" class="clearfix">
                      <span>最新公告</span>
                      <el-button
                        style="float: right; padding: 3px 0"
                        type="text"
                        @click="routeChange('/user/announcement')"
                      >查看所有公告</el-button>
                    </div>
                    <div v-if="userInfo.ann !== null" v-html="userInfo.ann.content"></div>
                  </el-card>
                </el-col>
                <el-col :xs="24" :lg="12">
                  <el-card class="quick-init">
                    <div slot="header" class="clearfix">
                      <span>快速导入节点</span>
                      <el-popconfirm title="确定要重置订阅链接吗？" @onConfirm="resetSubscribLink">
                        <el-button class="subscribe-reset" type="danger" slot="reference">重置订阅链接</el-button>
                      </el-popconfirm>
                    </div>
                    <el-alert
                      title="点击下面按钮复制链接"
                      type="info"
                      description="请按照教程设置订阅链接并更新订阅或使用剪贴板导入节点"
                      show-icon
                    ></el-alert>
                    <div>
                      <el-tabs v-model="subUrlActiveName" @tab-click="subUrlHandleClick">
                        <el-tab-pane label="订阅链接导入" name="first">
                          <span class="sub-button" v-for="link in suburl" :key="link.link">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="link.tooltip"
                              placement="top-start"
                              :disabled="!('tooltip' in link)"
                            >
                              <el-button
                                type="primary"
                                v-uimclip="{ onSuccess:successCopied }"
                                :data-uimclip="link.link"
                                round
                              >{{link.name}}</el-button>
                            </el-tooltip>
                          </span>
                        </el-tab-pane>
                        <el-tab-pane label="剪贴板导入" name="second">
                          <el-button
                            v-for="link in nodelink"
                            :key="'clip'+link.type"
                            v-uimclip:ajax="{ onSuccess:successCopied }"
                            :data-uimclip="link.type"
                            type="primary"
                            round
                            class="sub-button"
                          >{{link.name}}</el-button>
                        </el-tab-pane>
                        <el-tab-pane label="MAC/IOS一键导入" name="third">
                          <el-button
                            v-for="link in clashlink"
                            :key="link.link"
                            @click="link.function"
                            type="primary"
                            round
                            class="sub-button"
                          >{{link.name}}</el-button>
                        </el-tab-pane>
                        <el-tab-pane label="其他特殊导入" name="fourth">
                          <el-button
                            v-for="link in otherLink"
                            :key="link.link"
                            v-uimclip="{ onSuccess:successCopied }"
                            :data-uimclip="link.link"
                            type="primary"
                            round
                            class="sub-button"
                          >{{link.name}}</el-button>
                        </el-tab-pane>
                      </el-tabs>
                    </div>
                  </el-card>
                  <el-card class="gutter-top">
                    <div slot="header" class="clearfix">
                      <span>客户端下载</span>
                    </div>
                    <el-alert
                      title="点击下面按钮下载客户端"
                      type="info"
                      description="请根据自己的操作系统选择合适客户端"
                      show-icon
                    ></el-alert>
                    <div>
                      <el-tabs v-model="clientActiveName" @tab-click="subUrlHandleClick">
                        <el-tab-pane
                          v-for="tab in clientTabs"
                          :key="tab.label"
                          :label="tab.label"
                          :name="tab.name"
                        >
                          <el-row>
                            <el-col :span="24">
                              <el-select
                                class="sub-select"
                                v-model="clientTypeValue"
                                placeholder="请选择操作系统"
                              >
                                <el-option
                                  v-for="item in clientType"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                ></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="24">
                              <div
                                class="download-link"
                                v-for="link in customDownloads[clientActiveName][clientTypeValue]"
                                :key="link.link"
                                @click="linkclickHandle"
                              >
                                <el-link
                                  :underline="false"
                                  :href="link.link"
                                  type="primary"
                                >{{link.name}}</el-link>
                              </div>
                            </el-col>
                            <el-col :span="24">
                              <el-alert
                                v-if="clientTypeValue === 'option5'"
                                class="client-alert"
                                :title="clientAlertText"
                                type="warning"
                                show-icon
                              ></el-alert>
                            </el-col>
                          </el-row>
                        </el-tab-pane>
                      </el-tabs>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-col>
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
import CaptchaInit from "../../mixins/captcha";
// import downloads from "../../datamodel/downloads";
import downloadOption from "../../datamodel/downloadOption";
import Sub from "../../mixins/sub";
import Axios from "axios";

export default {
  name: "Index",
  mixins: [Basejs, PublicFunction, Sub, CaptchaInit],
  components: {
    navmenu: Navmenu,
    headertools: Headertools,
    charger: Charger
  },
  created() {
    this.initSite();
  },
  computed: {
    pandectCom() {
      if (this.userInfo !== "") {
        let newvalue = [
          this.userInfo.user.class,
          this.userInfo.user.money,
          `${this.userInfo.user.online_ip_count} / ${
            this.userInfo.user.node_connector === 0
              ? "不限制"
              : this.userInfo.user.node_connector
          }`,
          this.userInfo.user.node_speedlimit === 0
            ? "无限制"
            : this.userInfo.user.node_speedlimit
        ];
        for (let i = 0; i <= this.pandectData.length - 1; i++) {
          // console.log(this.pandectData[i]);
          this.$set(this.pandectData[i], "content", newvalue[i]);
        }
      }
      return this.pandectData;
    },
    trafficObj: function() {
      let enable = this.userInfo.user.transfer_enable;
      let upload = this.userInfo.user.u;
      let download = this.userInfo.user.d;
      let lastdayTransfer = this.userInfo.user.last_day_t;
      let obj = {
        remain: {
          content: "剩余流量",
          data: parseFloat(
            enable === 0
              ? 0
              : (((enable - upload - download) / enable) * 100).toFixed(1)
          ),
          color: "#67C23A"
        },
        usedtotal: {
          content: "过去已用",
          data: parseFloat(
            enable === 0 ? 0 : ((lastdayTransfer / enable) * 100).toFixed(1)
          ),
          color: "#E6A23C"
        },
        usedtoday: {
          content: "今日已用",
          data: parseFloat(
            enable === 0
              ? 0
              : (
                  ((upload + download - lastdayTransfer) / enable) *
                  100
                ).toFixed(1)
          ),
          color: "#F56C6C"
        }
      };
      console.log(obj);
      return obj;
    },
    clientAlertText() {
      let result;
      if (this.clientTypeValue === "option5") {
        result =
          this.clientActiveName === "third"
            ? "请前往Apple Store购买、下载 Shadowrocket、Quantumult、Loon"
            : "请前往Apple Store购买、下载Shadowrocket、Quantumult、Potatso、Potatso Lite、Loon";
      }
      return result;
    },
    customDownloads() {
      let value = this.globalConfig.next_config.custom_downloads.value;
      let obj = JSON.parse(value);
      let defaultObj = {
        first: { option1: [] }
      };
      return value === "{}" ? defaultObj : obj;
    }
  },
  watch: {
    signerVisible(val) {
      if (this.globalConfig.enable_checkin_captcha) {
        if (!val) {
          this.captchaLoading = false;
        } else {
          this.captchaLoading = true;
        }
      }
    }
  },
  data() {
    return {
      pagename: "用户中心",
      defaultOpenedsSubMenu: ["1"],
      defaultActiveMenuItem: "1-1",
      captchaLoading: false,
      pandectData: [
        {
          title: "VIP 等级",
          content: "",
          icon: "el-icon-lollipop"
        },
        {
          title: "账户余额",
          content: "",
          icon: "el-icon-coin"
        },
        {
          title: "在线设备数",
          content: "",
          icon: "el-icon-mobile-phone"
        },
        {
          title: "端口速率",
          content: "",
          icon: "el-icon-timer"
        }
      ],
      clientTabs: downloadOption.clientTabs,
      clientType: downloadOption.clientType,
      // downloads,
      subUrlActiveName: "first",
      clientActiveName: "first",
      clientTypeValue: "option1",
      clientAlert: false,
      signerVisible: false,
      signInScript: {
        geetest: "",
        "g-captcha": ""
      },
      trafficBarData: ["读取中", "读取中", "读取中", "uninitialized"],
      toolTipType: "default",
      chargeDialogVisible: false
    };
  },
  mounted() {
    window.addEventListener("shake", this.shakeEventDidOccur, false);
  },
  methods: {
    resetSubscribLink() {
      Axios.get("/getnewsubtoken", {
        withCredentials: true
      }).then(r => {
        if (r.data.ret === 1) {
          this.userInfo.ssrSubToken = r.data.arr.ssr_sub_token;
          this.$message({
            message: "重置邀请链接成功",
            type: "success"
          });
        } else if (r.data.ret === -1) {
          console.log(r);
        }
      });
    },
    subUrlHandleClick(tab, event) {
      console.log(tab, event);
    },
    linkclickHandle() {
      console.log(this.clientTypeValue);
      if (this.clientTypeValue === "option5") {
        this.clientAlert = true;
        this.$notify({
          title: "提示",
          message: this.clientAlertText,
          duration: 0
        });
      }
    },
    getTrafficBarData() {
      if (this.trafficBarData.length === 4) {
        this.getTraffic();
      } else {
        return;
      }
    },
    getTraffic() {
      Axios.get("/gettransfer", { withCredentials: true }).then(r => {
        console.log(r);
        this.trafficBarData = [
          r.data.arr.unUsedTraffic,
          r.data.arr.lastUsedTraffic,
          r.data.arr.todayUsedTraffic
        ];
      });
    },
    shakeEventDidOccur() {
      if ("vibrate" in navigator) {
        navigator.vibrate(500);
      }

      this.handleSignConfirm();
    },
    handleSignConfirm() {
      this.signerVisible = false;

      let body = {};

      if (this.globalConfig.enable_checkin_captcha === true) {
        switch (this.globalConfig.captcha_provider) {
          case "recaptcha":
            body.recaptcha = grecaptcha.getResponse();
            break;
          case "geetest":
            if (this.validate !== "") {
              console.log(this.validate);
              body.geetest_challenge = this.validate.geetest_challenge;
              body.geetest_validate = this.validate.geetest_validate;
              body.geetest_seccode = this.validate.geetest_seccode;
            } else {
              this.$notify({
                title: "提示",
                message: "请滑动验证码进行验证",
                type: "error",
                duration: 0
              });
              return;
            }
            break;
        }
      }

      Axios({
        method: "post",
        url: "/user/checkin",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        console.log(r);
        if (r.data.ret === 0) {
          this.$message({
            message: r.data.msg,
            type: "error"
          });
        } else if (r.data.ret === 1) {
          console.log(r.data);
          this.$message({
            message: r.data.msg,
            type: "success"
          });
          this.getUserInfo();
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
    }
  }
};
</script>

<style lang="stylus" scoped>
.pandect .pandect-title, .traffic-label
  font-size: 12px
  color: #909399
.pandect .pandect-content
  font-size: 20px
  margin-top: 0.4rem
.pandect-right
  text-align: right
for val in 3 4
  .pandect-container:nth-child({val})
    @media only screen and (max-width: 1200px)
      margin-top: 1rem
for val in 2 3 4
  .pandect-container:nth-child({val})
    @media only screen and (max-width: 768px)
      margin-top: 1rem
.download-link a
  font-size: 20px
  padding: 0.4rem 1rem
  border: 1px solid #409EFF
  border-radius: 4px
  box-shadow: none
.download-link
  margin-top: 1rem
.client-alert
  margin-top: 1rem
.quick-init
  @media only screen and (max-width: 1200px)
    margin-top: 1rem
.sub-button
  display: inline-block
.sub-button, .sub-select
  margin-top: 0.5rem
.sub-button+.sub-button
  margin-left: 10px
#captcha-container
  text-align: center
.traffic-highlight
  text-align: center
  color: #606266
.traffic-highlight span
  color: #FF7800
.subscribe-reset
  float: right
  padding: 7px 10px
  position: relative
  bottom: 0.4rem
.class-alert
  position: relative
  font-size: 16px
  top: 1px
  color: #ffbe00
</style>

