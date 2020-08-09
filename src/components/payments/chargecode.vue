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
      <el-form-item label="请输入充值码" prop="code">
        <el-input v-model="formLabelAlign.code"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  props: ["dialogConfirm", "dialogCancel"],
  data: function() {
    return {
      formLabelAlign: {
        code: ""
      },
      rules: {
        code: [{ required: true, message: "充值码不能为空", trigger: "blur" }]
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
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid, msg) => {
        if (valid) {
          Axios({
            method: "post",
            url: "/user/code",
            data: JSON.stringify({ code: this.formLabelAlign.code }),
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
              this.$emit("update-success");
              this.$refs.ruleForm.resetFields();
            }
          });
        } else {
          this.$emit("update-denied");
          return false;
        }
      });
      let body = { code: this.code };
    }
  }
};
</script>