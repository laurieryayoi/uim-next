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
            <el-col v-if="type === 'normal'" :span="24">
              <el-card>
                <template #header>自定义教程</template>
                <el-switch
                  v-model="globalConfig.next_config.custom_tutorial.value"
                  @change="editTheme('custom_tutorial',globalConfig.next_config.custom_tutorial.value)"
                  active-text="开启自定义教程"
                ></el-switch>
                <el-card shadow="never" class="common-margin-top">
                  <el-input
                    v-model="globalConfig.next_config.custom_tutorial_url.value"
                    placeholder="输入自定义教程链接"
                  ></el-input>
                  <div class="button-config">
                    <el-button
                      :disabled="!globalConfig.next_config.custom_tutorial.value"
                      class="common-margin-top"
                      type="primary"
                      @click="editTheme('custom_tutorial_url',globalConfig.next_config.custom_tutorial_url.value)"
                    >保存设置</el-button>
                  </div>
                </el-card>
                <el-card shadow="never" class="common-margin-top">
                  <template #header>
                    <span>编辑教程页面</span>
                    <el-popover
                      v-model="addTutorialVisiable"
                      placement="bottom"
                      title="输入教程名称"
                      width="200"
                      trigger="click"
                    >
                      <el-form
                        @submit.native.prevent
                        :model="addTutorialRuleForm"
                        :rules="addTutorialRules"
                        ref="addTutorialRuleForm"
                      >
                        <el-form-item label="教程名成" prop="title">
                          <el-input
                            v-model="addTutorialRuleForm.title"
                            minlength="1"
                            placeholder="请输入教程名称"
                          ></el-input>
                        </el-form-item>
                      </el-form>
                      <div class="button-config">
                        <el-button type="primary" size="mini" @click="handleAddTutorial">确定</el-button>
                      </div>
                      <el-button
                        slot="reference"
                        style="float: right; padding: 3px 0"
                        type="text"
                      >新增教程</el-button>
                    </el-popover>
                  </template>
                  <el-row :gutter="20">
                    <el-col
                      class="tutorial"
                      v-for="(item,index) in tutorials"
                      :key="item.id"
                      :xs="24"
                      :sm="12"
                      :lg="8"
                    >
                      <el-card shadow="hover">
                        <el-row>
                          <el-col :xs="24">
                            <span>{{item.title}}</span>
                          </el-col>
                          <el-col :xs="24">
                            <div class="button-config tutorial-action">
                              <el-popconfirm @onConfirm="deleteTutorial(index)" title="确定删除教程吗？">
                                <el-button
                                  :disabled="isActionDisabled"
                                  class="tutorial-action-delete"
                                  slot="reference"
                                  size="mini"
                                >删除</el-button>
                              </el-popconfirm>
                              <el-button
                                :disabled="isActionDisabled"
                                type="primary"
                                size="mini"
                                @click="editTutorial(item,index)"
                              >编辑</el-button>
                            </div>
                          </el-col>
                        </el-row>
                      </el-card>
                    </el-col>
                  </el-row>
                </el-card>
              </el-card>
            </el-col>
            <el-col v-if="type === 'editTutorial'">
              <el-card>
                <template #header>
                  <el-page-header class="header-inline" @back="goBack" content="教程编辑"></el-page-header>
                </template>
                <edit-tutorial
                  :tutorial="currentEditTutorial"
                  :tutorials="tutorials"
                  :global-config="globalConfig"
                ></edit-tutorial>
              </el-card>
            </el-col>
            <el-col v-if="type === 'normal'" :span="24" class="common-margin-top">
              <el-card>
                <template #header>
                  自定义下载链接
                  <el-popover
                    v-model="customDL.addCustomDLVisiable"
                    placement="bottom"
                    title="输入链接参数"
                    width="200"
                    trigger="click"
                  >
                    <el-form
                      @submit.native.prevent
                      :model="customDL.addCustomDLRuleForm"
                      :rules="customDL.addCustomDLRules"
                      ref="addcustomDLRuleForm"
                    >
                      <el-form-item label="选择客户端" prop="client">
                        <el-select v-model="customDL.addCustomDLRuleForm.client" placeholder="请选择">
                          <el-option
                            v-for="item in downloadOption.clientTabs"
                            :key="'dl'+item.label"
                            :label="item.label"
                            :value="item.name"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="选择平台" prop="type">
                        <el-select v-model="customDL.addCustomDLRuleForm.type" placeholder="请选择">
                          <el-option
                            v-for="item in downloadOption.clientType"
                            :key="'dlt'+item.label"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="客户端名称" prop="name">
                        <el-input v-model="customDL.addCustomDLRuleForm.name" placeholder="输入名称"></el-input>
                      </el-form-item>
                      <el-form-item label="链接地址" prop="link">
                        <el-input v-model="customDL.addCustomDLRuleForm.link" placeholder="输入链接"></el-input>
                      </el-form-item>
                    </el-form>
                    <div class="button-config">
                      <el-button type="primary" size="mini" @click="handleAddCustomDL">确定</el-button>
                    </div>
                    <el-button
                      slot="reference"
                      style="float: right; padding: 3px 0"
                      type="text"
                    >新增链接</el-button>
                  </el-popover>
                </template>

                <el-select v-model="customDL.client" placeholder="选择客户端">
                  <el-option
                    v-for="item in downloadOption.clientTabs"
                    :key="'dl'+item.label"
                    :label="item.label"
                    :value="item.name"
                  ></el-option>
                </el-select>
                <el-select class="dltype" v-model="customDL.type" placeholder="选择平台">
                  <el-option
                    v-for="item in downloadOption.clientType"
                    :key="'dlt'+item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-row :gutter="20" class="common-margin-top">
                  <el-col
                    class="tutorial"
                    v-for="(item,index) in customDownloads[customDL.client][customDL.type]"
                    :key="'dllink'+'index'+item.link"
                    :xs="24"
                    :sm="12"
                    :lg="8"
                  >
                    <el-card shadow="hover">
                      <el-row>
                        <el-col :xs="24">
                          <div>
                            <el-tag size="small">名称</el-tag>
                            {{item.name}}
                          </div>
                          <div class="dllink">
                            <el-tag size="small" type="warning">链接</el-tag>
                            {{item.link}}
                          </div>
                        </el-col>
                        <el-col :xs="24">
                          <div class="button-config tutorial-action">
                            <el-popconfirm @onConfirm="deleteCustomDL(index)" title="确定删除链接吗？">
                              <el-button
                                :disabled="isActionDisabled"
                                class="tutorial-action-delete"
                                slot="reference"
                                size="mini"
                              >删除</el-button>
                            </el-popconfirm>
                            <el-button
                              :disabled="isActionDisabled"
                              type="primary"
                              size="mini"
                              @click="handleEditCustomDL(item,index)"
                            >编辑</el-button>
                          </div>
                        </el-col>
                      </el-row>
                    </el-card>
                  </el-col>
                  <el-dialog
                    title="编辑链接"
                    :visible.sync="customDL.dialogVisible"
                    :width="customDL.dialogWidth"
                  >
                    <el-form
                      @submit.native.prevent
                      :model="customDL.currentDLForm"
                      :rules="customDL.currentDLFormRules"
                      append-to-body
                      ref="currentDLForm"
                    >
                      <el-form-item label="客户端名称" prop="name">
                        <el-input v-model="customDL.currentDLForm.name" placeholder="输入名称"></el-input>
                      </el-form-item>
                      <el-form-item label="链接地址" prop="link">
                        <el-input v-model="customDL.currentDLForm.link" placeholder="输入链接"></el-input>
                      </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="customDL.dialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click="editCustomDL">确 定</el-button>
                    </span>
                  </el-dialog>
                </el-row>
              </el-card>
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
import Navmenu from "../../components/Navmenu-config.vue";
import Headertools from "../../components/Header.vue";
import EditTutorial from "../../components/config/EditTutorial.vue";
import PublicFunction from "../../mixins/publicfunction";
import downloadOption from "../../datamodel/downloadOption";
import Basejs from "../../mixins/base";
import Axios from "axios";

export default {
  name: "Config",
  mixins: [Basejs, PublicFunction],
  components: {
    navmenu: Navmenu,
    headertools: Headertools,
    "edit-tutorial": EditTutorial
  },
  computed: {
    tutorials() {
      let result = this.globalConfig.next_config.tutorials.value;
      return result === "" ? [] : JSON.parse(result);
    },
    customDownloads() {
      let value = this.globalConfig.next_config.custom_downloads.value;
      let obj = JSON.parse(value);
      let defaultObj = {
        first: { option1: [] }
      };
      return value === "{}" ? defaultObj : obj;
    }
  },
  data() {
    return {
      pagename: "主题设置",
      defaultOpenedsSubMenu: ["4"],
      defaultActiveMenuItem: "4-3",
      type: "normal",
      addTutorialVisiable: false,
      addTutorialRuleForm: {
        title: ""
      },
      addTutorialRules: {
        title: [
          { required: true, message: "请输入教程标题", trigger: "blur" },
          { validator: this.validateTutorialTitle, trigger: "blur" },
          { max: 20, message: "不超过20个字符", trigger: "blur" }
        ]
      },
      isActionDisabled: false,
      currentEditTutorial: {
        index: 0,
        data: {}
      },
      downloadOption,
      customDL: {
        addCustomDLVisiable: false,
        dialogVisible: false,
        dialogWidth: "40%",
        client: "first",
        type: "option1",
        currentIndex: 0,
        currentDLForm: {
          name: "",
          link: ""
        },
        currentDLFormRules: {
          name: [
            { required: true, message: "请输入客户端名称", trigger: "blur" }
          ],
          link: [{ required: true, message: "请输入下载链接", trigger: "blur" }]
        },
        addCustomDLRuleForm: {
          client: "",
          type: "",
          name: "",
          link: ""
        },
        addCustomDLRules: {
          client: [
            { required: true, message: "请选择客户端类型", trigger: "blur" }
          ],
          type: [{ required: true, message: "请选择平台", trigger: "blur" }],
          name: [
            { required: true, message: "请输入客户端名称", trigger: "blur" }
          ],
          link: [{ required: true, message: "请输入下载链接", trigger: "blur" }]
        }
      }
    };
  },
  created() {
    this.initSite(() => {
      return;
    }, true);
  },
  methods: {
    goBack() {
      this.type = "normal";
    },
    //教程
    handleAddTutorial() {
      this.$refs["addTutorialRuleForm"].validate(valid => {
        if (valid) {
          this.addTutorialVisiable = false;
          let value = this.globalConfig.next_config.tutorials.value;
          let arr = value === "" ? [] : JSON.parse(value);
          arr.push({
            title: this.addTutorialRuleForm.title,
            id: this.addTutorialRuleForm.title + new Date(),
            children: []
          });
          this.$refs["addTutorialRuleForm"].resetFields();
          this.editTheme(
            "tutorials",
            JSON.stringify(arr),
            {
              success: "成功添加教程！"
            },
            () => {
              this.globalConfig.next_config.tutorials.value = JSON.stringify(
                arr
              );
            }
          );
          console.log(this.tutorials);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    validateTutorialTitle(rule, value, callback) {
      if (this.tutorials.length !== 0) {
        this.tutorials.forEach(item => {
          if (value === item.title) {
            callback(new Error("教程标题重复"));
          }
        });
      }
      callback();
    },
    editTutorial(item, index) {
      this.type = "editTutorial";
      this.currentEditTutorial.data = item;
      this.currentEditTutorial.index = index;
      console.log(this.currentEditTutorial);
    },
    deleteTutorial(index) {
      this.isActionDisabled = true;
      let value = this.globalConfig.next_config.tutorials.value;
      let arr = JSON.parse(value);
      arr.splice(index, 1);
      this.editTheme(
        "tutorials",
        JSON.stringify(arr),
        {
          success: "删除成功"
        },
        () => {
          this.globalConfig.next_config.tutorials.value = JSON.stringify(arr);
          this.isActionDisabled = false;
        },
        () => {
          this.isActionDisabled = false;
        }
      );
    },
    //自定义链接
    handleAddCustomDL() {
      this.$refs["addcustomDLRuleForm"].validate(valid => {
        if (valid) {
          this.customDL.addCustomDLVisiable = false;
          let value = this.globalConfig.next_config.custom_downloads.value;
          let arr = value === "" ? [] : JSON.parse(value);
          arr[this.customDL.addCustomDLRuleForm.client][
            this.customDL.addCustomDLRuleForm.type
          ].push({
            name: this.customDL.addCustomDLRuleForm.name,
            link: this.customDL.addCustomDLRuleForm.link
          });
          this.$refs["addcustomDLRuleForm"].resetFields();
          this.editTheme(
            "custom_downloads",
            JSON.stringify(arr),
            {
              success: "成功添加下载链接！"
            },
            () => {
              this.globalConfig.next_config.custom_downloads.value = JSON.stringify(
                arr
              );
            }
          );
          console.log(this.customDownloads);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteCustomDL(index) {
      this.isActionDisabled = true;
      let value = this.globalConfig.next_config.custom_downloads.value;
      let arr = JSON.parse(value);
      arr[this.customDL.client][this.customDL.type].splice(index, 1);
      this.editTheme(
        "custom_downloads",
        JSON.stringify(arr),
        {
          success: "删除成功"
        },
        () => {
          this.globalConfig.next_config.custom_downloads.value = JSON.stringify(
            arr
          );
          this.isActionDisabled = false;
        },
        () => {
          this.isActionDisabled = false;
        }
      );
    },
    handleEditCustomDL(item, index) {
      if (window.innerWidth <= 768 && window.innerWidth > 400) {
        this.customDL.dialogWidth = "70%";
      } else if (window.innerWidth <= 400) {
        this.customDL.dialogWidth = "90%";
      } else {
        this.customDL.dialogWidth = "40%";
      }
      this.customDL.dialogVisible = true;
      this.customDL.currentDLForm.name = item.name;
      this.customDL.currentDLForm.link = item.link;
      this.customDL.currentIndex = index;
    },
    editCustomDL() {
      console.log(this.$refs);
      this.$refs["currentDLForm"].validate(valid => {
        if (valid) {
          this.customDL.dialogVisible = false;
          let value = this.globalConfig.next_config.custom_downloads.value;
          let arr = value === "" ? [] : JSON.parse(value);
          let targetItem =
            arr[this.customDL.client][this.customDL.type][
              this.customDL.currentIndex
            ];
          targetItem.name = this.customDL.currentDLForm.name;
          targetItem.link = this.customDL.currentDLForm.link;
          this.$refs["currentDLForm"].resetFields();
          this.editTheme(
            "custom_downloads",
            JSON.stringify(arr),
            {
              success: "成功修改下载链接！"
            },
            () => {
              this.globalConfig.next_config.custom_downloads.value = JSON.stringify(
                arr
              );
            }
          );
          console.log(this.customDownloads);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.button-config
  text-align: right
.tutorial
  margin-top: 20px
.tutorial:nth-child(1)
  margin-top: 0
@media (min-width: 768px)
  .tutorial:nth-child(2)
    margin-top: 0
@media (min-width: 1200px)
  .tutorial:nth-child(3)
    margin-top: 0
.tutorial-action
  margin-top: 0.7rem
.tutorial-action-delete
  margin-right: 10px
.dltype
  margin-left: 1rem
  @media (max-width: 768px)
    margin-left: 0
    margin-top: 1rem
.dllink
  margin-top: 0.5rem
  font-size: 13px
  color: #606266
</style>

