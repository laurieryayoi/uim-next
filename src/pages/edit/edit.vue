<template>
  <div v-loading="globalLoading" id="app">
    <el-container class="container-body">
      <el-aside width="200px">
        <el-drawer
          :visible.sync="navmenuDrawer"
          :with-header="false"
          append-to-body
          :size="navmenuDrawerWidth"
        >
          <navmenu
            :default-active-menu-item="defaultActiveMenuItem"
            :default-openeds-sub-menu="defaultOpenedsSubMenu"
            :global-config="globalConfig"
            :user-info="userInfo"
          ></navmenu>
        </el-drawer>
        <navmenu
          :default-active-menu-item="defaultActiveMenuItem"
          :default-openeds-sub-menu="defaultOpenedsSubMenu"
          class="hidden-sm-and-down"
          :global-config="globalConfig"
          :user-info="userInfo"
        ></navmenu>
      </el-aside>
      <el-container class="container-main">
        <el-header height="unset" class="gutter-top">
          <headertools
            :user-info="userInfo"
            @nav-drawer-trigger="navDrawerTrigger"
            :pagename="pagename"
          ></headertools>
        </el-header>
        <el-main>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-tabs v-model="activeTab" type="border-card">
                <el-tab-pane name="first" label="连接设置">
                  <el-row :gutter="20">
                    <el-col :xs="24" :sm="12">
                      <el-card>
                        <template #header>
                          <span>连接密码管理</span>
                        </template>
                        <el-alert
                          title="为了确保您的安全，节点连接密码不允许自定义，点击提交按钮将会自动生成由随机字母和数字组成的连接密码。"
                          type="warning"
                          show-icon
                          :closable="false"
                        ></el-alert>
                        <el-alert
                          title="修改连接密码同时也会自动为您重新生成 V2Ray 节点的 UUID。"
                          type="warning"
                          show-icon
                          :closable="false"
                        ></el-alert>
                        <el-alert
                          title="修改密码后，请立刻更新各个客户端上的连接信息。"
                          type="warning"
                          :closable="false"
                          show-icon
                        ></el-alert>
                        <el-card class="common-margin-top" shadow="hover">
                          <span class="text-sub">当前连接密码：</span>
                          <span class="text-alert">{{userInfo.user.passwd}}</span>
                        </el-card>
                        <el-row :gutter="20">
                          <el-col class="passwd-manage" :span="12">
                            <el-button
                              type="primary"
                              plain
                              class="common-margin-top"
                              v-uimclip="{ onSuccess:successCopiedPswd }"
                              :data-uimclip="userInfo.user.passwd"
                            >复制密码</el-button>
                          </el-col>
                          <el-col class="passwd-manage" :span="12">
                            <el-popconfirm @onConfirm="resetLinkPasswd" title="确定重置密码吗？">
                              <el-button
                                slot="reference"
                                type="danger"
                                class="common-margin-top"
                              >重置密码</el-button>
                            </el-popconfirm>
                          </el-col>
                        </el-row>
                      </el-card>
                      <el-card class="common-margin-top">
                        <template #header>连接端口管理</template>
                        <el-alert
                          title="端口重置后，请立刻更新各个客户端上的连接信息。"
                          type="warning"
                          :closable="false"
                          show-icon
                        ></el-alert>
                        <el-card class="common-margin-top" shadow="hover">
                          <div>
                            当前端口：
                            <span class="text-alert">{{userInfo.user.port}}</span>
                          </div>
                        </el-card>
                        <div class="common-margin-top connect-button">
                          <span v-if="isPortSpecifyShow">
                            <el-popover
                              v-model="portSpecifyVisible"
                              placement="bottom"
                              title="指定端口"
                              width="200"
                              trigger="click"
                            >
                              <el-form label-position="left" inline class="common-table-expand">
                                <el-form-item label="账户余额">
                                  <span class="text-alert">{{ userInfo.user.money | creditFilter }}</span>
                                </el-form-item>
                                <el-form-item label="价格">
                                  <span
                                    class="text-alert"
                                  >{{ connectionData.port_price_specify | creditFilter }}</span>
                                </el-form-item>
                              </el-form>
                              <div style="text-align:center">
                                <div class="text-sub">输入要指定的端口</div>
                                <el-input-number
                                  v-model="specifyPort"
                                  :min="parseInt(connectionData.min_port)"
                                  :max="parseInt(connectionData.max_port)"
                                  label="描述文字"
                                ></el-input-number>
                              </div>

                              <el-alert
                                style="margin-top: .8rem"
                                :closable="false"
                                title="不可逆操作提示"
                                show-icon
                                type="warning"
                              >
                                <div>确认即完成购买，请做最后确认</div>
                              </el-alert>
                              <div style="text-align: right; margin-top: .5rem">
                                <el-button
                                  size="mini"
                                  type="text"
                                  @click="portSpecifyVisible = false"
                                >取消</el-button>
                                <el-button
                                  type="primary"
                                  size="mini"
                                  @click="handlePortSpecifyConfirm"
                                >确定</el-button>
                              </div>
                              <el-button slot="reference" type="primary" plain>指定端口</el-button>
                            </el-popover>
                          </span>

                          <el-popover
                            v-model="portResetVisible"
                            placement="bottom"
                            title="重置端口"
                            width="200"
                            trigger="click"
                          >
                            <el-form label-position="left" inline class="common-table-expand">
                              <el-form-item label="账户余额">
                                <span class="text-alert">{{ userInfo.user.money | creditFilter }}</span>
                              </el-form-item>
                              <el-form-item label="价格">
                                <span
                                  class="text-alert"
                                >{{ connectionData.port_price | creditFilter }}</span>
                              </el-form-item>
                            </el-form>
                            <el-alert
                              style="margin-top: .8rem"
                              :closable="false"
                              title="不可逆操作提示"
                              show-icon
                              type="warning"
                            >
                              <div>确认即完成购买，请做最后确认</div>
                            </el-alert>
                            <div style="text-align: right; margin-top: .5rem">
                              <el-button
                                size="mini"
                                type="text"
                                @click="portResetVisible = false"
                              >取消</el-button>
                              <el-button
                                type="primary"
                                size="mini"
                                @click="handlePortResetConfirm"
                              >确定</el-button>
                            </div>
                            <el-button
                              v-if="isPortResetShow"
                              style="margin-left:10px"
                              slot="reference"
                              type="danger"
                            >重置端口</el-button>
                          </el-popover>
                        </div>
                      </el-card>
                    </el-col>
                    <el-col class="connect-settings" :xs="24" :sm="12">
                      <el-card>
                        <template #header>
                          <span>SS连接参数配置</span>
                        </template>
                        <el-alert
                          title="在这里选择你需要使用的客户端可以帮助你筛选加密方式和混淆方式,单端口节点配置不受影响"
                          type="warning"
                          show-icon
                          :closable="false"
                        ></el-alert>
                        <el-alert
                          title="auth_chain 系为实验性协议，可能造成不稳定或无法使用"
                          type="warning"
                          show-icon
                          :closable="false"
                        ></el-alert>
                        <el-alert
                          title="SS/SSD/SSR 支持的加密方式和混淆方式有所不同，请根据实际情况来进行选择,设置完成后请及时更新客户端配置"
                          type="warning"
                          show-icon
                          :closable="false"
                        ></el-alert>
                        <el-card class="common-margin-top" shadow="hover">
                          <template #header>当前连接设置</template>
                          <el-form label-position="left" inline class="common-table-expand">
                            <el-form-item label="当前加密方式">
                              <span class="text-alert">{{ userInfo.user.method }}</span>
                            </el-form-item>
                            <el-form-item label="当前协议">
                              <span class="text-alert">{{ userInfo.user.protocol }}</span>
                            </el-form-item>
                            <el-form-item label="当前混淆">
                              <span class="text-alert">{{ userInfo.user.obfs }}</span>
                            </el-form-item>
                            <el-form-item label="当前混淆参数">
                              <span class="text-alert">{{ userInfo.user.obfs_param }}</span>
                            </el-form-item>
                          </el-form>

                          <div v-if="!showConnectSettingsGuide" class="connect-button">
                            <el-button
                              class="common-margin-top"
                              @click="startConnectSettings"
                              type="primary"
                            >配置向导</el-button>
                          </div>
                        </el-card>

                        <el-card
                          v-if="!showConnectSettingsGuide"
                          class="common-margin-top"
                          shadow="hover"
                        >
                          <template #header>修改配置</template>

                          <el-card shadow="never">
                            可连接客户端：
                            <span class="text-alert">{{clientCanConnect}}</span>
                          </el-card>
                          <div class="common-margin-top">
                            <div class="connect-settings-type">加密方式</div>
                            <el-select
                              v-model="selectedConnectSettings.methodValue"
                              placeholder="选择加密方式"
                            >
                              <el-option
                                v-for="item in connectionData.methods"
                                :key="item"
                                :label="item"
                                :value="item"
                              ></el-option>
                            </el-select>
                          </div>
                          <div class="common-margin-top">
                            <div class="connect-settings-type">协议</div>
                            <el-select
                              v-model="selectedConnectSettings.protocolValue"
                              placeholder="选择协议"
                            >
                              <el-option
                                v-for="item in connectionData.protocol"
                                :key="item"
                                :label="item"
                                :value="item"
                              ></el-option>
                            </el-select>
                          </div>
                          <div class="common-margin-top">
                            <div class="connect-settings-type">混淆方式</div>
                            <el-select
                              v-model="selectedConnectSettings.obfsValue"
                              placeholder="选择混淆方式"
                            >
                              <el-option
                                v-for="item in connectionData.obfs"
                                :key="item"
                                :label="item"
                                :value="item"
                              ></el-option>
                            </el-select>
                          </div>

                          <div class="connect-button">
                            <el-button
                              :disabled="clientCanConnect==='无客户端可连接' || isConnectConfirmDisable"
                              class="common-margin-top"
                              @click="handleConnectConfirm"
                              type="primary"
                            >提交修改</el-button>
                          </div>
                        </el-card>

                        <el-card
                          shadow="hover"
                          v-if="showConnectSettingsGuide"
                          class="common-margin-top"
                        >
                          <el-steps :active="connectSettingsSteps" finish-status="success">
                            <el-step title="选择客户端"></el-step>
                            <el-step title="选择加密方式"></el-step>
                            <el-step title="选择协议"></el-step>
                            <el-step title="选择混淆方式"></el-step>
                          </el-steps>
                          <div>
                            <el-select
                              class="common-margin-top"
                              v-model="selectedConnectSettings.clientValue"
                              :disabled="isClientSelectorDisable"
                              @change="clientChange"
                              placeholder="选择客户端类型"
                            >
                              <el-option
                                v-for="item in clients"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              ></el-option>
                            </el-select>
                          </div>
                          <div>
                            <el-select
                              v-if="connectSettingsSteps!==0"
                              class="common-margin-top"
                              v-model="selectedConnectSettings.methodValue"
                              :disabled="isMethodSelectorDisable"
                              @change="methodChange"
                              placeholder="选择加密方式"
                            >
                              <el-option
                                v-for="item in connectionData.methods"
                                :key="item"
                                :label="item"
                                :value="item"
                                :disabled="methodFilter(item)"
                              ></el-option>
                            </el-select>
                          </div>
                          <div>
                            <el-select
                              v-if="connectSettingsSteps>=2"
                              class="common-margin-top"
                              v-model="selectedConnectSettings.protocolValue"
                              :disabled="isProtocolSelectorDisable"
                              @change="protocolChange"
                              placeholder="选择协议"
                            >
                              <el-option
                                v-for="item in connectionData.protocol"
                                :key="item"
                                :label="item"
                                :value="item"
                                :disabled="protocolFilter(item)"
                              ></el-option>
                            </el-select>
                          </div>
                          <div>
                            <el-select
                              v-if="connectSettingsSteps>=3"
                              class="common-margin-top"
                              v-model="selectedConnectSettings.obfsValue"
                              :disabled="isObfsSelectorDisable"
                              @change="obfsChange"
                              placeholder="选择混淆方式"
                            >
                              <el-option
                                v-for="item in connectionData.obfs"
                                :key="item"
                                :label="item"
                                :value="item"
                                :disabled="obfsFilter(item)"
                              ></el-option>
                            </el-select>
                          </div>
                          <el-alert
                            v-if="isObfsSelectorDisable"
                            title="已完成所有步骤，请提交修改确认"
                            :closable="false"
                            class="common-margin-top"
                            type="success"
                            show-icon
                          ></el-alert>

                          <div class="connect-button common-margin-top">
                            <el-button
                              v-if="connectSettingsSteps===0"
                              @click="handleConnectCancel"
                            >取消</el-button>
                            <el-button v-else @click="handleConnectCancel">上一步</el-button>
                            <el-button
                              :disabled="isConnectConfirmDisable"
                              @click="handleConnectConfirm"
                              type="primary"
                            >提交修改</el-button>
                          </div>
                        </el-card>
                      </el-card>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane name="second" label="中转规则管理">
                  <relay
                    :active-tab="activeTab"
                    :global-config="globalConfig"
                    :user-info="userInfo"
                  ></relay>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
          <div v-if="IsApple" style="height:46px"></div>
        </el-main>
        <el-footer height="46px">
          <div>
            ©{{globalConfig.dateY}} {{ globalConfig.appName }} | Powered by
            <el-button @click="staff = true" type="text">SSPANEL</el-button>
            <el-dialog append-to-body fullscreen :visible.sync="staff">
              <staff :global-config="globalConfig" @close="staff = false"></staff>
            </el-dialog>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Navmenu from "../../components/Navmenu.vue";
import Headertools from "../../components/Header.vue";
import Relay from "../../components/edit/relay.vue";
import PublicFunction from "../../mixins/publicfunction";
import Basejs from "../../mixins/base";
import Axios from "axios";

export default {
  name: "Edit",
  mixins: [Basejs, PublicFunction],
  components: {
    navmenu: Navmenu,
    headertools: Headertools,
    relay: Relay
  },
  computed: {
    clientCanConnect() {
      let result;
      if (this.canSSConnect && !this.canSSRConnect) {
        result = "SS/SSD可连接 ";
      }
      if (this.canSSRConnect && !this.canSSConnect) {
        result = "SSR可连接 ";
      }
      if (this.canSSRConnect && this.canSSConnect) {
        result = "SS/SSD/SSR可连接";
      }
      if (!this.canSSRConnect && !this.canSSConnect) {
        result = "无客户端可连接";
      }
      return result;
    },
    canSSConnect() {
      return (
        this.canMethodConnect >= 2 &&
        this.canProtocolConnect >= 2 &&
        this.canObfsConnect >= 2
      );
    },
    canSSRConnect() {
      return (
        this.canMethodConnect !== 2 &&
        this.canProtocolConnect !== 2 &&
        this.canObfsConnect !== 2
      );
    },
    canMethodConnect() {
      if (this.selectedConnectSettings.methodValue === "none") {
        return 1;
      }
      if (
        this.connectionData.ss_aead_method.includes(
          this.selectedConnectSettings.methodValue
        )
      ) {
        return 2;
      } else {
        return 3;
      }
    },
    canProtocolConnect() {
      if (this.selectedConnectSettings.methodValue === "none") {
        if (
          !this.connectionData.allow_none_protocol.includes(
            this.selectedConnectSettings.protocolValue
          )
        ) {
          return 2;
        }
      }
      if (this.selectedConnectSettings.protocolValue !== "origin") {
        if (
          this.selectedConnectSettings.protocolValue.indexOf("_compatible") ===
          -1
        ) {
          return 1;
        }
        return 3;
      }
      return 3;
    },
    canObfsConnect() {
      if (this.selectedConnectSettings.obfsValue !== "plain") {
        if (
          this.connectionData.ss_obfs.includes(
            this.selectedConnectSettings.obfsValue
          )
        ) {
          if (
            this.selectedConnectSettings.obfsValue.indexOf("_compatible") === -1
          ) {
            return 2;
          }
          return 4;
        }

        if (
          this.selectedConnectSettings.obfsValue.indexOf("_compatible") === -1
        ) {
          return 1;
        }

        return 5;
      }
      return 3;
    },
    isPortResetShow() {
      return this.connectionData.port_price >= 0;
    },
    isPortSpecifyShow() {
      return this.connectionData.port_price_specify >= 0;
    }
  },
  data() {
    return {
      pagename: "连接设置",
      defaultOpenedsSubMenu: ["3"],
      defaultActiveMenuItem: "3-2",
      activeTab: "first",
      connectionData: {
        methods: [],
        obfs: [],
        allow_none_protocol: [],
        protocol: [],
        relay_able_protocol: [],
        ss_aead_method: [],
        ss_obfs: [],
        port_price: 0,
        port_price_specify: -1,
        min_port: 1,
        max_port: 65535
      },
      connectSettingsSteps: 0,
      showConnectSettingsGuide: false,
      isConnectConfirmDisable: false,
      selectedConnectSettings: {
        clientValue: "",
        methodValue: "",
        protocolValue: "",
        obfsValue: "",
        obfsParamsValue: ""
      },
      clients: [
        {
          label: "SS/SSD",
          value: "clop1"
        },
        {
          label: "SSR",
          value: "clop2"
        }
      ],
      isClientSelectorDisable: false,
      isMethodSelectorDisable: false,
      isProtocolSelectorDisable: false,
      isObfsSelectorDisable: false,
      portResetVisible: false,
      portSpecifyVisible: false,
      specifyPort: 0
    };
  },
  created() {
    this.initSite();
    Axios.get("/getconnectsettings", { withCredentials: true }).then(r => {
      console.log(r);
      this.connectionData = r.data;
    });
  },
  watch: {
    connectSettingsSteps(val) {
      if (val <= 3) {
        this.isConnectConfirmDisable = true;
      }

      switch (val) {
        case 0:
          this.isClientSelectorDisable = false;
          this.selectedConnectSettings.methodValue = "";
          this.selectedConnectSettings.clientValue = "";
          break;
        case 1:
          this.isMethodSelectorDisable = false;
          this.selectedConnectSettings.methodValue = "";
          this.selectedConnectSettings.protocolValue = "";
          break;
        case 2:
          this.isProtocolSelectorDisable = false;
          this.selectedConnectSettings.protocolValue = "";
          this.selectedConnectSettings.obfsValue = "";
          break;
        case 3:
          this.isObfsSelectorDisable = false;
          this.selectedConnectSettings.obfsValue = "";
          break;
      }
    },
    userInfoGeted(val) {
      if (val) {
        this.selectedConnectSettings.methodValue = this.userInfo.user.method;
        this.selectedConnectSettings.protocolValue = this.userInfo.user.protocol;
        this.selectedConnectSettings.obfsValue = this.userInfo.user.obfs;
        this.selectedConnectSettings.obfsParamsValue = this.userInfo.user.obfs_param;
      }
    },
    showConnectSettingsGuide(val) {
      if (!val) {
        this.isClientSelectorDisable = false;
        this.isMethodSelectorDisable = false;
        this.isProtocolSelectorDisable = false;
        this.isObfsSelectorDisable = false;
      }
    }
  },
  methods: {
    successCopiedPswd() {
      this.$message({
        message: "复制密码成功",
        type: "success"
      });
    },
    resetLinkPasswd() {
      let body = {
        sspwd: Math.random()
          .toString(36)
          .substr(2)
      };
      Axios({
        method: "post",
        url: "/user/sspwd",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          this.$message({
            message: "密码重置成功",
            type: "success"
          });
          this.getUserInfo();
        } else {
          this.$message.error("密码重置失败");
        }
      });
    },
    startConnectSettings() {
      this.showConnectSettingsGuide = true;
      this.isConnectConfirmDisable = true;
      this.connectSettingsSteps = 0;
      this.selectedConnectSettings.clientValue = "";
      this.selectedConnectSettings.methodValue = "";
      this.selectedConnectSettings.protocolValue = "";
      this.selectedConnectSettings.obfsValue = "";
    },
    handleConnectCancel() {
      if (this.connectSettingsSteps === 0) {
        this.showConnectSettingsGuide = false;
        this.selectedConnectSettings.methodValue = this.userInfo.user.method;
        this.selectedConnectSettings.protocolValue = this.userInfo.user.protocol;
        this.selectedConnectSettings.obfsValue = this.userInfo.user.obfs;
      } else {
        this.connectSettingsSteps -= 1;
      }
    },
    handleConnectConfirm() {
      this.isConnectConfirmDisable = true;

      Axios.all([this.changemethod(), this.changeOtherConnectSettings()]).then(
        Axios.spread((method, others) => {
          if (method.data.ret === 1 && others.data.ret === 1) {
            this.showConnectSettingsGuide = false;
            this.$message.success(others.data.msg);
            this.getUserInfo();
            this.isConnectConfirmDisable = false;
          } else if (method.data.ret !== 1) {
            this.$message.error(method.data.msg);
            this.isConnectConfirmDisable = false;
          } else if (others.data.ret !== 1) {
            this.$message.error(others.data.msg);
            this.isConnectConfirmDisable = false;
          }
        })
      );
    },
    changemethod() {
      let body1 = {
        obfs: this.selectedConnectSettings.obfsValue,
        obfs_param: this.selectedConnectSettings.obfsParamsValue,
        protocol: this.selectedConnectSettings.protocolValue
      };
      return Axios({
        method: "post",
        url: "/user/ssr",
        data: JSON.stringify(body1),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      });
    },
    changeOtherConnectSettings() {
      return Axios({
        method: "post",
        url: "/user/method",
        data: JSON.stringify({
          method: this.selectedConnectSettings.methodValue
        }),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      });
    },
    clientChange(val) {
      if (val !== "") {
        this.connectSettingsSteps = 1;
        this.isClientSelectorDisable = true;
      }
    },
    methodChange(val) {
      if (val !== "") {
        this.connectSettingsSteps = 2;
        this.isMethodSelectorDisable = true;
      }
    },
    protocolChange(val) {
      if (val !== "") {
        this.connectSettingsSteps = 3;
        this.isProtocolSelectorDisable = true;
      }
    },
    obfsChange(val) {
      if (val !== "") {
        this.connectSettingsSteps = 4;
        this.isObfsSelectorDisable = true;
        this.isConnectConfirmDisable = false;
      }
    },
    methodFilter(method) {
      if (this.selectedConnectSettings.clientValue === "clop1") {
        if (method === "none") {
          return true;
        }
        return false;
      } else {
        return this.connectionData.ss_aead_method.includes(method);
      }
    },
    protocolFilter(protocol) {
      if (this.selectedConnectSettings.clientValue === "clop1") {
        if (protocol === "origin") {
          return false;
        }
        return true;
      } else {
        if (this.selectedConnectSettings.methodValue !== "none") {
          return false;
        } else {
          return !this.connectionData.allow_none_protocol.includes(protocol);
        }
      }
    },
    obfsFilter(obfs) {
      if (obfs === "plain" || obfs.indexOf("_compatible") !== -1) {
        return false;
      } else {
        if (this.selectedConnectSettings.clientValue === "clop1") {
          return !this.connectionData.ss_obfs.includes(obfs);
        } else {
          if (this.connectionData.ss_obfs.includes(obfs)) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    handlePortResetConfirm() {
      this.portResetVisible = false;
      Axios({
        method: "post",
        url: "/user/resetport",
        data: JSON.stringify({}),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          this.$message.success(`已成功重置端口为 ${r.data.msg}`);
          this.getUserInfo();
        } else {
          this.$message.error(r.data.msg);
        }
      });
    },
    handlePortSpecifyConfirm() {
      this.portSpecifyVisible = false;
      Axios({
        method: "post",
        url: "/user/specifyport",
        data: JSON.stringify({ port: this.specifyPort }),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          this.$message.success(`已成功指定端口为 ${this.specifyPort}`);
          this.getUserInfo();
        } else {
          this.$message.error(r.data.msg);
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.passwd-manage button
  width: 100%
  letter-spacing: 4px
.connect-button
  text-align: right
.connect-settings-type
  font-size: 14px
  margin-bottom: 0.5rem
  color: #909399
@media only screen and (max-width: 768px)
  .connect-settings
    margin-top: 20px
</style>

