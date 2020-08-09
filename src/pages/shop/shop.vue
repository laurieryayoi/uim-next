<template>
  <div v-loading="globalLoading" id="app">
    <el-container class="container-body">
      <el-aside width="200px">
        <el-drawer
          title="我是标题"
          :visible.sync="navmenuDrawer"
          :with-header="false"
          append-to-body
          :size="navmenuDrawerWidth"
        >
          <navmenu
            :default-active-menu-item="defaultActiveMenuItem"
            :global-config="globalConfig"
            :user-info="userInfo"
          ></navmenu>
        </el-drawer>
        <navmenu
          :default-active-menu-item="defaultActiveMenuItem"
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
          <el-row>
            <el-col :span="24">
              <el-card>
                <el-alert type="warning" show-icon :closable="false">
                  <div slot="title">商品不可叠加，新购商品会覆盖旧商品的效果。</div>
                  <div>购买新套餐时，如果未关闭旧套餐自动续费，则旧套餐的自动续费依然生效。</div>
                </el-alert>
              </el-card>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12">
                  <el-card>
                    <template #header>
                      <span>账户余额</span>
                      <el-dropdown
                        trigger="click"
                        style="float: right; padding: 3px 0"
                        @command="handleChargeCommand"
                        plain
                      >
                        <span class="el-dropdown-link">
                          钱包充值
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="code">充值码</el-dropdown-item>
                          <el-dropdown-item command="payments">云支付</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                    <div class="card-avatar">
                      <div class="card-avatar-avatar">
                        <el-avatar :size="60">
                          <i class="el-icon-wallet"></i>
                        </el-avatar>
                      </div>
                      <div class="card-avatar-main">
                        <div class="card-avatar-title">我的钱包</div>
                        <div class="card-avatar-content">
                          <span>{{userInfo.user.money | creditFilter}}</span>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-card>
                    <template #header>
                      <span>会员状态</span>
                    </template>
                    <div class="card-avatar">
                      <div class="card-avatar-avatar">
                        <el-avatar :size="60">
                          <i class="el-icon-user"></i>
                        </el-avatar>
                      </div>
                      <div class="card-avatar-main">
                        <div class="card-avatar-title">会员有效期</div>
                        <div class="card-avatar-content">
                          <span>到期时间：{{userInfo.user.class_expire}}</span>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-col>
            <el-col class="common-margin-top" :span="24">
              <el-row>
                <el-col :span="24">
                  <el-tabs type="border-card" v-model="commodityType">
                    <el-tab-pane label="套餐购买" name="main">
                      <el-row :gutter="20">
                        <!-- <el-carousel :interval="4000" type="card" trigger="click" height="600px">
                          <el-carousel-item v-for="item in shopItems" :key="item.id">
                            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                              <div class="card-split-top">
                                <div class="shopitem-title">
                                  <div class="shopitem-title-banner">
                                    {{item.name}}
                                    <el-tooltip effect="dark" placement="top">
                                      <div slot="content">
                                        <div>此套餐包含自动重置系统</div>
                                        <div>
                                          购买后会立即获得
                                          <span
                                            class="shop-warning"
                                          >{{JSON.parse(item.content).bandwidth}}GB</span> 流量
                                        </div>
                                        <div>
                                          之后在
                                          <span
                                            class="shop-warning"
                                          >{{JSON.parse(item.content).reset_exp}}</span> 天内每隔
                                          <span
                                            class="shop-warning"
                                          >{{JSON.parse(item.content).reset}}</span> 天在当晚0点重置流量为
                                          <span
                                            class="shop-warning"
                                          >{{JSON.parse(item.content).reset_value}}GB</span>
                                        </div>
                                      </div>
                                      <i
                                        v-if="'reset_exp' in JSON.parse(item.content)"
                                        class="el-icon-warning-outline"
                                      ></i>
                                    </el-tooltip>
                                  </div>
                                </div>
                                <div class="shopitem-price">{{item.price | creditFilter}}</div>
                                <div
                                  class="shopitem-level"
                                  v-if="'class' in JSON.parse(item.content)"
                                >
                                  LEVEL.
                                  <span>{{JSON.parse(item.content).class}}</span>
                                </div>
                                <div class="shopitem-level" v-else>
                                  LEVEL.
                                  <span>CURRENT</span>
                                </div>
                                <div class="shopitem-detail">
                                  <div v-if="'bandwidth' in JSON.parse(item.content)">
                                    获得
                                    <span>{{JSON.parse(item.content).bandwidth}} GB</span> 传输流量
                                  </div>
                                  <div v-else>
                                    <span>不提供</span> 传输流量
                                  </div>
                                  <div v-if="'class_expire' in JSON.parse(item.content)">
                                    会员时长
                                    <span>{{ JSON.parse(item.content).class_expire }}</span> 天
                                  </div>
                                  <div v-else>
                                    <span>维持当前</span> LEVEL
                                  </div>
                                </div>
                                <div class="shopitem-group">
                                  <div class="shopitem-limit">
                                    <div>
                                      <i class="el-icon-mobile-phone"></i>
                                      <span>&nbsp;{{ JSON.parse(item.content).connector | connectorFilter }}</span>同时在线客户端
                                    </div>

                                    <div>
                                      <i class="el-icon-lightning"></i>
                                      <span>&nbsp;{{ JSON.parse(item.content).speedlimit | speedlimitFilter }}</span> 最高速率
                                    </div>
                                  </div>
                                </div>
                                <el-collapse
                                  v-model="activeCollapseNames"
                                  @change="handleCollapseChange"
                                >
                                  <el-collapse-item title="一致性 Consistency" name="1">
                                    <div class="shopitem-others">
                                      <div
                                        v-for="(item,index) in JSON.parse(item.content).content_extra.split(';')"
                                        :key="item+index"
                                      >
                                        <i class="el-icon-position"></i>
                                        {{item | extraFilter}}
                                      </div>
                                    </div>
                                  </el-collapse-item>
                                </el-collapse>
                              </div>
                              <div class="card-split-bottom">
                                <el-button
                                  class="buy-button"
                                  type="primary"
                                  plain
                                  @click="createOrder(item)"
                                >购买</el-button>
                              </div>
                            </el-card>
                          </el-carousel-item>
                        </el-carousel>-->
                        <el-col
                          class="shopitem"
                          :xs="24"
                          :sm="12"
                          :lg="8"
                          v-for="item in shopItems"
                          :key="item.id"
                        >
                          <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="card-split-top">
                              <div class="shopitem-title">
                                <div class="shopitem-title-banner">
                                  {{item.name}}
                                  <el-tooltip effect="dark" placement="top">
                                    <div slot="content">
                                      <div>此套餐包含自动重置系统</div>
                                      <div>
                                        购买后会立即获得
                                        <span
                                          class="shop-warning"
                                        >{{JSON.parse(item.content).bandwidth}}GB</span> 流量
                                      </div>
                                      <div>
                                        之后在
                                        <span
                                          class="shop-warning"
                                        >{{JSON.parse(item.content).reset_exp}}</span> 天内每隔
                                        <span
                                          class="shop-warning"
                                        >{{JSON.parse(item.content).reset}}</span> 天在当晚0点重置流量为
                                        <span
                                          class="shop-warning"
                                        >{{JSON.parse(item.content).reset_value}}GB</span>
                                      </div>
                                    </div>
                                    <i
                                      v-if="'reset_exp' in JSON.parse(item.content)"
                                      class="el-icon-warning-outline package-alert"
                                    ></i>
                                  </el-tooltip>
                                </div>
                              </div>
                              <div class="shopitem-detail">
                                <div v-if="'bandwidth' in JSON.parse(item.content)">
                                  <i class="el-icon-circle-plus-outline"></i>&nbsp;获得
                                  <span
                                    class="text-alert"
                                  >{{JSON.parse(item.content).bandwidth}} GB</span> 传输流量
                                </div>
                                <div v-else>
                                  <i class="el-icon-circle-close"></i>&nbsp;
                                  <span class="text-alert">不提供</span> 传输流量
                                </div>
                                <div v-if="'class_expire' in JSON.parse(item.content)">
                                  <i class="el-icon-medal"></i>&nbsp;会员时长
                                  <span
                                    class="text-alert"
                                  >{{ JSON.parse(item.content).class_expire }}</span> 天
                                </div>
                                <div v-else>
                                  <i class="el-icon-medal"></i>&nbsp;
                                  <span class="text-alert">不增加</span> 会员时长
                                </div>

                                <div>
                                  <i class="el-icon-mobile-phone"></i>
                                  <span
                                    class="text-alert"
                                  >&nbsp;{{ JSON.parse(item.content).connector | connectorFilter }}</span>同时在线客户端
                                </div>

                                <div>
                                  <i class="el-icon-lightning"></i>
                                  <span
                                    class="text-alert"
                                  >&nbsp;{{ JSON.parse(item.content).speedlimit | speedlimitFilter }}</span> 最高速率
                                </div>

                                <div
                                  v-if="JSON.parse(item.content).content_extra.split(';').length !== 0"
                                >
                                  <i class="el-icon-position" style="color:#409EFF"></i>&nbsp;
                                  <el-dropdown placement="bottom">
                                    <span class="el-dropdown-link dropdown-link-lg">
                                      更多精彩等你发现
                                      <i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                      <el-dropdown-item
                                        v-for="(item,index) in JSON.parse(item.content).content_extra.split(';')"
                                        :key="item+index"
                                      >
                                        <i class="el-icon-circle-check"></i>
                                        {{item | extraFilter}}
                                      </el-dropdown-item>
                                    </el-dropdown-menu>
                                  </el-dropdown>
                                </div>
                                <div v-else>
                                  <i class="el-icon-arrow-down el-icon--right"></i>&nbsp;
                                  <span>下一秒连接世界</span>
                                </div>
                              </div>
                              <div class="shopitem-price">
                                <span class="text-alert">{{item.price | creditFilter}}</span>
                              </div>
                              <div
                                class="shopitem-level"
                                v-if="'class' in JSON.parse(item.content)"
                              >
                                LEVEL.
                                <span class="text-alert">{{JSON.parse(item.content).class}}</span>
                              </div>
                              <div class="shopitem-level" v-else>
                                <span class="text-alert">不增加会员时长</span>
                              </div>
                            </div>
                            <div class="card-split-bottom">
                              <el-button
                                class="buy-button"
                                type="primary"
                                plain
                                @click="createOrder(item)"
                              >购买</el-button>
                            </div>
                          </el-card>
                        </el-col>
                      </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="流量叠加包" name="traffic">
                      <el-row :gutter="20">
                        <el-col
                          :xs="24"
                          :sm="12"
                          :lg="8"
                          v-for="item in trafficPacks"
                          :key="item.id"
                        >
                          <el-card :body-style="{ padding: '0px' }">
                            <div class="card-split-top">
                              <div class="shopitem-title-banner">
                                {{item.name}}
                                <el-tooltip effect="dark" placement="top">
                                  <div slot="content">
                                    <div>
                                      适用等级：LEVEL.
                                      <span
                                        class="shop-warning"
                                      >{{JSON.parse(item.content).traffic_package.class.min}}</span>
                                      -
                                      <span
                                        class="shop-warning"
                                      >{{JSON.parse(item.content).traffic_package.class.max}}</span>
                                    </div>
                                  </div>
                                  <i class="el-icon-warning-outline"></i>
                                </el-tooltip>
                              </div>
                            </div>

                            <div class="shopitem-traffic">
                              <div v-if="'bandwidth' in JSON.parse(item.content)">
                                获得
                                <span
                                  class="shop-warning"
                                >{{JSON.parse(item.content).bandwidth}} GB</span> 传输流量
                              </div>
                              <div
                                class="shop-warning shopitem-traffic-price"
                              >{{item.price | creditFilter}}</div>
                            </div>
                            <div class="card-split-bottom card-split-bottom-sm">
                              <el-popover
                                placement="bottom"
                                title="订单确认"
                                width="300"
                                trigger="click"
                                v-model="item.popover"
                                @show="handleTrafficPopoverOpen(item)"
                                @after-leave="handleTrafficPopoverClosed(item)"
                              >
                                <el-form label-position="left" inline class="common-table-expand">
                                  <el-form-item label="应付金额">
                                    <span>{{item.price | creditFilter}}</span>
                                  </el-form-item>
                                  <el-form-item v-if="item.radio === '1'" label="账户余额">
                                    <span>{{userInfo.user.money | creditFilter}}</span>
                                  </el-form-item>
                                </el-form>
                                <div v-if="item.radio === '2'">
                                  <component
                                    :global-config="globalConfig"
                                    :user-info="userInfo"
                                    :order-item="[{total:item.price}]"
                                    :is="paymentTypeComponent"
                                    @successfully-paid="completeTrafficPackageOrder(item)"
                                    :init="item.paymentInit"
                                  ></component>
                                </div>
                                <div @change="trafficRadioChange(item)" class="payment-type-check">
                                  <el-radio v-model="item.radio" label="1">余额支付</el-radio>
                                  <el-radio v-model="item.radio" label="2">云支付</el-radio>
                                </div>
                                <el-alert
                                  class="common-margin-top"
                                  :closable="false"
                                  title="不可逆操作提示"
                                  show-icon
                                  type="warning"
                                >
                                  <div>订单即将完成，请做最后确认</div>
                                  <div>支付完成前请勿刷新或关闭页面</div>
                                </el-alert>
                                <div class="common-margin-top" style="text-align: right;">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="item.popover = false"
                                  >取消</el-button>
                                  <el-button
                                    v-if="item.radio === '1'"
                                    type="primary"
                                    size="mini"
                                    @click="completeTrafficPackageOrder(item)"
                                  >确定</el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  class="buy-button"
                                  type="primary"
                                  plain
                                >购买</el-button>
                              </el-popover>
                            </div>
                          </el-card>
                        </el-col>
                      </el-row>
                    </el-tab-pane>
                  </el-tabs>
                </el-col>
              </el-row>
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
    <charger
      :tool-tip-type="toolTipType"
      @close="handleChargerClose"
      @success="handleChargeSuccess"
      :visible="chargeDialogVisible"
      :global-config="globalConfig"
    ></charger>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      @open="handleBuyOpen"
      @closed="handleBuyClose"
    >
      <el-steps finish-status="success" :active="buyStep">
        <el-step title="确认优惠"></el-step>
        <el-step title="确认订单"></el-step>
        <el-step title="支付订单"></el-step>
      </el-steps>

      <div v-if="buyStep === 0" class="couponChecker">
        <el-alert
          class="common-margin-top"
          :closable="false"
          title="请问您是否有优惠码？"
          show-icon
          type="info"
          effect="dark"
        >
          <div>请在下方输入框内输入优惠码，没有请留空</div>
        </el-alert>
        <div class="common-margin-top">
          <el-input v-model="coupon" placeholder="请输入优惠码(没有请留空)"></el-input>
        </div>
      </div>

      <div class="order-confirm" v-if="buyStep === 1">
        <el-table :data="orderItem" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="order-table-expand">
                <el-form-item label="套餐名称">
                  <span>{{props.row.name}}</span>
                </el-form-item>
                <el-form-item label="优惠额度">
                  <span>{{props.row.credit}}</span>
                </el-form-item>
                <el-form-item label="应付金额">
                  <span class="shop-warning">{{props.row.total}}</span>
                </el-form-item>
                <el-form-item label="会员等级">
                  <span class="shop-warning">{{'class' in orderDetail ? orderDetail.class : '保持不变'}}</span>
                </el-form-item>
                <el-form-item label="套餐流量">
                  <span
                    class="shop-warning"
                  >{{'bandwidth' in orderDetail ? orderDetail.bandwidth: 0}} GB</span>
                </el-form-item>
                <el-form-item label="会员时长">
                  <span
                    class="shop-warning"
                  >{{'class_expire' in orderDetail ? orderDetail.class_expire : 0}} 天</span>
                </el-form-item>
                <el-form-item label="帐号有效期延长">
                  <span>{{orderDetail.expire}} 天</span>
                </el-form-item>
                <el-form-item label="同时在线客户端数">
                  <span>{{orderDetail.connector === 0 ? '无限制' : orderDetail.connector}} 个</span>
                </el-form-item>
                <el-form-item label="最大端口速率">
                  <span>{{parseFloat(orderDetail.speedlimit) === 0 ? '无限制' : orderDetail.speedlimit + ' M'}}</span>
                </el-form-item>
                <el-form-item v-if="'reset_exp'in orderDetail" label="自动重置系统">
                  <span>
                    购买时获得
                    <span class="shop-warning">{{orderDetail.bandwidth}}GB</span> 流量，之后
                    在
                    <span class="shop-warning">{{orderDetail.reset_exp}}</span> 天内，
                    每
                    <span class="shop-warning">{{orderDetail.reset}}</span> 天重置流量为
                    <span class="shop-warning">{{orderDetail.reset_value}}GB</span>
                  </span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品名称" width="180"></el-table-column>
          <el-table-column prop="credit" label="优惠额度" width="180"></el-table-column>
          <el-table-column prop="total" label="应付金额"></el-table-column>
        </el-table>
        <div v-if="isOrderHasReset">
          <el-alert
            class="common-margin-top"
            :closable="false"
            title="此套餐含有自动重置系统"
            show-icon
            type="warning"
          >
            <div>购买后将无法自由购买其他商品，请审慎考虑后购买</div>
          </el-alert>
        </div>
        <div class="common-margin-top payment-type-check">
          <el-radio v-model="paymentRadio" label="1">余额支付</el-radio>
          <el-radio v-model="paymentRadio" label="2">云支付</el-radio>
        </div>
      </div>

      <div v-if="buyStep === 2">
        <div v-if="paymentRadio === '1'">
          <el-table :data="settlement" style="width: 100%">
            <el-table-column prop="money" label="账户余额" width="180"></el-table-column>
            <el-table-column prop="price" label="扣除金额" width="180"></el-table-column>
          </el-table>
          <el-switch
            class="common-margin-top"
            v-model="disableothers"
            active-text="关闭旧套餐自动续费"
            inactive-text="旧套餐到期仍然续费"
          ></el-switch>
          <div>
            <el-alert
              class="common-margin-top"
              :closable="false"
              title="不可逆操作提示"
              show-icon
              type="warning"
            >
              <div>订单即将完成，请做最后确认</div>
            </el-alert>
          </div>
        </div>
        <div v-if="paymentRadio === '2'">
          <el-row class="common-margin-top" :gutter="20">
            <el-col :xs="24" :lg="12">
              <el-card shadow="never">
                <div>
                  应付金额：
                  <span class="shop-warning">{{orderItem[0].total}}</span>
                </div>
                <div class="common-margin-top">请选择支付方式后扫码支付</div>
              </el-card>
            </el-col>
            <el-col class="pay-com" :xs="24" :lg="12">
              <component
                :global-config="globalConfig"
                :user-info="userInfo"
                :order-item="orderItem"
                :is="paymentTypeComponent"
                @successfully-paid="completeOrder"
                :init="true"
              ></component>
            </el-col>
          </el-row>
          <el-switch
            class="common-margin-top"
            v-model="disableothers"
            active-text="关闭旧套餐自动续费"
            inactive-text="旧套餐到期仍然续费"
          ></el-switch>
          <el-alert
            class="common-margin-top"
            :closable="false"
            title="不可逆操作提示"
            show-icon
            type="warning"
          >
            <div>扫码支付成功后订单即完成，请做最后确认</div>
          </el-alert>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">{{dialogCancelText}}</el-button>
        <el-button
          type="primary"
          @click="dialogConfirm"
          :disabled="isdialogConfirmDisable"
        >{{dialogConfirmText}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Navmenu from "../../components/Navmenu.vue";
import Headertools from "../../components/Header.vue";
import Charger from "../../components/Charger.vue";
import paymentModule from "../../mixins/charge";
import PublicFunction from "../../mixins/publicfunction";
import Basejs from "../../mixins/base";
import Axios from "axios";

export default {
  name: "Shop",
  mixins: [Basejs, PublicFunction, paymentModule],
  components: {
    navmenu: Navmenu,
    headertools: Headertools,
    charger: Charger
  },
  computed: {
    isOrderHasReset() {
      if ("content" in this.order) {
        return "reset_exp" in JSON.parse(this.order.content);
      } else {
        return false;
      }
    },
    orderDetail() {
      if ("content" in this.order) {
        return JSON.parse(this.order.content);
      } else {
        return {};
      }
    },
    settlement() {
      return [
        {
          money: this.userInfo.user.money,
          price: this.orderItem[0].total
        }
      ];
    }
  },
  filters: {
    connectorFilter(val) {
      if (parseFloat(val) !== 0) {
        return `${val}个 `;
      } else {
        return `无限制 `;
      }
    },
    speedlimitFilter(val) {
      if (parseFloat(val) !== 0) {
        return `${val}M `;
      } else {
        return `无限制 `;
      }
    },
    extraFilter(val) {
      return val.split("-")[1];
    }
  },
  data() {
    return {
      pagename: "商店",
      defaultActiveMenuItem: "2",
      toolTipType: "default",
      shopItems: [],
      activeCollapseNames: "",
      trafficPacks: [],
      chargeDialogVisible: false,
      dialogVisible: false,
      dialogWidth: "50%",
      dialogTitle: "",
      dialogConfirmText: "下一步",
      dialogCancelText: "取消",
      isdialogConfirmDisable: false,
      buyStep: 1,
      coupon: "",
      order: {},
      orderItem: [
        {
          credit: "0 %",
          name: "",
          total: 0
        }
      ],
      paymentRadio: "1",
      disableothers: true,
      commodityType: "main"
    };
  },

  created() {
    this.initSite();
    Axios.get("/getusershops", { withCredentials: true }).then(r => {
      if (r.data.ret === 1) {
        let arr = r.data.arr.shops;
        for (let i = 0; i <= arr.length - 1; i++) {
          if ("traffic_package" in JSON.parse(arr[i].content)) {
            arr[i].popover = false;
            arr[i].radio = "1";
            arr[i].paymentInit = false;
            arr[i].activeCollapseNames = [""];
            this.trafficPacks.push(arr[i]);
          } else {
            this.shopItems.push(arr[i]);
          }
        }
        console.log(this.shopItems);
        console.log(this.trafficPacks);
      }
    });
  },
  watch: {
    buyStep(val) {
      switch (val) {
        case 0:
          this.dialogConfirmText = "下一步";
          this.dialogCancelText = "取 消";
          this.dialogTitle = "优惠码";
          break;
        case 1:
          this.dialogConfirmText = "下一步";
          this.dialogCancelText = "上一步";
          this.dialogTitle = "订单确认";
          this.isdialogConfirmDisable = false;
          break;
        case 2:
          this.dialogConfirmText = "确 认";
          this.dialogCancelText = "上一步";
          this.dialogTitle = "订单支付";
          if (this.paymentRadio === "2") {
            this.isdialogConfirmDisable = true;
          }
          break;
      }
    }
  },
  methods: {
    handleCollapseChange(activeNames) {
      console.log(activeNames);
    },
    handleChargeCommand(command) {
      this.toolTipType = command;
      this.chargeDialogVisible = true;
    },
    handleChargerClose() {
      this.chargeDialogVisible = false;
    },
    handleChargeSuccess() {
      this.getUserInfo();
    },
    handleBuyOpen() {
      if (window.innerWidth <= 768 && window.innerWidth > 400) {
        this.dialogWidth = "70%";
      } else if (window.innerWidth <= 400) {
        this.dialogWidth = "90%";
      } else {
        this.dialogWidth = "40%";
      }
    },
    handleBuyClose() {
      this.coupon = "";
      this.isdialogConfirmDisable = false;
      this.order = {};
      this.orderItem = [
        {
          credit: "0 %",
          name: "",
          total: 0
        }
      ];
    },
    createOrder(order) {
      this.dialogVisible = true;
      this.buyStep = 0;
      this.order = order;
      console.log(this.order);
    },
    dialogCancel() {
      switch (this.buyStep) {
        case 0:
          this.dialogVisible = false;
          break;
        case 1:
          this.buyStep = 0;
          break;
        case 2:
          this.buyStep = 1;
          break;
      }
    },
    dialogConfirm() {
      switch (this.buyStep) {
        case 0:
          this.couponCheck();
          break;
        case 1:
          this.buyStep = 2;
          break;
        case 2:
          if (this.paymentRadio === "1") {
            this.completeOrder();
          } else {
            // this.dialogVisible = false;
            // this.$message({
            //   message: "下单成功！下一秒连接世界",
            //   type: "success"
            // });
          }
          break;
      }
    },
    couponCheck() {
      this.isdialogConfirmDisable = true;
      let body = {
        coupon: this.coupon,
        shop: this.order.id
      };
      console.log(body);
      Axios({
        method: "post",
        url: "/user/coupon_check",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          this.buyStep = 1;
          this.orderItem[0].credit = r.data.credit;
          this.orderItem[0].name = r.data.name;
          this.orderItem[0].total = r.data.total;
        } else {
          this.$message.error(r.data.msg);
        }
        this.isdialogConfirmDisable = false;
        this.coupon = "";
      });
    },
    completeOrder() {
      this.isdialogConfirmDisable = true;
      let body = {
        coupon: this.coupon,
        shop: this.order.id,
        autorenew: this.order.autorenew,
        disableothers: this.disableothers
      };
      Axios({
        method: "post",
        url: "/user/buy",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        console.log(r);
        this.isdialogConfirmDisable = false;
        if (r.data.ret === 1) {
          this.dialogVisible = false;
          this.$message({
            message: `${r.data.msg}！下一秒连接世界`,
            type: "success"
          });
          this.getUserInfo();
        } else if (r.data.ret === 0) {
          this.dialogVisible = false;
          this.$message.error(r.data.msg);
        }
      });
    },
    handleTrafficPopoverOpen(item) {
      item.paymentInit = true;
    },
    handleTrafficPopoverClosed(item) {
      item.paymentInit = false;
    },
    completeTrafficPackageOrder(item) {
      item.popover = false;
      let body = { shop: item.id };
      Axios({
        method: "post",
        url: "/user/buy_traffic_package",
        data: JSON.stringify(body),
        withCredentials: true,
        headers: { "content-type": "application/json" }
      }).then(r => {
        console.log(r);
        if (r.data.ret === 1) {
          this.$message({
            message: `${r.data.msg}！下一秒连接世界`,
            type: "success"
          });
          this.getUserInfo();
        } else if (r.data.ret === 0) {
          this.dialogVisible = false;
          this.$message.error(r.data.msg);
        }
      });
    },
    trafficRadioChange(item) {
      if (item.radio === "1") {
        item.paymentInit = false;
      } else {
        item.paymentInit = true;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
$fullwiddth = 100%
.el-col.el-col-sm-12:nth-child(2)
  @media only screen and (max-width: 768px)
    margin-top: 1rem
.shopitem
  margin-top: 1rem
for i in 1 2 3
  .shopitem:nth-child({i})
    margin-top: 0
.shopitem:nth-child(3)
  @media only screen and (max-width: 1200px)
    margin-top: 1rem
.card-split-bottom .el-button
  width: $fullwiddth
  border-radius: 0 0 4px 4px
.buy-button
  letter-spacing: 4px
  font-size: 16px
  font-family: 'Helvetica Neue'
.shopitem-title
  width: $fullwiddth
  color: #606266
.shopitem-title-banner
  font-size: 18px
  font-weight: bold
.shopitem-detail
  margin-top: 1.4rem
.shopitem-detail>div
  margin-top: 0.3rem
.shopitem-price
  margin-top: 16px
  font-size: 28px
  font-weight: 600
  letter-spacing: 2px
.shopitem-price, .shopitem-level
  text-align: right
.shopitem-level
  font-size: 13px
.shopitem-level .text-alert
  font-weight: 600
  font-size: 16px
.shop-warning
  color: #FF7800
.order-confirm
  margin-top: 1rem
  font-size: 16px
.order-table-expand
  font-size: 0
.payment-type-check
  text-align: center
.pay-com
  @media only screen and (max-width: 1200px)
    margin-top: 1rem
.shopitem-traffic
  padding: 0 20px
.shopitem-traffic-price
  text-align: right
.card-split-bottom-sm button
  margin-top: 1rem
.package-alert
  color: #ffbe00
.dropdown-link-lg
  font-size: 14px
</style>

