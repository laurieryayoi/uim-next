<template>
  <div>
    <el-alert title="中转规则一般由中国中转至其他国外节点" type="warning" show-icon :closable="false"></el-alert>
    <el-alert title="请设置端口号为您自己的端口" type="warning" show-icon :closable="false"></el-alert>
    <el-alert
      title="优先级越大，代表其在多个符合条件的规则并存时会被优先采用，当优先级一致时，先添加的规则会被采用。"
      type="warning"
      show-icon
      :closable="false"
    ></el-alert>
    <el-alert title="节点不设置中转时，这个节点就可以当作一个普通的节点来做代理使用。" type="warning" show-icon :closable="false"></el-alert>
    <el-card v-if="pagetype === 'list'" shadow="hover" class="common-margin-top">
      <template #header>
        <span>规则/链路表</span>
        <el-button
          class="create-rule"
          style="float: right;"
          size="mini"
          @click="handleCreate"
          type="primary"
        >添加中转规则</el-button>
      </template>
      <el-alert
        v-if="!indexData.is_relay_able"
        :closable="false"
        title="您目前的协议不支持中转，请修改协议后再进行设置"
        type="error"
        show-icon
      ></el-alert>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="规则表" name="rule">
          <el-table :data="indexData.rules.data" ref="ruletable" stripe style="width: 100%">
            <el-table-column prop="name" show-overflow-tooltip label="中转起点"></el-table-column>
            <el-table-column prop="dist_name" show-overflow-tooltip label="中转终点"></el-table-column>
            <el-table-column prop="port" label="端口"></el-table-column>
            <el-table-column prop="priority" label="优先级"></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  :disabled="scope.row.user_id===0"
                  @click="handleRuleEdit(scope.row)"
                  type="text"
                  size="small"
                >编辑</el-button>
                <el-button
                  :disabled="scope.row.user_id===0"
                  @click="handleDeleteRule(scope.row)"
                  type="text"
                  size="small"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="common-margin-top"
            layout="prev, pager, next"
            :page-size="pagenation.rule.pageSize"
            @current-change="rulePageChange"
            :total="pagenation.rule.total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="链路表" name="route">
          <el-table :data="indexData.pathset" stripe style="width: 100%">
            <el-table-column prop="port" label="端口"></el-table-column>
            <el-table-column prop="begin_node.name" show-overflow-tooltip label="中转起点"></el-table-column>
            <el-table-column prop="end_node.name" show-overflow-tooltip label="中转终点"></el-table-column>
            <el-table-column label="途径节点">
              <template slot-scope="scope">
                <div v-html="scope.row.path"></div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card v-if="pagetype === 'create'" shadow="hover" class="common-margin-top">
      <template #header>
        <el-page-header class="header-inline" @back="goBack" content="新建中转规则"></el-page-header>
      </template>
      <el-steps :active="realyGuideStep" align-center>
        <el-step title="选择中转起点"></el-step>
        <el-step title="选择中转终点"></el-step>
        <el-step title="设置中转端口"></el-step>
        <el-step title="设置优先级"></el-step>
      </el-steps>
      <div v-if="realyGuideStep === 0" class="relay-guide">
        <h3>
          假设您的主机为&nbsp;
          <span class="text-alert">A</span>，需要用&nbsp;
          <span class="text-alert">B</span> 节点中转&nbsp;
          <span class="text-alert">C</span> 节点的流量，最终达到从
          <span class="text-alert">A</span> 出发 -> 经过
          <span class="text-alert">B</span> -> 到达
          <span class="text-alert">C</span> 的效果
        </h3>
        <h3>
          <span class="text-alert">中转起点</span> 就是其中的
          <span class="text-alert">B</span>
        </h3>
        <h3>
          下面就来设置
          <span class="text-alert">中转起点</span> 吧
        </h3>
        <el-cascader
          placeholder="请选择中转起点"
          v-model="currentRelaySettings.sourceNode"
          :options="relaySourceSortByLevel"
          :props="{ expandTrigger: 'hover' }"
          @change="handleRelaySettingsChange"
        ></el-cascader>
        <h3>选择完成后，将进入下一步</h3>
      </div>
      <div v-if="realyGuideStep === 1" class="relay-guide">
        <h3>
          现在，你将要设置的是上一步中提到的
          <span class="text-alert">A - B - C</span> 三个节点中的
          <span class="text-alert">C</span>
          节点
        </h3>
        <h3>
          在访问网站等服务时，服务器查询到的IP也将是此
          <span class="text-alert">C</span> 节点的IP
        </h3>
        <h3>
          所以我们叫它
          <span class="text-alert">中转终点</span>
        </h3>
        <h3>
          下面就来设置
          <span class="text-alert">中转终点</span> 吧
        </h3>
        <el-cascader
          placeholder="请选择中转终点"
          v-model="currentRelaySettings.distNode"
          :options="relayDistSortByLevel"
          :props="{ expandTrigger: 'hover' }"
          @change="handleRelaySettingsChange"
        ></el-cascader>
        <h3>选择完成后，将进入下一步</h3>
      </div>
      <div v-if="realyGuideStep === 2" class="relay-guide">
        <h3>
          现在，你将要设置的是
          <span class="text-alert">中转起点</span> 和
          <span class="text-alert">中转终点</span> 的端口
        </h3>
        <h3>
          通常来说它是你的普通端口配置的端口
          <span class="text-alert">{{userInfo.user.port}}</span>
        </h3>
        <h3>
          下面就来设置
          <span class="text-alert">中转端口</span> 吧
        </h3>
        <el-select
          @change="handleRelaySettingsChange"
          v-model="currentRelaySettings.port"
          placeholder="请设置中转端口"
        >
          <el-option v-for="item in relayData.ports" :key="'port'+item" :label="item" :value="item"></el-option>
        </el-select>
        <h3>选择完成后，将进入下一步</h3>
      </div>
      <div v-if="realyGuideStep >= 3" class="relay-guide">
        <h3>
          现在，你将要设置的是
          <span class="text-alert">中转优先级</span>
        </h3>
        <h3>当同一节点设置多个中转规则时，优先级高的生效</h3>
        <h3>
          下面就来设置
          <span class="text-alert">中转优先级</span> 吧
        </h3>
        <el-input-number
          v-model="currentRelaySettings.priority"
          @change="handleRelaySettingsChange"
          :min="0"
          label="描述文字"
        ></el-input-number>
        <h3>选择完成后，请按确认提交按钮完成设置</h3>
      </div>
      <div class="relay-button">
        <el-button :disabled="realyGuideStep===0" @click="handlePrevStep">上一步</el-button>
        <el-button
          :disabled="isRelayComfirmDisabled"
          @click="handleRelayComfirm"
          type="primary"
        >确认提交</el-button>
      </div>
    </el-card>
    <el-card v-if="pagetype === 'edit'" shadow="hover" class="common-margin-top">
      <template #header>
        <el-page-header class="header-inline" @back="goBack" content="修改中转规则"></el-page-header>
      </template>
      <el-form
        :model="currentRelaySettings"
        :rules="relayFormRules"
        ref="ruleForm"
        label-position="left"
        inline
        class="common-table-expand"
      >
        <el-row :gutter="20">
          <el-col class="relay-selectors" :xs="24" :sm="12" :lg="6">
            <el-form-item class="common-margin-top" required prop="sourceNode" label="中转起点">
              <el-cascader
                v-model="currentRelaySettings.sourceNode"
                placeholder="请选择中转起点"
                :options="relaySourceSortByLevel"
                :props="{ expandTrigger: 'hover' }"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col class="relay-selectors" :xs="24" :sm="12" :lg="6">
            <el-form-item class="common-margin-top" required prop="distNode" label="中转终点">
              <el-cascader
                placeholder="请选择中转终点"
                v-model="currentRelaySettings.distNode"
                :options="relayDistSortByLevel"
                :props="{ expandTrigger: 'hover' }"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col class="relay-selectors" :xs="24" :sm="12" :lg="6">
            <el-form-item class="common-margin-top" required prop="port" label="中转端口">
              <el-select v-model="currentRelaySettings.port" placeholder="请设置中转端口">
                <el-option
                  v-for="item in relayData.ports"
                  :key="'port'+item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="relay-selectors" :xs="24" :sm="12" :lg="6">
            <el-form-item class="common-margin-top" required prop="priority" label="中转优先级">
              <el-input-number v-model="currentRelaySettings.priority" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="relay-button common-margin-top">
              <el-button
                :disabled="isRelayFormComfirmDisabled"
                @click="handleRelayFormComfirm"
                type="primary"
              >确认提交</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Axios from "axios";

export default {
  components: {},
  props: ["globalConfig", "userInfo", "activeTab"],
  computed: {
    relaySourceSortByLevel() {
      return this.SortByLevel(this.relayData.source_nodes);
    },
    relayDistSortByLevel() {
      return this.SortByLevel(this.relayData.dist_nodes);
    }
  },
  data() {
    return {
      activeName: "rule",
      pagetype: "list",
      indexData: {
        is_relay_able: false,
        relay_able_protocol_list: [],
        rules: "",
        pathset: []
      },
      pagenation: {
        rule: {
          currentPage: 1,
          total: 1,
          pageSize: 15
        }
      },
      relayData: {
        source_nodes: [],
        dist_nodes: [],
        ports: []
      },
      realyGuideStep: 0,
      currentRelaySettings: {
        sourceNode: "",
        distNode: "",
        port: "",
        priority: 0
      },
      editId: "",
      isRelayComfirmDisabled: true,
      isRelayFormComfirmDisabled: false,
      relayFormRules: {
        sourceNode: [
          { required: true, message: "请选择中转起点", trigger: "blur" }
        ],
        distNode: [
          { required: true, message: "请选择中转终点", trigger: "blur" }
        ],
        port: [{ required: true, message: "请设置中转端口", trigger: "blur" }],
        priority: [
          { required: true, message: "请设置中转优先级", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    realyGuideStep(val) {
      console.log(val);
      switch (val) {
        case 0:
          this.currentRelaySettings.sourceNode = "";
          this.isRelayComfirmDisabled = true;
          break;
        case 1:
          this.currentRelaySettings.distNode = "";
          this.isRelayComfirmDisabled = true;
          break;
        case 2:
          this.currentRelaySettings.port = "";
          this.isRelayComfirmDisabled = true;
          break;
        case 3:
          this.currentRelaySettings.priority = "";
          this.isRelayComfirmDisabled = false;
          break;
      }
    },
    activeTab(val) {
      this.$refs["ruletable"].doLayout();
    }
  },
  mounted() {
    this.getRelayData(1);
  },
  methods: {
    getRelayData(page) {
      Axios.get(`/user/relay?page=${page}&json=1`, {
        withCredentials: true
      }).then(r => {
        console.log(r);
        this.indexData = r.data;
        let arr = [];
        for (let key in r.data.pathset) {
          arr.push(r.data.pathset[key]);
        }
        this.indexData.pathset = arr;
        this.pagenation.rule.currentPage = r.data.rules.current_page;
        this.pagenation.rule.total = r.data.rules.total;
      });
    },
    goBack() {
      this.pagetype = "list";
      this.currentRelaySettings = {
        sourceNode: "",
        distNode: "",
        port: "",
        priority: 0
      };
    },
    rulePageChange(currentPage) {
      this.getRelayData(currentPage);
    },
    handleRuleEdit(row) {
      console.log(row);
      this.editId = row.id;
      this.currentRelaySettings.priority = row.priority;
      this.currentRelaySettings.port = row.port;
      this.currentRelaySettings.sourceNode = [
        `LEVEL${row.source_class}`,
        row.source_node_id
      ];
      this.currentRelaySettings.distNode = [
        `LEVEL${row.dist_class}`,
        row.dist_node_id
      ];
      console.log(this.currentRelaySettings);
      this.pagetype = "edit";
      Axios.get(`/user/relay/${row.id}/edit?json=1`, {
        withCredentials: true
      }).then(r => {
        console.log(r);
        this.relayData = r.data;
      });
    },
    handleDeleteRule(row) {
      this.$confirm("确认删除这条规则吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteRule(row.id);
        })
        .catch(() => {
          return;
        });
    },
    deleteRule(id) {
      let body = { id };
      Axios({
        method: "delete",
        url: "/user/relay",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret === 1) {
          this.$message.success(r.data.msg);
          this.getRelayData(this.pagenation.rule.currentPage);
        } else {
          this.$message.error(r.data.msg);
        }
      });
    },
    SortByLevel(nodelist) {
      let arr = nodelist;
      let resultOBJ = {};
      for (let i = 0; i <= arr.length - 1; i++) {
        if (!(`LEVEL${arr[i].node_class}` in resultOBJ)) {
          resultOBJ[`LEVEL${arr[i].node_class}`] = [];
        }
        resultOBJ[`LEVEL${arr[i].node_class}`].push({
          value: arr[i].id,
          label: arr[i].name
        });
      }
      let result = [];
      for (let key in resultOBJ) {
        result.push({
          value: key,
          label: key,
          children: resultOBJ[key]
        });
      }
      return result;
    },
    handleCreate() {
      this.pagetype = "create";
      Axios.get("/user/relay/create?json=1", { withCredentials: true }).then(
        r => {
          console.log(r);
          this.relayData = r.data;
        }
      );
    },
    handlePrevStep() {
      if (this.realyGuideStep === 4) {
        this.realyGuideStep -= 2;
      } else {
        this.realyGuideStep -= 1;
      }
    },
    handleRelaySettingsChange(val) {
      if (this.realyGuideStep <= 3) {
        this.realyGuideStep += 1;
      }
      console.log(this.currentRelaySettings);
    },
    handleRelayComfirm() {
      this.isRelayComfirmDisabled = true;
      let body = {
        source_node: this.currentRelaySettings.sourceNode[1],
        dist_node: this.currentRelaySettings.distNode[1],
        port: this.currentRelaySettings.port,
        priority: this.currentRelaySettings.priority
      };
      Axios({
        method: "post",
        url: "/user/relay",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        if (r.data.ret === 1) {
          this.$message.success(r.data.msg);
          this.getRelayData(this.pagenation.rule.currentPage);
          this.isRelayComfirmDisabled = false;

          this.goBack();
        } else {
          this.$message.error(r.data.msg);
          this.isRelayComfirmDisabled = false;
        }
      });
    },
    handleRelayFormComfirm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.isRelayFormComfirmDisabled = true;
          console.log();
          let body = {
            source_node: this.currentRelaySettings.sourceNode[1],
            dist_node: this.currentRelaySettings.distNode[1],
            port: this.currentRelaySettings.port,
            priority: this.currentRelaySettings.priority
          };
          Axios({
            method: "put",
            url: `/user/relay/${this.editId}`,
            data: JSON.stringify(body),
            withCredentials: true,
            headers: { "content-type": "application/json" }
          }).then(r => {
            console.log(r);
            if (r.data.ret === 1) {
              this.$message.success(r.data.msg);
              this.isRelayFormComfirmDisabled = false;
              this.getRelayData(this.pagenation.rule.currentPage);
              this.$refs["ruleForm"].clearValidate();
              this.goBack();
            } else {
              this.$message.error(r.data.msg);
              this.isRelayFormComfirmDisabled = false;
            }
          });
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
.create-rule
  position: relative
  bottom: 5px
.relay-guide
  text-align: center
.relay-button
  text-align: right
.relay-selectors input
  width: 100%
</style>