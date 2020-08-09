import f2fpay from "../components/payments/f2fpay.vue"
import materialpay from "../components/payments/materialpay.vue"
import paytaro from "../components/payments/paytaro.vue"

export default {
    computed: {
        paymentTypeComponent() {
            let result;
            switch (this.globalConfig.payment_type) {
                case "f2fpay":
                    result = "f2fpay";
                    break;
                case "materialpay":
                    result = "materialpay";
                    break;
                case "paytaro":
                    result = "paytaro";
                    break;
            }
            console.log(result);
            return result
        }
    },
    components: {
        f2fpay,
        materialpay,
        paytaro
    }
}