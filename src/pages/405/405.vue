<template>
  <div id="app">
    <el-container>
      <el-main>
        <el-row type="flex" justify="center">
          <el-col :xs="24" :sm="12" :lg="8" :xl="7">
            <el-card class="error">
              <div class="error-title text-alert">405 - 访问方式不正确</div>
              <el-alert
                :closable="false"
                class="common-margin-top"
                title="您的访问方式不正确，如有任何问题请联系网站管理员"
                type="error"
                show-icon
              ></el-alert>
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
  name: "page405",
  mixins: [Basejs, PublicFunction],
  computed: {},
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
  data() {
    return {};
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
.error
  margin-top: 50px
  @media (max-width: 768px)
    margin-top: 25px
.error-title
  font-size: 20px
  text-align: center
</style>

