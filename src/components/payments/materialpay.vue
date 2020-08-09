<template>
  <div>
    <el-alert
      title="请确认金额"
      style="text-align:left"
      type="info"
      :closable="false"
      description="确认后点击图标充值, 订单完成前请勿刷新或关闭页面"
      show-icon
    ></el-alert>
    <div class="payment-button-group common-margin-top">
      <el-avatar
        class="payment-button"
        shape="square"
        @click.native="initCharge('ALIPAY')"
        :size="56"
        src="data:image/svg+xml;base64,CjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMDAgMTAwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwMCAxMDAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPG1ldGFkYXRhPiDnn6Lph4/lm77moIfkuIvovb0gOiBodHRwOi8vd3d3LnNmb250LmNuLyA8L21ldGFkYXRhPjxnPjxwYXRoIGQ9Ik05OTAsNjgwLjlWMTk4LjVDOTkwLDk0LjQsOTA1LjcsMTAsODAxLjUsMTBIMTk4LjVDOTQuNCwxMCwxMCw5NC4zLDEwLDE5OC41djYwMy4xQzEwLDkwNS42LDk0LjMsOTkwLDE5OC41LDk5MGg2MDMuMWM5Mi44LDAsMTY5LjktNjcsMTg1LjUtMTU1LjNjLTUwLTIxLjUtMjY2LjctMTE1LjEtMzc5LjQtMTY5Yy04NS44LDEwNC0xNzUuOCwxNjYuNS0zMTEuMywxNjYuNXMtMjI2LTgzLjMtMjE1LjEtMTg1LjZjNy4xLTY3LjIsNTMuMi0xNzYuNiwyNTMtMTU3LjhjMTA1LjMsMTAsMTUzLjUsMjkuNSwyMzkuNCw1Ny45YzIyLjEtNDAuNyw0MC42LTg1LjUsNTQuNi0xMzMuMkgyNDcuNXYtMzcuN2gxODguM3YtNjcuOEgyMDZ2LTQxLjVoMjI5Ljh2LTk3LjhjMCwwLDIuMi0xNS4zLDE5LTE1LjNoOTQuM3YxMTMuMWgyNDV2NDEuNWgtMjQ1djY3LjhoMTk5LjdjLTE4LjMsNzQuOC00Ni4yLDE0My41LTgxLDIwMy41QzcyNS45LDYwMC4yLDk5MCw2ODAuOSw5OTAsNjgwLjlMOTkwLDY4MC45TDk5MCw2ODAuOXogTTI4MS40LDc2Ny42Yy0xNDMuMywwLTE2NS44LTkwLjUtMTU4LjMtMTI4LjJzNDktODYuNywxMjguNi04Ni43YzkxLjUsMCwxNzMuNSwyMy40LDI3MS44LDcxLjNDNDU0LjUsNzE0LDM2OS41LDc2Ny42LDI4MS40LDc2Ny42TDI4MS40LDc2Ny42eiIgc3R5bGU9ImZpbGw6IzU2YWJlNCI+PC9wYXRoPjwvZz48L3N2Zz4gIA=="
      ></el-avatar>
      <el-avatar
        class="payment-button"
        shape="square"
        @click.native="initCharge('WXPAY')"
        :size="56"
        src="data:image/svg+xml;base64,CjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMDAgMTAwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwMCAxMDAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPG1ldGFkYXRhPiDnn6Lph4/lm77moIfkuIvovb0gOiBodHRwOi8vd3d3LnNmb250LmNuLyA8L21ldGFkYXRhPjxnPjxwYXRoIGQ9Ik0zMTIuNiwzMTUuN2MtMTkuMSwwLTM4LjMsMTIuNi0zOC4zLDMxLjhjMCwxOSwxOS4yLDMxLjcsMzguMywzMS43YzE5LjEsMCwzMS43LTEyLjgsMzEuNy0zMS44QzM0NC4zLDMyOC4yLDMzMS43LDMxNS43LDMxMi42LDMxNS43TDMxMi42LDMxNS43TDMxMi42LDMxNS43eiBNNDkwLjMsMzc5LjFjMTkuMiwwLDMxLjgtMTIuOCwzMS44LTMxLjdjMC0xOS4xLTEyLjYtMzEuOC0zMS44LTMxLjhjLTE5LDAtMzguMSwxMi42LTM4LjEsMzEuOEM0NTIuMywzNjYuNCw0NzEuNCwzNzkuMSw0OTAuMywzNzkuMUw0OTAuMywzNzkuMUw0OTAuMywzNzkuMXogTTU3Mi45LDUwMGMtMTIuNiwwLTI1LjQsMTIuNi0yNS40LDI1LjNjMCwxMi44LDEyLjgsMjUuNCwyNS40LDI1LjRjMTkuMiwwLDMxLjgtMTIuNiwzMS44LTI1LjRDNjA0LjcsNTEyLjYsNTkyLjIsNTAwLDU3Mi45LDUwMEw1NzIuOSw1MDBMNTcyLjksNTAweiBNNzEyLjcsNTAwYy0xMi42LDAtMjUuMywxMi43LTI1LjMsMjUuNGMwLDEyLjgsMTIuOCwyNS40LDI1LjMsMjUuNGMxOS4xLDAsMzEuOC0xMi42LDMxLjgtMjUuNEM3NDQuNSw1MTIuNiw3MzEuOCw1MDAsNzEyLjcsNTAwTDcxMi43LDUwMEw3MTIuNyw1MDB6IE04MDEuNSwxMEgxOTguNEM5NC40LDEwLDEwLDk0LjQsMTAsMTk4LjR2NjAzLjJDMTAsOTA1LjYsOTQuMyw5OTAsMTk4LjQsOTkwaDYwMy4xYzkyLjcsMCwxNjkuOC02NywxODUuNS0xNTUuMmwyLjktMTUzLjlWMTk4LjRDOTkwLDk0LjQsOTA1LjYsMTAsODAxLjUsMTBMODAxLjUsMTBMODAxLjUsMTB6IE0zOTUuMiw2MzkuOGMtMzEuNywwLTU3LjItNi40LTg4LjktMTIuN2wtODguOCw0NC41bDI1LjQtNzYuNGMtNjMuNi00NC41LTEwMS43LTEwMS44LTEwMS43LTE3MS41YzAtMTIwLjksMTE0LjQtMjE2LDI1NC4xLTIxNmMxMjQuOSwwLDIzNC4zLDc2LjEsMjU2LjMsMTc4LjRjLTguMi0wLjktMTYuNC0xLjUtMjQuNS0xLjVjLTEyMC43LDAtMjE1LjksOTAtMjE1LjksMjAxYzAsMTguNiwyLjksMzYuNCw3LjgsNTMuM0M0MTEsNjM5LjQsNDAzLjEsNjM5LjgsMzk1LjIsNjM5LjhMMzk1LjIsNjM5LjhMMzk1LjIsNjM5Ljh6IE03NjkuNyw3MjguOGwxOS4yLDYzLjVsLTY5LjctMzguM2MtMjUuNCw2LjQtNTAuOSwxMi43LTc2LjIsMTIuN2MtMTIwLjksMC0yMTYtODIuNS0yMTYtMTg0LjNjMC0xMDEuNiw5NS4xLTE4NC4zLDIxNi0xODQuM2MxMTQuMSwwLDIxNS44LDgyLjgsMjE1LjgsMTg0LjNDODU4LjgsNjM5LjgsODIwLjgsNjkwLjUsNzY5LjcsNzI4LjhMNzY5LjcsNzI4LjhMNzY5LjcsNzI4Ljh6IiBzdHlsZT0iZmlsbDojMTFjZDZlIj48L3BhdGg+PC9nPjwvc3ZnPiAg"
      ></el-avatar>
    </div>
    <el-row v-show="isQrshow">
      <el-row class="common-margin-top" type="flex" justify="center" v-loading="isQrLoading">
        <vue-qr v-loading="isQrLoading" :text="qr" :correctLevel="3" :size="230"></vue-qr>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import Axios from "axios";

export default {
  components: {
    "vue-qr": VueQr
  },
  props: ["globalConfig", "userInfo", "orderItem", "init", "dialogCancel"],
  data() {
    return {
      tid: "",
      paypagesrc: "",
      isQrshow: false,
      isQrLoading: true,
      fullpageLoading: "",
      qr: "0"
    };
  },
  watch: {
    init(val) {
      console.log(val);
      if (!val) {
        this.qr = "0";
        this.isQrshow = false;
      }
    }
  },
  methods: {
    initCharge(type) {
      this.$emit("confirm");
      this.isQrLoading = true;

      if (type === "ALIPAY") {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          type = "ALIPAY_WAP";
        } else {
          type = "ALIPAY_WEB";
        }
      } else {
        this.isQrshow = true;
      }

      this.$notify({
        title: "正在连接支付网关",
        message: "感谢您对我们的支持，请耐心等待",
        type: "success"
      });

      let pid = 0;

      let price = parseFloat(this.orderItem[0].total);
      console.log(price);

      setTimeout(() => {
        let body = { price: price, type };
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
                message: r.data.errmsg,
                type: "error"
              });
              this.isQrshow = false;
              return Promise.reject(r.data.errmsg);
            } else {
              this.dialogVisible = true;
              pid = r.data.pid;

              return r.data;
            }
          })
          .then(r => {
            window.console.log(r);
            if (type === "ALIPAY_WAP" || type === "ALIPAY_WEB") {
              this.fullpageLoading = this.$loading({
                lock: true,
                text: "请在打开的支付页面完成支付",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)"
              });
              window.open(r.result.url);
              // window.location.href = r.data.result.url;
            } else {
              this.$notify({
                title: "支付网关连接完成",
                message: "请扫描二维码完成支付",
                type: "success"
              });
              this.qr = r.result.url;
              this.isQrLoading = false;
            }
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
</style>