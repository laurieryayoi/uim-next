<template>
  <div>
    <el-alert
      title="请确认金额"
      style="text-align:left"
      type="info"
      :closable="false"
      description="请输入金额后点击下方按钮充值，充值完成前请勿关闭本页面"
      show-icon
    ></el-alert>
    <div class="payment-button-group common-margin-top">
      <el-button class="charge" @click="initCharge" type="primary" plain>打开充值页面</el-button>
    </div>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  props: ["globalConfig", "userInfo", "orderItem", "init", "dialogCancel"],
  data() {
    return {
      tid: "",
      paypagesrc: "",
      fullpageLoading: ""
    };
  },
  methods: {
    initCharge(type) {
      this.$emit("confirm");

      this.$notify({
        title: "正在连接支付网关",
        message: "感谢您对我们的支持，请耐心等待",
        type: "success"
      });

      let pid = 0;

      let price = parseFloat(this.orderItem[0].total);
      console.log(price);

      setTimeout(() => {
        let body = { amount: price, type };
        Axios({
          method: "post",
          url: "/user/payment/purchase",
          data: JSON.stringify(body),
          withCredentials: true,
          headers: { "content-type": "application/json" }
        })
          .then(r => {
            console.log(r);
            if (r.data.code === -1) {
              this.$message({
                message: r.data.msg,
                type: "error"
              });
              return Promise.reject(r.data.msg);
            } else {
              this.dialogVisible = true;
              pid = r.data.pid;

              return r.data;
            }
          })
          .then(r => {
            window.console.log(r);

            this.fullpageLoading = this.$loading({
              lock: true,
              text: "请在打开的支付页面完成支付",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)"
            });
            window.open(r.url);
            // window.location.href = r.url;

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
          if (this.fullpageLoading !== "") {
            this.fullpageLoading.close();
          }
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
.payment-button-group
  text-align: center
.payment-button
  background-color: white
  cursor: pointer
  margin: 0 0.7rem
.iframe
  z-index: 30000
.charge
  letter-spacing: 4px
  width: 100%
</style>