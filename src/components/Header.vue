<template>
  <el-row>
    <el-col :span="24">
      <el-card class="nav-bar">
        <el-row type="flex" align="middle">
          <el-col class="navbar-column" :xs="20" :sm="12">
            <el-button
              class="hidden-md-and-up"
              icon="el-icon-s-unfold"
              circle
              @click="navDrawerTrigger"
            ></el-button>
            <h2>{{pagename}}</h2>
          </el-col>
          <el-col class="navbar-tools navbar-column" :xs="4" :sm="12">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-avatar class="navbar-tools-trigger" size="medium" :src="userInfo.gravatar"></el-avatar>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="index" icon="el-icon-s-custom">用户中心</el-dropdown-item>
                <el-dropdown-item command="code" icon="el-icon-bank-card">我的钱包</el-dropdown-item>
                <el-dropdown-item command="avatar" icon="el-icon-picture-outline-round">设置头像</el-dropdown-item>
                <el-dropdown-item
                  class="text-danget"
                  command="logout"
                  divided
                  icon="el-icon-delete-location"
                >退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import Axios from "axios";
export default {
  props: ["pagename", "userInfo"],
  data() {
    return {};
  },
  methods: {
    navDrawerTrigger() {
      this.$emit("nav-drawer-trigger");
    },
    handleCommand(command) {
      switch (command) {
        case "index":
          window.location.href = "/user";
          break;
        case "code":
          window.location.href = "/user/code";
          break;
        case "avatar":
          window.open("https://en.gravatar.com/");
          break;
        case "logout":
          Axios.get("/logout", { withCredentials: true }).then(r => {
            if (r.data.ret === 1) {
              this.$notify({
                title: "提示",
                message: "登出成功！即将跳转至首页",
                duration: 1500
              });
              setTimeout(() => {
                window.location.href = "/";
              }, 1500);
            }
          });
          break;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.navbar-column
  display: flex
  align-items: center
.navbar-tools
  justify-content: flex-end
.navbar-tools-trigger
  cursor: pointer
</style>