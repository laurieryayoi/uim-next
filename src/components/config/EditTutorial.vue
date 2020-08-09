<template>
  <div>
    <el-card v-if="type === 'index'" shadow="never">
      <el-form
        @submit.native.prevent
        :model="TutorialRuleForm"
        :rules="TutorialRules"
        ref="TutorialRuleForm"
      >
        <el-form-item label="教程标题" prop="title">
          <el-input v-model="TutorialRuleForm.title" placeholder="请输入教程标题"></el-input>
        </el-form-item>
      </el-form>

      <el-row :gutter="20">
        <el-col
          class="tutorial-cards"
          v-for="(item,index) in cards"
          :key="item.date"
          :xs="24"
          :sm="12"
          :lg="8"
        >
          <el-card shadow="hover">
            <template #header>
              <span>卡片{{index+1}}</span>
            </template>
            {{item.date}}
            <div class="confirm common-margin-top">
              <el-popconfirm @onConfirm="deleteCard(index)" title="确定删除卡片吗？">
                <el-button class="card-action-delete" slot="reference" size="mini">删除</el-button>
              </el-popconfirm>
              <el-button type="primary" size="mini" @click="handleEdit(item,index)">编辑</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <div class="confirm common-margin-top">
        <el-button @click="addCard">
          <i class="el-icon-circle-plus-outline"></i> 添加卡片
        </el-button>
        <el-button @click="saveTutorial" type="primary">保存教程</el-button>
      </div>
    </el-card>
    <el-card shadow="never" v-if="type === 'edit'">
      <template #header>
        <el-page-header class="header-inline" @back="goBack" content="卡片编辑"></el-page-header>
      </template>
      <div class="mavon">
        <mavon-editor
          v-model="currentCard.content"
          @imgAdd="handleImgAdd"
          @change="handleEditChange"
        />
      </div>
      <div class="common-margin-top">
        <el-button type="primary" @click="saveEdit" class="edit-confirm">保存卡片内容</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import PublicFunction from "../../mixins/publicfunction";

export default {
  props: ["tutorial", "tutorials", "globalConfig"],
  mixins: [PublicFunction],
  watch: {
    "tutorial.title": {
      handler(val) {
        this.TutorialRuleForm.title = val;
      },
      deep: true
    }
  },
  computed: {
    cards() {
      return JSON.parse(this.globalConfig.next_config.tutorials.value)[
        this.tutorial.index
      ].children;
    }
  },
  mounted() {
    this.TutorialRuleForm.title = this.tutorial.data.title;
    console.log(this.cards);
  },
  data() {
    return {
      type: "index",
      TutorialRuleForm: {
        title: ""
      },
      TutorialRules: {
        title: [
          { required: true, message: "请输入教程标题", trigger: "blur" },
          { validator: this.validateTutorialTitle, trigger: "blur" },
          { max: 20, message: "不超过20个字符", trigger: "blur" }
        ]
      },
      currentCard: {
        index: 0,
        content: "",
        html: ""
      }
    };
  },
  methods: {
    goBack() {
      this.type = "index";
    },
    getArr() {
      let value = this.globalConfig.next_config.tutorials.value;
      let arr = value === "" ? [] : JSON.parse(value);
      return arr;
    },
    validateTutorialTitle(rule, value, callback) {
      if (this.tutorials.length !== 0) {
        this.tutorials.forEach((item, index) => {
          if (value === item.title && index !== this.tutorial.index) {
            callback(new Error("教程标题重复"));
          }
        });
      }
      callback();
    },
    addCard() {
      let tdate = new Date();
      let arr = this.getArr();
      let obj = {
        date: tdate.toUTCString(),
        content: "",
        html: ""
      };
      arr[this.tutorial.index].children.push(obj);
      this.editTheme(
        "tutorials",
        JSON.stringify(arr),
        {
          success: "成功添加卡片！"
        },
        () => {
          this.globalConfig.next_config.tutorials.value = JSON.stringify(arr);
        }
      );
    },
    deleteCard(index) {
      let arr = this.getArr();
      arr[this.tutorial.index].children.splice(index, 1);
      this.editTheme(
        "tutorials",
        JSON.stringify(arr),
        {
          success: "成功删卡片！"
        },
        () => {
          this.globalConfig.next_config.tutorials.value = JSON.stringify(arr);
        }
      );
    },
    handleEdit(item, index) {
      this.type = "edit";
      this.currentCard.content = item.content;
      this.currentCard.index = index;
    },
    handleImgAdd() {
      this.$message.warning("无法上传本地图片，请使用图片链接");
    },
    handleEditChange(value, render) {
      this.currentCard.html = render;
      console.log(this.currentCard);
    },
    saveEdit() {
      let arr = this.getArr();
      arr[this.tutorial.index].children[
        this.currentCard.index
      ].content = this.currentCard.content;
      arr[this.tutorial.index].children[
        this.currentCard.index
      ].html = this.currentCard.html;
      this.editTheme(
        "tutorials",
        JSON.stringify(arr),
        {
          success: "保存成功"
        },
        () => {
          this.globalConfig.next_config.tutorials.value = JSON.stringify(arr);
          this.type = "index";
        }
      );
    },
    saveTutorial() {
      this.$refs["TutorialRuleForm"].validate(valid => {
        if (valid) {
          let arr = this.getArr();
          arr[this.tutorial.index].title = this.TutorialRuleForm.title;
          this.editTheme(
            "tutorials",
            JSON.stringify(arr),
            {
              success: "保存成功"
            },
            () => {
              this.globalConfig.next_config.tutorials.value = JSON.stringify(
                arr
              );
              this.type = "index";
            }
          );
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
.tutorial-cards
  margin-top: 20px
.tutorial-cards:nth-child(1)
  margin-top: 0
@media (min-width: 768px)
  .tutorial-cards:nth-child(2)
    margin-top: 0
@media (min-width: 1200px)
  .tutorial-cards:nth-child(3)
    margin-top: 0
.confirm
  text-align: right
.card-action-delete
  margin-right: 10px
.edit-confirm
  width: 100%
  letter-spacing: 4px
</style>