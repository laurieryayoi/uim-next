<template>
  <el-row class="tos">
    <el-col :span="24">
      <el-alert title="隐私安全" :closable="false" type="warning">
        <div>1. 请提供真实邮箱，邮箱为本站服务的唯一凭证，请自行保管。</div>
        <div>2. 本站会以SHA256加密存储用户密码，尽量保证数据安全，但并不保证这些信息的绝对安全。</div>
        <div>3. 本站所有服务器不会学习用户行为方式，只做必要的审计。</div>
      </el-alert>
      <el-alert class="common-margin-top" title="帐号所有权" :closable="false" type="warning">
        <div>1. 对于免费用户，我们有权在不通知的情况下删除账户。</div>
        <div>2. 任何违反使用条款的用户，我们将会删除违规账户并收回使用本站服务的权利。</div>
      </el-alert>
      <el-alert class="common-margin-top" title="帐号违规" :closable="false" type="warning">
        <div>1. 禁止使用本站服务进行任何违法恶意活动。</div>
        <div>2. 使用任何节点，需遵循节点所属国家的相关法律。</div>
        <div>3. 禁止滥用本站提供的服务，包括爬虫、BT下载上传、诈骗以及其他类似的滥用行为。</div>
        <div>4. 为了公平使用考虑，长时间占用服务资源，我们将视情况对帐号进行限制</div>
      </el-alert>
    </el-col>
  </el-row>
</template>

<script>
import PublicFunction from "../mixins/publicfunction";

export default {
  props: ["globalConfig", "userInfo"],
  mixins: [PublicFunction],
  data() {
    return {};
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
.tos
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
.tos-close
  letter-spacing: 2px
</style>