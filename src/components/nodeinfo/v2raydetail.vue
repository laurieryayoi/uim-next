<template>
  <div>
    <el-tabs v-model="activeNodeInfoType" type="card">
      <el-tab-pane label="V2RAY" name="v2ray">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-card :body-style="{'background-color':'#fafcff'}" shadow="never">
              <template #header>
                <span>节点参数</span>
              </template>
              <el-form label-position="left" inline class="common-table-expand">
                <el-form-item label="节点名称">
                  <span>{{ nodeDetail.nodeInfo.node.remark }}</span>
                </el-form-item>
                <el-form-item label="节点地址">
                  <span>{{ nodeDetail.nodeInfo.node.add }}</span>
                </el-form-item>
                <el-form-item label="节点端口">
                  <span>{{ nodeDetail.nodeInfo.node.port }}</span>
                </el-form-item>
                <el-form-item label="AlterId">
                  <span>{{ nodeDetail.nodeInfo.node.aid }}</span>
                </el-form-item>
                <el-form-item label="用户 UUID">
                  <span>{{ nodeDetail.nodeInfo.node.id }}</span>
                </el-form-item>
                <el-form-item label="传输协议">
                  <span>{{ nodeDetail.nodeInfo.node.net }}</span>
                </el-form-item>
                <el-form-item v-if="nodeDetail.nodeInfo.node.net === 'ws'" label="伪装路径">
                  <span>{{ nodeDetail.nodeInfo.node.path }}</span>
                </el-form-item>
                <el-form-item v-if="nodeDetail.nodeInfo.node.net === 'ws'" label="HOST">
                  <span>{{ nodeDetail.nodeInfo.node.host }}</span>
                </el-form-item>
                <el-form-item v-if="nodeDetail.nodeInfo.node.net === 'kcp'" label="伪装方式">
                  <span>{{ nodeDetail.nodeInfo.node.type }}</span>
                </el-form-item>
                <el-form-item v-if="nodeDetail.nodeInfo.node.tls === 'tls'" label="TLS">
                  <span>{{ nodeDetail.nodeInfo.node.tls }}</span>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-card shadow="never">
              <template #header>
                <span>节点导入</span>
              </template>
              <el-collapse v-model="v2rayActiveNames">
                <el-collapse-item title="二维码导入" name="muqr">
                  <div class="qrarea">
                    <vue-qr :text="nodeDetail.vmessUrl" :correctLevel="3" :size="230"></vue-qr>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="复制链接到剪贴板" name="ssrlink">
                  <el-button
                    v-uimclip="{ onSuccess:successCopied }"
                    :data-uimclip="nodeDetail.vmessUrl"
                    type="primary"
                  >复制VMESS链接</el-button>
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

export default {
  props: ["globalConfig", "userInfo", "nodeDetail"],
  components: {
    "vue-qr": VueQr
  },
  data() {
    return {
      activeNodeInfoType: "v2ray",
      v2rayActiveNames: ""
    };
  },
  watch: {},
  mounted() {},
  methods: {
    successCopied() {
      this.$message({
        message: "复制链接成功",
        type: "success"
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.qrarea
  text-align center
</style>