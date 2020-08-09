<template>
  <el-dialog
    title="充值"
    :visible.sync="dialogVisible"
    :width="dialogWidth"
    @open="handleChargeOpen"
    @closed="handleChargeClose"
  >
    <div v-if="toolTipType === 'code'">
      <charge-code
        @update-success="handleSuccess"
        @update-denied="handleDenied"
        :dialog-confirm="dialogConfirm"
        :dialog-cancel="dialogCancel"
      ></charge-code>
    </div>
    <div v-if="toolTipType === 'payments'">
      <el-row :gutter="20">
        <el-col :xs="24" :lg="12">
          <el-form
            @submit.native.prevent
            label-position="top"
            label-width="100px"
            :model="chargeFormLabelAlign"
            :rules="chargeFormRules"
            ref="chargeForm"
          >
            <el-card shadow="never">
              <span>
                订单金额:
                <span class="text-alert">{{chargeFormLabelAlign.price | creditFilter}}</span>
              </span>
            </el-card>
            <el-card class="common-margin-top" shadow="hover">
              <el-form-item label="请输入充值金额" prop="price">
                <el-input-number
                  :disabled="isPriceInputDisable"
                  v-model="chargeFormLabelAlign.price"
                  :min="0"
                ></el-input-number>
              </el-form-item>
            </el-card>
          </el-form>
        </el-col>
        <el-col class="pay-com" :xs="24" :lg="12">
          <component
            :is="paymentTypeComponent"
            :order-item="[{total:chargeFormLabelAlign.price}]"
            :init="isPaymentComInit"
            @confirm="handleDialogConfirm"
            @successfully-paid="handleSuccess"
          ></component>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleDialogCancel">取 消</el-button>
      <el-button
        v-if="globalConfig.payment_type === 'f2fpay'"
        type="primary"
        :disabled="disableConfirm"
        @click="handleDialogConfirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ChargeModule from "../mixins/charge";
import chargeCodeModule from "./payments/chargecode.vue";

export default {
  mixins: [ChargeModule],
  components: {
    "charge-code": chargeCodeModule
  },
  filters: {
    creditFilter(val) {
      return `￥` + val;
    }
  },
  props: ["visible", "toolTipType", "globalConfig"],
  watch: {
    visible(val) {
      if (val) {
        this.dialogVisible = true;
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit("close");
        this.disableConfirm = false;
        this.isPriceInputDisable = false;
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogWidth: "40%",
      dialogConfirm: true,
      dialogCancel: true,
      isPaymentComInit: false,
      disableConfirm: false,
      isPriceInputDisable: false,
      chargeFormLabelAlign: {
        price: 0
      },
      chargeFormRules: {
        price: [{ validator: this.priceValidator, trigger: "blur" }]
      }
    };
  },
  methods: {
    handleChargeOpen() {
      if (window.innerWidth <= 768 && window.innerWidth > 400) {
        this.dialogWidth = "70%";
      } else if (window.innerWidth <= 400) {
        this.dialogWidth = "90%";
      } else {
        this.dialogWidth = "40%";
      }
    },
    handleChargeClose() {
      this.dialogCancel = !this.dialogCancel;
      if (this.toolTipType === "payments") {
        this.$refs.chargeForm.resetFields();
      }
      this.isPaymentComInit = false;
    },
    handleSuccess() {
      this.dialogVisible = false;

      this.$emit("success");
    },
    handleDenied() {
      this.disableConfirm = false;
      this.isPriceInputDisable = false;
    },
    handleDialogCancel() {
      this.dialogVisible = false;
    },
    handleDialogConfirm() {
      this.dialogConfirm = !this.dialogConfirm;
      this.disableConfirm = true;

      if (this.toolTipType === "payments") {
        this.handleCharge();
      }
    },
    priceValidator(rule, value, callback) {
      if (value === 0) {
        callback(new Error("金额不能为0"));
      } else {
        callback();
      }
    },
    handleCharge() {
      this.isPriceInputDisable = true;
      this.$refs.chargeForm.validate((valid, msg) => {
        if (valid) {
          this.isPaymentComInit = true;
        } else {
          this.handleDenied();
        }
      });
    }
  }
};
</script>