<template>
  <div>
    <el-alert type="info" description="开启后将每天发送公告和流量日志信息" show-icon>
      <template #title>
        现在状态：
        <span style="color:#FF7800">{{isDailymailOn}}</span>
      </template>
    </el-alert>
    <el-card class="common-margin-top" shadow="hover">
      <el-switch v-model="value" @change="onChange" active-text="开启" inactive-text="不开启"></el-switch>
    </el-card>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  components: {},
  computed: {
    isDailymailOn() {
      if (this.userInfo.user.sendDailyMail) {
        return "开启";
      } else {
        return "未开启";
      }
    }
  },
  props: ["globalConfig", "userInfo", "dialogConfirm", "dialogCancel"],
  data() {
    return {
      value: false
    };
  },
  watch: {
    dialogConfirm(val) {
      let body = {
        mail: this.value === true ? "1" : "0"
      };
      Axios({
        method: "post",
        url: "/user/mail",
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
          this.$emit("update-success", { mail: this.value });
        }
      });
    },
    dialogCancel(val) {}
  },
  mounted() {},
  methods: {
    submitForm() {},
    onChange(val) {
      console.log(val);
    }
  }
};
</script>

<style lang="stylus" scoped></style>