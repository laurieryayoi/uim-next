<template>
  <div id="app">
    <el-container>
      <el-main>
        <el-row type="flex" justify="center">
          <el-col :xs="24" :sm="12" :lg="8" :xl="7">
            <el-card v-if="loginType === 'login'" v-loading="loading" class="auth">
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                label-position="top"
              >
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="ruleForm.email" placeholder="请输入账号邮箱"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                  <el-input v-model="ruleForm.password" show-password placeholder="请输入账号密码"></el-input>
                </el-form-item>

                <el-form-item label="二步验证码" prop="twostepsauth">
                  <el-input v-model="ruleForm.twostepsauth" placeholder="(未设置请忽略)"></el-input>
                </el-form-item>

                <el-form-item
                  v-loading="captchaLoading"
                  v-if="globalConfig.enable_logincaptcha"
                  label="人机验证"
                >
                  <div
                    id="captcha-container"
                    data-size="normal"
                    :data-sitekey="globalConfig.recaptcha_sitekey"
                  ></div>
                </el-form-item>

                <el-form-item>
                  <el-row type="flex" justify="space-between" align="middle">
                    <el-switch active-text="记住登录" v-model="ruleForm.remember"></el-switch>
                    <el-button
                      v-if="globalConfig.enable_telegram"
                      @click="tgDialogVisiable = true"
                      type="text"
                    >Telegram 登录</el-button>
                  </el-row>
                </el-form-item>

                <el-form-item class="action-area">
                  <el-button
                    type="primary"
                    :disabled="isLoginDisabled"
                    class="button-login"
                    @click="submitForm('ruleForm')"
                  >登录</el-button>
                </el-form-item>

                <div class="links">
                  <div>
                    <el-button type="text" @click="loginType = 'forget'">忘记密码？</el-button>
                  </div>
                  <div>
                    <span class="toreg">
                      还没有账号？
                      <el-link type="primary" href="/auth/register">点击注册</el-link>
                    </span>
                  </div>
                  <div></div>
                </div>
              </el-form>
            </el-card>
            <el-card class="auth" v-if="loginType === 'forget'">
              <template #header>
                <span>忘记密码</span>
                <el-button
                  style="float: right; padding: 3px 0"
                  @click="loginType = 'login'"
                  type="text"
                >去登录</el-button>
              </template>
              <el-alert :closable="false" title="请妥善保管自己的登录密码" type="warning" show-icon></el-alert>
              <el-form
                class="common-margin-top"
                :model="resetRuleForm"
                :rules="resetRules"
                ref="resetRuleForm"
                label-width="100px"
                label-position="top"
              >
                <el-form-item label="邮箱" required prop="email">
                  <el-input v-model="resetRuleForm.email" placeholder="请输入账号邮箱"></el-input>
                </el-form-item>

                <div class="action-area">
                  <el-button
                    type="primary"
                    :disabled="isResetDisabled"
                    class="button-login"
                    @click="submitForm('resetRuleForm')"
                  >发送重置邮件</el-button>
                </div>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-main>

      <el-dialog
        title="Telegarn登录"
        :visible.sync="tgDialogVisiable"
        :width="dialogWidth"
        @open="handleTelagramOpen"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :xl="12">
            <el-card shadow="hover">
              <el-alert :closable="false" title="点击按钮一键登录" type="info" show-icon></el-alert>
              <div class="tgOauth common-margin-top">
                <el-alert
                  :closable="false"
                  title="正在载入 Telegram，如果长时间未显示请刷新页面或检查代理"
                  id="telegram-alert"
                  type="info"
                  show-icon
                ></el-alert>
                <div class="text-center" id="telegram-login-box"></div>
              </div>
            </el-card>
            <el-card class="common-margin-top" shadow="hover">
              <div>
                <el-alert :closable="false" type="info" show-icon>
                  <template #title>
                    <div>将登录验证码发送给：</div>
                    <el-link type="primary" :href="tgBotUrl">@{{globalConfig.telegram_bot}}</el-link>
                  </template>
                </el-alert>
                <el-card class="common-margin-top" shadow="never">
                  数字验证码：
                  <span class="text-alert tg-number">{{globalConfig.login_number}}</span>
                </el-card>
              </div>
            </el-card>
          </el-col>
          <el-col class="tgqr" :xs="24" :xl="12">
            <el-card shadow="hover">
              <el-alert :closable="false" type="info" show-icon>
                <template #title>
                  <div>将登录二维码发送给：</div>
                  <el-link type="primary" :href="tgBotUrl">@{{globalConfig.telegram_bot}}</el-link>
                </template>
              </el-alert>
              <div class="tgOauth">
                <vue-qr :text="tgQrLink" :correctLevel="3" :size="230"></vue-qr>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="tgDialogVisiable = false">取 消</el-button>
        </span>
      </el-dialog>

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
  </div>
</template>

<script>
import PublicFunction from "../../mixins/publicfunction";
import Basejs from "../../mixins/base";
import CaptchaInit from "../../mixins/captcha";
import Axios from "axios";
import VueQr from "vue-qr";

export default {
  name: "Login",
  mixins: [Basejs, PublicFunction, CaptchaInit],
  components: {
    "vue-qr": VueQr
  },
  computed: {
    tgBotUrl() {
      return `https://t.me/${this.globalConfig.telegram_bot}`;
    },
    tgQrLink() {
      return `mod://login/${this.globalConfig.login_token}`;
    }
  },
  watch: {
    loginType(val) {
      if (val === "login") {
        this.initCaptcha("captcha-container", "enable_logincaptcha", () => {
          this.captchaLoading = false;
        });
      } else {
        this.captchaLoading = true;
      }
    }
  },
  data() {
    return {
      loading: true,
      captchaLoading: true,
      loginType: "login",
      isLoginDisabled: false,
      ruleForm: {
        email: "",
        password: "",
        twostepsauth: "",
        remember: false
      },
      rules: {
        email: [
          { required: true, message: "请输入账号邮箱", trigger: "blur" },
          { type: "email", message: "请输入有效邮箱", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" }
        ]
      },
      tgDialogVisiable: false,
      dialogWidth: "30%",
      isResetDisabled: false,
      resetRuleForm: {
        email: ""
      },
      resetRules: {
        email: [
          { required: true, message: "请输入账号邮箱", trigger: "blur" },
          { type: "email", message: "请输入有效邮箱", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getGlobalConfig(false, () => {
      this.loading = false;
      if (this.globalConfig.enable_mylivechat) {
        this.initLivechat(this.globalConfig.mylivechat_id);
      }
      let siteTitle = document.getElementsByTagName("title")[0];
      siteTitle.innerText = `${this.globalConfig.appName} - ${siteTitle.innerText}`;
      this.$nextTick(() => {
        this.initCaptcha("captcha-container", "enable_logincaptcha", () => {
          this.captchaLoading = false;
        });
        if (this.globalConfig.enable_telegram === true) {
          setTimeout(() => {
            let tid = this.tgAuthChecker(tid);
          }, 2500);
        }
      });
    });
  },
  methods: {
    handleTelagramOpen() {
      if (window.innerWidth <= 1200 && window.innerWidth > 768) {
        this.dialogWidth = "50%";
      } else if (window.innerWidth <= 768 && window.innerWidth > 500) {
        this.dialogWidth = "70%";
      } else if (window.innerWidth <= 500) {
        this.dialogWidth = "90%";
      } else {
        this.dialogWidth = "35%";
      }
      this.$nextTick(() => {
        this.initTelegramOauth();
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.loginType === "login") {
            this.handleLogin();
          } else {
            this.sendResetEmail();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleLogin() {
      this.isLoginDisabled = true;

      let body = {
        email: this.ruleForm.email,
        passwd: this.ruleForm.password,
        remember_me: this.ruleForm.remember,
        code: this.ruleForm.remember.twostepsauth
      };

      if (this.globalConfig.enable_logincaptcha === true) {
        switch (this.globalConfig.captcha_provider) {
          case "recaptcha":
            body.recaptcha = grecaptcha.getResponse();
            break;
          case "geetest":
            if (this.validate !== "") {
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
              this.isLoginDisabled = false;
              return;
            }
            break;
        }
        this.$notify({
          title: "人机验证已通过",
          message: "正在验证登录信息...",
          type: "success",
          duration: 2000
        });
      }

      Axios({
        method: "post",
        url: "/auth/login",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret === 1) {
          this.$notify({
            title: "登录成功",
            message: "即将跳转至用户中心...",
            type: "success",
            duration: 1000
          });
          setTimeout(() => {
            window.location.href = "/user";
          }, 1100);
        } else {
          this.$message({
            message: r.data.msg,
            type: "error"
          });
          this.isLoginDisabled = false;
        }
      });
    },
    initTelegramOauth() {
      let el = document.createElement("script");
      document.getElementById("telegram-login-box").append(el);
      el.onload = function() {
        let alert = document.getElementById("telegram-alert");
        if (alert !== null) {
          alert.outerHTML = "";
        } else {
          return;
        }
      };
      el.src = "https://telegram.org/js/telegram-widget.js?4";
      el.setAttribute("data-size", "large");
      el.setAttribute("data-telegram-login", this.globalConfig.telegram_bot);
      el.setAttribute(
        "data-auth-url",
        this.globalConfig.base_url + "/auth/telegram_oauth"
      );
      el.setAttribute("data-request-access", "write");
    },
    tgAuthChecker(tid) {
      let body = {
        token: this.globalConfig.login_token,
        number: this.globalConfig.login_number
      };
      Axios({
        method: "post",
        url: "/auth/qrcode_check",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret > 0) {
          clearTimeout(tid);
          this.tgAuthLogin(body);
        } else if (r.data.ret === -1) {
          this.$notify({
            title: "验证密钥过期",
            message: "即将重新请求 Telegram 验证数据...",
            type: "success",
            duration: 3000
          });
          this.getGlobalConfig(false, () => {
            this.$notify({
              title: "验证数据请求成功",
              message: "验证码会同步刷新...",
              type: "success",
              duration: 3000
            });
          });
        }
        tid = setTimeout(() => {
          this.tgAuthChecker(tid);
        }, 2500);
      });
    },
    tgAuthLogin(body) {
      Axios({
        method: "post",
        url: "/auth/qrcode_login",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        this.$notify({
          title: "Telegram登录成功",
          message: "即将跳转至用户中心...",
          type: "success",
          duration: 1000
        });
        setTimeout(() => {
          window.location.href = "/user";
        }, 1500);
      });
    },
    sendResetEmail() {
      this.isResetDisabled = true;
      let body = { email: this.resetRuleForm.email };
      Axios({
        method: "post",
        url: "/password/reset",
        data: JSON.stringify(body),
        withCredentials: false,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret === 1) {
          this.$message.success(r.data.msg);
          this.$refs["resetRuleForm"].resetFields();
          this.isResetDisabled = false;
        } else {
          this.$message.error(r.data.msg);
          this.isResetDisabled = false;
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.el-footer
  background-color: white
.el-container
  position: relative
  height: 100%
  padding-bottom: 46px
  background-color: #fafafa
.auth
  margin-top: 50px
  @media (max-width: 768px)
    margin-top: 25px
.button-login
  width: 90%
  letter-spacing: 4px
.action-area, .links
  text-align: center
.toreg
  font-size: 14px
  margin-top: 0.3rem
  display: inline-block
.tgOauth
  text-align: center
.tg-number
  font-size: 20px
  display: inline-block
.tgqr
  @media (max-width: 1919px)
    margin-top: 20px
.links button
  padding: 0
#captcha-container
  margin-bottom: 0
</style>

