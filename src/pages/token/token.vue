<template>
  <div id="app">
    <el-container>
      <el-main>
        <el-row type="flex" justify="center">
          <el-col :xs="24" :sm="12" :lg="8" :xl="7">
            <el-card v-loading="loading" class="auth">
              <template #header>
                <span>重置密码</span>
                <el-link style="float: right; padding: 3px 0" href="/auth/login" type="primary">去登录</el-link>
              </template>
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                label-position="top"
              >
                <el-form-item label="密码" prop="password">
                  <el-input v-model="ruleForm.password" show-password placeholder="请设置登录密码"></el-input>
                </el-form-item>
                <el-form-item label="再次输入密码" prop="passwordRepeat">
                  <el-input v-model="ruleForm.passwordRepeat" show-password placeholder="请再次输入登录密码"></el-input>
                </el-form-item>

                <el-form-item class="action-area">
                  <el-button
                    type="primary"
                    :disabled="isResetDisabled"
                    class="button-reset"
                    @click="submitForm('ruleForm')"
                  >重置密码</el-button>
                </el-form-item>
              </el-form>
              <div class="links">
                <div>
                  <span class="toreg">
                    甚至想要重新注册？
                    <el-link type="primary" href="/auth/register">点击注册</el-link>
                  </span>
                </div>
                <div></div>
              </div>
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
  </div>
</template>

<script>
import PublicFunction from "../../mixins/publicfunction";
import Basejs from "../../mixins/base";
import Axios from "axios";

export default {
  name: "Token",
  mixins: [Basejs, PublicFunction],
  computed: {},

  data() {
    return {
      loading: true,
      isResetDisabled: false,
      ruleForm: {
        password: "",
        passwordRepeat: ""
      },
      rules: {
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 9,
            message: "密码需大于8位",
            trigger: "blur"
          }
        ],
        passwordRepeat: [
          { required: true, message: "请再次输入登录密码", trigger: "blur" },
          { validator: this.passwordRepeatValidator, trigger: "blur" }
        ]
      },
      tgDialogVisiable: false,
      dialogWidth: "30%"
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
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleReset();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleReset() {
      this.isResetDisabled = true;
      let token = window.location.href.split("/password/token/")[1];

      let body = {
        password: this.ruleForm.password,
        repasswd: this.ruleForm.passwordRepeat
      };
      Axios({
        method: "post",
        url: `/password/token/${token}`,
        data: JSON.stringify(body),
        withCredentials: false,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret === 1) {
          this.$message.success(r.data.msg);
          this.$notify({
            title: "密码重置成功",
            message: "即将跳转至登录界面...",
            type: "success",
            duration: 1000
          });
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 1100);
        } else {
          this.$message.error(r.data.msg);
          this.isResetDisabled = false;
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
.button-reset
  width: 90%
  letter-spacing: 4px
.action-area, .links
  text-align: center
.toreg
  font-size: 14px
  margin-top: 0.3rem
  display: inline-block
.links button
  padding: 0
</style>

