export default {
    computed: {
        suburlBase: function () {
            return this.userInfo.subUrl + this.userInfo.ssrSubToken;
        },
        suburlMu0: function () {
            return this.suburlBase + "?sub=1";
        },
        suburlMu1: function () {
            return this.suburlBase + "?mu=1";
        },
        suburlSSD: function () {
            return this.suburlBase + "?ssd=1";
        },
        suburlClash: function () {
            return this.suburlBase + "?clash=1";
        },
        suburlSurge: function () {
            return this.suburlBase + "?surge=";
        },
        suburlMu3: function () {
            return this.suburlBase + "?sub=3";
        },
        suburl() {
            return [{
                    name: 'SSR',
                    link: this.suburlMu0
                },
                // {
                //     name: 'SSR单端口',
                //     link: this.suburlMu1
                // },
                {
                    name: 'SSD',
                    link: this.suburlSSD
                },
                {
                    name: 'V2RAY',
                    link: this.suburlMu3
                },
                {
                    name: 'SS安卓',
                    link: this.userInfo.subInfo.ssa,
                    tooltip: '该客户端仅 v5.0 以上版本支持订阅，如您未找到订阅配置之处，请尝试升级客户端'
                },
                {
                    name: 'Clash配置文件下载',
                    link: this.suburlClash
                }
            ]
        },
        nodelink() {
            return [{
                    name: 'SSR',
                    link: this.userInfo.user.ssr_url_all,
                    type: 'ssr'
                },
                // {
                //     name: 'SSR单端口',
                //     link: this.userInfo.user.ssr_url_all_mu
                // },
                {
                    name: 'SS',
                    link: this.userInfo.user.ss_url_all,
                    type: 'ss'
                },
                {
                    name: 'SSD',
                    link: this.userInfo.user.ssd_url_all,
                    type: 'ssd'
                },
                {
                    name: 'V2RAY',
                    link: this.userInfo.user.vmess_url_all,
                    type: 'v2ray'
                },
            ]
        },
        clashlink() {
            return [{
                name: 'Clash配置一键导入',
                function: () => {
                    window.location.href = `clash://install-config?url=${this.userInfo.url_subinfo.clash}`
                }
            }, {
                name: 'Shadowrocket一键导入',
                function: () => {
                    return this.addSub(this.userInfo.subInfo.shadowrocket, "sub://")
                }
            }]
        },
        otherLink() {
            return [{
                name: 'Quantumult V2ray订阅',
                link: this.userInfo.subInfo.quantumult_v2
            }, {
                name: 'QuantumultX',
                link: this.userInfo.subInfo.quantumultx
            }, {
                name: 'Kitsunebi',
                link: this.userInfo.subInfo.kitsunebi
            }]
        },
        surgeLink() {
            return [{
                    name: '4.x版本一键导入',
                    link: `${this.suburlSurge}4`
                },
                {
                    name: '3.x版本一键导入',
                    link: `${this.suburlSurge}3`
                },
                {
                    name: '2.x版本一键导入',
                    link: `${this.suburlSurge}2`
                }
            ]
        }
    },
    methods: {
        addSub(url, jumpurl = "") {
            let tmp = window.btoa(url);
            window.location.href = jumpurl + tmp;
        }
    }


}