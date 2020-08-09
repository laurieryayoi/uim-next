<template>
  <div class="telegram">
    <div>
      <div v-if="userInfo.user.telegram_id === 0">
        <div v-if="!globalConfig.use_new_telegram_bot">
          <div>
            <el-card shadow="never">
              将下面的二维码复制或截图发送给 Telegram 机器人
              <el-link
                :href="`https://t.me/${globalConfig.telegram_bot}`"
                type="primary"
              >@{{globalConfig.telegram_bot}}</el-link>
              <div>如二维码过期，点击刷新按钮重新获取</div>
            </el-card>
          </div>
          <div class="tgqr">
            <vue-qr :text="`mod://bind/${userInfo.bind_token}`" :correctLevel="3" :size="230"></vue-qr>
          </div>
          <div class="tgqr">
            <el-button type="success" @click="refreshQr" icon="el-icon-refresh" circle></el-button>
          </div>
        </div>
        <div v-else>
          <el-alert
            :closable="false"
            title="二维码或绑定码有效期 10 分钟，超时请点击刷新按钮重新获取，每个只能使用一次"
            type="warning"
            show-icon
          ></el-alert>
          <el-card class="common-margin-top" shadow="hover">
            <el-alert :closable="false" type="info" show-icon>
              <template #title>
                <div>
                  您可以点击复制绑定码，在 Telegram 中私聊并将绑定码发送给机器人
                  <el-link
                    :href="`https://t.me/${globalConfig.telegram_bot}`"
                    type="primary"
                  >@{{globalConfig.telegram_bot}}</el-link>
                </div>
                <div>手机电脑平板等如已安装 Telegram 可点击一键绑定按钮绑定帐号</div>
              </template>
            </el-alert>
            <el-row class="common-margin-top" :gutter="20">
              <el-col :span="12">
                <el-button
                  style="width:100%"
                  v-uimclip="{ onSuccess:()=>{$message.success('绑定码复制成功')} }"
                  :data-uimclip="userInfo.bind_token"
                  type="primary"
                  plain
                >复制绑定码</el-button>
              </el-col>
              <el-col :span="12">
                <el-button style="width:100%" type="primary" @click="oneKey" plain>一键绑定至账户</el-button>
              </el-col>
              <el-col class="common-margin-top" style="text-align:center" :span="24">
                <el-button type="success" @click="refreshQr" icon="el-icon-refresh" circle></el-button>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>

      <div v-else>
        <el-card shadow="hover">
          当前绑定Telegram账户：
          <el-link
            :href="`https://t.me/${userInfo.user.im_value}`"
            type="primary"
          >@{{userInfo.user.im_value}}</el-link>
        </el-card>
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
    return {};
  },
  watch: {
    dialogConfirm(val) {
      if (this.userInfo.user.telegram_id !== 0) {
        Axios.get("/resettelegram", { withCredentials: true }).then(r => {
          console.log(r);
          if (r.data.ret === 1) {
            console.log(r);
            this.$message({
              message: r.data.msg,
              type: "success"
            });
            this.$emit("update-success", { tg: 0 });
          }
        });
      } else {
        this.$emit("update-success", { tg: 1 });
      }
    },
    dialogCancel(val) {}
  },
  mounted() {},
  methods: {
    submitForm() {},
    refreshQr() {
      this.$emit("update-denied", { qr: "refresh" });
    },
    oneKey() {
      window.open(
        `https://t.me/${this.globalConfig.telegram_bot}?start=${this.userInfo.bind_token}`
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.telegram
  display: flex
  justify-content: center
  flex-wrap: wrap
  color: #606266
.tgqr
  text-align: center
</style>