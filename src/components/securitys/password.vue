<template>
  <div>
    <el-form
      @submit.native.prevent
      label-position="top"
      label-width="100px"
      :model="formLabelAlign"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="当前登录密码" prop="cur">
        <el-input show-password v-model="formLabelAlign.cur"></el-input>
      </el-form-item>
      <el-form-item label="新的登录密码" prop="new">
        <el-input show-password v-model="formLabelAlign.new"></el-input>
      </el-form-item>
      <el-form-item label="确认新的密码" prop="confirm">
        <el-input show-password v-model="formLabelAlign.confirm"></el-input>
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
      labelPosition: "right",
      formLabelAlign: {
        cur: "",
        new: "",
        confirm: ""
      },
      rules: {
        cur: [{ required: true, message: "请输入旧登录密码", trigger: "blur" }],
        new: [
          { required: true, message: "请输入新登录密码", trigger: "blur" },
          { validator: this.backendValidator, trigger: "blur" }
        ],
        confirm: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: this.passwordValidator, trigger: "blur" }
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
            oldpwd: this.formLabelAlign.cur,
            pwd: this.formLabelAlign.new,
            repwd: this.formLabelAlign.confirm
          };
          Axios({
            method: "post",
            url: "/user/password",
            data: JSON.stringify(body),
            withCredentials: true,
            headers: { "content-type": "application/json" }
          })
            .then(r => {
              if (r.data.ret === 1) {
                this.$message({
                  message: r.data.msg,
                  type: "success"
                });
                this.$emit("update-success");
                this.$refs.ruleForm.resetFields();
              } else {
                this.$message.error(r.data.msg);
                this.$emit("update-denied");
              }
            })
            .catch(r => {
              console.log(r);
              this.$emit("update-denied");
            });
        } else {
          this.$emit("update-denied");
          return false;
        }
      });
    },
    passwordValidator(rule, value, callback) {
      if (value !== this.formLabelAlign.new) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    }
  }
};
</script>

<style lang="stylus" scoped></style>