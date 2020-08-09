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
            :global-config="globalConfig"
            :user-info="userInfo"
          ></navmenu>
        </el-drawer>
        <navmenu
          :default-active-menu-item="defaultActiveMenuItem"
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
            <el-col :xs="24" :sm="12">
              <el-card :body-style="{ padding: '0px' }" shadow="hover">
                <div class="card-split-top">
                  <div class="card-avatar">
                    <div class="card-avatar-avatar">
                      <el-avatar class="avatar-icon-lg invite-sum" :size="105">
                        <i class="el-icon-medal"></i>
                      </el-avatar>
                    </div>
                    <div class="card-avatar-main">
                      <div class="card-avatar-title">您累计获得的返利总额</div>
                      <div class="card-avatar-content-lg">
                        <span
                          class="text-alert"
                          style="font-weight:600"
                        >{{paybacks_sum|creditFilter}}</span>
                      </div>
                      <el-tag class="invite-num" type="warning" size="small">
                        剩余邀请次数：
                        <span>{{invite_num}}</span>
                      </el-tag>
                    </div>
                  </div>
                </div>
                <div>
                  <el-button
                    type="warning"
                    class="invite-button"
                    v-uimclip="{ onSuccess:successCopied }"
                    :data-uimclip="inviteLink"
                  >复制邀请链接</el-button>
                </div>
              </el-card>
            </el-col>
            <el-col class="invite-intro" :xs="24" :sm="12">
              <el-card :body-style="{ padding: '0px' }">
                <template #header>当您邀请朋友注册时</template>
                <div class="card-split-top">
                  <div>
                    对方充值时您会获得对方充值金额
                    <span class="text-alert">{{code_payback}} %</span> 的返利
                  </div>
                  <div class="common-margin-top">
                    对方注册后将获得
                    <span class="text-alert">{{invite_get_money}}</span> 元奖励作为初始资金。
                  </div>
                  <div class="common-margin-top">
                    另外，您会在对方注册后获得
                    <span class="text-alert">{{invite_gift}} GB</span> 流量作为奖励
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <template #header>管理邀请链接</template>
                <el-row :gutter="20">
                  <el-col class="invite-tool" :xs="24" :sm="8">
                    <el-popconfirm @onConfirm="resetInviteLink" title="确定重置邀请链接吗？">
                      <el-button slot="reference" type="primary" plain>重置邀请链接</el-button>
                    </el-popconfirm>
                  </el-col>
                  <el-col v-if="invitePrice >= 0" class="invite-tool" :xs="24" :sm="8">
                    <el-popover
                      v-model="buyVisible"
                      placement="bottom"
                      title="购买邀请次数"
                      width="300"
                      trigger="click"
                    >
                      <el-form
                        label-position="left"
                        inline
                        class="invite-table-expand common-table-expand"
                      >
                        <el-form-item label="账户余额">
                          <span class="text-alert">{{ userInfo.user.money | creditFilter }}</span>
                        </el-form-item>
                        <el-form-item label="单价">
                          <span class="text-alert">{{ invitePrice | creditFilter }}</span>
                        </el-form-item>
                        <el-form-item label="总价">
                          <span class="text-alert">{{ invitePriceTotal | creditFilter }}</span>
                        </el-form-item>
                      </el-form>
                      <div class="but-invite-number">
                        <el-input-number v-model="buyInviteNum" :min="1" size="small"></el-input-number>
                      </div>
                      <el-alert
                        style="margin-top: .8rem"
                        :closable="false"
                        title="不可逆操作提示"
                        show-icon
                        type="warning"
                      >
                        <div>确认即完成购买，请做最后确认</div>
                      </el-alert>
                      <div style="text-align: right; margin-top: .8rem">
                        <el-button size="mini" type="text" @click="buyVisible = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleBuyInviteConfirm">确定</el-button>
                      </div>

                      <el-button slot="reference" type="primary" plain>购买邀请次数</el-button>
                    </el-popover>
                  </el-col>
                  <el-col v-if="customPrice >= 0" class="invite-tool" :xs="24" :sm="8">
                    <el-popover
                      v-model="customVisible"
                      placement="bottom"
                      title="定制邀请链接"
                      width="300"
                      trigger="click"
                    >
                      <el-form
                        label-position="left"
                        inline
                        class="invite-table-expand common-table-expand"
                      >
                        <el-form-item label="账户余额">
                          <span class="text-alert">{{ userInfo.user.money | creditFilter }}</span>
                        </el-form-item>
                        <el-form-item label="价格">
                          <span class="text-alert">{{ customPrice | creditFilter }}</span>
                        </el-form-item>
                        <el-form-item label="旧的后缀">
                          <span class="text-alert">{{ code.code }}</span>
                        </el-form-item>
                        <el-form-item label="要定制的后缀">
                          <span class="text-alert">{{ customContent }}</span>
                        </el-form-item>
                      </el-form>
                      <div class="custom-invite">
                        <el-input v-model="customContent" placeholder="请输入邀请链接后缀"></el-input>
                      </div>
                      <el-alert
                        style="margin-top: .8rem"
                        :closable="false"
                        title="不可逆操作提示"
                        show-icon
                        type="warning"
                      >
                        <div>确认即完成购买，请做最后确认</div>
                      </el-alert>
                      <div style="text-align: right; margin-top: .5rem">
                        <el-button size="mini" type="text" @click="customVisible = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="handleCustomInviteConfirm">确定</el-button>
                      </div>

                      <el-button slot="reference" type="primary" plain>定制邀请链接</el-button>
                    </el-popover>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-card>
                <template #header>返利记录</template>
                <el-table :data="paybacks.data" stripe style="width: 100%">
                  <el-table-column prop="id" label="ID"></el-table-column>
                  <el-table-column prop="user_name" label="被邀请用户ID"></el-table-column>
                  <el-table-column prop="ref_get" label="获得返利"></el-table-column>
                </el-table>
                <el-pagination
                  class="common-margin-top"
                  layout="prev, pager, next"
                  :page-size="paybacks.per_page"
                  @current-change="paybacksPageChange"
                  :total="paybacks.total"
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
  name: "Invite",
  mixins: [Basejs, PublicFunction],
  components: {
    navmenu: Navmenu,
    headertools: Headertools
  },
  computed: {
    inviteLink() {
      return `${this.userInfo.baseUrl}/auth/register?code=${this.code.code}`;
    },
    invitePriceTotal() {
      return this.buyInviteNum * this.invitePrice;
    }
  },
  watch: {
    buyVisible(val) {
      this.buyInviteNum = 1;
    },
    customVisible(val) {
      this.customContent = "";
    }
  },
  data() {
    return {
      pagename: "参与推广",
      defaultActiveMenuItem: "4",
      code: { code: "" },
      code_payback: 0,
      customPrice: -1,
      invitePrice: -1,
      invite_get_money: 0,
      invite_gift: 0,
      invite_num: 0,
      paybacks: "",
      paybacks_sum: 0,
      buyInviteNum: 1,
      customContent: "",
      buyVisible: false,
      customVisible: false
    };
  },

  created() {
    this.initSite();
    this.getInviteInfo(1);
  },
  methods: {
    paybacksPageChange(currentPage) {
      this.getInviteInfo(currentPage);
    },
    getInviteInfo(page) {
      let body = { current: page };
      Axios({
        method: "post",
        url: "/getuserinviteinfo",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          for (let key in r.data.inviteInfo) {
            this[key] = r.data.inviteInfo[key];
          }
        }
      });
    },
    resetInviteLink() {
      Axios.get("/getnewinvotecode", { withCredentials: true }).then(r => {
        if (r.data.ret === 1) {
          this.code.code = r.data.arr.code.code;
          this.$message.success("邀请链接已重置");
        } else {
          this.$message.error("登录状态失效，请重新登录");
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 3000);
        }
      });
    },
    handleBuyInviteConfirm() {
      this.buyVisible = false;
      let body = { num: this.buyInviteNum };
      Axios({
        method: "post",
        url: "/user/buy_invite",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret === 1) {
          this.getInviteInfo(this.paybacks.current_page);
          this.$message.success("邀请次数购买成功");
        } else if (r.data.ret === 0) {
          this.$message.error(r.data.msg);
        } else {
          this.$message.error("登录状态失效，请重新登录");
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 3000);
        }
      });
    },
    handleCustomInviteConfirm() {
      this.customVisible = false;
      let body = { customcode: this.customContent };
      Axios({
        method: "post",
        url: "/user/custom_invite",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret === 1) {
          this.getInviteInfo(this.paybacks.current_page);
          this.$message.success(r.data.msg);
        } else if (r.data.ret === 0) {
          this.$message.error(r.data.msg);
        } else {
          this.$message.error("登录状态失效，请重新登录");
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 3000);
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.invite-button
  width: 100%
  border-radius: 0 0 4px 4px
  background: linear-gradient(to right, #f9d72c, #ef7a27c4, #f9d72c)
.invite-detail
  display: flex
  align-items: center
.invite-detail h1
  margin: 0
  margin-right: 1rem
  font-size: 40px
.invite-num
  margin-top: 0.5rem
  color: #909399
.invite-num span
  color: #FF7800
.invite-sum
  background: linear-gradient(#e3b869, #f9d72c, #ef7a27c4)
.invite-tool button
  width: 100%
  letter-spacing: 4px
.but-invite-number
  text-align: right
.invite-table-expand
  margin-left: 20px
  margin-top: 0.3rem
.custom-invite
  margin: 0 20px
@media only screen and (max-width: 768px)
  .invite-intro
    margin-top: 20px
  for i in 2 3
    .invite-tool:nth-child({i})
      margin-top: 20px
</style>

