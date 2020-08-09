<template>
  <el-row class="staff">
    <el-col class="center" :span="24">
      <h1 class="title">STAFF</h1>
      <el-divider></el-divider>
    </el-col>
    <el-col class="center" :span="24">
      <h2>MIT许可证（MIT）</h2>
    </el-col>
    <el-col class="center" :span="24">
      <h2>©2015 orvice</h2>
      <h2>©{{globalConfig.dateY}} SSPanel UIM Dev Team</h2>

      <el-divider></el-divider>
    </el-col>
    <el-col :span="24">
      <h2>
        特此免费授予任何获得副本的人这个软件和相关的文档文件（“软件”）来处理在软件中没有限制，
        包括但不限于权利使用，复制，修改，合并，发布，分发，再许可和/或销售该软件的副本， 并允许软件所属的人员提供这样做，但须符合以下条件：
      </h2>
    </el-col>
    <el-col class="center" :span="24">
      <h2 class="text-alert">上述版权声明和本许可声明必须包含在内本软件的副本或实质性部分。</h2>
    </el-col>
    <el-col :span="24">
      <h2>
        本软件按“原样”提供，不附有任何形式的明示或暗示保证默示的，包括但不限于对适销性的保证， 适用于特定目的和不侵权。在任何情况下，
        作者或版权持有者对任何索赔，
        损坏或其他责任均不负任何责任责任，无论是在合同，民事侵权行为或其他方面， 与本软件或本软件的使用或其他交易有关或与之有关软件。
      </h2>
      <el-divider></el-divider>
    </el-col>
    <el-col class="center" :span="24">
      <h1 class="title title-sub">免责声明</h1>
      <el-divider></el-divider>
    </el-col>
    <el-col class="center" :span="24">
      <h2>您当前所访问的站点使用的是下面所提到的开源程序。您能看到这个页面仅代表这个站点使用了本程序，其使用过程中发生的一切问题需要其自行解决，本程序不承担任何责任。</h2>
    </el-col>
    <el-col :span="24">
      <el-row type="flex" justify="center">
        <el-form class="staff-table-expand">
          <el-form-item v-for="item in staffList" :key="item.name" :label="item.name">
            <span v-if="item.text">{{item.text}}&nbsp;</span>
            <el-button
              @click="openlink(button.link)"
              v-for="button in item.children"
              :key="button.name"
              type="text"
            >{{button.name}}</el-button>
            <span v-if="item.list">
              &nbsp;此列表为参与到
              <span class="text-alert">SSPanel V3 Mod UIM</span> 中的人员，在此表示感谢。
            </span>
          </el-form-item>
        </el-form>
      </el-row>
    </el-col>
    <el-col class="center" :span="24">
      <el-divider></el-divider>
      <el-button @click="close" class="staff-close">关闭 STAFF</el-button>
    </el-col>
    <el-col class="center" :span="24">
      <h5 class="copyright">@2015-{{globalConfig.dateY}} {{globalConfig.appName}}</h5>
      <h5 class="theme-copyright">©2020 UIM-Next by Nymph</h5>
    </el-col>
  </el-row>
</template>

<script>
import PublicFunction from "../mixins/publicfunction";

export default {
  props: ["globalConfig", "userInfo"],
  mixins: [PublicFunction],
  data() {
    return {
      staffList: [
        {
          name: "原作",
          children: [
            {
              name: "orvice",
              link: "https://github.com/orvice/"
            }
          ]
        },
        {
          name: "现阶段维护",
          children: [
            {
              name: "Anankke",
              link: "https://github.com/Talocan"
            },
            {
              name: "galaxyq",
              link: "https://github.com/galaxychuck"
            },
            {
              name: "dumplin",
              link: "https://github.com/dumplin233"
            },
            {
              name: "Rin SAMA",
              link: "https://github.com/mxihan"
            },
            {
              name: "Miku",
              link: "https://github.com/xcxnig"
            },
            {
              name: "Tony Zou",
              link: "https://github.com/ZJY2003"
            },
            {
              name: "Nymph",
              link: "https://github.com/laurieryayoi"
            }
          ]
        },
        {
          name: "监督",
          children: [
            {
              name: "Anankke",
              link: "https://github.com/Talocan"
            }
          ]
        },
        {
          name: "作画",
          children: [
            {
              name: "Daemonite",
              link: "https://github.com/Daemonite/"
            },
            {
              name: "galaxyq",
              link: "https://github.com/galaxychuck"
            }
          ]
        },
        {
          name: "永远喜欢",
          text: "永远喜欢",
          children: [
            {
              name: "Anankke",
              link: "https://t.me/Anankke"
            }
          ]
        },
        {
          name: "出演",
          children: [
            {
              name: "mengyang",
              link: "http://mengyang.wang/"
            },
            {
              name: "tony",
              link: "http://tony.ecy.ren/"
            }
          ]
        },
        {
          name: "鸣谢",
          text:
            "所有被引用过代码的同学，以及所有提交过 PR 的同学。当然，还有在使用这份程序的你我Ta。",
          children: []
        },
        {
          name: "本程序的参与人员列表",
          list: true,
          children: [
            {
              name: "SSPanel V3 Mod UIM",
              link: "https://github.com/Anankke/SSPanel-Uim"
            }
          ]
        }
      ]
    };
  },
  methods: {
    openlink(link) {
      window.open(link);
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="stylus" scoped>
.staff
  padding: 0 20px
.center
  text-align: center
.title
  font-size: 40px
  letter-spacing: 1rem
  color: #409EFF
.title-sub
  font-size: 30px
h2
  @media (max-width: 500px)
    font-size: 16px
.staff-close
  letter-spacing: 2px
h5.copyright
  margin-top: 3rem
  font-weight: 300
.theme-copyright
  font-weight: 300
</style>