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

        <el-menu-item v-if="userInfo.user.is_admin" index="7" @click="routeChange('/user')">
          <i class="el-icon-user-solid"></i>
          <span slot="title">用户中心</span>
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
          title: "系统",
          icon: "el-icon-cpu",
          data: [
            {
              index: "1-1",
              content: "系统概览",
              path: "/admin",
              show: true
            },
            {
              index: "1-2",
              content: "公告管理",
              path: "/admin/announcement",
              show: true
            },
            {
              index: "1-4",
              content: "工单管理",
              path: "/admin/ticket",
              show: this.isTicketShow
            },
            {
              index: "1-5",
              content: "下发命令",
              path: "/admin/auto",
              show: true
            }
          ]
        },
        {
          index: "2",
          title: "节点",
          icon: "el-icon-s-promotion",
          data: [
            {
              index: "2-1",
              content: "节点列表",
              path: "/admin/node",
              show: true
            },
            {
              index: "2-2",
              content: "流量记录",
              path: "/admin/trafficlog",
              show: true
            },
            {
              index: "2-3",
              content: "已封禁IP",
              path: "/admin/block",
              show: true
            },
            {
              index: "2-4",
              content: "已解封IP",
              path: "/admin/unblock",
              show: true
            }
          ]
        },
        {
          index: "3",
          title: "用户",
          icon: "el-icon-user",
          data: [
            {
              index: "3-1",
              content: "用户列表",
              path: "/admin/user",
              show: true
            },
            {
              index: "3-2",
              content: "中专规则",
              path: "/admin/relay",
              show: true
            },
            {
              index: "3-3",
              content: "邀请与返利",
              path: "/admin/invite",
              show: true
            },
            {
              index: "3-4",
              content: "订阅记录",
              path: "/admin/subscribe",
              show: true
            },
            {
              index: "3-5",
              content: "订阅记录",
              path: "/admin/login",
              show: true
            },
            {
              index: "3-6",
              content: "在线IP",
              path: "/admin/alive",
              show: true
            }
          ]
        },
        {
          index: "4",
          title: "配置",
          icon: "el-icon-s-tools",
          data: [
            {
              index: "4-1",
              content: "Telegram",
              path: "/admin/user",
              show: true
            },
            {
              index: "4-2",
              content: "用户注册",
              path: "/admin/relay",
              show: true
            },
            {
              index: "4-3",
              content: "Next主题",
              path: "/admin/nextconfig",
              show: true
            }
          ]
        },
        {
          index: "5",
          title: "审计",
          icon: "el-icon-s-check",
          data: [
            {
              index: "5-1",
              content: "审计规则",
              path: "/admin/detect",
              show: true
            },
            {
              index: "5-2",
              content: "审计记录",
              path: "/admin/detect/log",
              show: true
            },
            {
              index: "5-3",
              content: "审计封禁",
              path: "/admin/detect/ban",
              show: true
            }
          ]
        },
        {
          index: "6",
          title: "交易",
          icon: "el-icon-money",
          data: [
            {
              index: "6-1",
              content: "充值记录",
              path: "/admin/code",
              show: true
            },
            {
              index: "6-2",
              content: "商品",
              path: "/admin/shop",
              show: true
            },
            {
              index: "6-3",
              content: "优惠码",
              path: "/admin/couppon",
              show: true
            },
            {
              index: "6-4",
              content: "购买记录",
              path: "/admin/bought",
              show: true
            }
          ]
        }
      ];
    },
    isTicketShow() {
      return this.globalConfig.enable_ticket;
    },
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
