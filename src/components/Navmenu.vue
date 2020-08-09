<template>
  <el-row class="fullheight-nav">
    <el-col class="fullheight-nav" :span="24">
      <el-menu
        class="el-menu-vertical-demo fullheight-nav"
        :default-openeds="defaultOpenedsSubMenu"
        :default-active="defaultActiveMenuItem"
      >
        <el-popover placement="top-start" width="200" trigger="hover" content="这是一个防止bug的物件">
          <div :style="{height: 0}" slot="reference"></div>
        </el-popover>
        <el-tooltip effect="dark" :content="globalConfig.appName" placement="bottom">
          <el-menu-item index="0" @click="routeChange('/')">
            <h2 class="appname">{{globalConfig.appName}}</h2>
          </el-menu-item>
        </el-tooltip>

        <div v-for="item in menuData" :key="`submenu${item.index}`">
          <el-submenu v-if="'data' in item" :index="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <div v-for="link in item.data" :key="link.index">
              <el-menu-item
                v-if="link.show"
                :index="link.index"
                @click="routeChange(link.path)"
              >{{ link.content }}</el-menu-item>
            </div>
          </el-submenu>
          <el-menu-item
            v-if="'path' in item && item.show"
            :index="item.index"
            @click="routeChange(item.path)"
          >
            <i :class="item.icon"></i>
            {{item.content}}
          </el-menu-item>
        </div>

        <el-menu-item v-if="userInfo.user.is_admin" index="7" @click="routeChange('/admin')">
          <i class="el-icon-setting"></i>
          <span slot="title">管理面板</span>
        </el-menu-item>
        <el-menu-item
          v-if="userInfo.can_backtoadmin"
          index="8"
          @click="routeChange('/user/backtoadmin')"
        >
          <i class="el-icon-setting"></i>
          <span slot="title">返回管理员身份</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import PublicFunction from "../mixins/publicfunction";

export default {
  props: [
    "globalConfig",
    "userInfo",
    "defaultOpenedsSubMenu",
    "defaultActiveMenuItem"
  ],
  mixins: [PublicFunction],
  computed: {
    menuData() {
      return [
        {
          index: "1",
          title: "用户中心",
          icon: "el-icon-user",
          data: [
            {
              index: "1-1",
              content: "首页",
              path: "/user",
              show: true
            },
            {
              index: "1-2",
              content: "账户设置",
              path: "/user/profile",
              show: true
            },
            {
              index: "1-4",
              content: "我的钱包",
              path: "/user/code",
              show: true
            },
            {
              index: "1-5",
              content: "公告栏",
              path: "/user/announcement",
              show: true
            }
          ]
        },
        {
          index: "2",
          content: "商店",
          path: "/user/shop",
          icon: "el-icon-shopping-cart-1",
          show: true
        },
        {
          index: "3",
          title: "节点",
          icon: "el-icon-s-promotion",
          data: [
            {
              index: "3-1",
              content: "节点列表",
              path: "/user/node",
              show: true
            },
            {
              index: "3-2",
              content: "连接设置",
              path: "/user/edit",
              show: true
            }
          ]
        },
        {
          index: "4",
          content: "参与推广",
          path: "/user/invite",
          icon: "el-icon-present",
          show: true
        },
        {
          index: "5",
          title: "帮助",
          data: [
            {
              index: "5-1",
              content: "使用教程",
              path: this.tutorialPath,
              show: true
            },
            {
              index: "5-2",
              content: "工单系统",
              path: "/user/ticket",
              show: this.isTicketShow
            }
          ],
          icon: "el-icon-bangzhu"
        },
        {
          index: "6",
          title: "审计",
          icon: "el-icon-warning-outline",
          data: [
            {
              index: "6-1",
              content: "审计规则",
              path: "/user/detect",
              show: true
            },
            {
              index: "6-2",
              content: "审计记录",
              path: "/user/detect/log",
              show: true
            }
          ]
        }
      ];
    },
    isTicketShow() {
      return this.globalConfig.enable_ticket;
    },
    tutorialPath() {
      let result;
      if (this.globalConfig.next_config.custom_tutorial.value) {
        result = "/wiki";
      } else {
        result = "user/tutorial";
      }
      return result;
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="stylus" scoped>
.fullheight-nav
  height: 100%
.appname
  width: 100%
  text-align: center
  margin: 0
  overflow: hidden
  text-overflow: ellipsis
</style>
