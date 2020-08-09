import Axios from "axios";

export default {
    methods: {
        routeChange(path) {
            window.location.href = path;
        },
        // config 可选参数success,error,分别为自定义成功失败时的信息,onsuccess 成功时回调
        editTheme(key, value, config, onSuccess, onError) {
            Axios({
                method: "put",
                url: `/admin/next/config/update/${key}`,
                data: JSON.stringify({
                    value
                }),
                withCredentials: true,
                headers: {
                    "content-type": "application/json"
                }
            }).then(r => {
                console.log(r);
                if (r.data.ret === 1) {
                    if (config && "success" in config) {
                        this.$message.success(config.success);
                    } else {
                        this.$message.success(r.data.msg);
                    }
                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    if (config && "error" in config) {
                        this.$message.error(config.error);
                    } else {
                        this.$message.error(r.data.msg);
                    }
                    if (onError) {
                        onError();
                    }
                }
            });
        },
    }
}