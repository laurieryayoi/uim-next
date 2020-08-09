<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="tab in tabData"
        class="paymentTab"
        :key="tab.label"
        :label="tab.label"
        :name="tab.name"
      >
        <div v-if="init">请扫描下方二维码付款</div>
        <el-alert
          v-else
          title="请确认金额"
          style="text-align:left"
          type="info"
          :closable="false"
          description="确认后点击确定获取充值二维码"
          show-icon
        ></el-alert>
        <div v-loading="isQrLoading">
          <vue-qr v-loading="isQrLoading" :text="tab.qr" :correctLevel="3" :size="230"></vue-qr>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import Axios from "axios";

export default {
  components: {
    "vue-qr": VueQr
  },
  props: ["globalConfig", "userInfo", "orderItem", "init"],
  data() {
    return {
      activeName: "zfb",
      tabData: [
        {
          label: "支付宝",
          name: "zfb",
          qr: "0"
        }
      ],
      tid: "",
      isQrLoading: false
    };
  },
  watch: {
    init(val) {
      if (val) {
        this.initCharge();
      } else {
        this.tabData.forEach(item => {
          item.qr = "0";
        });
        this.isQrLoading = false;
      }
    }
  },
  mounted() {
    if (this.init) {
      console.log('a');
      this.initCharge();
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    initCharge() {
      this.isQrLoading = true;
      this.$notify({
        title: "正在连接支付网关",
        message: "感谢您对我们的支持，请耐心等待",
        type: "success"
      });

      let pid = 0;

      let price = parseFloat(this.orderItem[0].total);
      console.log(price);

      setTimeout(() => {
        let body = { amount: price };
        Axios({
          method: "post",
          url: "/user/payment/purchase",
          data: JSON.stringify(body),
          withCredentials: true,
          headers: { "content-type": "application/json" }
        })
          .then(r => {
            console.log(r);
            if (r.data.ret === 1) {
              pid = r.data.pid;
              this.isQrLoading = false;
              return r.data.qrcode;
            } else {
              this.$message.error(r.data.msg);
            }
          })
          .then(r => {
            window.console.log(r);
            this.$notify({
              title: "支付网关连接完成",
              message: "请扫描二维码完成支付",
              type: "success"
            });
            this.tabData[0].qr = r;
            this.tid = setTimeout(() => {
              this.chargeChecker(pid);
            }, 1000);
          });
      }, 300);
    },
    chargeChecker(token) {
      let headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      };
      let params = new URLSearchParams();
      params.set("pid", token);
      Axios({
        method: "post",
        url: "/payment/status",
        data: params,
        withCredentials: true,
        headers
      }).then(r => {
        if (r.data.result) {
          this.$message({
            message: "支付成功！",
            type: "success"
          });
          this.$emit("successfully-paid");
        } else {
          this.tid = setTimeout(() => {
            this.chargeChecker(token);
          }, 1000);
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.paymentTab
  text-align: center
</style>