import Axios from "axios";

export default {
    data() {
        return {
            isGcaptchaRendered: false,
            validate: ''
        }
    },
    methods: {
        initCaptcha(id, type, callback) {
            if (!this.globalConfig[type]) {
                return
            }
            if (document.getElementById('capthcascript') !== null) {
                document.getElementById('capthcascript').remove()
            }
            this.signInScript = document.createElement('script')
            this.signInScript.type = 'text/javascript'
            this.signInScript.id = "capthcascript"

            switch (this.globalConfig.captcha_provider) {
                case 'recaptcha':
                    this.loadGcaptcha(id, callback)
                    break;
                case 'geetest':
                    this.loadGt(id, callback)
                    break;
            }
        },
        loadGt(id, callback) {
            let el = document.getElementById(id)
            if (el !== null) {
                document.getElementById(id).innerHTML = ''
            }
            let self = this

            this.signInScript.src = 'https://static.geetest.com/static/tools/gt.js';
            this.signInScript.onload = function () {

                Axios.get('/getCaptcha', {
                    withCredentials: true
                }).then(r => {
                    let GeConfig = {
                        gt: r.data.GtSdk.gt,
                        challenge: r.data.GtSdk.challenge,
                        product: 'embed'
                    }

                    if (r.data.GtSdk.success === 1) {
                        GeConfig.offline = 0
                    } else {
                        GeConfig.offline = 1
                    }

                    window.initGeetest(GeConfig, function (captchaObj) {
                        captchaObj.appendTo(`#${id}`)
                        captchaObj.onSuccess(function () {
                            self.validate = captchaObj.getValidate()
                        })
                        self.captcha = captchaObj

                        if (callback) {
                            callback()
                        }
                    })
                }).catch(r => {
                    console.log(r);
                })
            }

            document.body.appendChild(this.signInScript);
        },
        loadGcaptcha(id, callback) {
            this.signInScript.src = 'https://recaptcha.net/recaptcha/api.js?render=explicit';
            // this.signInScript.setAttribute('async', true)
            // this.signInScript.setAttribute('defer', true)

            this.signInScript.onload = () => {
                this.initGcaptcha(id)
            }

            document.body.appendChild(this.signInScript);
        },
        initGcaptcha(id, callback) {
            if (grecaptcha.render !== undefined) {
                if (!this.isGcaptchaRendered) {
                    grecaptcha.render(id)
                    this.isGcaptchaRendered = !this.isGcaptchaRendered
                    document.querySelector('#captcha-container>div').style.width = '100%'
                    // console.log(getComputedStyle(document.querySelector('#captcha-container iframe'),maxWidth));

                    if (callback) {
                        callback()
                    }
                } else {
                    grecaptcha.reset()
                }
            } else {
                setTimeout(() => {
                    this.initGcaptcha(id)
                }, 300);
            }
        }
    }
}