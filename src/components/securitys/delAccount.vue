<template>
  <div>
    <el-alert title="不可逆操作警告" type="warning" show-icon :closable="false">
      <h4>
        注意！帐号删除后，您的所有数据都会被
        <b>真实地</b>删除。如果想重新使用本网站提供的服务，您需要重新注册。
      </h4>
    </el-alert>
    <el-form
      @submit.native.prevent
      label-position="top"
      label-width="100px"
      :model="formLabelAlign"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item class="common-margin-top" label="请输入登录密码" prop="passwd">
        <el-input type="number" show-password v-model="formLabelAlign.passwd"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  components: {},
  props: ["globalConfig", "userInfo", "dialogConfirm", "dialogCancel"],
  data() {
    return {
      formLabelAlign: {
        passwd: ""
      },
      rules: {
        passwd: [
          { required: true, message: "请输入旧登录密码", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    dialogConfirm(val) {
      this.submitForm();
    },
    dialogCancel(val) {
      this.$refs.ruleForm.resetFields();
    }
  },
  mounted() {},
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid, msg) => {
        if (valid) {
          let body = {
            passwd: this.formLabelAlign.passwd
          };
          Axios({
            method: "post",
            url: "/user/kill",
            data: JSON.stringify(body),
            withCredentials: true,
            headers: { "content-type": "application/json" }
          }).then(r => {
            if (r.data.ret === 0) {
              this.$message.error(r.data.msg);
              this.$emit("update-denied");
            } else {
              this.$message({
                message: r.data.msg,
                type: "success"
              });
              window.location.href = "/";
            }
          });
        } else {
          this.$emit("update-denied");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped></style>