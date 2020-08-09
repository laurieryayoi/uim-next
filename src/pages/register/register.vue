<template>
  <div id="app">
    <el-container>
      <el-main>
        <el-row type="flex" justify="center">
          <el-col :xs="24" :sm="18" :lg="14" :xl="12">
            <el-card v-loading="loading" class="auth">
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
                label-position="top"
              >
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="昵称" prop="name">
                      <el-input v-model="ruleForm.name" placeholder="请输入账号昵称"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="邮件" prop="email">
                      <el-input v-model="ruleForm.email" placeholder="请输入账号邮箱"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="密码" prop="password">
                      <el-input v-model="ruleForm.password" show-password placeholder="请设置账号密码"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="验证密码" prop="passwordRepeat">
                      <el-input
                        v-model="ruleForm.passwordRepeat"
                        show-password
                        placeholder="请再次输入帐号密码"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="联络方式" prop="contactType">
                      <el-select v-model="ruleForm.contactType" placeholder="请选择联络方式">
                        <el-option key="weixin" label="微信" value="1"></el-option>
                        <el-option key="qq" label="QQ" value="2"></el-option>
                        <el-option key="facebook" label="Facebook" value="3"></el-option>
                        <el-option key="telegram" label="Telegram" value="4"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="联络方式帐号" prop="contactAccount">
                      <el-input v-model="ruleForm.contactAccount" placeholder="请输入联络方式的帐号"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="globalConfig.register_mode === 'invite'" :xs="24" :sm="12">
                    <el-form-item label="邀请码" prop="inviteCode">
                      <el-input v-model="ruleForm.inviteCode" placeholder="请输入您的邀请码"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="globalConfig.enable_email_verify" :xs="24" :sm="12">
                    <el-row type="flex" align="bottom" :gutter="20">
                      <el-col class="verify-email" :xs="12" :sm="12">
                        <el-form-item label="邮箱验证码" prop="mailCode">
                          <el-input v-model="ruleForm.mailCode" placeholder="请输入邮件中的验证码"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col class="verify-email" :xs="12" :sm="12">
                        <el-button
                          style="margin-bottom:22px;width:100%"
                          type="primary"
                          :disabled="isEmailVerifyDisabled || verifyTime<60"
                          @click="sendVerifyEmail"
                        >{{verifyButtonText}}</el-button>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>

                <el-row type="flex" justify="center">
                  <el-col :xs="24" :sm="18" :md="14" :lg="12" :xl="10">
                    <el-form-item v-if="globalConfig.enable_regcaptcha" label="人机验证">
                      <div
                        id="captcha-container"
                        data-size="normal"
                        :data-sitekey="globalConfig.recaptcha_sitekey"
                      ></div>
                    </el-form-item>

                    <el-form-item class="action-area">
                      <el-button
                        type="primary"
                        :disabled="isRegisterDisabled || !tosChecked"
                        class="button-register"
                        @click="submitForm('ruleForm')"
                      >注册</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>

                <div class="links">
                  <el-row style="width:100%" type="flex" justify="center" class="tos">
                    <el-col :span="24">
                      <el-checkbox v-model="tosChecked">
                        我同意
                        <el-button @click="tos = true" type="text">用户服务协议</el-button>
                      </el-checkbox>
                    </el-col>
                  </el-row>
                  <div>
                    <span class="tologin">
                      已经拥有账号？
                      <el-link type="primary" href="/auth/login">点击登录</el-link>
                    </span>
                  </div>
                  <div></div>
                </div>
              </el-form>
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

    <el-dialog :visible.sync="tos">
      <template #title>
        <span class="tos-title">用户服务协议</span>
      </template>
      <tos></tos>
    </el-dialog>
  </div>
</template>

<script>
import PublicFunction from "../../mixins/publicfunction";
import Tos from "../../components/Tos";
import Basejs from "../../mixins/base";
import CaptchaInit from "../../mixins/captcha";
import Axios from "axios";

export default {
  name: "Register",
  mixins: [Basejs, PublicFunction, CaptchaInit],
  components: {
    tos: Tos
  },
  computed: {
    tgBotUrl() {
      return `https://t.me/${this.globalConfig.telegram_bot}`;
    },
    tgQrLink() {
      return `mod://login/${this.globalConfig.login_token}`;
    },
    verifyButtonText() {
      return this.verifyTime === 60
        ? `发送验证码`
        : `重新发送(${this.verifyTime})`;
    }
  },
  data() {
    return {
      loading: true,
      isRegisterDisabled: false,
      tos: false,
      tosDialogWidth: "50%",
      tosChecked: false,
      ruleForm: {
        name: "",
        email: "",
        password: "",
        passwordRepeat: "",
        contactType: "",
        contactAccount: "",
        inviteCode: "",
        mailCode: ""
      },
      verifyTime: 60,
      rules: {
        email: [
          { required: true, message: "请设置账号邮箱", trigger: "blur" },
          { type: "email", message: "请输入有效邮箱", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请设置登录密码", trigger: "blur" },
          {
            min: 9,
            message: "密码需大于8位",
            trigger: "blur"
          }
        ],
        passwordRepeat: [
          { required: true, message: "请再次输入登录密码", trigger: "blur" },
          { validator: this.passwordRepeatValidator, trigger: "blur" }
        ],
        name: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
        contactType: [
          { required: true, message: "请选择联系方式", trigger: "blur" }
        ],
        contactAccount: [
          { required: true, message: "请填写联系方式帐号", trigger: "blur" }
        ],
        inviteCode: [
          { required: true, message: "请填写邀请码", trigger: "blur" }
        ],
        mailCode: [
          { required: true, message: "请填写邮箱验证码", trigger: "blur" }
        ]
      },
      isEmailVerifyDisabled: false
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
        this.initCaptcha("captcha-container", "enable_regcaptcha", () => {
          this.captchaLoading = false;
        });
      });
      this.setInviteCode();
      let time = localStorage.getItem("verifyTime");
      if (isNaN(time) || time === null) {
        time = 0;
      }
      if (time === 0 || time === 60) {
        this.verifyTime = 60;
      } else {
        this.verifyTime = time;
        this.time();
      }
    });
  },
  methods: {
    handleTosOpen() {
      if (window.innerWidth <= 768 && window.innerWidth > 400) {
        this.tosDialogWidth = "70%";
      } else if (window.innerWidth <= 400) {
        this.tosDialogWidth = "90%";
      } else {
        this.tosDialogWidth = "40%";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleRegister();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    sendVerifyEmail() {
      let body = {
        email: this.ruleForm.email
      };
      Axios({
        method: "post",
        url: "/auth/send",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret === 1) {
          this.$message.success(r.data.msg);
          this.time();
        } else {
          this.$message.error(r.data.msg);
        }
      });
    },
    time() {
      if (this.verifyTime === 0) {
        this.verifyTime = 60;
        localStorage.setItem("verifyTime", 60);
      } else {
        this.verifyTime = this.verifyTime - 1;
        localStorage.setItem("verifyTime", this.verifyTime);
        setTimeout(() => {
          this.time();
        }, 1000);
      }
    },
    setInviteCode() {
      //读取邀请码设置到cookie
      if (this.getQueryVariable("code") !== "") {
        this.setCookie("code", this.getQueryVariable("code"), 30);
        let state = {
          title: document.title,
          url: window.location.href.substring(
            0,
            window.location.href.indexOf(window.location.search)
          ),
          otherkey: null
        };
        history.replaceState(
          state,
          document.title,
          window.location.href.substring(
            0,
            window.location.href.indexOf(window.location.search)
          )
        );
      }
      //自动填写邀请码到邀请框
      if (this.globalConfig.register_mode === "invite") {
        if (this.getCookie("code") !== "") {
          this.ruleForm.inviteCode = this.getCookie("code");
        }
      }
    },
    getQueryVariable(variable) {
      let query = window.location.search.substring(1);
      if (typeof query === "undefined") {
        return "";
      }
      let vars = query.split("&");
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] === variable) {
          return pair[1];
        }
      }
      return "";
    },
    setCookie(cname, cvalue, exdays) {
      let d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toGMTString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    getCookie(cname) {
      let name = cname + "=";
      let ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    handleRegister() {
      this.isRegisterDisabled = true;

      let body = {
        email: this.ruleForm.email,
        name: this.ruleForm.name,
        passwd: this.ruleForm.password,
        repasswd: this.ruleForm.passwordRepeat,
        wechat: this.ruleForm.contactAccount,
        imtype: this.ruleForm.contactType,
        code: this.ruleForm.inviteCode
      };

      if (this.globalConfig.enable_email_verify === true) {
        body.emailcode = this.ruleForm.mailCode;
      }

      if (this.globalConfig.register_mode !== "invite") {
        body.code = 0;
        if (this.getCookie("code") !== "") {
          body.code = this.getCookie("code");
        }
      }

      if (this.globalConfig.enable_regcaptcha === true) {
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
              this.isLoginDisabled = false;
              return;
            }
            break;
        }
        this.$notify({
          title: "人机验证已通过",
          message: "正在验证注册信息...",
          type: "success",
          duration: 2000
        });
      }

      Axios({
        method: "post",
        url: "/auth/register",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret === 1) {
          this.$notify({
            title: "注册成功",
            message: "即将跳转至用户中心...",
            type: "success",
            duration: 1000
          });
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 1100);
        } else {
          this.$message({
            message: r.data.msg,
            type: "error"
          });
          this.isRegisterDisabled = false;
        }
      });
    },
    passwordRepeatValidator(rule, value, callback) {
      if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.tos-title
  color: #409EFF
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
.button-register
  width: 100%
  letter-spacing: 4px
.action-area, .links
  text-align: center
.links button
  padding: 0
.tologin, .tos
  font-size: 14px
  margin-top: 0.3rem
  display: inline-block
.el-select
  width: 100%
.verify-email
  @media (max-width: 500px)
    width: 100%
#captcha-container
  margin-bottom: 0
</style>

