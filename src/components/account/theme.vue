<template>
  <div>
    <el-card shadow="hover">
      当前主题：
      <span class="text-alert">{{userInfo.user.theme}}</span>
      <el-form
        class="common-margin-top"
        @submit.native.prevent
        label-position="top"
        label-width="100px"
        :model="formLabelAlign"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="选择主题" prop="theme">
          <el-select required v-model="formLabelAlign.theme" placeholder="请选择主题">
            <el-option v-for="item in globalConfig.themes" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  components: {},
  computed: {},
  props: ["globalConfig", "userInfo", "dialogConfirm", "dialogCancel"],
  data() {
    return {
      formLabelAlign: {
        theme: ""
      },
      rules: {
        theme: [{ required: true, message: "请选择一个主题", trigger: "blur" }]
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
            theme: this.formLabelAlign.theme
          };
          Axios({
            method: "post",
            url: "/user/theme",
            data: JSON.stringify(body),
            withCredentials: true,
            headers: { "content-type": "application/json" }
          })
            .then(r => {
              if (r.data.ret === 1) {
                this.$notify({
                  title: "主题修改成功",
                  message: "即将跳转至用户中心",
                  type: "success",
                  duration: 2000
                });
                this.$emit("update-success");
                this.$refs.ruleForm.resetFields();
                setTimeout(() => {
                  window.location.href = "/user";
                }, 2000);
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
    }
  }
};
</script>

<style lang="stylus" scoped></style>