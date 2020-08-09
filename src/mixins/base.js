import Staff from "../components/Staff.vue";
import Axios from "axios";

export default {
    components: {
        staff: Staff
    },
    computed: {
        calcExpireDays() {
            let levelExpire = this.DateParse(this.userInfo.user.class_expire);
            let accountExpire = this.DateParse(this.userInfo.user.expire_in);
            let nowDate = new Date();
            let a = nowDate.getTime();
            let b = levelExpire - a;
            let c = accountExpire - a;
            let levelExpireDays = Math.floor(b / (24 * 3600 * 1000));
            let accountExpireDays = Math.floor(c / (24 * 3600 * 1000));
            if (levelExpireDays < 0 || levelExpireDays > 315360000000) {
                levelExpireDays = "无限期"
            } else {
                levelExpireDays = levelExpireDays + '天'
            }
            if (accountExpireDays < 0 || accountExpireDays > 315360000000) {
                accountExpireDays = "无限期"
            } else {
                accountExpireDays = accountExpireDays + '天'
            }
            return {
                levelExpireDays,
                accountExpireDays,
            }
        },
        IsApple() {
            let u = navigator.userAgent
            let ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            let iPad = u.indexOf('iPad') > -1;
            let iPhone = u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1;
            if (ios || iPad || iPhone) {
                return true;
            } else {
                return false;
            }
        }
    },
    filters: {
        creditFilter(val) {
            return `￥` + val;
        }
    },
    data() {
        return {
            globalConfig: {
                appName: '',
                captcha_provider: '',
                payment_type: '',
                mylivechat_id: '',
                enable_kill: '',
                enable_telegram: false,
                telegram_bot: '',
                login_token: '',
                subscribeLog: false,
                subscribeLog_show: false,
                themes: [],
                use_new_telegram_bot: false,
                enable_logincaptcha: false,
                enable_checkin_captcha: false,
                recaptcha_sitekey: '',
                register_mode: '',
                next_config: {
                    custom_tutorial: {},
                    custom_tutorial_url: {},
                    tutorials: {
                        value: '{}'
                    },
                    custom_downloads: {
                        value: '{}'
                    },
                },
                enable_email_verify: false,
                enable_regcaptcha: false,
                dateY: ''
            },
            userInfo: {
                ann: {
                    content: ''
                },
                subUrl: '',
                ssrSubToken: '',
                user: {
                    transfer_enable: 0,
                    u: 0,
                    d: 0,
                    class_expire: '',
                    expire_in: ''
                },
                baseUrl: '',
                subInfo: '',
                url_subinfo: ''
            },
            globalLoading: true,
            userInfoGeted: false,
            navmenuDrawer: false,
            navmenuDrawerWidth: '30%',
            staff: false
        }
    },
    methods: {
        initSite(globalcallback, isAdmin) {
            Axios.all([this.getGlobalConfig(true), this.getUserInfo(true)]).then(Axios.spread((global, userinfo) => {
                //获取系统设置
                this.globalConfig = global.data.globalConfig
                console.log(this.globalConfig);
                console.log(userinfo.data);
                if (global.data.globalConfig.enable_mylivechat && !isAdmin) {
                    this.initLivechat(global.data.globalConfig.mylivechat_id)
                }
                if (globalcallback) {
                    globalcallback()
                }
                //更改title
                let siteTitle = document.getElementsByTagName('title')[0]
                siteTitle.innerText = `${this.globalConfig.appName} - ${siteTitle.innerText}`
                //获取用户信息
                if (userinfo.data.ret === 1) {
                    this.userInfo = userinfo.data.info
                    this.userInfoGeted = true;
                } else if (userinfo.data.ret === -1) {
                    this.$message.error('登录状态失效，请重新登录');
                    setTimeout(() => {
                        window.location.href = '/auth/login'
                    }, 3000);
                }
                //结束loading动画
                this.globalLoading = false
                console.log(JSON.parse(this.globalConfig.next_config.custom_downloads.value))
            }))
        },
        getGlobalConfig(promise = false, callback) {
            if (!promise) {
                Axios.get("/globalconfig", {
                    withCredentials: true
                }).then(r => {
                    this.globalConfig = r.data.globalConfig
                    console.log(this.globalConfig);
                    if (callback) {
                        callback()
                    }
                })
            } else {
                return Axios.get("/globalconfig", {
                    withCredentials: true
                })
            }
        },
        getUserInfo(promise = false, callback) {
            if (!promise) {
                Axios.get("/getuserinfo", {
                    withCredentials: true
                }).then(r => {
                    if (r.data.ret === 1) {
                        this.userInfo = r.data.info
                        this.userInfoGeted = true;
                        if (callback) {
                            callback()
                        }
                    } else if (r.data.ret === -1) {
                        this.$message.error('登录状态失效，请重新登录');
                        setTimeout(() => {
                            window.location.href = '/auth/login'
                        }, 3000);
                    }
                })
            } else {
                return Axios.get("/getuserinfo", {
                    withCredentials: true
                })
            }
        },
        initLivechat(id) {
            function add_chatinline() {
                let hccid = id;
                let nt = document.createElement("script");
                nt.async = true;
                nt.src = "https://mylivechat.com/chatinline.aspx?hccid=" + hccid;
                document.body.appendChild(nt)
                // let ct=document.getElementsByTagName("script")[0];
                // ct.parentNode.insertBefore(nt,ct);
            }
            add_chatinline();
        },
        navDrawerTrigger() {
            console.log();
            if (window.innerWidth <= 768) {
                this.navmenuDrawerWidth = '46%'
            } else {
                this.navmenuDrawerWidth = '30%'
            }
            this.navmenuDrawer = !this.navmenuDrawer
        },
        DateParse(str_date) {
            let str_date_splited = str_date.split(/[^0-9]/);
            return new Date(
                str_date_splited[0],
                str_date_splited[1] - 1,
                str_date_splited[2],
                str_date_splited[3],
                str_date_splited[4],
                str_date_splited[5]
            );
        },
        successCopied() {
            this.$message({
                message: "复制链接成功",
                type: "success"
            });
        },

    }
}