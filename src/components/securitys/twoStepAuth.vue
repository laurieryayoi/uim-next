<template>
  <div>
    <div v-if="!userInfo.user.ga_enable">
      <el-steps :active="step" finish-status="success">
        <el-step title="扫描二维码"></el-step>
        <el-step title="输入6位验证码"></el-step>
      </el-steps>
      <div v-show="step === 0" class="two-way-auth common-margin-top">
        <div>
          <el-alert :closable="false" title="请使用二步验证APP扫描二维码，推荐使用 Google Authenticator" type="info" show-icon></el-alert>
          <div class="qrarea">
            <vue-qr :text="userInfo.GaUrl" :correctLevel="3" :size="230"></vue-qr>
            <div>密钥:{{userInfo.user.ga_token}}</div>
          </div>
        </div>
      </div>
      <div v-show="step ===1" class="two-way-auth common-margin-top">
        <div>
          <el-form
            @submit.native.prevent
            label-position="top"
            label-width="100px"
            :model="formLabelAlign"
            :rules="rules"
            ref="ruleForm"
          >
            <el-form-item label="请输入6位验证码" prop="pin">
              <el-input type="number" v-model="formLabelAlign.pin"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="two-way-auth" v-else>
      <div>
        <div>点击按钮关闭二步验证</div>
        <div class="gadisable common-margin-top">
          <el-button type="danger" icon="el-icon-unlock" @click="set('0')" size="medium" circle></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import Axios from "axios";

export default {
  components: {
    "vue-qr": VueQr
  },
  props: ["globalConfig", "userInfo", "dialogConfirm", "dialogCancel"],
  data() {
    return {
      step: 0,
      formLabelAlign: {
        pin: ""
      },
      rules: {
        pin: [
          { required: true, message: "6位验证码不能为空", trigger: "blur" },
          { validator: this.pindValidator, trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    dialogConfirm(val) {
      if (this.step === 0) {
        this.step = 1;
        this.$emit("update-success", { close: false, confirm: "confirm" });
      } else {
        this.submitForm();
      }
    },
    dialogCancel(val) {
      if (this.step === 0) {
        this.$refs.ruleForm.resetFields();
      } else {
        this.step = 0;
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.resetFields();
        }
      }
    }
  },
  mounted() {},
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid, msg) => {
        if (valid) {
          let body = {
            code: this.formLabelAlign.pin
          };
          Axios({
            method: "post",
            url: "/user/gacheck",
            data: JSON.stringify(body),
            withCredentials: true,
            headers: { "content-type": "application/json" }
          }).then(r => {
            console.log(r);
            if (r.data.ret === 0) {
              this.$message.error(r.data.msg);
              this.$emit("update-denied");
            } else {
              this.$message({
                message: r.data.msg,
                type: "success"
              });
              this.$notify({
                title: "开启二步验证",
                message: "正在开启二步验证……",
                type: "success"
              });
              this.set("1");
              this.$refs.ruleForm.resetFields();
            }
          });
        } else {
          this.$emit("update-denied");
          return false;
        }
      });
    },
    pindValidator(rule, value, callback) {
      if (value.length !== 6) {
        callback(new Error("不是6位数字"));
      } else {
        callback();
      }
    },
    set(number) {
      let body = {
        enable: number
      };
      Axios({
        method: "post",
        url: "/user/gaset",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret === 1) {
          this.$message({
            message: r.data.msg,
            type: "success"
          });
          if (this.userInfo.user.ga_enable) {
            this.$emit("update-success", { ga: 0 });
            this.step = 0;
          } else {
            this.$emit("update-success", { ga: 1 });
          }
        } else {
          this.$message.error(r.data.msg);
          this.$emit("update-denied");
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.two-way-auth
  display: flex
  justify-content: center
  flex-wrap: wrap
  color: #606266
.gadisable
  text-align: center
.gadisable button
  width: 100px
  height: 100px
  font-size: 50px
.qrarea
  text-align: center
</style>