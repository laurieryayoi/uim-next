import password from "../components/securitys/password.vue"
import twoStepAuth from "../components/securitys/twoStepAuth.vue"
import delAccount from "../components/securitys/delAccount.vue"
import telegram from "../components/securitys/telegram.vue"
import dailymail from "../components/securitys/dailymail.vue"
import theme from "../components/account/theme.vue"

export default {
    computed: {
        profileModuleComponent() {
            let result
            switch (this.dialogType) {
                case 'password':
                    result = 'password'
                    break;
                case 'two-step-authenticator':
                    result = 'two-step-authenticator'
                    break;
                case 'delete-account':
                    result = 'delete-account'
                    break;
                case 'telegram':
                    result = 'telegram'
                    break;
                case 'dailymail':
                    result = 'dailymail'
                    break;
                case 'theme':
                    result = 'theme'
                    break;
            }
            return result
        }
    },
    components: {
        password,
        'two-step-authenticator': twoStepAuth,
        "delete-account": delAccount,
        telegram,
        dailymail,
        theme
    }
}