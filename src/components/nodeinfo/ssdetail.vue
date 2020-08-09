<template>
  <div>
    <el-tabs v-model="activeNodeInfoType" @tab-click="handleTabClick" type="card">
      <el-tab-pane v-if="ssrHasNormalPort" label="SSR" name="ssr">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-card :body-style="{'background-color':'#fafcff'}" shadow="never">
              <template #header>
                <span>节点参数</span>
              </template>
              <el-form label-position="left" inline class="common-table-expand">
                <el-form-item label="节点名称">
                  <span>{{ nodeDetail.nodeInfo.node.name }}</span>
                </el-form-item>
                <el-form-item label="服务器地址">
                  <span>{{ nodeDetail.nodeInfo.node.server | serverFilter }}</span>
                </el-form-item>
                <el-form-item label="服务器端口">
                  <span>{{ nodeDetail.ssritem.port }}</span>
                </el-form-item>
                <el-form-item label="加密方式">
                  <span>{{ nodeDetail.nodeInfo.user.method }}</span>
                </el-form-item>
                <el-form-item label="密码">
                  <span>{{ nodeDetail.nodeInfo.user.passwd }}</span>
                </el-form-item>
                <el-form-item label="协议">
                  <span>{{ nodeDetail.nodeInfo.user.protocol }}</span>
                </el-form-item>
                <el-form-item label="协议参数">
                  <span>{{ nodeDetail.nodeInfo.user.protocol_param }}</span>
                </el-form-item>
                <el-form-item label="混淆">
                  <span>{{ nodeDetail.nodeInfo.user.obfs }}</span>
                </el-form-item>
                <el-form-item label="混淆参数">
                  <span>{{ nodeDetail.nodeInfo.user.obfs_param }}</span>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-card shadow="never">
              <template #header>
                <span>节点导入</span>
              </template>
              <el-collapse v-model="ssrActiveNames">
                <el-collapse-item title="二维码导入" name="ssrqr">
                  <div class="qrarea">
                    <div>扫描二维码导入</div>
                    <vue-qr :text="nodeDetail.ssrlink" :correctLevel="3" :size="230"></vue-qr>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="复制链接到剪贴板" name="ssrlink">
                  <el-button
                    v-uimclip="{ onSuccess:successCopied }"
                    :data-uimclip="nodeDetail.ssrlink"
                    type="primary"
                  >复制节点链接</el-button>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane v-if="ssHasNormalPort" label="SS" name="ss">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-card :body-style="{'background-color':'#fafcff'}" shadow="never">
              <template #header>
                <span>节点参数</span>
              </template>
              <el-form label-position="left" inline class="common-table-expand">
                <el-form-item label="节点名称">
                  <span>{{ nodeDetail.nodeInfo.node.name }}</span>
                </el-form-item>
                <el-form-item label="服务器地址">
                  <span>{{ nodeDetail.nodeInfo.node.server | serverFilter }}</span>
                </el-form-item>
                <el-form-item label="服务器端口">
                  <span>{{ nodeDetail.nodeInfo.user.port | portFilter }}</span>
                </el-form-item>
                <el-form-item label="加密方式">
                  <span>{{ nodeDetail.nodeInfo.user.method }}</span>
                </el-form-item>
                <el-form-item label="密码">
                  <span>{{ nodeDetail.nodeInfo.user.passwd }}</span>
                </el-form-item>
                <el-form-item label="混淆">
                  <span>{{ nodeDetail.nodeInfo.user.obfs }}</span>
                </el-form-item>
                <el-form-item label="混淆参数">
                  <span>{{ nodeDetail.nodeInfo.user.obfs_param }}</span>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-card shadow="never">
              <template #header>
                <span>节点导入</span>
              </template>
              <el-collapse v-model="ssrActiveNames">
                <el-collapse-item title="二维码导入" name="ssqr">
                  <div class="qrarea">
                    <div>扫描二维码导入</div>
                    <div>非windows</div>
                    <vue-qr :text="nodeDetail.sslink" :correctLevel="3" :size="230"></vue-qr>
                    <div>windows</div>
                    <vue-qr :text="nodeDetail.ssQrWin" :correctLevel="3" :size="230"></vue-qr>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="复制链接到剪贴板" name="sslink">
                  <el-button
                    v-uimclip="{ onSuccess:successCopied }"
                    :data-uimclip="nodeDetail.sslink"
                    type="primary"
                  >复制节点链接</el-button>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane
        v-for="tab in nodeMuportCom"
        :key="tab.server.server"
        :label="`单端口-${tab.server.server}`"
        :name="`muport-${tab.server.server}`"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-card :body-style="{'background-color':'#fafcff'}" shadow="never">
              <template #header>
                <span>节点参数</span>
              </template>
              <el-form label-position="left" inline class="common-table-expand">
                <el-form-item label="节点名称">
                  <span>{{ nodeDetail.nodeInfo.node.name }}</span>
                </el-form-item>
                <el-form-item label="服务器地址">
                  <span>{{ nodeDetail.nodeInfo.node.server | serverFilter }}</span>
                </el-form-item>
                <el-form-item v-if="'ssritem' in currentMuport" label="服务器端口">
                  <span>{{ currentMuport.ssritem.port }}</span>
                </el-form-item>
                <el-form-item label="加密方式">
                  <span>{{ tab.user.method }}</span>
                </el-form-item>
                <el-form-item label="密码">
                  <span>{{ tab.user.passwd }}</span>
                </el-form-item>
                <el-form-item label="协议">
                  <span>{{ tab.user.protocol }}</span>
                </el-form-item>
                <el-form-item v-if="'ssritem' in currentMuport" label="协议参数">
                  <span>{{ currentMuport.ssritem.protocol_param }}</span>
                </el-form-item>
                <el-form-item label="混淆">
                  <span>{{ tab.user.obfs }}</span>
                </el-form-item>
                <el-form-item label="混淆参数">
                  <span>{{ tab.user.obfs_param }}</span>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-card shadow="never">
              <template #header>
                <span>节点导入</span>
              </template>
              <el-collapse v-model="ssrActiveNames">
                <el-collapse-item title="二维码导入" name="muqr">
                  <div class="qrarea">
                    <div>扫描二维码导入</div>
                    <div v-if="muportSSqrWim !== ''">非windows</div>
                    <vue-qr :text="muportLink" :correctLevel="3" :size="230"></vue-qr>
                    <div v-if="muportSSqrWim !== ''">windows</div>
                    <vue-qr
                      v-if="muportSSqrWim !== ''"
                      :text="muportLink"
                      :correctLevel="3"
                      :size="230"
                    ></vue-qr>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="复制链接到剪贴板" name="mulink">
                  <el-button
                    v-uimclip="{ onSuccess:successCopied }"
                    :data-uimclip="muportLink"
                    type="primary"
                  >复制节点链接</el-button>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-col>
        </el-row>
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
  props: ["globalConfig", "userInfo", "nodeMuport", "nodeDetail"],
  computed: {
    nodeMuportCom() {
      if (this.nodeDetail.nodeInfo.node.mu_only === -1) {
        return [];
      } else {
        return this.nodeMuport;
      }
    },
    ssrHasNormalPort() {
      if (
        "ssrlink" in this.nodeDetail &&
        this.nodeDetail.nodeInfo.node.mu_only !== 1
      ) {
        return true;
      }
      return false;
    },
    ssHasNormalPort() {
      if (
        "sslink" in this.nodeDetail &&
        this.nodeDetail.nodeInfo.node.mu_only !== 1
      ) {
        return true;
      }
      return false;
    }
  },
  filters: {
    serverFilter(val) {
      return val.split(";")[0];
    }
  },
  data() {
    return {
      activeNodeInfoType: "ssr",
      ssrActiveNames: "",
      currentMuport: {},
      muportLink: "",
      muportSSqrWim: ""
    };
  },
  watch: {},
  mounted() {
    if (this.ssrHasNormalPort) {
      this.activeNodeInfoType = "ssr";
    } else if (this.ssHasNormalPort) {
      this.activeNodeInfoType = "ss";
    } else {
      if (this.nodeMuportCom.lengt !== 0) {
        let port = this.nodeMuportCom[0].server.server;
        this.activeNodeInfoType = `muport-${port}`;
        this.getMuportInfo(port);
      }
    }
  },
  methods: {
    successCopied() {
      this.$message({
        message: "复制链接成功",
        type: "success"
      });
    },
    handleTabClick(tab) {
      if (tab.name.indexOf("muport") !== -1) {
        this.getMuportInfo(tab.name.split("-")[1]);
      }
    },
    getMuportInfo(port) {
      Axios.get(`/nodeinfo/${this.nodeDetail.nodeInfo.node.id}?ismu=${port}`, {
        withCredentials: true
      }).then(r => {
        console.log(r);
        this.currentMuport = r.data;
        this.getMuportLink();
      });
    },
    getMuportLink() {
      if ("ssrlink" in this.currentMuport) {
        this.muportLink = this.currentMuport.ssrlink;
      }
      if ("sslink" in this.currentMuport) {
        this.muportLink = this.currentMuport.sslink;
        this.muportSSqrWim = this.currentMuport.ssQrWin;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.qrarea
  text-align: center
</style>